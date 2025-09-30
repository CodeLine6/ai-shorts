import z from "zod";

// Updated schema for Root.tsx
export const motionConfig = z.object({
  transition: z.enum([
    'fade', 'slide', 'zoomBlurTransition', 'spiralTransition', 
    'glitch', 'shatter', 'flip', 'wipe', 'bounce'
  ]).optional(),
  subtitle: z.enum([
    'spring', 'bounce', 'slide', 'typewriter', 'glow', 
    'shake', 'flip', 'rainbow', 'wave', 'neon', 'matrix'
  ]).optional(),
  backgroundEffects: z.enum(['parallax', 'kenBurns', 'drift']).optional(),
  intensity: z.enum(['low', 'medium', 'high']).optional(),
}).optional()

// Example configurations
export const motionPresets : Record<"cyberpunk" | "retro" | "matrix" | "dynamic" | "dramatic", z.infer<typeof motionConfig>> = {
  cyberpunk: {
    transition: 'glitch',
    subtitle: 'neon',
    backgroundEffects: 'drift',
    intensity: 'high'
  },
  retro: {
    transition: 'flip',
    subtitle: 'rainbow',
    backgroundEffects: 'kenBurns',
    intensity: 'medium'
  },
  matrix: {
    transition: 'wipe',
    subtitle: 'matrix',
    backgroundEffects: 'parallax',
    intensity: 'high'
  },
  dynamic: {
    transition: 'bounce',
    subtitle: 'wave',
    backgroundEffects: 'drift',
    intensity: 'high'
  },
  dramatic: {
    transition: 'shatter',
    subtitle: 'glow',
    backgroundEffects: 'kenBurns',
    intensity: 'medium'
  } 
};