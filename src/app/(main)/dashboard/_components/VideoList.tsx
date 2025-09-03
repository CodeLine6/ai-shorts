"use client"
import { Button } from "@/components/ui/button"
import { useConvex } from "convex/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "../../../../../convex/_generated/api"
import moment from "moment"
import { RefreshCcw, Ban, EllipsisVertical, Trash, RotateCcw } from "lucide-react"
import { VideoData } from "@/../convex/schema"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Id } from "@/../convex/_generated/dataModel"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast";
import { QueueVideo } from "@/actions/generateVideo"


const RenderProgress = ({status,progress} : {status: string,progress: number}) => {
  if(status == 'Completed') return null
  return (      
         <div className="w-3/4 text-center">
                  <p className="mb-2">Rendering</p>
                  <div className="w-3/4 mx-auto"><Progress value={progress}  /></div>
          </div>        
      )
}

const VideoStatus = ({status,progress} : {status: string,progress: number}) => {
  if(status == 'Completed') return null
  return (
    <div className={`absolute top-0 left-0 w-full h-full ${status.includes('Failed') ? 'bg-red-900' : 'bg-black'} bg-opacity-80 flex items-center justify-center gap-2`}>
      {status.includes('Failed') ?
            <>
              <Ban />
              <h2>Failed</h2>
            </>

        :  status == "Rendering" ?  <RenderProgress status={status} progress={progress} />
        :
          <>
            <RefreshCcw className="animate-spin" />
            <h2>{status}</h2>
          </>
      }
    </div>
  )
}

const VideoItem = ({ video, index }: { video: VideoData, index: number }) => {
  const convex = useConvex();
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
            <DropdownMenuItem onSelect={(e) => { e.preventDefault() }} onClick={(e) => e.target.closest('div[data-state="open"]').style.visibility = 'hidden'}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center w-full cursor-pointer">
                    <Trash className="mr-2" width={20} /> Delete
                  </div>
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
            </DropdownMenuItem>
            {video?.status == "Render Failed" &&
            <DropdownMenuItem className="cursor-pointer" onClick={handleRegenerate}><RotateCcw /> Retry</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        {video?.images?.[0].image &&<Image
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

function VideoList() {
  const [videoList, setVideoList] = useState<VideoData[]>([])
  const convex = useConvex();
  const session = useSession();
  const user = session.data?.user

  useEffect(() => {
    user && GetUserVideoList()
  }, [user])

  const GetUserVideoList = async () => {
    // All user videos
    const userVideoList = await convex.query(api.videoData.GetUsersVideo, {
      //@ts-ignore
      uid: user._id,
    })

    setVideoList(userVideoList as VideoData[])
  }

  return (
    <div>
      {videoList.length == 0 ?
        <div className="flex flex-col items-center justify-center mt-28 gap-5 p-5 py-16 border border-dashed rounded-xl">
          <Image src={'/logo.svg'} alt="logo" width={60} height={60} />
          <h2 className="text-gray-400 text-lg">You don't have any videos</h2>
          <Link href={'/dashboard/create-new-video'}>
            <Button>+ Create New Video</Button>
          </Link>
        </div> :
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
          {/* @ts-ignore */}
          {videoList?.map((video, index) => (
            <VideoItem video={video} index={index} />
          ))}
        </div>

      }
    </div>
  )
}

export default VideoList