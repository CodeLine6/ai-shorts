import React from 'react'
import { backgroundEffects } from '../../config'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Motion = ({customizeVideo, effectsData}: {customizeVideo: (property: string,value: any) => void, effectsData: any}) => {
  const handleClick = (value: string) => {
     customizeVideo("config",{
       ...effectsData,
       backgroundEffects: value
     })
  }
  return (
    <div className='grid grid-cols-3 gap-4'>
      {backgroundEffects.map(effect => {
        return <Button onClick={() => handleClick(effect.value)} variant={"outline"} className={cn("flex flex-col items-center gap-2 py-10", effectsData?.backgroundEffects === effect.value && "bg-muted")}>
                  <effect.icon />
                  {effect.label}
              </Button>
      })}
    </div>
  )
}

export default Motion