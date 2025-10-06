"use client"
import React from 'react'
import { 
  AbsoluteFill, 
  Audio, 
  interpolate, 
  useCurrentFrame, 
  useVideoConfig, 
  spring, 
  Easing, 
  random,
} from 'remotion'
import {
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { sentence, utterance } from '@/../convex/schema'
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { bounceTransition, flipTransition,  shatterTransition, simpleGlitchTransition, spiralTransition, wipeTransition, zoomBlurTransition } from '../../../remotion/customTransitions';

// Motion utility functions
const getMotionIntensity = (intensity: string) => {
  switch (intensity) {
    case 'low': return 1;
    case 'high': return 1.8;
    default: return 1.4;
  }
}

// Custom rotate transition using proper Remotion pattern  

const RemotionComposition = ({ videoData }: { videoData: any }) => {
  const captions: { sentences: sentence[], utterances: utterance[] } = videoData?.captionJson
  const {utterances} = captions;
  const { fps } = useVideoConfig()
  const imageList = videoData?.images
  const frame = useCurrentFrame();
  const captionClass = videoData.caption.style
  const motionConfig = videoData?.config || {};
  const intensity = getMotionIntensity(motionConfig.intensity || 'medium');

  // Enhanced motion effects
  const getImageTransform = (imageIndex: number, localFrame: number, duration: number) => {
    const seed = imageIndex + 1;
    const cycleDuration = fps * 15; // 15 second cycle
    
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let rotation = 0;

    switch (motionConfig.backgroundEffects) {
      case 'kenBurns':
        const isZoomIn = random(`zoom-${seed}`) > 0.5;
        const startScale = isZoomIn ? 1 : 1.4 * intensity;
        const endScale = isZoomIn ? 1.4 * intensity : 1;
        
        scale = interpolate(
          localFrame,
          [0, duration/2],
          [startScale, endScale],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.6, 1) }
        );

        const panX = (random(`panX-${seed}`) - 0.5) * 100 * intensity;
        const panY = (random(`panY-${seed}`) - 0.5) * 50 * intensity;
        
        translateX = interpolate(
          localFrame,
          [0, duration],
          [0, panX],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.6, 1) }
        );
        
        translateY = interpolate(
          localFrame,
          [0, duration],
          [0, panY],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.6, 1) }
        );
        break;

      case 'parallax':
        const parallaxSpeed = 0.5 * intensity;
        translateY = Math.sin((localFrame / fps) * parallaxSpeed) * 20;
        translateX = Math.cos((localFrame / fps) * parallaxSpeed) * 10;
        scale = 1 + Math.sin((localFrame / fps) * 2) * 0.02 * intensity;
        break;

      case 'drift':
        const driftSpeed = 0.3 * intensity;
        translateX = Math.sin((localFrame / fps) * driftSpeed) * 30;
        translateY = Math.cos((localFrame / fps) * driftSpeed * 0.7) * 20;
        rotation = Math.sin((localFrame / fps) * 0.1) * 0.5 * intensity;
        scale = 1 + Math.sin((localFrame / fps) * 0.5) * 0.05 * intensity;
        break;

      default:
        scale = interpolate(
          localFrame % cycleDuration,
          [0, cycleDuration / 2, cycleDuration],
          [1, 1.2 * intensity, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.6, 1) }
        );
    }

    return {
      transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
      transformOrigin: 'center center'
    };
  };

  // Enhanced transition effects
  const getTransitionEffect = (imageIndex: number) => {
    var zoomDirection: "in" | "out" | undefined;
    var rotateDirection: "clockwise" | "counterclockwise" | undefined;
    
    switch (motionConfig.transition) {
        case 'slide':
        const slideDirection = imageIndex % 2 === 0 ? 'from-left' : 'from-right';
        return slide({ direction: slideDirection });

        case 'zoomBlurTransition':
        zoomDirection = imageIndex % 2 === 0 ? 'in' : 'out';  
        return zoomBlurTransition({direction: zoomDirection, intensity: intensity, blurAmount: 10});

        case "spiralTransition":
        rotateDirection = imageIndex % 2 === 0 ? 'clockwise' : 'counterclockwise';  
        return spiralTransition({direction: rotateDirection,spiralIntensity: intensity, rotations: 1});

        case "glitch":
        return simpleGlitchTransition({intensity: intensity});

        case "shatter":
        return shatterTransition({intensity: intensity});

        case "flip":
        return flipTransition({direction: 'horizontal', intensity: intensity});  

        case "wipe" : 
        const wipeDirection = imageIndex % 2 === 0 ? 'left' : 'right';
        return wipeTransition({direction: wipeDirection, intensity: intensity});

        case "bounce":
        return bounceTransition({intensity: intensity});  
    
        default:
        return fade();
    }
  };

  const getCurrentCaption = () => {
    const singleCaption: utterance[] = []
    utterances?.forEach((caption: utterance) => {
      singleCaption.push(caption)
    })
    const currentTime = frame / fps;
    const currentWord = singleCaption.find((word: utterance) => word.start <= currentTime && word.end >= currentTime)
    return currentWord
  }

  const getTextAnimation = (wordObj: utterance) => {
    if (!wordObj) return {};
    
    const wordStartFrame = Math.floor(wordObj.start * fps);
    const wordEndFrame = Math.floor(wordObj.end * fps);
    const timeSinceStart = frame - wordStartFrame;

    switch (motionConfig.subtitle) {
    case 'bounce':
        const bounceScale = spring({
          frame: timeSinceStart,
          fps,
          config: {
            damping: 100,
            stiffness: 200,
            mass: 0.3,
          },
          durationInFrames: 15,
          from: 0.5
        });

        const bounceY = spring({
          frame: timeSinceStart,
          fps,
          config: {
            damping: 150,
            stiffness: 300,
            mass: 0.2,
          },
          durationInFrames: 10,
          from: 20
        });

        return {
          content: wordObj.text,
          styles : {transform: `scale(${bounceScale}) translateY(${-bounceY}px)`},
        };

    case 'typewriter':
      const typewriterProgress = interpolate(
        timeSinceStart,
        [0, wordEndFrame - wordStartFrame],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      
      const charactersVisible = Math.floor(typewriterProgress * wordObj.text.length);
      const visibleText = wordObj.text.substring(0, charactersVisible);
      
      return {
        content: visibleText + (charactersVisible < wordObj.text.length ? '|' : ''),
        styles: {
          transform: 'scale(1)',
        fontFamily: 'monospace',
        }
      };

    case 'glow':
      const glowIntensity = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 200, stiffness: 100, mass: 0.5 },
        durationInFrames: 10,
        from: 0
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `scale(${1 + glowIntensity * 0.1})`,
        textShadow: `
          0 0 ${20 * glowIntensity}px currentColor,
          0 0 ${40 * glowIntensity}px currentColor,
          0 0 ${60 * glowIntensity}px currentColor
        `,
        filter: `brightness(${1 + glowIntensity * 0.5})`,
        }
      };

    case 'shake':
      const shakeX = Math.sin(timeSinceStart * 0.8) * 5;
      const shakeY = Math.cos(timeSinceStart * 1.2) * 3;
      const shakeScale = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 150, stiffness: 200, mass: 0.3 },
        durationInFrames: 15,
        from: 0.8
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `scale(${shakeScale}) translate(${shakeX}px, ${shakeY}px)`,
        }
      };

    case 'flip':
      const flipRotation = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 180, stiffness: 120, mass: 0.4 },
        durationInFrames: 20,
        from: 180
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `rotateY(${flipRotation}deg)`,
        transformStyle: 'preserve-3d' as const,
        }
      };

    case 'rainbow':
      const hue = (timeSinceStart * 10) % 360;
      const rainbowScale = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 200, stiffness: 100, mass: 0.5 },
        durationInFrames: 10,
        from: 0.8
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `scale(${rainbowScale})`,
        color: `hsl(${hue}, 100%, 70%)`,
        textShadow: `0 0 20px hsl(${hue}, 100%, 70%)`,
        }
      };

    case 'wave':
      const waveOffset = Math.sin((timeSinceStart * 0.1) + frame * 0.05) * 10;
      const waveScale = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 200, stiffness: 100, mass: 0.5 },
        durationInFrames: 10,
        from: 0.8
      });

      return {
        content: wordObj.text,
        styles: {
           transform: `scale(${waveScale}) translateY(${waveOffset}px) rotateZ(${Math.sin(timeSinceStart * 0.1) * 2}deg)`,
        }
      };

    case 'neon':
      const neonPulse = Math.sin(timeSinceStart * 0.3) * 0.5 + 0.5;
      const neonScale = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 200, stiffness: 100, mass: 0.5 },
        durationInFrames: 10,
        from: 0.8
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `scale(${neonScale})`,
          color: '#00ffff',
          textShadow: `
          0 0 5px #00ffff,
          0 0 10px #00ffff,
          0 0 20px #00ffff,
          0 0 40px #00ffff
        `,
          filter: `brightness(${1 + neonPulse * 0.5})`,
        }
      };

    case 'matrix':
      const matrixGlitch = Math.random() > 0.9 ? Math.random() : 1;
      const matrixScale = spring({
        frame: timeSinceStart,
        fps,
        config: { damping: 200, stiffness: 100, mass: 0.5 },
        durationInFrames: 10,
        from: 0.8
      });

      return {
        content: wordObj.text,
        styles: {
          transform: `scale(${matrixScale}) translateX(${(Math.random() - 0.5) * matrixGlitch * 5}px)`,
        color: '#00ff00',
        textShadow: '0 0 10px #00ff00',
        fontFamily: 'monospace',
        filter: matrixGlitch < 1 ? 'blur(1px)' : 'none',
        }
      };

    case 'slide':
        const slideX = spring({
          frame: timeSinceStart,
          fps,
          config: {
            damping: 200,
            stiffness: 100,
            mass: 0.5,
          },
          durationInFrames: 15,
          from: 100
        });

        const slideScale = spring({
          frame: timeSinceStart,
          fps,
          config: {
            damping: 200,
            stiffness: 150,
            mass: 0.4,
          },
          durationInFrames: 12,
          from: 0.8
        });

        return {
          content: wordObj.text,
          styles: {
            transform: `translateX(${-slideX}px) scale(${slideScale})`,
          }
        };

    default:
        const scale = spring({
          frame: timeSinceStart,
          fps,
          config: {
            damping: 200,
            stiffness: 100,
            mass: 0.5,
          },
          durationInFrames: 10,
          from: 0.8
        });

        return {
          content: wordObj.text,
          styles: {
            transform: `scale(${scale})`,
          }
        };
    }
  };

  // Calculate frame offsets for each image
  let frameOffset = 0;
  const imageFrameData = imageList?.map((image: any, index: number) => {
    const duration = Math.floor(image.duration * fps);
    const currentImageDuration = index === imageList.length - 1 ? duration + 70 : duration + 40;
    const startFrame = frameOffset;
    frameOffset += currentImageDuration;
    return {
      ...image,
      startFrame,
      duration: currentImageDuration
    };
  });

  return (
    <div>
      <AbsoluteFill>
        <TransitionSeries>
          {imageFrameData?.map((image: any, index: number) => (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={image.duration}>
                <AbsoluteFill>
                    <img
                      src={image.image}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        ...getImageTransform(index, frame - image.startFrame, image.duration),
                      }}
                    />                  
                  
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              
              {index !== imageFrameData.length - 1 && (
                <TransitionSeries.Transition
                  timing={springTiming({ durationInFrames: 20 })}
                  presentation={getTransitionEffect(index)}
                />
              )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </AbsoluteFill>
      
      {/* Caption Container */}
      <AbsoluteFill style={{
        bottom: '0px',
        textAlign: 'center',
        justifyContent: 'end',
        paddingBottom: '50px'
      }}>

        <AbsoluteFill
          style={{
            position: 'absolute',
            width: '100%',
            height: '400px',
            top: "unset",
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }}
        />        
        <h2 className={`${captionClass} text-6xl relative z-10`}>
          {(() => {
            const wordObj = getCurrentCaption();
            if (!wordObj) return null;

            return (
              <span
                style={{
                  display: 'inline-block',
                  marginRight: '0.5em',
                  ...getTextAnimation(wordObj).styles,
                }}
              >
                {getTextAnimation(wordObj).content ?? wordObj.text}
              </span>
            );
          })()}
        </h2>
      </AbsoluteFill>

      {/* Audio */}
      {videoData?.audioUrl && <Audio src={videoData.audioUrl} volume={videoData.volume?.voice} />}
      {videoData?.musicTrack?.url && (
        <Audio src={videoData.musicTrack.url} loop volume={videoData.volume?.backgroundMusic} />
      )}
    </div>
  )
}

export default RemotionComposition