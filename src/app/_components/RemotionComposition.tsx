"use client"
import React, { useEffect } from 'react'
import { AbsoluteFill, Audio, interpolate, useCurrentFrame, useVideoConfig, spring, Easing  } from 'remotion'
import {
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { sentence, utterance, word } from '../../../convex/schema'

import { fade } from "@remotion/transitions/fade";

const RemotionComposition = ({ videoData }: { videoData: any }) => {
  videoData
  const captions: { sentences: sentence[], utterances: utterance[] } = videoData?.captionJson
  const sentences = captions.utterances;
  const { fps } = useVideoConfig()
  const imageList = videoData?.images
  const frame = useCurrentFrame();
  const captionClass = videoData.caption.style

  const zoomCycleDuration = fps * 20;

  const continuousZoomScale = interpolate(
    frame % zoomCycleDuration,
    [0, zoomCycleDuration / 2, zoomCycleDuration],
    [1, 2, 1], // Zoom from 1x to 1.2x and back to 1x within each cycle
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear // Add linear easing
 }
  );

  const getCurrentCaption = () => {
    const singleCaption: word[] = []
    sentences?.forEach((caption: utterance) => {
      singleCaption.push(...caption.words)
    })
    const currentTime = frame / fps;

    const currentWord = singleCaption.find((word: word) => word.start <= currentTime && word.end >= currentTime)
    return currentWord

  }

  return (
    <div>
      <AbsoluteFill>
        <TransitionSeries>
          {imageList?.map((image: any, index: number) => {
            const duration = image.duration * fps
            const currentImageDuration = index === imageList.length - 1 ? duration + 70 : duration + 40

            return (
              <>
                <TransitionSeries.Sequence key={index} durationInFrames={currentImageDuration}>
                  <AbsoluteFill>
                    <img
                      src={image.image}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${continuousZoomScale})`,
                      }}
                    />
                  </AbsoluteFill>
                </TransitionSeries.Sequence>
                {index !== imageList.length - 1 && <TransitionSeries.Transition
                  timing={springTiming({durationInFrames: 20})}
                  presentation={fade()}
                />}
              </>
            )
          })}
        </TransitionSeries>
      </AbsoluteFill>
      <AbsoluteFill style={{
        justifyContent: 'center',
        top: undefined,
        bottom: '-310px',
        textAlign: 'center',
      }}>
        <h2 className={`${captionClass} text-6xl`}>
          {((wordObj = getCurrentCaption()) => {
            if (!wordObj) {
              return null;
            }
            const wordStartFrame = Math.floor(wordObj.start * fps);

            const scale = spring({
              frame: frame - wordStartFrame,
              fps,
              config: {
                damping: 200,
                stiffness: 100,
                mass: 0.5,
              },
              durationInFrames: 10,
              from: 0.8
            });

            return (
              <span
                style={{
                  display: 'inline-block',
                  transform: `scale(${scale})`,
                  marginRight: '0.5em', // Add some space between words
                }}
              >
                {wordObj.word}
              </span>
            );
          })()}
        </h2>
      </AbsoluteFill>
      {videoData?.audioUrl && <Audio src={videoData.audioUrl} />}
    </div>
  )
}

export default RemotionComposition
