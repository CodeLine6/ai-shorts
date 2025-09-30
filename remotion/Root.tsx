import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';
import * as z from 'zod';
import { musicTracks } from '../src/config/musicTracks';
import { motionConfig } from './motionConfig';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9740nggz2t7jncdt54k7br4917p1178/audio/The_Skills_of_Tomorrow-1755664666862.mp3",
  captionJson: {
  sentences: [
    {
      channel: 0,
      confidence: 0.93,
      end: 1.549,
      language: "en",
      sentence: "Forget just learning to code.",
      start: 0.108,
      words: [
        {
          confidence: 1,
          end: 0.428,
          start: 0.108,
          word: "Forget",
        },
        {
          confidence: 0.88,
          end: 0.649,
          start: 0.468,
          word: " just",
        },
        {
          confidence: 0.99,
          end: 1.009,
          start: 0.729,
          word: " learning",
        },
        {
          confidence: 0.99,
          end: 1.13,
          start: 1.01,
          word: " to",
        },
        {
          confidence: 0.78,
          end: 1.549,
          start: 1.189,
          word: " code.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 4.891,
      language: "en",
      sentence:
        "The skills of tomorrow go beyond programming.",
      start: 2.45,
      words: [
        {
          confidence: 0.91,
          end: 2.571,
          start: 2.45,
          word: " The",
        },
        {
          confidence: 0.99,
          end: 2.971,
          start: 2.61,
          word: " skills",
        },
        {
          confidence: 1,
          end: 3.11,
          start: 2.991,
          word: " of",
        },
        {
          confidence: 0.91,
          end: 3.551,
          start: 3.132,
          word: " tomorrow",
        },
        {
          confidence: 1,
          end: 3.751,
          start: 3.632,
          word: " go",
        },
        {
          confidence: 1,
          end: 4.192,
          start: 3.811,
          word: " beyond",
        },
        {
          confidence: 1,
          end: 4.891,
          start: 4.294,
          word: " programming.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 10.716,
      language: "en",
      sentence:
        "We'll need AI prompting, problem solving, ethics, and creativity.",
      start: 5.872,
      words: [
        {
          confidence: 0.58,
          end: 6.012,
          start: 5.872,
          word: " We'll",
        },
        {
          confidence: 1,
          end: 6.333,
          start: 6.094,
          word: " need",
        },
        {
          confidence: 0.92,
          end: 6.696,
          start: 6.434,
          word: " AI",
        },
        {
          confidence: 1,
          end: 7.255,
          start: 6.794,
          word: " prompting,",
        },
        {
          confidence: 1,
          end: 8.059,
          start: 7.696,
          word: " problem",
        },
        {
          confidence: 1,
          end: 8.575,
          start: 8.176,
          word: " solving,",
        },
        {
          confidence: 0.98,
          end: 9.419,
          start: 9.02,
          word: " ethics,",
        },
        {
          confidence: 0.99,
          end: 9.958,
          start: 9.841,
          word: " and",
        },
        {
          confidence: 1,
          end: 10.716,
          start: 9.997,
          word: " creativity.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 16.872,
      language: "en",
      sentence:
        "The future belongs to people who can combine human imagination with machine intelligence.",
      start: 11.739,
      words: [
        {
          confidence: 0.93,
          end: 11.856,
          start: 11.739,
          word: " The",
        },
        {
          confidence: 1,
          end: 12.262,
          start: 11.903,
          word: " future",
        },
        {
          confidence: 0.97,
          end: 12.7,
          start: 12.278,
          word: " belongs",
        },
        {
          confidence: 1,
          end: 12.817,
          start: 12.701,
          word: " to",
        },
        {
          confidence: 0.97,
          end: 13.161,
          start: 12.88,
          word: " people",
        },
        {
          confidence: 0.96,
          end: 13.278,
          start: 13.162,
          word: " who",
        },
        {
          confidence: 1,
          end: 13.458,
          start: 13.341,
          word: " can",
        },
        {
          confidence: 0.98,
          end: 14.005,
          start: 13.505,
          word: " combine",
        },
        {
          confidence: 0.97,
          end: 14.341,
          start: 14.059,
          word: " human",
        },
        {
          confidence: 1,
          end: 15.122,
          start: 14.403,
          word: " imagination",
        },
        {
          confidence: 0.92,
          end: 15.606,
          start: 15.481,
          word: " with",
        },
        {
          confidence: 0.86,
          end: 16.09,
          start: 15.661,
          word: " machine",
        },
        {
          confidence: 0.97,
          end: 16.872,
          start: 16.137,
          word: " intelligence.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.87,
      end: 19.95,
      language: "en",
      sentence: "Those who learn, they'll thrive.",
      start: 17.84,
      words: [
        {
          confidence: 0.94,
          end: 18.09,
          start: 17.84,
          word: " Those",
        },
        {
          confidence: 0.98,
          end: 18.2,
          start: 18.091,
          word: " who",
        },
        {
          confidence: 0.94,
          end: 18.544,
          start: 18.278,
          word: " learn,",
        },
        {
          confidence: 0.54,
          end: 19.45,
          start: 19.231,
          word: " they'll",
        },
        {
          confidence: 0.97,
          end: 19.95,
          start: 19.465,
          word: " thrive.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.89,
      end: 22.715,
      language: "en",
      sentence: "Those who don't, they'll be left behind.",
      start: 20.512,
      words: [
        {
          confidence: 0.99,
          end: 20.684,
          start: 20.512,
          word: " Those",
        },
        {
          confidence: 0.99,
          end: 20.809,
          start: 20.685,
          word: " who",
        },
        {
          confidence: 0.83,
          end: 21.09,
          start: 20.84,
          word: " don't,",
        },
        {
          confidence: 0.47,
          end: 21.856,
          start: 21.684,
          word: " they'll",
        },
        {
          confidence: 0.99,
          end: 21.965,
          start: 21.857,
          word: " be",
        },
        {
          confidence: 1,
          end: 22.215,
          start: 22.012,
          word: " left",
        },
        {
          confidence: 0.96,
          end: 22.715,
          start: 22.247,
          word: " behind.",
        },
      ],
    },
  ],
  utterances: [
    {
      channel: 0,
      confidence: 0.93,
      end: 1.549,
      language: "en",
      start: 0.108,
      text: "Forget just learning to code.",
      words: [
        {
          confidence: 1,
          end: 0.428,
          start: 0.108,
          word: "Forget",
        },
        {
          confidence: 0.88,
          end: 0.649,
          start: 0.468,
          word: " just",
        },
        {
          confidence: 0.99,
          end: 1.009,
          start: 0.729,
          word: " learning",
        },
        {
          confidence: 0.99,
          end: 1.13,
          start: 1.01,
          word: " to",
        },
        {
          confidence: 0.78,
          end: 1.549,
          start: 1.189,
          word: " code.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 4.891,
      language: "en",
      start: 2.45,
      text: "The skills of tomorrow go beyond programming.",
      words: [
        {
          confidence: 0.91,
          end: 2.571,
          start: 2.45,
          word: " The",
        },
        {
          confidence: 0.99,
          end: 2.971,
          start: 2.61,
          word: " skills",
        },
        {
          confidence: 1,
          end: 3.11,
          start: 2.991,
          word: " of",
        },
        {
          confidence: 0.91,
          end: 3.551,
          start: 3.132,
          word: " tomorrow",
        },
        {
          confidence: 1,
          end: 3.751,
          start: 3.632,
          word: " go",
        },
        {
          confidence: 1,
          end: 4.192,
          start: 3.811,
          word: " beyond",
        },
        {
          confidence: 1,
          end: 4.891,
          start: 4.294,
          word: " programming.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.88,
      end: 7.255,
      language: "en",
      start: 5.872,
      text: "We'll need AI prompting,",
      words: [
        {
          confidence: 0.58,
          end: 6.012,
          start: 5.872,
          word: " We'll",
        },
        {
          confidence: 1,
          end: 6.333,
          start: 6.094,
          word: " need",
        },
        {
          confidence: 0.92,
          end: 6.696,
          start: 6.434,
          word: " AI",
        },
        {
          confidence: 1,
          end: 7.255,
          start: 6.794,
          word: " prompting,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 1,
      end: 8.575,
      language: "en",
      start: 7.696,
      text: "problem solving,",
      words: [
        {
          confidence: 1,
          end: 8.059,
          start: 7.696,
          word: " problem",
        },
        {
          confidence: 1,
          end: 8.575,
          start: 8.176,
          word: " solving,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 9.419,
      language: "en",
      start: 9.02,
      text: "ethics,",
      words: [
        {
          confidence: 0.98,
          end: 9.419,
          start: 9.02,
          word: " ethics,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 10.716,
      language: "en",
      start: 9.841,
      text: "and creativity.",
      words: [
        {
          confidence: 0.99,
          end: 9.958,
          start: 9.841,
          word: " and",
        },
        {
          confidence: 1,
          end: 10.716,
          start: 9.997,
          word: " creativity.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 16.872,
      language: "en",
      start: 11.739,
      text: "The future belongs to people who can combine human imagination with machine intelligence.",
      words: [
        {
          confidence: 0.93,
          end: 11.856,
          start: 11.739,
          word: " The",
        },
        {
          confidence: 1,
          end: 12.262,
          start: 11.903,
          word: " future",
        },
        {
          confidence: 0.97,
          end: 12.7,
          start: 12.278,
          word: " belongs",
        },
        {
          confidence: 1,
          end: 12.817,
          start: 12.701,
          word: " to",
        },
        {
          confidence: 0.97,
          end: 13.161,
          start: 12.88,
          word: " people",
        },
        {
          confidence: 0.96,
          end: 13.278,
          start: 13.162,
          word: " who",
        },
        {
          confidence: 1,
          end: 13.458,
          start: 13.341,
          word: " can",
        },
        {
          confidence: 0.98,
          end: 14.005,
          start: 13.505,
          word: " combine",
        },
        {
          confidence: 0.97,
          end: 14.341,
          start: 14.059,
          word: " human",
        },
        {
          confidence: 1,
          end: 15.122,
          start: 14.403,
          word: " imagination",
        },
        {
          confidence: 0.92,
          end: 15.606,
          start: 15.481,
          word: " with",
        },
        {
          confidence: 0.86,
          end: 16.09,
          start: 15.661,
          word: " machine",
        },
        {
          confidence: 0.97,
          end: 16.872,
          start: 16.137,
          word: " intelligence.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.95,
      end: 18.544,
      language: "en",
      start: 17.84,
      text: "Those who learn,",
      words: [
        {
          confidence: 0.94,
          end: 18.09,
          start: 17.84,
          word: " Those",
        },
        {
          confidence: 0.98,
          end: 18.2,
          start: 18.091,
          word: " who",
        },
        {
          confidence: 0.94,
          end: 18.544,
          start: 18.278,
          word: " learn,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.76,
      end: 19.95,
      language: "en",
      start: 19.231,
      text: "they'll thrive.",
      words: [
        {
          confidence: 0.54,
          end: 19.45,
          start: 19.231,
          word: " they'll",
        },
        {
          confidence: 0.97,
          end: 19.95,
          start: 19.465,
          word: " thrive.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 21.09,
      language: "en",
      start: 20.512,
      text: "Those who don't,",
      words: [
        {
          confidence: 0.99,
          end: 20.684,
          start: 20.512,
          word: " Those",
        },
        {
          confidence: 0.99,
          end: 20.809,
          start: 20.685,
          word: " who",
        },
        {
          confidence: 0.83,
          end: 21.09,
          start: 20.84,
          word: " don't,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.85,
      end: 22.715,
      language: "en",
      start: 21.684,
      text: "they'll be left behind.",
      words: [
        {
          confidence: 0.47,
          end: 21.856,
          start: 21.684,
          word: " they'll",
        },
        {
          confidence: 0.99,
          end: 21.965,
          start: 21.857,
          word: " be",
        },
        {
          confidence: 1,
          end: 22.215,
          start: 22.012,
          word: " left",
        },
        {
          confidence: 0.96,
          end: 22.715,
          start: 22.247,
          word: " behind.",
        },
      ],
    },
  ],
},
  images: [
  {
    duration: 1.549,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9740nggz2t7jncdt54k7br4917p1178/images/The_Skills_of_Tomorrow-1755664692676-0.png",
    start: 0,
  },
  {
    duration: 8.266,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9740nggz2t7jncdt54k7br4917p1178/images/The_Skills_of_Tomorrow-1755664692676-1.png",
    start: 2.45,
  },
  {
    duration: 5.133,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9740nggz2t7jncdt54k7br4917p1178/images/The_Skills_of_Tomorrow-1755664692677-2.png",
    start: 11.739,
  },
  {
    duration: 4.875,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9740nggz2t7jncdt54k7br4917p1178/images/The_Skills_of_Tomorrow-1755664692677-3.png",
    start: 17.84,
  },
],
  caption: {
  name: "Youtuber",
  style:
    "text-yellow-400 font-semibold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg",
},
musicTrack: musicTracks[0],
 motionConfig: {
    imageTransition: 'fade', // 'fade', 'slide', 'zoom', 'rotate'
    textAnimation: 'spring', // 'spring', 'bounce', 'slide'
    backgroundEffect: 'parallax', // 'parallax', 'kenBurns', 'drift'
    intensity: 'medium' // 'low', 'medium', 'high'
  }
}

const videoDataSchema = z.object({
  audioUrl: z.string(),
  captionJson: z.object({
    utterances: z.array(z.object({
      channel: z.number(),
      confidence: z.number(),
      end: z.number(),
      language: z.string(),
      start: z.number(),
      text: z.string(),
      words: z.array(z.object({
        confidence: z.number(),
        end: z.number(),
        start: z.number(),
        word: z.string(),
      })),
    })),
    sentences: z.array(z.object({
      channel: z.number(),
      confidence: z.number(),
      end: z.number(),
      language: z.string(),
      sentence: z.string(),
      start: z.number(),
      words: z.array(z.object({
        confidence: z.number(),
        end: z.number(),
        start: z.number(),
        word: z.string(),
      })),
    }))
  }),
  images: z.array(z.object({
    duration: z.number(),
    image: z.string(),
    start: z.number(),
  })),
  caption: z.object({
    name: z.string(),
    style: z.string(),
  }),
  musicTrack: z.object({
    name: z.string(),
    url: z.string(),
  }).optional(),
   motionConfig: motionConfig,
   status: z.string(),
  config: z.object({
    transition: z.string(),
    subtitle: z.any(),
    backgroundEffects: z.string(),
    intensity: z.string(),
  })
})

export type videoData = z.infer<typeof videoDataSchema>

const calculateMetadata = ({props} : {props: {videoData: videoData}}) => {
  const {videoData} = props
  const {utterances} = videoData.captionJson
  return {
    // Change the metadata
    durationInFrames: ((parseInt(utterances[utterances.length - 1].end.toFixed(0))+1) * 30),
    // or transform some props
  };
};

export const RemotionRoot: React.FC = () => {
  return (
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          videoData: {
            ...videoData,
          }
        }}
        calculateMetadata={calculateMetadata}
      />
  );
};
