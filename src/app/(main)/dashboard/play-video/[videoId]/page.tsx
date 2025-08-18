"use client"
import React, { useEffect, useState } from 'react'
import RemotionPlayer from '../_components/RemotionPlayer'
import VIdeoInfo from '../_components/VIdeoInfo'
import { useConvex } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { prefetchImages } from '@/lib/utils';

const PlayVideo = () => {

  const { videoId } = useParams();
  const convex = useConvex();
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    videoId && getVideoDataById()
  }, [videoId])

  const getVideoDataById = async () => {
    const videoData = await convex.query(api.videoData.GetVideoRecord, {
      //@ts-ignore
      recordId: videoId,
    })

    const prefetchedImages = await prefetchImages(videoData.images);

    setVideoData({
      ...videoData,
      images: prefetchedImages,
    });
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {videoData && videoData.captionJson  && <RemotionPlayer videoData={videoData} />}
        <div className='p-5 border rounded-xl'>
            <VIdeoInfo videoData={videoData} />
        </div>
    </div>
  )
}

export default PlayVideo