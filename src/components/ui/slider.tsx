"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal",...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none items-center",
      className,
      orientation === "vertical" && "mx-auto" 
    )}
    orientation={orientation}
    {...props}
  >
    <SliderPrimitive.Track className={cn("relative overflow-hidden rounded-full bg-primary/70", orientation === "horizontal" ? "h-1.5 w-full grow" : "w-1.5 h-full")}>
      <SliderPrimitive.Range className={cn("absolute bg-primary", orientation === "horizontal" ? "h-full" : "w-full")} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn("block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", orientation === "vertical" && "-translate-x-[5px]")} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
