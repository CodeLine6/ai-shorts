import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { api } from "@/../convex/_generated/api";
import { VideoData } from "@/../convex/schema";
import { InfiniteVideoListClient } from "./InfiniteVideoListClient";
import { ConvexHttpClient } from "convex/browser"; // Import ConvexHttpClient
import { Id } from "@/../convex/_generated/dataModel"; // Import Id

export const dynamic = "force-dynamic";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!); // Create Convex client instance

// This is a server component
const VideoList = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  let initialVideos: VideoData[] = [];
  let initialCursor: string | null = null;
  let isDone: boolean = true;

  if (user?._id) {
    const result = await convex.query(api.videoData.GetUsersVideo, {
      uid: user._id as Id<"users">,
      paginationOpts: {
        numItems: 10, // Initial load
        cursor: null,
      },
    });
    initialVideos = result.page;
    initialCursor = result.continueCursor;
    isDone = result.isDone;
  }
  
  // This function will be passed to the client component to fetch more videos
  // It needs to be a server action or a function that can be called from the client
  // For now, we'll define it here and assume it can be passed.
  // In a real Next.js app, you might create a separate server action for this.
  const fetchMoreVideos = async (cursor: string | null) => {
    "use server"; // This makes it a server action

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?._id) {
      return { page: [], cursor: null, done: true };
    }

    const { continueCursor, isDone, page } = await convex.query(api.videoData.GetUsersVideo, {
      uid: user._id as Id<"users">,
      paginationOpts: {
        numItems: cursor ? 5 : 10, // Subsequent loads
        cursor,
      },
    });
    return { page, cursor: continueCursor, done: isDone };
  };

  return (
    <div>
      <InfiniteVideoListClient
        initialVideos={initialVideos}
        fetchMoreVideos={fetchMoreVideos}      />
    </div>
  );
};

export default VideoList;
