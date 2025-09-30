import { VideoData } from "@/../convex/schema";
import { api } from "@/../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { InfiniteAdminVideoListClient } from "./_components/InfiniteAdminVideoListClient";

export const dynamic = "force-dynamic";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function AdminVideosPage() {
  const initialLoadCount = 10; // Number of videos to load initially

  // Fetch total counts for summary cards
  const totalVideosCount = await convex.query(api.videoData.getTotalVideosCount);
  const completedVideosCount = await convex.query(api.videoData.getCompletedVideosCount);
  const inProgressVideosCount = await convex.query(api.videoData.getInProgressVideosCount);
  const failedVideosCount = await convex.query(api.videoData.getFailedVideosCount);
  const trashedVideosCount = await convex.query(api.videoData.getTrashedVideosCount);

  const initialResult = await convex.query(api.videoData.GetVideosPaginated, {
    paginationOpts: {
      cursor: null,
    },
  });

  const initialVideos: VideoData[] = initialResult.page;
  const initialCursor: string | null = initialResult.continueCursor;
  const isDone: boolean = initialResult.isDone;

  // This server action will be passed to the client component to fetch more videos
  const fetchMoreAdminVideos = async (cursor: string | null) => {
    "use server";
    const { continueCursor, isDone, page } = await convex.query(api.videoData.GetVideosPaginated, {
      paginationOpts: {
        cursor,
      },
    });
    return { page, cursor: continueCursor, done: isDone };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Videos Management</h1>
        <p className="text-muted-foreground">Overview and management of all videos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideosCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Videos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedVideosCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress Videos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressVideosCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Videos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedVideosCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trashed Videos</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trashedVideosCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Table with Infinite Scrolling */}
      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <InfiniteAdminVideoListClient
            initialVideos={initialVideos}
            fetchMoreVideos={fetchMoreAdminVideos}
          />
        </CardContent>
      </Card>
    </div>
  );
}
