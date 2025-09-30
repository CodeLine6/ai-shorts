import { Button } from '@/components/ui/button'
import { ArrowLeft, DownloadIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { VideoData } from '@/../convex/schema'

const VideoInfo = ({videoData} : {videoData: VideoData}) => {
  return (
    <>
      <Link href='/dashboard'>
      <h2 className='flex gap-2 items-center'>
         <ArrowLeft />
         Back to Dashboard
      </h2>
      </Link>
      <div className='flex flex-col h-full gap-3 relative'>
        
        {videoData ? <>
          <h2 className='mt-5'>Project Name :  {videoData.title}</h2>
        <p className='text-gray-500'><span className='text-white'>Script</span> : {videoData?.script}</p>
        <h2 className='mb-16'>Video Style : {videoData?.videoStyle}</h2>
        
        {videoData?.downloadUrl ? <Link href={videoData?.downloadUrl || ''}  className='w-full absolute bottom-5' download target='_blank' >
        <Button className='w-full'><DownloadIcon /> Download</Button>
        </Link> : <Button className='w-full absolute bottom-5' disabled><Loader2 className='animate-spin' /> Rendering...</Button>}
        </> : 
        <>
        <h2 className='mt-5 bg-gray-800 animate-pulse rounded-md p-3' />
        <h2 className='mt-2 bg-gray-800 animate-pulse rounded-md p-3' />
        <h2 className='mt-2 bg-gray-800 animate-pulse rounded-md p-3' />
        <Button className='w-full absolute bottom-5 bg-gray-800 animate-pulse' disabled/>
        </>}
      </div>
    </>
  )
}

export default VideoInfo