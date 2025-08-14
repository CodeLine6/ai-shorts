"use client"
import { Button } from "@/components/ui/button"
import { useConvex } from "convex/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "../../../../../convex/_generated/api"
import moment from "moment"
import { RefreshCcw } from "lucide-react"

function VideoList() {
  const [videoList, setVideoList] = useState<any>([])
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

      setVideoList(userVideoList)
    }

  return (
    <div>
        {videoList.length == 0 ?
            <div className="flex flex-col items-center justify-center mt-28 gap-5 p-5 py-16 border border-dashed rounded-xl">
                <Image src={'/logo.svg'} alt="logo" width={60} height={60}/>
                <h2 className="text-gray-400 text-lg">You don't have any videos</h2>
                <Link href={'/dashboard/create-new-video'}>
                    <Button>+ Create New Video</Button>
                </Link>
            </div> :
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
                {/* @ts-ignore */}
                {videoList?.map((video,index) => (
                    <Link href={`/dashboard/play-video/${video?._id}`} key={index}>
                    <div className="relative" key={index}>
                      {video?.status == 'completed' ? <Image 
                            src={video?.images[0].image} 
                            width={500} 
                            height={500} 
                            alt={video?.title}
                            className="w-full object-cover rounded-xl aspect-[2/3]"
                        /> : <div className="aspect-[2/3] p-5 w-full rounded-xl bg-slate-900 flex items-center justify-center gap-2">
                             <RefreshCcw className="animate-spin"/>
                             <h2>Generating...</h2>
                        </div>}
                        <div className="absolute bottom-1 text-center w-full">
                            <h2>{video?.title}</h2>
                            <h2 className="text-sm">{moment(video?._creationTime).fromNow()}</h2>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>

        }
    </div>
  )
}

export default VideoList