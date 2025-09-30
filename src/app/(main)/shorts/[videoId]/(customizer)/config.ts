import {lazy} from "react";
import { Music, Play, Scissors, Captions} from "lucide-react";
import {
  // Background Effects
  Layers,        // parallax
  ZoomIn,        // kenBurns  
  Wind,          // drift
  
  // Image Transitions
  Eye,           // fade
  ArrowRight,    // slide
  Search,        // zoom (zoomBlurTransition)
  RotateCw,      // spiral
  FlipHorizontal, // flip
  Slash,         // wipe
  TrendingUp,    // bounce
  
  // Text Animations
  Activity,      // spring
  ChevronsUp,    // bounce
  MoveHorizontal, // slide
  Type,          // typewriter
  Sun,           // glow
  Zap,           // shake
  RefreshCw,     // flip
  Palette,       // rainbow
  Waves,         // wave
  Lightbulb,     // neon
  Code           // matrix
} from 'lucide-react';


const BackgroundEffects = lazy(() => import("./_components/CutstomizerPanel/components/BackgroundEffects"));
const MusicComp = lazy(() => import("./_components/CutstomizerPanel/components/Music"));
const Transitions = lazy(() => import("./_components/CutstomizerPanel/components/Transitions"));
const Capt = lazy(() => import("./_components/CutstomizerPanel/components/Captions"));


export const TabItems = [
   {
      label : "Motion",
      icon : Play,
      value : "motion",
      component: BackgroundEffects
   },
   {
      label : "Music",
      icon : Music,
      value : "music",
      component: MusicComp
   },
   {
     label :  "Transitions",
     icon : Scissors,
     value : "transitions",
     component: Transitions
   },
   {
    label: "Caption",
    icon: Captions,
    value: "caption",
    component:  Capt
   }
];

export const backgroundEffects = [
  {
    label: 'Parallax',
    value: 'parallax',
    icon: Layers
  },
  {
    label: 'Ken Burns',
    value: 'kenBurns',
    icon: ZoomIn
  },
  {
    label: 'Drift',
    value: 'drift',
    icon: Wind
  }
];

export const imageTransitions = [
  {
    label: 'Fade',
    value: 'fade',
    icon: Eye
  },
  {
    label: 'Slide',
    value: 'slide',
    icon: ArrowRight
  },
  {
    label: 'Zoom',
    value: 'zoomBlurTransition',
    icon: Search
  },
  {
    label: 'Spiral',
    value: 'spiralTransition',
    icon: RotateCw
  },
  {
    label: 'Flip',
    value: 'flip',
    icon: FlipHorizontal
  },
  {
    label: 'Wipe',
    value: 'wipe',
    icon: Slash
  },
  {
    label: 'Bounce',
    value: 'bounce',
    icon: TrendingUp
  }
];

export const textAnimations = [
  {
    label: 'Spring',
    value: 'spring',
    icon: Activity
  },
  {
    label: 'Bounce',
    value: 'bounce',
    icon: ChevronsUp
  },
  {
    label: 'Slide',
    value: 'slide',
    icon: MoveHorizontal
  },
  {
    label: 'Typewriter',
    value: 'typewriter',
    icon: Type
  },
  {
    label: 'Glow',
    value: 'glow',
    icon: Sun
  },
  {
    label: 'Shake',
    value: 'shake',
    icon: Zap
  },
  {
    label: 'Flip',
    value: 'flip',
    icon: RefreshCw
  },
  {
    label: 'Rainbow',
    value: 'rainbow',
    icon: Palette
  },
  {
    label: 'Wave',
    value: 'wave',
    icon: Waves
  },
  {
    label: 'Neon',
    value: 'neon',
    icon: Lightbulb
  },
  {
    label: 'Matrix',
    value: 'matrix',
    icon: Code
  }
];