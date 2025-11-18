import { ConvexHttpClient } from "convex/browser";
import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { renderMediaOnLambda } from "@remotion/lambda/client";
import { prefetchImages } from "@/lib/utils";

// Import the generated API
import { api } from "@/../convex/_generated/api.js";

// Helper function for retries
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);

      if (i === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export const handler = async (event, context) => {
  console.log("Background video generation started");

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  try {
    // Simple security check
    const triggerSecret = event.headers["x-netlify-trigger"];
    if (triggerSecret !== (process.env.NETLIFY_TRIGGER_SECRET || "internal")) {
      return { statusCode: 403, body: "Forbidden" };
    }

    const active = await convex.query(api.videoData.getActiveRenders);
    console.log(`Currently active renders: ${active.length}`);

    if (active.length >= 2) {
      console.log("Queue full, not processing more vidos");
      return { statusCode: 200, body: "Queue full" };
    }

    const nextVideo = await convex.query(api.videoData.getNextQueuedVideo);
    if (!nextVideo) {
      console.log("Queue is empty");
      return { statusCode: 200, body: "Queue empty" };
    }

    console.log(`Processing video: ${nextVideo._id}`);

    // Rest of your render logic...
    /* const services = await retryWithBackoff(
      () => getServices({
        region: "us-east1",
        compatibleOnly: true,
      }),
      3,
      2000
    );

    if (!services || services.length === 0) {
      throw new Error("No Cloud Run services available");
    }

    const serviceName = services[0].serviceName;
    console.log(`Using service: ${serviceName}`); */

    let prefetchedImages = nextVideo.images;
    try {
      prefetchedImages = await prefetchImages(nextVideo.images);
    } catch (e) {
      console.log("Using original images, prefetch not available");
    }

    /* retryWithBackoff(
      () => renderMediaOnCloudrun({
        serviceName,
        region: "us-east1",
        serveUrl: process.env.GCP_SERVE_URL,
        composition: "youtubeShort",
        inputProps: {
          videoData: {
            audioUrl: nextVideo.audioUrl,
            captionJson: nextVideo.captionJson,
            images: prefetchedImages,
            caption: nextVideo.caption,
            musicTrack: nextVideo.musicTrack,
            config: nextVideo.config,
            volume: nextVideo.volume,
          },
        },
        codec: "h264",
        renderStatusWebhook: {
          url: `${process.env.NEXTAUTH_URL}/api/remotion-webhook`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            recordId: nextVideo._id,
          },
          webhookProgressInterval: 0.05,
        },
        downloadBehavior: {
          type: "download",
          fileName: `${nextVideo.title}.mp4`,
        }
      }),
      2,
      5000
    ); */

    
    const { renderId, bucketName} = await renderMediaOnLambda({
          region: "us-east-1",
          functionName: process.env.REMOTION_LAMBDA_FUNCTION,
          serveUrl: process.env.REMOTION_SERVE_URL,
          composition: "youtubeShort",
          codec: "h264",
          framesPerLambda: 18, // Good balance
          memorySizeInMb: 2048, // Enough for your effects
          concurrencyPerLambda: 1, // Keeps memory predictable
          timeoutInMilliseconds: 120000, // 2 min safety buffer
          maxRetries: 1,
          timeoutInMilliseconds: 900000,
          inputProps: {
            videoData: {
              audioUrl: nextVideo.audioUrl,
              captionJson: nextVideo.captionJson,
              images: prefetchedImages,
              caption: nextVideo.caption,
              musicTrack: nextVideo.musicTrack,
              config: nextVideo.config,
              volume: nextVideo.volume,
            },
          },
          webhook: {
            url: `${process.env.NEXTAUTH_URL}/api/remotion-webhook`,
            secret: null,
            customData: {
              recordId: nextVideo._id,
            },
          },
          downloadBehavior: {
            type: "download",
            fileName: `${nextVideo.title}.mp4`,
          },
        })

    await convex.mutation(api.videoData.startRendering, {
      videoId: nextVideo._id,
      renderId,
      bucketName
    });

    console.log(`Video render initiated for: ${nextVideo._id}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Video render initiated",
        videoId: nextVideo._id,
      }),
    };
  } catch (error) {
    console.error("Background function error:", error);

    try {
      const nextVideo = await convex.query(api.videoData.getNextQueuedVideo);
      if (nextVideo) {
        // ✅ Use proper API reference
        await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
          recordId: nextVideo._id,
          status: "Render Failed",
          comments: `Failed after retries: ${error.message}`,
        });
      }
    } catch (e) {
      console.error("Failed to update video status:", e);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
