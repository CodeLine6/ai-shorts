// netlify/functions/process-completed-render.ts

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { deleteRender } from "@remotion/lambda/client";
import { Id } from "../../convex/_generated/dataModel";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

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

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  let payload: any;

  try {
    // Parse the body string to JSON
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No body provided" })
      };
    }

    payload = JSON.parse(event.body);
    console.log("Received payload for processing completed render:", payload);

    const { outputFile, bucketName, renderId, customData } = payload as { 
      outputFile: string; 
      bucketName: string; 
      renderId: string; 
      customData: { recordId: string; }; 
    };

    if (!outputFile || !bucketName || !renderId || !customData?.recordId) {
        console.error("❌ Missing required data in payload for processing completed render.");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required data in payload" })
        };
    }

    const { recordId } = customData;

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
    const videoKey = `videos/${recordId}.mp4`;
    console.log(`⬆️ Uploading to R2: ${videoKey}`);
    
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: videoKey,
      Body: new Uint8Array(videoBuffer),
      ContentType: "video/mp4",
      CacheControl: "public, max-age=31536000",
    }));
    
    console.log(`✅ Successfully uploaded to R2`);
    
    // Step 3: Generate public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${videoKey}`;
    
    // Step 4: Update Convex with video URL and status
    await convex.mutation(api.videoData.UpdateVideoRecord, {
      recordId: recordId as Id<"videoData">,
      status: "Completed",
      downloadUrl: publicUrl,
      renderProgress: 100
    });
    
    console.log(`✅ Updated Convex with public URL`);
    
    // Step 5: Delete from Lambda S3 (save costs)
    try {
      await deleteRender({
        region: "us-east-1",
        bucketName: bucketName,
        renderId: renderId,
      });
      console.log(`🗑️ Deleted render from Lambda S3`);
    } catch (deleteError) {
      console.error("⚠️ Failed to delete from Lambda:", deleteError);
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

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Video successfully processed and uploaded to R2",
        videoUrl: publicUrl,
        size: `${videoSizeMB} MB`
      })
    };
    
  } catch (error) {
    console.error("❌ Error processing completed render:", error);
    
    // Attempt to update status to failed in Convex if recordId is available
    const recordId = payload?.customData?.recordId;
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
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to process completed render",
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}