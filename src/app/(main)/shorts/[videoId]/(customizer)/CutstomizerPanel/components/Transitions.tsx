import React from 'react'
import { imageTransitions } from '../../config'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Transitions = ({customizeVideo, effectsData}:{customizeVideo: (string: any,value: any) => void, effectsData: any}) => {
   const handleClick = (value: string) => {
       customizeVideo(
        "config",{
         ...effectsData,
         transition: value
       })
    }
  return (
    <div className='grid grid-cols-3 gap-4'>
      {imageTransitions.map(effect => {
        return <Button onClick={() => handleClick(effect.value)} variant={"outline"} className={cn("flex flex-col items-center gap-2 py-10", effectsData?.transition === effect.value && "bg-muted")}>
                  <effect.icon />
                  {effect.label}
              </Button>
      })}
    </div>
  )
}

export default Transitions