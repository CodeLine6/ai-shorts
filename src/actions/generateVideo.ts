"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

export const QueueVideo = async (videoId: any, userId: Id<"users">) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    // Deduct credits for video rendering
    await convex.mutation(api.user.AdjustUserCredits, {
      userId,
      amount: -20, // Deduct 20 credits for video rendering
    });

    // Queue the video
    await convex.mutation(api.videoData.queueVideo, { videoId });

    // Check if we should start processing
    const active = await convex.query(api.videoData.getActiveRenders);
    if (active.length >= 2) {
      return { ok: true, message: "Video queued" };
    } else {
      console.log("Less than 2 active renders");
      // Trigger background processing
      const siteUrl = process.env.NEXTAUTH_URL || process.env.URL;
      console.log("Sending Request to Trigger Function");
      const response = await fetch(
        `${siteUrl}/.netlify/functions/start-video-rendering`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-netlify-trigger":
              process.env.NETLIFY_TRIGGER_SECRET || "internal",
          },
        }
      );
      const result = await response.text();
      console.log("Background function response:", result);
      return { ok: true, message: "Video Rendering Triggered" };
    }
  } catch (error: any) {
    console.error("Error queueing video:", error);
    return { ok: false, error: error.message };
  }
};
