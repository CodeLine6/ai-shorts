import React from 'react';
import { CalculateMetadataFunction, Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';
import * as z from 'zod';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975wfprk6nhyb5nj25eq3je457njggq/audio/TTS.mp3",
  captionJson: {
  sentences: [
    {
      channel: 0,
      confidence: 0.77,
      end: 4.203,
      language: "en",
      sentence:
        "In 1947, the Black Dahlia case gripped Los Angeles.",
      start: 0.02,
      words: [
        {
          confidence: 0.5,
          end: 0.14,
          start: 0.02,
          word: "In",
        },
        {
          confidence: 0.06,
          end: 1.461,
          start: 0.141,
          word: " 1947,",
        },
        {
          confidence: 1,
          end: 1.842,
          start: 1.722,
          word: " the",
        },
        {
          confidence: 0.93,
          end: 2.102,
          start: 1.861,
          word: " Black",
        },
        {
          confidence: 0.73,
          end: 2.562,
          start: 2.182,
          word: " Dahlia",
        },
        {
          confidence: 0.9,
          end: 2.943,
          start: 2.643,
          word: " case",
        },
        {
          confidence: 0.93,
          end: 3.324,
          start: 3.062,
          word: " gripped",
        },
        {
          confidence: 0.99,
          end: 3.645,
          start: 3.424,
          word: " Los",
        },
        {
          confidence: 0.9,
          end: 4.203,
          start: 3.744,
          word: " Angeles.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.95,
      end: 11.273,
      language: "en",
      sentence:
        "Elizabeth Short, a young aspiring actress, was found murdered, her body posed in a gruesome manner.",
      start: 4.727,
      words: [
        {
          confidence: 1,
          end: 5.227,
          start: 4.727,
          word: " Elizabeth",
        },
        {
          confidence: 0.99,
          end: 5.664,
          start: 5.324,
          word: " Short,",
        },
        {
          confidence: 1,
          end: 5.926,
          start: 5.805,
          word: " a",
        },
        {
          confidence: 0.93,
          end: 6.188,
          start: 5.984,
          word: " young",
        },
        {
          confidence: 0.89,
          end: 6.805,
          start: 6.246,
          word: " aspiring",
        },
        {
          confidence: 0.91,
          end: 7.406,
          start: 6.969,
          word: " actress,",
        },
        {
          confidence: 1,
          end: 7.828,
          start: 7.688,
          word: " was",
        },
        {
          confidence: 1,
          end: 8.266,
          start: 7.906,
          word: " found",
        },
        {
          confidence: 0.98,
          end: 8.828,
          start: 8.406,
          word: " murdered,",
        },
        {
          confidence: 0.93,
          end: 9.312,
          start: 9.188,
          word: " her",
        },
        {
          confidence: 1,
          end: 9.672,
          start: 9.367,
          word: " body",
        },
        {
          confidence: 1,
          end: 10.211,
          start: 9.789,
          word: " posed",
        },
        {
          confidence: 1,
          end: 10.367,
          start: 10.25,
          word: " in",
        },
        {
          confidence: 1,
          end: 10.43,
          start: 10.368,
          word: " a",
        },
        {
          confidence: 0.65,
          end: 10.914,
          start: 10.469,
          word: " gruesome",
        },
        {
          confidence: 0.99,
          end: 11.273,
          start: 10.953,
          word: " manner.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 18.5,
      language: "en",
      sentence:
        "The killer was never found, leaving behind a chilling mystery that continues to fascinate and horrify.",
      start: 11.812,
      words: [
        {
          confidence: 1,
          end: 11.93,
          start: 11.812,
          word: " The",
        },
        {
          confidence: 0.96,
          end: 12.289,
          start: 11.969,
          word: " killer",
        },
        {
          confidence: 1,
          end: 12.492,
          start: 12.352,
          word: " was",
        },
        {
          confidence: 0.96,
          end: 12.789,
          start: 12.57,
          word: " never",
        },
        {
          confidence: 0.98,
          end: 13.352,
          start: 12.914,
          word: " found,",
        },
        {
          confidence: 1,
          end: 14.031,
          start: 13.734,
          word: " leaving",
        },
        {
          confidence: 0.99,
          end: 14.531,
          start: 14.07,
          word: " behind",
        },
        {
          confidence: 1,
          end: 14.711,
          start: 14.594,
          word: " a",
        },
        {
          confidence: 0.96,
          end: 15.172,
          start: 14.797,
          word: " chilling",
        },
        {
          confidence: 0.99,
          end: 15.719,
          start: 15.258,
          word: " mystery",
        },
        {
          confidence: 1,
          end: 16.156,
          start: 16.031,
          word: " that",
        },
        {
          confidence: 0.97,
          end: 16.75,
          start: 16.203,
          word: " continues",
        },
        {
          confidence: 1,
          end: 16.891,
          start: 16.781,
          word: " to",
        },
        {
          confidence: 0.88,
          end: 17.656,
          start: 17,
          word: " fascinate",
        },
        {
          confidence: 1,
          end: 17.797,
          start: 17.672,
          word: " and",
        },
        {
          confidence: 0.85,
          end: 18.5,
          start: 17.859,
          word: " horrify.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 23,
      language: "en",
      sentence:
        "Was it a crime of passion or the work of a disturbed mind?",
      start: 19.156,
      words: [
        {
          confidence: 1,
          end: 19.297,
          start: 19.156,
          word: " Was",
        },
        {
          confidence: 0.99,
          end: 19.438,
          start: 19.312,
          word: " it",
        },
        {
          confidence: 0.99,
          end: 19.516,
          start: 19.439,
          word: " a",
        },
        {
          confidence: 0.99,
          end: 19.953,
          start: 19.562,
          word: " crime",
        },
        {
          confidence: 1,
          end: 20.078,
          start: 19.954,
          word: " of",
        },
        {
          confidence: 0.98,
          end: 20.688,
          start: 20.141,
          word: " passion",
        },
        {
          confidence: 1,
          end: 21.234,
          start: 21.125,
          word: " or",
        },
        {
          confidence: 1,
          end: 21.359,
          start: 21.235,
          word: " the",
        },
        {
          confidence: 1,
          end: 21.641,
          start: 21.406,
          word: " work",
        },
        {
          confidence: 1,
          end: 21.781,
          start: 21.656,
          word: " of",
        },
        {
          confidence: 0.99,
          end: 21.859,
          start: 21.782,
          word: " a",
        },
        {
          confidence: 0.84,
          end: 22.469,
          start: 21.875,
          word: " disturbed",
        },
        {
          confidence: 1,
          end: 23,
          start: 22.562,
          word: " mind?",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 25.109,
      language: "en",
      sentence: "The files remain open.",
      start: 23.547,
      words: [
        {
          confidence: 0.99,
          end: 23.656,
          start: 23.547,
          word: " The",
        },
        {
          confidence: 0.97,
          end: 24.156,
          start: 23.75,
          word: " files",
        },
        {
          confidence: 0.99,
          end: 24.609,
          start: 24.25,
          word: " remain",
        },
        {
          confidence: 1,
          end: 25.109,
          start: 24.781,
          word: " open.",
        },
      ],
    },
  ],
  utterances: [
    {
      channel: 0,
      confidence: 0.28,
      end: 1.461,
      language: "en",
      start: 0.02,
      text: "In 1947,",
      words: [
        {
          confidence: 0.5,
          end: 0.14,
          start: 0.02,
          word: "In",
        },
        {
          confidence: 0.06,
          end: 1.461,
          start: 0.141,
          word: " 1947,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.91,
      end: 4.203,
      language: "en",
      start: 1.722,
      text: "the Black Dahlia case gripped Los Angeles.",
      words: [
        {
          confidence: 1,
          end: 1.842,
          start: 1.722,
          word: " the",
        },
        {
          confidence: 0.93,
          end: 2.102,
          start: 1.861,
          word: " Black",
        },
        {
          confidence: 0.73,
          end: 2.562,
          start: 2.182,
          word: " Dahlia",
        },
        {
          confidence: 0.9,
          end: 2.943,
          start: 2.643,
          word: " case",
        },
        {
          confidence: 0.93,
          end: 3.324,
          start: 3.062,
          word: " gripped",
        },
        {
          confidence: 0.99,
          end: 3.645,
          start: 3.424,
          word: " Los",
        },
        {
          confidence: 0.9,
          end: 4.203,
          start: 3.744,
          word: " Angeles.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 5.664,
      language: "en",
      start: 4.727,
      text: "Elizabeth Short,",
      words: [
        {
          confidence: 1,
          end: 5.227,
          start: 4.727,
          word: " Elizabeth",
        },
        {
          confidence: 0.99,
          end: 5.664,
          start: 5.324,
          word: " Short,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.93,
      end: 7.406,
      language: "en",
      start: 5.805,
      text: "a young aspiring actress,",
      words: [
        {
          confidence: 1,
          end: 5.926,
          start: 5.805,
          word: " a",
        },
        {
          confidence: 0.93,
          end: 6.188,
          start: 5.984,
          word: " young",
        },
        {
          confidence: 0.89,
          end: 6.805,
          start: 6.246,
          word: " aspiring",
        },
        {
          confidence: 0.91,
          end: 7.406,
          start: 6.969,
          word: " actress,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 8.828,
      language: "en",
      start: 7.688,
      text: "was found murdered,",
      words: [
        {
          confidence: 1,
          end: 7.828,
          start: 7.688,
          word: " was",
        },
        {
          confidence: 1,
          end: 8.266,
          start: 7.906,
          word: " found",
        },
        {
          confidence: 0.98,
          end: 8.828,
          start: 8.406,
          word: " murdered,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 11.273,
      language: "en",
      start: 9.188,
      text: "her body posed in a gruesome manner.",
      words: [
        {
          confidence: 0.93,
          end: 9.312,
          start: 9.188,
          word: " her",
        },
        {
          confidence: 1,
          end: 9.672,
          start: 9.367,
          word: " body",
        },
        {
          confidence: 1,
          end: 10.211,
          start: 9.789,
          word: " posed",
        },
        {
          confidence: 1,
          end: 10.367,
          start: 10.25,
          word: " in",
        },
        {
          confidence: 1,
          end: 10.43,
          start: 10.368,
          word: " a",
        },
        {
          confidence: 0.65,
          end: 10.914,
          start: 10.469,
          word: " gruesome",
        },
        {
          confidence: 0.99,
          end: 11.273,
          start: 10.953,
          word: " manner.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 13.352,
      language: "en",
      start: 11.812,
      text: "The killer was never found,",
      words: [
        {
          confidence: 1,
          end: 11.93,
          start: 11.812,
          word: " The",
        },
        {
          confidence: 0.96,
          end: 12.289,
          start: 11.969,
          word: " killer",
        },
        {
          confidence: 1,
          end: 12.492,
          start: 12.352,
          word: " was",
        },
        {
          confidence: 0.96,
          end: 12.789,
          start: 12.57,
          word: " never",
        },
        {
          confidence: 0.98,
          end: 13.352,
          start: 12.914,
          word: " found,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 18.5,
      language: "en",
      start: 13.734,
      text: "leaving behind a chilling mystery that continues to fascinate and horrify.",
      words: [
        {
          confidence: 1,
          end: 14.031,
          start: 13.734,
          word: " leaving",
        },
        {
          confidence: 0.99,
          end: 14.531,
          start: 14.07,
          word: " behind",
        },
        {
          confidence: 1,
          end: 14.711,
          start: 14.594,
          word: " a",
        },
        {
          confidence: 0.96,
          end: 15.172,
          start: 14.797,
          word: " chilling",
        },
        {
          confidence: 0.99,
          end: 15.719,
          start: 15.258,
          word: " mystery",
        },
        {
          confidence: 1,
          end: 16.156,
          start: 16.031,
          word: " that",
        },
        {
          confidence: 0.97,
          end: 16.75,
          start: 16.203,
          word: " continues",
        },
        {
          confidence: 1,
          end: 16.891,
          start: 16.781,
          word: " to",
        },
        {
          confidence: 0.88,
          end: 17.656,
          start: 17,
          word: " fascinate",
        },
        {
          confidence: 1,
          end: 17.797,
          start: 17.672,
          word: " and",
        },
        {
          confidence: 0.85,
          end: 18.5,
          start: 17.859,
          word: " horrify.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 23,
      language: "en",
      start: 19.156,
      text: "Was it a crime of passion or the work of a disturbed mind?",
      words: [
        {
          confidence: 1,
          end: 19.297,
          start: 19.156,
          word: " Was",
        },
        {
          confidence: 0.99,
          end: 19.438,
          start: 19.312,
          word: " it",
        },
        {
          confidence: 0.99,
          end: 19.516,
          start: 19.439,
          word: " a",
        },
        {
          confidence: 0.99,
          end: 19.953,
          start: 19.562,
          word: " crime",
        },
        {
          confidence: 1,
          end: 20.078,
          start: 19.954,
          word: " of",
        },
        {
          confidence: 0.98,
          end: 20.688,
          start: 20.141,
          word: " passion",
        },
        {
          confidence: 1,
          end: 21.234,
          start: 21.125,
          word: " or",
        },
        {
          confidence: 1,
          end: 21.359,
          start: 21.235,
          word: " the",
        },
        {
          confidence: 1,
          end: 21.641,
          start: 21.406,
          word: " work",
        },
        {
          confidence: 1,
          end: 21.781,
          start: 21.656,
          word: " of",
        },
        {
          confidence: 0.99,
          end: 21.859,
          start: 21.782,
          word: " a",
        },
        {
          confidence: 0.84,
          end: 22.469,
          start: 21.875,
          word: " disturbed",
        },
        {
          confidence: 1,
          end: 23,
          start: 22.562,
          word: " mind?",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 25.109,
      language: "en",
      start: 23.547,
      text: "The files remain open.",
      words: [
        {
          confidence: 0.99,
          end: 23.656,
          start: 23.547,
          word: " The",
        },
        {
          confidence: 0.97,
          end: 24.156,
          start: 23.75,
          word: " files",
        },
        {
          confidence: 0.99,
          end: 24.609,
          start: 24.25,
          word: " remain",
        },
        {
          confidence: 1,
          end: 25.109,
          start: 24.781,
          word: " open.",
        },
      ],
    },
  ],
},
  images: [
  {
    duration: 4.203,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975wfprk6nhyb5nj25eq3je457njggq/images/TTS-1755102981740-0.png",
    start: 0,
  },
  {
    duration: 6.546,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975wfprk6nhyb5nj25eq3je457njggq/images/TTS-1755102981744-1.png",
    start: 4.727,
  },
  {
    duration: 6.688,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975wfprk6nhyb5nj25eq3je457njggq/images/TTS-1755102981745-2.png",
    start: 11.812,
  },
  {
    duration: 5.953,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975wfprk6nhyb5nj25eq3je457njggq/images/TTS-1755102981745-3.png",
    start: 19.156,
  },
],
  caption: {
  name: "Youtuber",
  style:
    "text-yellow-400 font-semibold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg",
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
  })
})

const calculateMetadata = ({props} : {props: {videoData: z.infer<typeof videoDataSchema>}}) => {
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
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={300}
        fps={30}
        width={720}
        height={1080}
        defaultProps={{
          videoData: videoData
        }}
        schema={z.object({ videoData: videoDataSchema })}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
