"use server"

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { prefetchImages } from "@/lib/utils";

export const QueueVideo = async (videoId: any) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  await convex.mutation(api.videoData.queueVideo, { videoId });

  const active = await convex.query(api.videoData.getActiveRenders, {});
    if (active.length < 2) {
      // Nothing rendering → start processing the queue
      await GenerateVideo();
  }

  return { ok: true };
};

export const GenerateVideo =  async() => {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const nextVideo = await convex.query(api.videoData.getNextQueuedVideo, {});
      if (!nextVideo) {
          return { message: "Queue is empty" };
      }

      await convex.mutation(api.videoData.startRendering, {
        videoId: nextVideo._id,
      });

        const services = await getServices({
          region: "us-east1",
          compatibleOnly: true,
        });

        const serviceName = services[0].serviceName;

        const prefetchedImages = await prefetchImages(nextVideo.images);
        console.log("Prefetched images: ", prefetchedImages);

        const renderVideo = renderMediaOnCloudrun({
          serviceName,
          region: "us-east1",
          serveUrl: process.env.GCP_SERVE_URL!, // Assert non-null
          composition: "youtubeShort",
          inputProps: {
            videoData: {
              // @ts-ignore
              audioUrl: nextVideo.audioUrl, // Use Supabase URL
              captionJson: nextVideo.captionJson,
              images: prefetchedImages,
              caption: nextVideo.caption,
            },
          },
          codec: "h264",
          renderStatusWebhook: {
            url: `${process.env.NEXTAUTH_URL}/api/remotion-webhook`, // Point to the new API route
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              recordId: nextVideo._id, // Pass recordId to the webhook
            },
            webhookProgressInterval: 0.05, // Add this back as it was in the user's original code
          },
        }).catch(async (error) => {
          console.error("Error rendering video:", error);
          await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
                  recordId: nextVideo._id,
                  status: "Failed",
                  comments: `Rendering video failed: ${error.message}`
                });
          throw new Error(`Error rendering video: ${error.message}`);
        });

        return "Video is being rendered";
};

