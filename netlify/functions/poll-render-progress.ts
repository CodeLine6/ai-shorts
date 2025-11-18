import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api.js";
import { getRenderProgress } from "@remotion/lambda/client";
import type { Config } from "@netlify/functions"

// Define a type for AWS regions that Remotion Lambda might support
// This is a common set, adjust if Remotion's SDK specifies a different set.
type RemotionAWSRegion =
  | "us-east-1" | "us-east-2" | "us-west-1" | "us-west-2"
  | "af-south-1" | "ap-east-1" | "ap-south-1" | "ap-southeast-1" | "ap-southeast-2"
  | "ap-northeast-1" | "ap-northeast-2" | "ap-northeast-3"
  | "ca-central-1"
  | "eu-central-1" | "eu-central-2" | "eu-west-1" | "eu-west-2" | "eu-west-3"
  | "eu-south-1" | "eu-north-1"
  | "me-south-1"
  | "sa-east-1";

// Environment variables for Remotion Lambda configuration
// These should be configured in your Netlify environment variables
const REGION: RemotionAWSRegion = (process.env.REMOTION_REGION || "us-east-1") as RemotionAWSRegion; // Default to us-east-1 if not set
const FUNCTION_NAME = process.env.REMOTION_LAMBDA_FUNCTION; // Must be set
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL; // Must be set

// Helper function to poll render progress
async function pollRenderProgress() {
  if (!CONVEX_URL) {
    console.error("Missing environment variable: NEXT_PUBLIC_CONVEX_URL");
    return;
  }
  if (!FUNCTION_NAME) {
    console.error("Missing environment variable: REMOTION_LAMBDA_FUNCTION");
    return;
  }

  const convex = new ConvexHttpClient(CONVEX_URL);

  try {
    // Get all videos that are currently rendering
    // We use getActiveRenders which filters by status: "Rendering"
    const renderingVideos = await convex.query(api.videoData.getActiveRenders);

    if (!renderingVideos || renderingVideos.length === 0) {
      console.log("No videos currently rendering. Polling complete.");
      return;
    }

    console.log(`Found ${renderingVideos.length} videos rendering. Polling progress...`);

    for (const video of renderingVideos) {
      if (!video.renderId || !video.bucketName) {
        console.warn(`Skipping video ${video._id} due to missing renderId or bucketName.`);
        continue;
      }

      try {
        const progress = await getRenderProgress({
          region: REGION,
          functionName: FUNCTION_NAME,
          renderId: video.renderId,
          bucketName: video.bucketName,
          // customCredentials and forcePathStyle might be needed if not using default AWS config
          // For simplicity, we assume default AWS config is sufficient here.
        });

        console.log(`Progress for video ${video._id} (renderId: ${video.renderId}):`, progress);

        let newStatus = video.status;
        let newRenderProgress = video.renderProgress;
        let downloadUrl: string | undefined = undefined; // Explicitly type as string | undefined
        let comments = video.comments;

        if (!progress.fatalErrorEncountered && !progress.done) {
          // progress.overallProgress is a number between 0 and 1
          newRenderProgress = Math.round(progress.overallProgress * 100);
        }

        // Update Convex with the latest status and progress
        await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
          recordId: video._id,
          //@ts-ignore
          status: newStatus,
          renderProgress: newRenderProgress,
          downloadUrl: downloadUrl,
          comments: comments,
        });

      } catch (error) {
        console.error(`Error polling progress for video ${video._id} (renderId: ${video.renderId}):`, error);
        // If polling fails, we might want to update the status to "Failed" after a certain number of retries or time.
        // For now, we'll just log the error and continue to the next video.
        // A more robust solution would involve tracking polling attempts and failing after a threshold.
      }
    }
  } catch (error) {
    console.error("Error in pollRenderProgress main loop:", error);
  }
}

// This Netlify function handler will be triggered by a scheduler.
// For example, you can use Netlify's built-in cron jobs or a third-party scheduler.
// The handler itself just calls the polling function.
export default async (event: any, context: any) => {
  // Optional: Add a security check if this function is triggered externally
  // For example, using a Netlify Trigger secret.

  await pollRenderProgress();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Render progress polling process initiated." }),
  };
};

export const config: Config = {
    schedule: "* * * * *"
}