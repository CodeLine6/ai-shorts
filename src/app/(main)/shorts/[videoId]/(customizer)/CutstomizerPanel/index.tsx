"use client"

import { VideoData } from '@/../convex/schema'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { TabItems } from '../config'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import Music from './components/Music'

const CutstomizerPanel = ({videoData, activeTab} : {videoData: VideoData | null | undefined, activeTab: string}) => {
  const updateVideo = useMutation(api.videoData.UpdateVideoRecord)
  const customizeVideo = (property: string,value: any ) => {
    if(!videoData) return
    updateVideo({
      recordId: videoData._id as any,
      [property]: value,
      lastModified: new Date().toISOString(),
    })
  }
  return (
    <Tabs value={activeTab} className="h-full">
      {TabItems.map((tab) => {
        return (
          <TabsContent value={tab.value} className='h-full mt-0 bg-white bg-opacity-5 w-11/12 mx-auto' key={tab.value} asChild>
            <div className="p-4 rounded-md h-full">
                {tab.value === "music" ? 
                <Music customizeVideo={customizeVideo} volumeData={videoData?.volume} /> : 
                <tab.component customizeVideo={customizeVideo} effectsData={{config:videoData?.config}} />
                }
            </div>
          </TabsContent>  
        )  
      })}
    </Tabs>
  )
}

export default CutstomizerPanel
