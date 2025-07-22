import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977fy6vb5k6frs6vgqyhygq397m62ar/audio/PJ2-1753193690351.mp3",
  captionJson: [
  {
    channel: 0,
    confidence: 0.97,
    end: 3.824,
    language: "en",
    sentence:
      "Lily loved drawing, but she always used the same colors.",
    start: 0.1,
    words: [
      {
        confidence: 0.98,
        end: 0.34,
        start: 0.1,
        word: "Lily",
      },
      {
        confidence: 1,
        end: 0.761,
        start: 0.48,
        word: " loved",
      },
      {
        confidence: 0.86,
        end: 1.301,
        start: 0.841,
        word: " drawing,",
      },
      {
        confidence: 1,
        end: 1.642,
        start: 1.521,
        word: " but",
      },
      {
        confidence: 0.98,
        end: 1.781,
        start: 1.662,
        word: " she",
      },
      {
        confidence: 1,
        end: 2.363,
        start: 1.962,
        word: " always",
      },
      {
        confidence: 1,
        end: 2.762,
        start: 2.502,
        word: " used",
      },
      {
        confidence: 0.95,
        end: 2.883,
        start: 2.763,
        word: " the",
      },
      {
        confidence: 0.94,
        end: 3.283,
        start: 2.982,
        word: " same",
      },
      {
        confidence: 1,
        end: 3.824,
        start: 3.363,
        word: " colors.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.95,
    end: 7.566,
    language: "en",
    sentence:
      "One day, her grandma gave her a magical crayon box.",
    start: 4.305,
    words: [
      {
        confidence: 0.96,
        end: 4.445,
        start: 4.305,
        word: " One",
      },
      {
        confidence: 0.98,
        end: 4.703,
        start: 4.504,
        word: " day,",
      },
      {
        confidence: 0.93,
        end: 5.086,
        start: 4.965,
        word: " her",
      },
      {
        confidence: 0.71,
        end: 5.484,
        start: 5.145,
        word: " grandma",
      },
      {
        confidence: 1,
        end: 5.824,
        start: 5.605,
        word: " gave",
      },
      {
        confidence: 1,
        end: 5.965,
        start: 5.844,
        word: " her",
      },
      {
        confidence: 1,
        end: 6.105,
        start: 5.984,
        word: " a",
      },
      {
        confidence: 0.99,
        end: 6.648,
        start: 6.188,
        word: " magical",
      },
      {
        confidence: 0.92,
        end: 7.188,
        start: 6.727,
        word: " crayon",
      },
      {
        confidence: 1,
        end: 7.566,
        start: 7.246,
        word: " box.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.97,
    end: 10.406,
    language: "en",
    sentence: "Each crayon was a different flavor.",
    start: 8.211,
    words: [
      {
        confidence: 0.94,
        end: 8.391,
        start: 8.211,
        word: " Each",
      },
      {
        confidence: 0.93,
        end: 8.945,
        start: 8.469,
        word: " crayon",
      },
      {
        confidence: 1,
        end: 9.188,
        start: 9.07,
        word: " was",
      },
      {
        confidence: 1,
        end: 9.328,
        start: 9.211,
        word: " a",
      },
      {
        confidence: 0.95,
        end: 9.852,
        start: 9.453,
        word: " different",
      },
      {
        confidence: 1,
        end: 10.406,
        start: 9.953,
        word: " flavor.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.94,
    end: 14.391,
    language: "en",
    sentence:
      "When Lily drew a strawberry, it smelled like strawberries.",
    start: 10.969,
    words: [
      {
        confidence: 0.95,
        end: 11.109,
        start: 10.969,
        word: " When",
      },
      {
        confidence: 0.98,
        end: 11.414,
        start: 11.188,
        word: " Lily",
      },
      {
        confidence: 1,
        end: 11.672,
        start: 11.508,
        word: " drew",
      },
      {
        confidence: 0.99,
        end: 11.812,
        start: 11.688,
        word: " a",
      },
      {
        confidence: 0.79,
        end: 12.492,
        start: 11.852,
        word: " strawberry,",
      },
      {
        confidence: 1,
        end: 12.789,
        start: 12.672,
        word: " it",
      },
      {
        confidence: 1,
        end: 13.234,
        start: 12.852,
        word: " smelled",
      },
      {
        confidence: 0.99,
        end: 13.516,
        start: 13.297,
        word: " like",
      },
      {
        confidence: 0.76,
        end: 14.391,
        start: 13.594,
        word: " strawberries.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.92,
    end: 17.672,
    language: "en",
    sentence: "When she drew the ocean, it tasted salty.",
    start: 14.836,
    words: [
      {
        confidence: 1,
        end: 14.953,
        start: 14.836,
        word: " When",
      },
      {
        confidence: 0.91,
        end: 15.117,
        start: 14.992,
        word: " she",
      },
      {
        confidence: 1,
        end: 15.414,
        start: 15.219,
        word: " drew",
      },
      {
        confidence: 0.98,
        end: 15.578,
        start: 15.453,
        word: " the",
      },
      {
        confidence: 0.64,
        end: 16.031,
        start: 15.695,
        word: " ocean,",
      },
      {
        confidence: 1,
        end: 16.469,
        start: 16.359,
        word: " it",
      },
      {
        confidence: 0.99,
        end: 17.031,
        start: 16.531,
        word: " tasted",
      },
      {
        confidence: 0.87,
        end: 17.672,
        start: 17.234,
        word: " salty.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.96,
    end: 23.328,
    language: "en",
    sentence:
      "Lily drew the most amazing pictures ever, sharing the flavors with her friends.",
    start: 18.375,
    words: [
      {
        confidence: 0.97,
        end: 18.625,
        start: 18.375,
        word: " Lily",
      },
      {
        confidence: 0.9,
        end: 18.875,
        start: 18.719,
        word: " drew",
      },
      {
        confidence: 0.98,
        end: 19.016,
        start: 18.906,
        word: " the",
      },
      {
        confidence: 1,
        end: 19.484,
        start: 19.156,
        word: " most",
      },
      {
        confidence: 0.86,
        end: 19.984,
        start: 19.562,
        word: " amazing",
      },
      {
        confidence: 0.99,
        end: 20.5,
        start: 20.016,
        word: " pictures",
      },
      {
        confidence: 1,
        end: 21,
        start: 20.703,
        word: " ever,",
      },
      {
        confidence: 0.95,
        end: 21.828,
        start: 21.484,
        word: " sharing",
      },
      {
        confidence: 1,
        end: 21.969,
        start: 21.844,
        word: " the",
      },
      {
        confidence: 0.99,
        end: 22.438,
        start: 21.984,
        word: " flavors",
      },
      {
        confidence: 1,
        end: 22.625,
        start: 22.5,
        word: " with",
      },
      {
        confidence: 0.98,
        end: 22.75,
        start: 22.626,
        word: " her",
      },
      {
        confidence: 0.87,
        end: 23.328,
        start: 22.828,
        word: " friends.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.98,
    end: 27.203,
    language: "en",
    sentence:
      "She learned that being creative can be a tasty adventure.",
    start: 23.75,
    words: [
      {
        confidence: 0.99,
        end: 23.859,
        start: 23.75,
        word: " She",
      },
      {
        confidence: 0.95,
        end: 24.266,
        start: 23.969,
        word: " learned",
      },
      {
        confidence: 0.91,
        end: 24.422,
        start: 24.281,
        word: " that",
      },
      {
        confidence: 0.98,
        end: 24.781,
        start: 24.5,
        word: " being",
      },
      {
        confidence: 1,
        end: 25.422,
        start: 24.828,
        word: " creative",
      },
      {
        confidence: 1,
        end: 25.688,
        start: 25.531,
        word: " can",
      },
      {
        confidence: 1,
        end: 25.828,
        start: 25.703,
        word: " be",
      },
      {
        confidence: 1,
        end: 25.969,
        start: 25.844,
        word: " a",
      },
      {
        confidence: 0.99,
        end: 26.5,
        start: 26.047,
        word: " tasty",
      },
      {
        confidence: 1,
        end: 27.203,
        start: 26.609,
        word: " adventure.",
      },
    ],
  },
],
  images: [
  {
    duration: 4.324,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977fy6vb5k6frs6vgqyhygq397m62ar/images/PJ2-1753194118280-0.png",
    start: -0.19999999999999998,
  },
  {
    duration: 6.701000000000001,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977fy6vb5k6frs6vgqyhygq397m62ar/images/PJ2-1753194118290-1.png",
    start: 4.005,
  },
  {
    duration: 7.303000000000003,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977fy6vb5k6frs6vgqyhygq397m62ar/images/PJ2-1753194118290-2.png",
    start: 10.668999999999999,
  },
  {
    duration: 9.428,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977fy6vb5k6frs6vgqyhygq397m62ar/images/PJ2-1753194118290-3.png",
    start: 18.075,
  },
],
  caption: {
    name: "Fire",
    style: "text-red-500 text-6xl font-extrabold uppercase px-3 py-1 rounded-lg",
  }
}

const captions = videoData.captionJson

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={parseInt(captions[captions.length - 1].end.toFixed(0)) * 30}
        fps={30}
        width={720}
        height={1080}
        defaultProps={{
          videoData: videoData
        }}
      />
    </>
  );
};
