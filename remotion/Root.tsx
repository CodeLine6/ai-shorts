import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';

const videoData = {
  audioUrl: "https://50cb1v0h-3000.inc1.devtunnels.ms/j97726z3n1f4knt9nsbtf7ctsh7kvyfy/audio/PJ-1752665176577.mp3",
  captionJson: [
    {
      channel: 0,
      confidence: 0.99,
      end: 1.953,
      language: "en",
      sentence: "Lily loved drawing more than anything.",
      start: 0.212,
      words: [
        {
          confidence: 0.98,
          end: 0.412,
          start: 0.212,
          word: "Lily",
        },
        {
          confidence: 1,
          end: 0.733,
          start: 0.512,
          word: " loved",
        },
        {
          confidence: 0.97,
          end: 1.093,
          start: 0.813,
          word: " drawing",
        },
        {
          confidence: 1,
          end: 1.253,
          start: 1.133,
          word: " more",
        },
        {
          confidence: 1,
          end: 1.413,
          start: 1.274,
          word: " than",
        },
        {
          confidence: 1,
          end: 1.953,
          start: 1.514,
          word: " anything.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 4.654,
      language: "en",
      sentence: "One rainy afternoon she ran out of paper.",
      start: 2.655,
      words: [
        {
          confidence: 1,
          end: 2.776,
          start: 2.655,
          word: " One",
        },
        {
          confidence: 0.95,
          end: 3.055,
          start: 2.815,
          word: " rainy",
        },
        {
          confidence: 0.99,
          end: 3.596,
          start: 3.155,
          word: " afternoon",
        },
        {
          confidence: 0.95,
          end: 3.776,
          start: 3.655,
          word: " she",
        },
        {
          confidence: 1,
          end: 4.016,
          start: 3.836,
          word: " ran",
        },
        {
          confidence: 1,
          end: 4.178,
          start: 4.057,
          word: " out",
        },
        {
          confidence: 1,
          end: 4.276,
          start: 4.179,
          word: " of",
        },
        {
          confidence: 1,
          end: 4.654,
          start: 4.295,
          word: " paper.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 8.381,
      language: "en",
      sentence:
        "Disappointed, she looked out the window and saw raindrops trickling down.",
      start: 5.256,
      words: [
        {
          confidence: 0.96,
          end: 5.838,
          start: 5.256,
          word: " Disappointed,",
        },
        {
          confidence: 1,
          end: 5.998,
          start: 5.877,
          word: " she",
        },
        {
          confidence: 0.99,
          end: 6.237,
          start: 6.037,
          word: " looked",
        },
        {
          confidence: 0.93,
          end: 6.377,
          start: 6.256,
          word: " out",
        },
        {
          confidence: 1,
          end: 6.498,
          start: 6.378,
          word: " the",
        },
        {
          confidence: 1,
          end: 6.799,
          start: 6.518,
          word: " window",
        },
        {
          confidence: 1,
          end: 6.959,
          start: 6.838,
          word: " and",
        },
        {
          confidence: 1,
          end: 7.139,
          start: 6.998,
          word: " saw",
        },
        {
          confidence: 0.97,
          end: 7.658,
          start: 7.217,
          word: " raindrops",
        },
        {
          confidence: 1,
          end: 8.08,
          start: 7.721,
          word: " trickling",
        },
        {
          confidence: 1,
          end: 8.381,
          start: 8.123,
          word: " down.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 10.905,
      language: "en",
      sentence:
        "She decided to draw on the window with her finger.",
      start: 8.92,
      words: [
        {
          confidence: 1,
          end: 9.037,
          start: 8.92,
          word: " She",
        },
        {
          confidence: 1,
          end: 9.42,
          start: 9.084,
          word: " decided",
        },
        {
          confidence: 1,
          end: 9.545,
          start: 9.421,
          word: " to",
        },
        {
          confidence: 1,
          end: 9.764,
          start: 9.584,
          word: " draw",
        },
        {
          confidence: 0.98,
          end: 9.858,
          start: 9.765,
          word: " on",
        },
        {
          confidence: 0.89,
          end: 9.983,
          start: 9.881,
          word: " the",
        },
        {
          confidence: 0.96,
          end: 10.264,
          start: 9.998,
          word: " window",
        },
        {
          confidence: 1,
          end: 10.42,
          start: 10.303,
          word: " with",
        },
        {
          confidence: 1,
          end: 10.545,
          start: 10.421,
          word: " her",
        },
        {
          confidence: 1,
          end: 10.905,
          start: 10.584,
          word: " finger.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 15.905,
      language: "en",
      sentence:
        "Soon, a beautiful, steamy picture covered the glass, making the rainy day feel magical.",
      start: 11.623,
      words: [
        {
          confidence: 1,
          end: 11.865,
          start: 11.623,
          word: " Soon,",
        },
        {
          confidence: 1,
          end: 12.022,
          start: 11.905,
          word: " a",
        },
        {
          confidence: 0.95,
          end: 12.444,
          start: 12.045,
          word: " beautiful,",
        },
        {
          confidence: 0.88,
          end: 12.803,
          start: 12.545,
          word: " steamy",
        },
        {
          confidence: 0.99,
          end: 13.248,
          start: 12.905,
          word: " picture",
        },
        {
          confidence: 0.98,
          end: 13.569,
          start: 13.287,
          word: " covered",
        },
        {
          confidence: 0.93,
          end: 13.686,
          start: 13.57,
          word: " the",
        },
        {
          confidence: 0.99,
          end: 14.045,
          start: 13.687,
          word: " glass,",
        },
        {
          confidence: 1,
          end: 14.467,
          start: 14.209,
          word: " making",
        },
        {
          confidence: 0.99,
          end: 14.569,
          start: 14.468,
          word: " the",
        },
        {
          confidence: 0.91,
          end: 14.826,
          start: 14.608,
          word: " rainy",
        },
        {
          confidence: 0.91,
          end: 15.084,
          start: 14.928,
          word: " day",
        },
        {
          confidence: 1,
          end: 15.365,
          start: 15.186,
          word: " feel",
        },
        {
          confidence: 0.99,
          end: 15.905,
          start: 15.405,
          word: " magical.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 19.592,
      language: "en",
      sentence:
        "From that day on, Lily found art everywhere she looked.",
      start: 16.764,
      words: [
        {
          confidence: 1,
          end: 16.904,
          start: 16.764,
          word: " From",
        },
        {
          confidence: 1,
          end: 17.123,
          start: 16.967,
          word: " that",
        },
        {
          confidence: 1,
          end: 17.311,
          start: 17.17,
          word: " day",
        },
        {
          confidence: 1,
          end: 17.576,
          start: 17.404,
          word: " on,",
        },
        {
          confidence: 0.99,
          end: 17.967,
          start: 17.764,
          word: " Lily",
        },
        {
          confidence: 1,
          end: 18.248,
          start: 18.029,
          word: " found",
        },
        {
          confidence: 0.98,
          end: 18.545,
          start: 18.389,
          word: " art",
        },
        {
          confidence: 0.94,
          end: 19.092,
          start: 18.686,
          word: " everywhere",
        },
        {
          confidence: 0.97,
          end: 19.248,
          start: 19.123,
          word: " she",
        },
        {
          confidence: 1,
          end: 19.592,
          start: 19.311,
          word: " looked.",
        },
      ],
    },
  ],
  images: [
  {
    duration: 1.741,
    image:
      "https://50cb1v0h-3000.inc1.devtunnels.ms/j97726z3n1f4knt9nsbtf7ctsh7kvyfy/images/PJ-1752688399577.png",
    start: 0.212,
  },
  {
    duration: 5.726000000000001,
    image:
      "https://50cb1v0h-3000.inc1.devtunnels.ms/j97726z3n1f4knt9nsbtf7ctsh7kvyfy/images/PJ-1752688399177.png",
    start: 2.655,
  },
  {
    duration: 6.984999999999999,
    image:
      "https://50cb1v0h-3000.inc1.devtunnels.ms/j97726z3n1f4knt9nsbtf7ctsh7kvyfy/images/PJ-1752688399419.png",
    start: 8.92,
  },
  {
    duration: 2.8279999999999994,
    image:
      "https://50cb1v0h-3000.inc1.devtunnels.ms/j97726z3n1f4knt9nsbtf7ctsh7kvyfy/images/PJ-1752688399178.png",
    start: 16.764,
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
