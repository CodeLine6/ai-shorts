import React, { use, useEffect } from 'react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { cn } from '@/lib/utils'
import { Slash  } from 'lucide-react';

const Volume = ({Icon, volume, orientation, width, updateVolume} : any) => {
 const [value, setValue] = React.useState(volume);
 const [muted, setMuted] = React.useState(false); 

 const toggleMuted = () => {
   setMuted(!muted)
   if(!muted) updateVolume(0)
   else updateVolume(value)
 }

 const modifyVolume = (value: number) => {
   
    if(value) {
      if(muted) toggleMuted()
      else {
        setValue(value)
        updateVolume(value)
      }
    }
    else toggleMuted()
 }


  return (
    <div className={cn("flex group gap-2 items-center relative hover:bg-accent rounded", orientation === "vertical" && "flex-col-reverse")}>
          <Button variant={"ghost"} size="icon" className={cn(muted && "text-muted-foreground","mx-auto relative")} onClick={toggleMuted}>
            <Icon className="w-4 h-4" />
            {muted && <Slash className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
          </Button>
          <div className={cn(orientation === "vertical" ? 'flex justify-center py-2 w-full bg-accent rounded absolute bottom-[30px] invisible group-hover:visible':`w-[${width}]`)}>
          <Slider
            value={[!muted ? value : 0]}
            max={1}
            className={cn(orientation === "vertical" && "h-24 flex")}
            step={0.01}
            orientation={orientation}
            onValueChange={(value) => modifyVolume(value[0])}
            />
        </div>
    </div>
  )
}

export default Volume