"use client"
import { Button } from "@/components/ui/button"
import { useConvex } from "convex/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "../../../../../convex/_generated/api"
import moment from "moment"
import { RefreshCcw, Ban } from "lucide-react"
import { VideoData } from "../../../../../convex/schema"

const VideoItem = ({ video, index }: { video: VideoData, index: number }) => {
  return (
    <Link href={`/dashboard/play-video/${video?._id}`} key={index}>
      <div className="relative" key={index}>
        {video?.status != 'Completed' && video?.status != 'Generating Video' && video?.status != 'Failed' ?
          <div className="aspect-[2/3] p-5 w-full rounded-xl bg-slate-900 flex items-center justify-center gap-2">
            <RefreshCcw className="animate-spin" />
            <h2>{video?.status}</h2>
          </div>
          :
          video?.status == 'Failed' ?
            <div className="aspect-[2/3] p-5 w-full rounded-xl bg-red-900 flex items-center justify-center gap-2">
              <Ban />
              <h2>Failed</h2>
            </div>
            :
            <div className="relative aspect-[2/3]">
              {video.status == 'Generating Video' && <><div
                className="absolute top-0 left-0 w-full h-full bg-black opacity-70"
                style={{ clipPath: `inset(${video.renderProgress}% 0 0 0)`,transition: "clip-path 0.3s ease-in-out" }} />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-whitet">
                  <p>Rendering<br/></p>
                  {video.renderProgress}%
                </div>
              </>}
              <Image
                src={video?.images[0].image}
                width={500}
                height={500}
                alt={video?.title}
                className="w-full object-cover rounded-xl aspect-[2/3]"
              />
            </div>
        }
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