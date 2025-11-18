import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "@/../convex/_generated/api";
import { deleteRender } from "@remotion/lambda/client";

export async function POST(request: Request) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  try {
    const payload = await request.json();
    console.log("Received Remotion webhook payload:", payload);

    // Handle error case
    if(payload.type === "error" || payload.errors) {
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId: payload.customData?.recordId,
        status: "Render Failed",
        comments: payload.errors?.[0]?.message || payload.error || "Unknown error"
      });
      
      // Clean up failed render from Lambda
      if (payload.renderId && payload.bucketName) {
        try {
          await deleteRender({
            region: "us-east-1",
            bucketName: payload.bucketName,
            renderId: payload.renderId,
          });
          console.log("🗑️ Cleaned up failed render from Lambda");
        } catch (cleanupError) {
          console.error("⚠️ Failed to cleanup:", cleanupError);
        }
      }
      
      return NextResponse.json({ message: "Webhook received - render failed" }, { status: 200 });
    }

    // Handle progress updates
    if(payload.type === "progress") {
      await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId: payload.customData?.recordId,
        renderProgress: payload.overallProgress * 100
      });
      return NextResponse.json({ message: "Webhook received - progress updated" }, { status: 200 });
    }

    // Handle completion
    if(payload.type === "success") {
      const recordId = payload.customData?.recordId;
      if (!recordId) {
        console.error("❌ Missing recordId in success payload");
        return NextResponse.json({ error: "Missing recordId" }, { status: 400 });
      }

      // Check if video is already completed using Convex
      const videoRecord = await convex.query(api.videoData.GetVideoRecord, { recordId });

      // Refined check: ensure videoRecord is an object, has a 'status' property, and that property is 'Completed'
      if (videoRecord && typeof videoRecord === 'object' && videoRecord.status === "Completed") {
        console.log(`✅ Video ${recordId} already completed. Skipping processing.`);
        return NextResponse.json({ message: "Webhook received - already completed" }, { status: 200 });
      }

      // If not completed, offload processing to a Netlify function
      console.log(`🚀 Offloading processing for recordId ${recordId} to Netlify function.`);
      
      const siteUrl = process.env.NEXTAUTH_URL || process.env.URL;
      // Assuming the new Netlify function is at '/.netlify/functions/process-completed-render'
      fetch(`${siteUrl}/.netlify/functions/process-completed-render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary auth headers if the Netlify function requires them
          'x-netlify-trigger': process.env.NETLIFY_TRIGGER_SECRET || 'internal' // Example header
        },
        body: JSON.stringify(payload) // Pass the entire payload
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Acknowledge receipt and indicate processing has been initiated
      return NextResponse.json({ message: "Webhook received - processing initiated" }, { status: 200 });
    }
      
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json({ 
      error: "Failed to process webhook",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
