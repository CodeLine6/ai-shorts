// netlify/functions/process-completed-render.ts

import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "@/../convex/_generated/api"; // Assuming this path is correct for Netlify functions
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { deleteRender } from "@remotion/lambda/client";
import { Id } from "../../convex/_generated/dataModel";

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const handler = async (request: Request) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  let payload: any; // Explicitly type payload as any for now

  try {
    payload = await request.json();
    console.log("Received payload for processing completed render:", payload);

    const { recordId, outputFile, bucketName, renderId, customData } = payload as { recordId: string; outputFile: string; bucketName: string; renderId: string; customData: { recordId: string; }; };

    if (!recordId || !outputFile || !bucketName || !renderId || !customData?.recordId) {
        console.error("❌ Missing required data in payload for processing completed render.");
        return NextResponse.json({ error: "Missing required data in payload" }, { status: 400 });
    }

    // Step 1: Download from Lambda S3
    console.log(`⬇️ Downloading from Lambda S3: ${outputFile}`);
    const videoResponse = await fetch(outputFile);
    
    if (!videoResponse.ok) {
      throw new Error(`Failed to download: ${videoResponse.status} ${videoResponse.statusText}`);
    }
    
    const videoBuffer = await videoResponse.arrayBuffer();
    const videoSizeMB = (videoBuffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`✅ Downloaded video: ${videoSizeMB} MB`);
    
    // Step 2: Upload to R2
    const videoKey = `videos/${recordId}.mp4`; // Use recordId from payload
    console.log(`⬆️ Uploading to R2: ${videoKey}`);
    
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: videoKey,
      Body: new Uint8Array(videoBuffer),
      ContentType: "video/mp4",
      CacheControl: "public, max-age=31536000", // Cache for 1 year
    }));
    
    console.log(`✅ Successfully uploaded to R2`);
    
    // Step 3: Generate public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${videoKey}`;
    
    // Step 4: Update Convex with video URL and status
    await convex.mutation(api.videoData.UpdateVideoRecord, {
      recordId: recordId as Id<"videoData">, // Use recordId from payload and cast to Id<"videoData">
      status: "Completed",
      downloadUrl: publicUrl,
      renderProgress: 100
    });
    
    console.log(`✅ Updated Convex with public URL`);
    
    // Step 5: Delete from Lambda S3 (save costs)
    try {
      await deleteRender({
        region: "us-east-1", // Assuming this region is consistent
        bucketName: bucketName, // Use bucketName from payload
        renderId: renderId,     // Use renderId from payload
      });
      console.log(`🗑️ Deleted render from Lambda S3`);
    } catch (deleteError) {
      console.error("⚠️ Failed to delete from Lambda:", deleteError);
      // Don't fail the entire process if cleanup fails, video is already in R2
    }

    // Step 6: Trigger next video in queue
    try {
      const siteUrl = process.env.NEXTAUTH_URL || process.env.URL;
      await fetch(`${siteUrl}/.netlify/functions/start-video-rendering`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-netlify-trigger': process.env.NETLIFY_TRIGGER_SECRET || 'internal'
        }
      });
      console.log("🚀 Triggered next video processing");
    } catch (e) {
      console.error("Failed to trigger next video:", e);
    }

    return NextResponse.json({ 
      message: "Video successfully processed and uploaded to R2",
      videoUrl: publicUrl,
      size: `${videoSizeMB} MB`
    }, { status: 200 });
    
  } catch (error) {
    console.error("❌ Error processing completed render:", error);
    
    // Attempt to update status to failed in Convex if recordId is available
    const recordId = payload?.customData?.recordId; // Safely access recordId
    if (recordId) {
        try {
            await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
                recordId: recordId,
                status: "Render Failed",
                comments: `Processing function failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } catch (convexError) {
            console.error("⚠️ Failed to update Convex status after processing error:", convexError);
        }
    }
    
    return NextResponse.json({ 
      error: "Failed to process completed render",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
