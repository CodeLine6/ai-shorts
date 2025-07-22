import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j9792egjstkftqvzwqjraxtv517m3sed/audio/PJ-1753019012075.mp3",
  captionJson: [
  {
    channel: 0,
    confidence: 0.92,
    end: 2.922,
    language: "en",
    sentence:
      "My grandmother always warned me about the mirror in the attic.",
    start: 0.08,
    words: [
      {
        confidence: 0.99,
        end: 0.2,
        start: 0.08,
        word: "My",
      },
      {
        confidence: 0.96,
        end: 0.741,
        start: 0.24,
        word: " grandmother",
      },
      {
        confidence: 0.98,
        end: 1.102,
        start: 0.821,
        word: " always",
      },
      {
        confidence: 0.92,
        end: 1.441,
        start: 1.182,
        word: " warned",
      },
      {
        confidence: 1,
        end: 1.562,
        start: 1.442,
        word: " me",
      },
      {
        confidence: 0.98,
        end: 1.882,
        start: 1.642,
        word: " about",
      },
      {
        confidence: 1,
        end: 2.021,
        start: 1.902,
        word: " the",
      },
      {
        confidence: 0.73,
        end: 2.322,
        start: 2.043,
        word: " mirror",
      },
      {
        confidence: 0.99,
        end: 2.482,
        start: 2.363,
        word: " in",
      },
      {
        confidence: 0.93,
        end: 2.582,
        start: 2.483,
        word: " the",
      },
      {
        confidence: 0.59,
        end: 2.922,
        start: 2.662,
        word: " attic.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.92,
    end: 5.645,
    language: "en",
    sentence:
      "She said it showed things you weren't meant to see.",
    start: 3.543,
    words: [
      {
        confidence: 0.99,
        end: 3.664,
        start: 3.543,
        word: " She",
      },
      {
        confidence: 0.93,
        end: 3.924,
        start: 3.744,
        word: " said",
      },
      {
        confidence: 1,
        end: 4.043,
        start: 3.925,
        word: " it",
      },
      {
        confidence: 0.98,
        end: 4.324,
        start: 4.086,
        word: " showed",
      },
      {
        confidence: 1,
        end: 4.664,
        start: 4.383,
        word: " things",
      },
      {
        confidence: 0.95,
        end: 4.805,
        start: 4.684,
        word: " you",
      },
      {
        confidence: 0.56,
        end: 5.004,
        start: 4.824,
        word: " weren't",
      },
      {
        confidence: 0.81,
        end: 5.246,
        start: 5.066,
        word: " meant",
      },
      {
        confidence: 1,
        end: 5.367,
        start: 5.247,
        word: " to",
      },
      {
        confidence: 1,
        end: 5.645,
        start: 5.445,
        word: " see.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.96,
    end: 7.809,
    language: "en",
    sentence: "Of course, I ignored her.",
    start: 6.668,
    words: [
      {
        confidence: 1,
        end: 6.785,
        start: 6.668,
        word: " Of",
      },
      {
        confidence: 0.91,
        end: 7.105,
        start: 6.828,
        word: " course,",
      },
      {
        confidence: 0.94,
        end: 7.266,
        start: 7.148,
        word: " I",
      },
      {
        confidence: 0.96,
        end: 7.648,
        start: 7.289,
        word: " ignored",
      },
      {
        confidence: 1,
        end: 7.809,
        start: 7.688,
        word: " her.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.93,
    end: 11.172,
    language: "en",
    sentence: "One afternoon, I crept up to the attic.",
    start: 8.891,
    words: [
      {
        confidence: 1,
        end: 9.008,
        start: 8.891,
        word: " One",
      },
      {
        confidence: 1,
        end: 9.57,
        start: 9.07,
        word: " afternoon,",
      },
      {
        confidence: 1,
        end: 10.094,
        start: 9.969,
        word: " I",
      },
      {
        confidence: 0.87,
        end: 10.43,
        start: 10.109,
        word: " crept",
      },
      {
        confidence: 1,
        end: 10.57,
        start: 10.453,
        word: " up",
      },
      {
        confidence: 1,
        end: 10.734,
        start: 10.609,
        word: " to",
      },
      {
        confidence: 0.99,
        end: 10.828,
        start: 10.735,
        word: " the",
      },
      {
        confidence: 0.6,
        end: 11.172,
        start: 10.93,
        word: " attic.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.95,
    end: 15.375,
    language: "en",
    sentence:
      "The mirror was old, its surface clouded with age.",
    start: 12.195,
    words: [
      {
        confidence: 1,
        end: 12.312,
        start: 12.195,
        word: " The",
      },
      {
        confidence: 0.76,
        end: 12.672,
        start: 12.375,
        word: " mirror",
      },
      {
        confidence: 0.99,
        end: 12.852,
        start: 12.734,
        word: " was",
      },
      {
        confidence: 0.99,
        end: 13.234,
        start: 12.953,
        word: " old,",
      },
      {
        confidence: 0.89,
        end: 13.773,
        start: 13.656,
        word: " its",
      },
      {
        confidence: 0.9,
        end: 14.312,
        start: 13.875,
        word: " surface",
      },
      {
        confidence: 1,
        end: 14.812,
        start: 14.391,
        word: " clouded",
      },
      {
        confidence: 1,
        end: 15.016,
        start: 14.875,
        word: " with",
      },
      {
        confidence: 1,
        end: 15.375,
        start: 15.094,
        word: " age.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.98,
    end: 19.656,
    language: "en",
    sentence:
      "As I stared into it, my reflection began to distort.",
    start: 16.375,
    words: [
      {
        confidence: 1,
        end: 16.5,
        start: 16.375,
        word: " As",
      },
      {
        confidence: 0.98,
        end: 16.656,
        start: 16.531,
        word: " I",
      },
      {
        confidence: 1,
        end: 17.016,
        start: 16.672,
        word: " stared",
      },
      {
        confidence: 1,
        end: 17.297,
        start: 17.062,
        word: " into",
      },
      {
        confidence: 1,
        end: 17.484,
        start: 17.359,
        word: " it,",
      },
      {
        confidence: 1,
        end: 18.125,
        start: 18,
        word: " my",
      },
      {
        confidence: 0.94,
        end: 18.672,
        start: 18.156,
        word: " reflection",
      },
      {
        confidence: 0.99,
        end: 19.016,
        start: 18.734,
        word: " began",
      },
      {
        confidence: 1,
        end: 19.172,
        start: 19.062,
        word: " to",
      },
      {
        confidence: 0.87,
        end: 19.656,
        start: 19.219,
        word: " distort.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.98,
    end: 22.922,
    language: "en",
    sentence: "It smiled, but it wasn't my smile.",
    start: 20.578,
    words: [
      {
        confidence: 1,
        end: 20.703,
        start: 20.578,
        word: " It",
      },
      {
        confidence: 1,
        end: 21.234,
        start: 20.766,
        word: " smiled,",
      },
      {
        confidence: 1,
        end: 21.922,
        start: 21.797,
        word: " but",
      },
      {
        confidence: 0.99,
        end: 22.016,
        start: 21.923,
        word: " it",
      },
      {
        confidence: 0.95,
        end: 22.281,
        start: 22.017,
        word: " wasn't",
      },
      {
        confidence: 1,
        end: 22.422,
        start: 22.297,
        word: " my",
      },
      {
        confidence: 0.92,
        end: 22.922,
        start: 22.5,
        word: " smile.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.99,
    end: 27.531,
    language: "en",
    sentence:
      "Its eyes widened, and a dark figure emerged from behind it.",
    start: 23.844,
    words: [
      {
        confidence: 1,
        end: 23.969,
        start: 23.844,
        word: " Its",
      },
      {
        confidence: 1,
        end: 24.359,
        start: 24.125,
        word: " eyes",
      },
      {
        confidence: 0.95,
        end: 24.859,
        start: 24.438,
        word: " widened,",
      },
      {
        confidence: 1,
        end: 25.484,
        start: 25.359,
        word: " and",
      },
      {
        confidence: 1,
        end: 25.578,
        start: 25.485,
        word: " a",
      },
      {
        confidence: 1,
        end: 25.844,
        start: 25.625,
        word: " dark",
      },
      {
        confidence: 0.99,
        end: 26.266,
        start: 25.922,
        word: " figure",
      },
      {
        confidence: 1,
        end: 26.812,
        start: 26.344,
        word: " emerged",
      },
      {
        confidence: 1,
        end: 26.984,
        start: 26.844,
        word: " from",
      },
      {
        confidence: 0.93,
        end: 27.391,
        start: 27,
        word: " behind",
      },
      {
        confidence: 1,
        end: 27.531,
        start: 27.406,
        word: " it.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.96,
    end: 31.863,
    language: "en",
    sentence:
      "I stumbled back, terrified, and slammed the door shut.",
    start: 28.436,
    words: [
      {
        confidence: 0.99,
        end: 28.556,
        start: 28.436,
        word: " I",
      },
      {
        confidence: 0.96,
        end: 28.957,
        start: 28.576,
        word: " stumbled",
      },
      {
        confidence: 0.93,
        end: 29.237,
        start: 28.997,
        word: " back,",
      },
      {
        confidence: 0.99,
        end: 30.179,
        start: 29.538,
        word: " terrified,",
      },
      {
        confidence: 1,
        end: 30.679,
        start: 30.56,
        word: " and",
      },
      {
        confidence: 0.89,
        end: 31.101,
        start: 30.74,
        word: " slammed",
      },
      {
        confidence: 0.99,
        end: 31.22,
        start: 31.121,
        word: " the",
      },
      {
        confidence: 0.98,
        end: 31.482,
        start: 31.261,
        word: " door",
      },
      {
        confidence: 0.93,
        end: 31.863,
        start: 31.623,
        word: " shut.",
      },
    ],
  },
  {
    channel: 0,
    confidence: 0.96,
    end: 40.457,
    language: "en",
    sentence:
      "I never went near that attic again, but sometimes, late at night, I still catch a glimpse of that smile in other reflections.",
    start: 32.785,
    words: [
      {
        confidence: 1,
        end: 32.906,
        start: 32.785,
        word: " I",
      },
      {
        confidence: 1,
        end: 33.144,
        start: 32.925,
        word: " never",
      },
      {
        confidence: 1,
        end: 33.386,
        start: 33.226,
        word: " went",
      },
      {
        confidence: 1,
        end: 33.644,
        start: 33.464,
        word: " near",
      },
      {
        confidence: 1,
        end: 33.847,
        start: 33.687,
        word: " that",
      },
      {
        confidence: 0.47,
        end: 34.187,
        start: 33.964,
        word: " attic",
      },
      {
        confidence: 0.99,
        end: 34.546,
        start: 34.246,
        word: " again,",
      },
      {
        confidence: 1,
        end: 35.25,
        start: 35.129,
        word: " but",
      },
      {
        confidence: 1,
        end: 35.89,
        start: 35.328,
        word: " sometimes,",
      },
      {
        confidence: 0.76,
        end: 36.433,
        start: 36.25,
        word: " late",
      },
      {
        confidence: 0.99,
        end: 36.55,
        start: 36.434,
        word: " at",
      },
      {
        confidence: 0.98,
        end: 36.808,
        start: 36.574,
        word: " night,",
      },
      {
        confidence: 1,
        end: 37.472,
        start: 37.355,
        word: " I",
      },
      {
        confidence: 0.99,
        end: 37.714,
        start: 37.496,
        word: " still",
      },
      {
        confidence: 0.97,
        end: 37.996,
        start: 37.769,
        word: " catch",
      },
      {
        confidence: 1,
        end: 38.074,
        start: 37.997,
        word: " a",
      },
      {
        confidence: 0.93,
        end: 38.394,
        start: 38.089,
        word: " glimpse",
      },
      {
        confidence: 1,
        end: 38.511,
        start: 38.41,
        word: " of",
      },
      {
        confidence: 1,
        end: 38.691,
        start: 38.535,
        word: " that",
      },
      {
        confidence: 0.97,
        end: 39.277,
        start: 38.793,
        word: " smile",
      },
      {
        confidence: 1,
        end: 39.433,
        start: 39.316,
        word: " in",
      },
      {
        confidence: 1,
        end: 39.738,
        start: 39.535,
        word: " other",
      },
      {
        confidence: 0.99,
        end: 40.457,
        start: 39.793,
        word: " reflections.",
      },
    ],
  },
],
  images: [
  {
    duration: 6.164999999999999,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97f2kcehx19jjx0ben7ndstrx7m3j2e/images/PJ-1753021169413.png",
    start: -0.21999999999999997,
  },
  {
    duration: 5.104000000000001,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97f2kcehx19jjx0ben7ndstrx7m3j2e/images/PJ-1753021166985.png",
    start: 6.368,
  },
  {
    duration: 15.936,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97f2kcehx19jjx0ben7ndstrx7m3j2e/images/PJ-1753021170569.png",
    start: 11.895,
  },
  {
    duration: 12.620999999999999,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97f2kcehx19jjx0ben7ndstrx7m3j2e/images/PJ-1753021167855.png",
    start: 28.136,
  },
],
  caption: {
    name: "Fire",
    style: "text-red-500 text-6xl font-extrabold uppercase px-3 py-1 rounded-lg",
  }
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={parseInt((videoData.captionJson[videoData.captionJson.length - 1].end).toFixed(0)) * 30}
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
