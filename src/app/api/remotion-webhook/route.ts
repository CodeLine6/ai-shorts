import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: Request) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  try {
    const payload = await request.json();
    console.log("Received Remotion webhook payload:", payload);

    // Handle error case
    if(payload.error) {
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId: payload.recordId,
        status: "Render Failed",
        comments: payload.error
      });
      return NextResponse.json({ message: "Webhook received - render failed" }, { status: 200 });
    }

    // Handle progress updates
    if(payload.progress < 1) {
      await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId: payload.recordId,
        renderProgress: payload.progress * 100
      });
      return NextResponse.json({ message: "Webhook received - progress updated" }, { status: 200 });
    }

    // Handle completion (progress === 1)
    const downloadUrl = `https://storage.googleapis.com/remotioncloudrun-wdehybeugz/renders/${payload.renderId}/out.mp4`;
        
    await convex.mutation(api.videoData.UpdateVideoRecord, {
      recordId: payload.recordId,
      status: "Completed",
      downloadUrl,
      renderProgress: 100
    });

    // Trigger processing of next video in queue
    try {
      const siteUrl = process.env.NEXTAUTH_URL || process.env.URL;
      fetch(`${siteUrl}/.netlify/functions/trigger-video-processing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-netlify-trigger': process.env.NETLIFY_TRIGGER_SECRET || 'internal'
        }
      }).catch(console.error); // Fire and forget
    } catch (e) {
      console.error("Failed to trigger next video processing:", e);
    }

    return NextResponse.json({ message: "Webhook received - render completed" }, { status: 200 });
      
  } catch (error) {
    console.error("Error processing Remotion webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}