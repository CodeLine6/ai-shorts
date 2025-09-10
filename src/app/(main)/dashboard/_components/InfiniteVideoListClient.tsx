"use client"

import { useInfinite, defaultOptions } from "@/hooks/useInfinite"
import { VideoData } from "@/../convex/schema"
import { VideoItemClient } from "./VideoItemClient" // Import the new client component

const VideoItemLoading = () => <div className="w-full h-full animate-pulse bg-gray-800 rounded-md aspect-[2/3]" />

interface InfiniteVideoListClientProps {
  initialVideos: VideoData[];
  fetchMoreVideos: (cursor: string | null) => Promise<{ page: VideoData[], cursor: string | null, done: boolean }>;
}

export const InfiniteVideoListClient = ({ initialVideos, fetchMoreVideos }: InfiniteVideoListClientProps) => {
  const { data: videoList, loading, targetRef, rootRef } = useInfinite(fetchMoreVideos, [], defaultOptions)

  // Initialize videoList with initialVideos if it's empty
  // This ensures that the server-fetched data is displayed first
  const combinedVideoList = videoList.length == 0 ? initialVideos : videoList;
  const uniqueVideoList = Array.from(new Set(combinedVideoList.map(JSON.stringify))).map(JSON.parse);

  return (
    <div>
      {uniqueVideoList.length > 0 &&
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
          {/* @ts-ignore */}
          {uniqueVideoList?.map((video, index) => (
            <div key={JSON.stringify(video)} ref={index === uniqueVideoList.length - 1 ? targetRef : null}>
              <VideoItemClient videoData={video} index={index} />
            </div>
          ))}
        </div>
      }
      
      {loading && videoList.length != 0 &&
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-5">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={item}> <VideoItemLoading /></div>
          ))}
        </div>
      }
    </div>
  )
}
