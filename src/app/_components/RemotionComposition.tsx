"use client"
import React, { useEffect } from 'react'
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'
import { sentence, word } from '../../../convex/schema'

const RemotionComposition = ({ videoData }: { videoData: any }) => {videoData
    const captions: sentence[] = videoData?.captionJson
    
    const {fps} = useVideoConfig()
    const imageList = videoData?.images
    const frame = useCurrentFrame();
    const captionClass = videoData.caption.style

    useEffect(() => {
        videoData && getDurationFrame()
    }, [videoData])
    const getDurationFrame = () => {
      const totalDuration = (captions[captions.length - 1].end) * fps
      //setDurationInFrames(Number(totalDuration.toFixed(0)) + 100)
      return totalDuration
    }

    const getCurrentCaption = () => {
       const singleCaption: word[] = [] 
       captions?.forEach((caption : sentence) => {
        caption?.words?.forEach((word : word) => {
            singleCaption.push(word)
        })
       })
       const currentTime = frame/fps;

       const currentWord = singleCaption.find((word : word) => word.start <= currentTime && word.end >= currentTime)
       return currentWord ? currentWord.word : ''

    }

  return (
    <div>
        <AbsoluteFill>
            {imageList?.map((image : any, index : number) => {
                const startTime = image.start * fps
                const duration = image.duration * fps
                
                return (
                    <Sequence key={index} from={startTime} durationInFrames={duration} >
                      <AbsoluteFill>
                        <img src={image.image} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </AbsoluteFill>
                    </Sequence>
                )
            })}
        </AbsoluteFill>
        <AbsoluteFill style={{
            opacity: interpolate(frame, [0, 1], [0, 1]),
            justifyContent: 'center',
            top: undefined,
            bottom: '-310px',
            textAlign: 'center',
        }}>
            <h2 className={`${captionClass} text-6xl`}>{getCurrentCaption()}</h2>
        </AbsoluteFill>
            {videoData?.audioUrl && <Audio src={videoData.audioUrl} />}
    </div>
  )
}

export default RemotionComposition