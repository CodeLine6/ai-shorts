"use client"

import { VideoData } from '@/../convex/schema'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { TabItems } from '../config'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'

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
      const Component = tab.component;
        return (
          <TabsContent value={tab.value} className='h-full mt-0 bg-white bg-opacity-5 w-11/12 mx-auto' key={tab.value} asChild>
            <div className="p-4 rounded-md h-full">
                <Component customizeVideo={customizeVideo} effectsData={{config:videoData?.config,volume:videoData?.volume}} />
            </div>
          </TabsContent>  
        )  
      })}
    </Tabs>
  )
}

export default CutstomizerPanel
