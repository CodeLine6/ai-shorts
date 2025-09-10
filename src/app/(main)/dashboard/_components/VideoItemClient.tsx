"use client"

import { Button } from "@/components/ui/button"
import { useConvex, useQuery } from "convex/react" // Import useQuery
import Image from "next/image"
import Link from "next/link"
import moment from "moment"
import { api } from "@/../convex/_generated/api"
import { RefreshCcw, Ban, EllipsisVertical, Trash, RotateCcw } from "lucide-react"
import { VideoData } from "@/../convex/schema"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Id } from "@/../convex/_generated/dataModel"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast";
import { QueueVideo } from "@/actions/generateVideo"

const RenderProgress = ({ status, progress }: { status: string | undefined, progress: number | undefined }) => {
  if (status == 'Completed') return null
  return (
    <div className="w-3/4 text-center">
      <p className="mb-2">Rendering</p>
      <div className="w-3/4 mx-auto"><Progress value={progress} /></div>
    </div>
  )
}

const VideoStatus = ({ status, progress }: { status: string | undefined, progress: number | undefined }) => {
  if (status == 'Completed') return null
  return (
    <div className={`absolute top-0 left-0 w-full h-full ${status?.includes('Failed') ? 'bg-red-900' : 'bg-black'} bg-opacity-80 flex items-center justify-center gap-2`}>
      {status?.includes('Failed') ?
        <>
          <Ban />
          <h2>Failed</h2>
        </>

        : status == "Rendering" ? <RenderProgress status={status} progress={progress} />
          :
          <>
            <RefreshCcw className="animate-spin" />
            <h2>{status}</h2>
          </>
      }
    </div>
  )
}

export const VideoItemClient = ({ videoData, index }: { videoData: VideoData, index: number }) => {
  const convex = useConvex();
  const videoWithUpdates = useQuery(api.videoData.GetVideoRecord, { recordId: videoData._id as Id<"videoData"> }); // Fetch video data in real-time
  const video = videoWithUpdates || videoData; 

  const handleRegenerate = async () => {
    await QueueVideo(video._id)
    toast({
      title: "Video Queued",
      description: "Video successfully added to the render queue.",
    })
  }
  return (
    <Link href={`/dashboard/play-video/${video?._id}`} key={index}>
      <div className="relative aspect-[2/3] rounded-md overflow-hidden" key={index}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button className="absolute top-2 right-2 rounded-full pl-[13px] pr-[12px] hover:bg-gray-800 hover:bg-opacity-50 z-10" variant={"ghost"} ><EllipsisVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Keep onSelect to prevent dropdown from closing immediately */}
                  <div className="flex items-center w-full cursor-pointer">
                    <Trash className="mr-2" width={20} /> Delete
                  </div>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the video.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={async () => await convex.mutation(api.videoData.trashVid, { recordId: video?._id as Id<"videoData"> })}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {video?.status == "Render Failed" &&
              <DropdownMenuItem className="cursor-pointer" onClick={handleRegenerate}><RotateCcw /> Retry</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        {video?.images?.[0].image && <Image
          src={video?.images[0].image}
          width={500}
          height={500}
          alt={video?.title}
          className="w-full object-cover rounded-xl aspect-[2/3]"
        />}
        <VideoStatus status={video?.status} progress={video?.renderProgress} />

        <div className="absolute bottom-1 text-center w-full">
          <h2>{video?.title}</h2>
          <h2 className="text-sm">{moment(video?._creationTime).fromNow()}</h2>
        </div>
      </div>
    </Link>
  )
}