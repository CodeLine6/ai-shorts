

"use server"

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

export const QueueVideo = async (videoId: any) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  try {
    // Queue the video
    await convex.mutation(api.videoData.queueVideo, { videoId });

    // Check if we should start processing
    const active = await convex.query(api.videoData.getActiveRenders);
    if (active.length < 2) {
      // Trigger background processing
      const siteUrl = process.env.NEXTAUTH_URL || process.env.URL;
      fetch(`${siteUrl}/.netlify/functions/trigger-video-processing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-netlify-trigger': process.env.NETLIFY_TRIGGER_SECRET || 'internal'
        }
      })
      console.log("Background processing triggered");
    }

    return { ok: true, message: "Video queued" };

  } catch (error) {
    console.error("Error queueing video:", error);
    return { ok: false, error: error.message };
  }
};