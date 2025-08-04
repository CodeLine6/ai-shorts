import { Button } from '@/components/ui/button'
import { ArrowLeft, DownloadIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const VIdeoInfo = ({videoData} : {videoData: any}) => {
  return (
    <div className='p-5 border rounded-xl'>
      <Link href='/dashboard'>
      <h2 className='flex gap-2 items-center'>
         <ArrowLeft />
         Back to Dashboard
      </h2>
      </Link>
      <div className='flex flex-col gap-3'>
        <h2 className='mt-5'>Project Name : {videoData?.title}</h2>
        <p className='text-gray-500'>Script : {videoData?.script}</p>
        <h2>Video Style : {videoData?.videoStyle}</h2>
        <Link href={videoData?.downloadUrl || ''} className='w-full' download={videoData?.title} >
        <Button><DownloadIcon /> Export & Download</Button>
        </Link>
      </div>
    </div>
  )
}

export default VIdeoInfo