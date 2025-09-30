import { TransitionPresentationComponentProps } from '@remotion/transitions';
import {
  AbsoluteFill,
  interpolate,
} from 'remotion';

// Advanced Zoom with Blur
const zoomBlurPresentation = ({ children, presentationDirection, presentationProgress, passedProps: {direction = "in",intensity = 1, blurAmount = 10} }: any) => {
  const isEntering = presentationDirection === 'entering';
  const progress = presentationProgress; 

  const scale = isEntering
    ? interpolate(
        progress,
        [0, 1],
        direction === 'in' ? [0.3 * intensity, 1] : [3 * intensity,1],
      )
    : interpolate(
        progress,
        [0, 1],
        direction === 'in' ? [1, 3 * intensity] : [1, 0.3 * intensity],
      );

  const blur = isEntering
    ? interpolate(
        progress,
        [0, 0.6, 1],
        [blurAmount, blurAmount * 0.5, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
      )
    : interpolate(
        progress,
        [0, 0.4, 1],
        [0, blurAmount * 0.5, blurAmount],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
      );

    const opacity = isEntering
      ? interpolate(progress, [0, 0.3, 1], [0, 0.8, 1])
      : interpolate(progress, [0, 0.7, 1], [1, 0.8, 0]);

    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>
    );
}
export const zoomBlurTransition = (props: {direction?: 'in' | 'out',intensity?: number, blurAmount?: number} = {}) => {  
    return {
      component: zoomBlurPresentation,
      props: props !== null && props !== void 0 ? props : {},
    };
};

// Spiral Rotate Transition
const spiralPresentation = ({children, presentationDirection, presentationProgress, passedProps: {direction = "clockwise",spiralIntensity = 1, rotations = 1} }: any) => {
  const isEntering = presentationDirection === 'entering';
  const progress = presentationProgress;

  const rotationMultiplier = direction === 'clockwise' ? 1 : -1;
  
  const rotation = isEntering
    ? interpolate(
        progress,
        [0, 1],
        [360 * rotations * rotationMultiplier, 0],
      )
    : interpolate(
        progress,
        [0, 1],
        [0, -360 * rotations * rotationMultiplier],
      );

  const scale = isEntering
    ? interpolate(
        progress,
        [0, 0.7, 1],
        [0.2 * spiralIntensity, 0.9, 1],
      )
    : interpolate(
        progress,
        [0, 0.3, 1],
        [1, 0.9, 0.2 * spiralIntensity],
      );

   const translateX = Math.sin((progress * Math.PI * 2 * rotations)) * 20 * spiralIntensity;
   const translateY = Math.cos((progress * Math.PI * 2 * rotations)) * 20 * spiralIntensity;

   const opacity = isEntering
      ? interpolate(progress, [0, 0.3, 1], [0, 0.8, 1])
      : interpolate(progress, [0, 0.7, 1], [1, 0.8, 0]);   

   return (
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>
    );

}
export const spiralTransition = (props: {direction?: 'clockwise' | 'counterclockwise',spiralIntensity?: number, rotations?: number} = {}) => {
  return {
    component: spiralPresentation,
    props: props !== null && props !== void 0 ? props : {},
  };
}

// Glitch Transition
// Simple CSS Glitch Transition
export const simpleGlitchTransition = ({
  intensity = 1
}: {
  intensity?: number;
} = {}) => ({
  name: "simpleGlitch",
  component: (props: TransitionPresentationComponentProps<{}>) => {
    const {children, presentationDirection, presentationProgress} = props;
    
    const isEntering = presentationDirection === 'entering';
    const progress = presentationProgress;
    
    // Glitch timing - more frequent at the beginning/end
    const glitchIntensity = Math.sin(progress * Math.PI * 8) * intensity;
    const shouldGlitch = Math.abs(glitchIntensity) > 0.5;
    
    const scale = interpolate(
      progress,
      [0, 0.3, 0.7, 1],
      isEntering ? [0.9, 1.05, 0.95, 1] : [1, 0.95, 1.05, 0.9]
    );

    const opacity = interpolate(
      progress,
      [0, 0.2, 0.8, 1],
      isEntering ? [0, 0.8, 1, 1] : [1, 1, 0.8, 0]
    );

    // Random displacement
    const translateX = shouldGlitch ? (Math.random() - 0.5) * 20 * intensity : 0;
    const skewX = shouldGlitch ? (Math.random() - 0.5) * 5 * intensity : 0;

    return (
      <div
        style={{
          transform: `scale(${scale}) translateX(${translateX}px) skewX(${skewX}deg)`,
          height: '100%',
          width: '100%',
          opacity,
          filter: shouldGlitch 
            ? `
                contrast(${1 + Math.random() * 0.5})
                brightness(${0.8 + Math.random() * 0.4})
                hue-rotate(${Math.random() * 30}deg)
              `
            : 'none',
          animation: shouldGlitch ? 'glitchFlicker 0.1s ease-in-out' : 'none',
        }}
      >
        {children}
      </div>
    );
  }
});

// Shatter Transition
// Polygon Shatter Transition
export const shatterTransition = ({
  intensity = 1
}: {
  intensity?: number;
} = {}) => ({
  name: "polygonShatter",
  component: (props: TransitionPresentationComponentProps<{}>) => {
    const {children, presentationDirection, presentationProgress} = props;
    
    const isEntering = presentationDirection === 'entering';
    const progress = presentationProgress;
    
    // Define irregular polygon shapes for shatter pieces
    const shatterPieces = [
      { clipPath: "polygon(0% 0%, 60% 0%, 30% 40%, 0% 35%)", angle: -45, distance: 150 },
      { clipPath: "polygon(60% 0%, 100% 0%, 100% 45%, 70% 35%, 30% 40%)", angle: 30, distance: 180 },
      { clipPath: "polygon(100% 45%, 100% 100%, 65% 100%, 70% 35%)", angle: 90, distance: 200 },
      { clipPath: "polygon(65% 100%, 0% 100%, 0% 35%, 30% 40%, 70% 35%)", angle: -120, distance: 170 },
      { clipPath: "polygon(30% 40%, 70% 35%, 65% 65%, 25% 70%)", angle: 180, distance: 120 },
    ];
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {shatterPieces.map((piece, index) => {
          const fragmentDelay = (index / shatterPieces.length) * 0.3;
          const adjustedProgress = Math.max(0, (progress - fragmentDelay) / (1 - fragmentDelay));
          
          const translateX = isEntering
            ? interpolate(
                adjustedProgress,
                [0, 1],
                [Math.cos(piece.angle * Math.PI / 180) * piece.distance * intensity, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
            : interpolate(
                adjustedProgress,
                [0, 1],
                [0, Math.cos(piece.angle * Math.PI / 180) * piece.distance * intensity],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              
          const translateY = isEntering
            ? interpolate(
                adjustedProgress,
                [0, 1],
                [Math.sin(piece.angle * Math.PI / 180) * piece.distance * intensity, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
            : interpolate(
                adjustedProgress,
                [0, 1],
                [0, Math.sin(piece.angle * Math.PI / 180) * piece.distance * intensity],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

          
          const scale = interpolate(
            adjustedProgress,
            [0, 1],
            isEntering ? [0.5, 1] : [1, 0.3]
          );
          
          const opacity = interpolate(
            adjustedProgress,
            [0, 0.8, 1],
            isEntering ? [0, 0.9, 1] : [1, 0.9, 0]
          );
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: piece.clipPath,
                transform: `translate(${translateX}px, ${translateY}px) `,
                opacity,
                filter: `blur(${Math.abs(translateX + translateY) * 0.01}px)`, // Add motion blur
              }}
            >
              {children}
            </div>
          );
        })}
      </div>
    );
  }
});

// Flip Transition
export const flipTransition = ({
  direction = 'horizontal',
  intensity = 1
}: {
  direction?: 'horizontal' | 'vertical';
  intensity?: number;
} = {}) => ({
  name: "flip",
  component: (props: TransitionPresentationComponentProps<{}>) => {
    const {children, presentationDirection, presentationProgress} = props;
    
    const isEntering = presentationDirection === 'entering';
    const progress = presentationProgress;
    
    const rotateValue = isEntering
      ? interpolate(progress, [0, 1], [180 * intensity, 0])
      : interpolate(progress, [0, 1], [0, 180 * intensity]);

    const scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1, 0.8, 1]
    );

    const opacity = interpolate(
      progress,
      [0, 0.4, 0.6, 1],
      isEntering ? [0, 0, 1, 1] : [1, 1, 0, 0]
    );

    const rotateAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';

    return (
      <AbsoluteFill
        style={{
          transform: `${rotateAxis}(${rotateValue}deg) scale(${scale})`,
          opacity,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
});

// Wipe Transition
export const wipeTransition = ({
  direction = 'left',
  intensity = 1
}: {
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number;
} = {}) => ({
  name: "wipe",
  component: (props: TransitionPresentationComponentProps<{}>) => {
    const {children, presentationDirection, presentationProgress} = props;
    
    const isEntering = presentationDirection === 'entering';
    
    const getClipPath = () => {
      const pos = interpolate(presentationProgress, [0, 1], [0, 100]);
      
      if(isEntering) {
        switch (direction) {
        case 'right':
          return `inset(0 ${100 - pos}% 0 0)`;
        case 'up':
          return `inset(${100 - pos}% 0 0 0)`;
        case 'down':
          return  `inset(0 0 ${100 - pos}% 0)`;
        default: // left
          return `inset(0 0 0 ${100 - pos}%)`;
      }  
      }
      else {
         return `inset(0 0 0 0)`
      }
      
    };

    return (
      <AbsoluteFill
        style={{
          clipPath: getClipPath(),
          transform: `scale(${1 + (Math.sin(presentationProgress * Math.PI) * 0.05 * intensity)})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
});

// Bounce Transition
export const bounceTransition = ({
  intensity = 1,
  bounces = 2
}: {
  intensity?: number;
  bounces?: number;
} = {}) => ({
  name: "bounce",
  component: (props: TransitionPresentationComponentProps<{}>) => {
    const {children, presentationDirection, presentationProgress} = props;
    
    const isEntering = presentationDirection === 'entering';
    const progress = presentationProgress;
    
    const bounceEffect = Math.sin(progress * Math.PI * bounces) * (1 - progress);
    const scale = isEntering
      ? interpolate(progress, [0, 1], [0.3, 1]) + bounceEffect * 0.3 * intensity
      : interpolate(progress, [0, 1], [1, 0.3]) + bounceEffect * 0.3 * intensity;

    const translateY = bounceEffect * 50 * intensity;

    const opacity = interpolate(
      progress,
      [0, 0.2, 0.8, 1],
      isEntering ? [0, 0.8, 0.95, 1] : [1, 0.95, 0.8, 0]
    );

    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${-translateY}px)`,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
});