"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VideoData } from "@/../convex/schema";
import { api } from "@/../convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Play, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface InfiniteAdminVideoListClientProps {
  initialVideos: VideoData[];
  fetchMoreVideos: (cursor: string | null) => Promise<{ page: VideoData[]; cursor: string | null; done: boolean }>;
}

export const InfiniteAdminVideoListClient: React.FC<InfiniteAdminVideoListClientProps> = ({
  initialVideos,
  fetchMoreVideos,
}) => {
  const [videoList, setVideoList] = useState<VideoData[]>(initialVideos);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const loader = useRef(null);

  const trashVideo = useMutation(api.videoData.trashVid);

  useEffect(() => {
    setVideoList(initialVideos);
    // The initialVideos should come with the first page's data and the continueCursor/isDone status
    // from the server component. If initialVideos is empty, it means there are no videos
    // or the first fetch returned no results, so we are done.
    if (initialVideos.length === 0) {
      setIsDone(true);
      setCursor(null);
    } else {
      // Assuming the server component provides the initial cursor and isDone status
      // along with initialVideos. If not, a separate mechanism would be needed.
      // For now, we'll rely on the fetchMoreVideos to provide the next cursor.
      fetchMoreVideos(null).then(result => {
        setCursor(result.cursor);
        setIsDone(result.done);
      });
    }
  }, [initialVideos, fetchMoreVideos]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isDone && !loadingMore) {
        setLoadingMore(true);
        fetchMoreVideos(cursor)
          .then((result) => {
            setVideoList((prevVideos) => [...prevVideos, ...result.page]);
            setCursor(result.cursor);
            setIsDone(result.done);
          })
          .finally(() => {
            setLoadingMore(false);
          });
      }
    },
    [cursor, isDone, loadingMore, fetchMoreVideos]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const handleTrashVideo = async (videoId: string) => {
    try {
      await trashVideo({ recordId: videoId as any }); // Cast to any for now
      setVideoList((prev) => prev.filter((video) => video._id !== videoId));
      toast({
        title: "Video trashed",
        description: "The video has been moved to trash.",
      });
    } catch (error) {
      console.error("Error trashing video:", error);
      toast({
        title: "Error",
        description: "Failed to trash video.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Failed':
      case 'Render Failed': // Assuming 'Render Failed' is a possible status
        return 'destructive';
      case 'Trashed': // New status for trashed videos
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videoList.map((video) => (
            <TableRow key={video._id}>
              <TableCell className="font-medium max-w-xs truncate">{video.title}</TableCell>
              <TableCell>{video.createdBy}</TableCell>
              <TableCell>
                <Badge variant="secondary">{video.videoStyle}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(video.status)}>
                  {video.trashed ? 'Trashed' : video.status}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                {video.status === 'Completed' && video.downloadUrl ? (
                  <a href={video.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 text-green-500 cursor-pointer" />
                  </a>
                ) : video.status === 'Failed' || video.status === 'Render Failed' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Play className="h-4 w-4 text-gray-400" />
                )}
                {!video.trashed && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will move the video "{video.title || 'Untitled'}" to trash. You can restore it later if needed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleTrashVideo(video._id)}>
                          Move to Trash
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
          {loadingMore && (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isDone && (
        <div ref={loader} className="flex justify-center p-4">
          {loadingMore ? (
            <p className="text-muted-foreground">Loading more videos...</p>
          ) : (
            <p className="text-muted-foreground">Scroll down to load more</p>
          )}
        </div>
      )}
      {isDone && videoList.length === 0 && !loadingMore && (
        <p className="text-center text-muted-foreground p-4">No videos found.</p>
      )}
    </>
  );
};
