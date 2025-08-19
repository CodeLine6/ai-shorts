import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';
import * as z from 'zod';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97ack72e2c1d1wq5ksjk288cs7n1kq1/audio/Demo-1754330134578.mp3",
  captionJson: {
  sentences: [
    {
      channel: 0,
      confidence: 0.94,
      end: 4.406,
      language: "en",
      sentence:
        "Once upon a time, high in the snowy mountains lived a lonely yeti named Barnaby.",
      start: 0.1,
      words: [
        {
          confidence: 0.92,
          end: 0.24,
          start: 0.1,
          word: "Once",
        },
        {
          confidence: 0.97,
          end: 0.48,
          start: 0.28,
          word: " upon",
        },
        {
          confidence: 0.99,
          end: 0.581,
          start: 0.481,
          word: " a",
        },
        {
          confidence: 0.92,
          end: 1.061,
          start: 0.621,
          word: " time,",
        },
        {
          confidence: 0.84,
          end: 1.461,
          start: 1.221,
          word: " high",
        },
        {
          confidence: 0.97,
          end: 1.562,
          start: 1.481,
          word: " in",
        },
        {
          confidence: 0.99,
          end: 1.662,
          start: 1.563,
          word: " the",
        },
        {
          confidence: 0.96,
          end: 2.021,
          start: 1.742,
          word: " snowy",
        },
        {
          confidence: 0.99,
          end: 2.523,
          start: 2.102,
          word: " mountains",
        },
        {
          confidence: 1,
          end: 2.803,
          start: 2.623,
          word: " lived",
        },
        {
          confidence: 0.98,
          end: 2.902,
          start: 2.804,
          word: " a",
        },
        {
          confidence: 0.83,
          end: 3.242,
          start: 2.963,
          word: " lonely",
        },
        {
          confidence: 0.8,
          end: 3.562,
          start: 3.324,
          word: " yeti",
        },
        {
          confidence: 1,
          end: 3.904,
          start: 3.664,
          word: " named",
        },
        {
          confidence: 0.9,
          end: 4.406,
          start: 4.004,
          word: " Barnaby.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 8.852,
      language: "en",
      sentence:
        "All he wanted was a friend, but everyone was too scared to get close.",
      start: 5.387,
      words: [
        {
          confidence: 1,
          end: 5.504,
          start: 5.387,
          word: " All",
        },
        {
          confidence: 0.99,
          end: 5.625,
          start: 5.505,
          word: " he",
        },
        {
          confidence: 0.93,
          end: 5.965,
          start: 5.707,
          word: " wanted",
        },
        {
          confidence: 1,
          end: 6.105,
          start: 5.984,
          word: " was",
        },
        {
          confidence: 1,
          end: 6.246,
          start: 6.125,
          word: " a",
        },
        {
          confidence: 0.94,
          end: 6.648,
          start: 6.285,
          word: " friend,",
        },
        {
          confidence: 1,
          end: 6.848,
          start: 6.727,
          word: " but",
        },
        {
          confidence: 1,
          end: 7.309,
          start: 6.969,
          word: " everyone",
        },
        {
          confidence: 1,
          end: 7.445,
          start: 7.328,
          word: " was",
        },
        {
          confidence: 0.91,
          end: 7.688,
          start: 7.527,
          word: " too",
        },
        {
          confidence: 0.96,
          end: 8.086,
          start: 7.766,
          word: " scared",
        },
        {
          confidence: 1,
          end: 8.188,
          start: 8.087,
          word: " to",
        },
        {
          confidence: 1,
          end: 8.352,
          start: 8.211,
          word: " get",
        },
        {
          confidence: 0.98,
          end: 8.852,
          start: 8.43,
          word: " close.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 13.695,
      language: "en",
      sentence:
        "One day, a little boy named Timmy got lost in the mountains during a blizzard.",
      start: 9.969,
      words: [
        {
          confidence: 0.91,
          end: 10.094,
          start: 9.969,
          word: " One",
        },
        {
          confidence: 1,
          end: 10.273,
          start: 10.133,
          word: " day,",
        },
        {
          confidence: 1,
          end: 10.391,
          start: 10.289,
          word: " a",
        },
        {
          confidence: 0.91,
          end: 10.594,
          start: 10.406,
          word: " little",
        },
        {
          confidence: 1,
          end: 10.852,
          start: 10.648,
          word: " boy",
        },
        {
          confidence: 1,
          end: 11.148,
          start: 10.93,
          word: " named",
        },
        {
          confidence: 0.89,
          end: 11.492,
          start: 11.188,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 11.812,
          start: 11.648,
          word: " got",
        },
        {
          confidence: 0.98,
          end: 12.195,
          start: 11.93,
          word: " lost",
        },
        {
          confidence: 1,
          end: 12.312,
          start: 12.211,
          word: " in",
        },
        {
          confidence: 1,
          end: 12.391,
          start: 12.313,
          word: " the",
        },
        {
          confidence: 0.97,
          end: 12.812,
          start: 12.414,
          word: " mountains",
        },
        {
          confidence: 0.96,
          end: 13.07,
          start: 12.875,
          word: " during",
        },
        {
          confidence: 1,
          end: 13.195,
          start: 13.094,
          word: " a",
        },
        {
          confidence: 0.75,
          end: 13.695,
          start: 13.25,
          word: " blizzard.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 16.953,
      language: "en",
      sentence: "Barnaby found Timmy shivering and alone.",
      start: 14.773,
      words: [
        {
          confidence: 0.89,
          end: 15.094,
          start: 14.773,
          word: " Barnaby",
        },
        {
          confidence: 0.99,
          end: 15.477,
          start: 15.219,
          word: " found",
        },
        {
          confidence: 0.91,
          end: 15.734,
          start: 15.516,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 16.375,
          start: 15.938,
          word: " shivering",
        },
        {
          confidence: 0.95,
          end: 16.516,
          start: 16.391,
          word: " and",
        },
        {
          confidence: 0.9,
          end: 16.953,
          start: 16.517,
          word: " alone.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 23.406,
      language: "en",
      sentence:
        "He gently carried Timmy back to his cave, shared his warm soup, and kept him safe until the storm passed.",
      start: 17.625,
      words: [
        {
          confidence: 1,
          end: 17.734,
          start: 17.625,
          word: " He",
        },
        {
          confidence: 0.95,
          end: 18.141,
          start: 17.812,
          word: " gently",
        },
        {
          confidence: 0.88,
          end: 18.5,
          start: 18.203,
          word: " carried",
        },
        {
          confidence: 0.9,
          end: 18.734,
          start: 18.516,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 19,
          start: 18.844,
          word: " back",
        },
        {
          confidence: 1,
          end: 19.125,
          start: 19.001,
          word: " to",
        },
        {
          confidence: 1,
          end: 19.266,
          start: 19.141,
          word: " his",
        },
        {
          confidence: 1,
          end: 19.656,
          start: 19.312,
          word: " cave,",
        },
        {
          confidence: 1,
          end: 20.406,
          start: 20.141,
          word: " shared",
        },
        {
          confidence: 1,
          end: 20.547,
          start: 20.422,
          word: " his",
        },
        {
          confidence: 0.96,
          end: 20.844,
          start: 20.625,
          word: " warm",
        },
        {
          confidence: 0.65,
          end: 21.266,
          start: 20.953,
          word: " soup,",
        },
        {
          confidence: 1,
          end: 21.422,
          start: 21.297,
          word: " and",
        },
        {
          confidence: 1,
          end: 21.766,
          start: 21.547,
          word: " kept",
        },
        {
          confidence: 1,
          end: 21.875,
          start: 21.767,
          word: " him",
        },
        {
          confidence: 0.88,
          end: 22.234,
          start: 22,
          word: " safe",
        },
        {
          confidence: 1,
          end: 22.484,
          start: 22.281,
          word: " until",
        },
        {
          confidence: 1,
          end: 22.625,
          start: 22.5,
          word: " the",
        },
        {
          confidence: 1,
          end: 22.938,
          start: 22.656,
          word: " storm",
        },
        {
          confidence: 0.97,
          end: 23.406,
          start: 23,
          word: " passed.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 28.422,
      language: "en",
      sentence:
        "When Timmy's parents arrived, they were amazed to see Barnaby caring for their son.",
      start: 24.469,
      words: [
        {
          confidence: 0.99,
          end: 24.578,
          start: 24.469,
          word: " When",
        },
        {
          confidence: 0.89,
          end: 24.938,
          start: 24.656,
          word: " Timmy's",
        },
        {
          confidence: 0.99,
          end: 25.328,
          start: 25,
          word: " parents",
        },
        {
          confidence: 0.97,
          end: 25.812,
          start: 25.359,
          word: " arrived,",
        },
        {
          confidence: 0.97,
          end: 25.938,
          start: 25.828,
          word: " they",
        },
        {
          confidence: 1,
          end: 26.109,
          start: 25.969,
          word: " were",
        },
        {
          confidence: 0.94,
          end: 26.594,
          start: 26.125,
          word: " amazed",
        },
        {
          confidence: 0.99,
          end: 26.703,
          start: 26.609,
          word: " to",
        },
        {
          confidence: 1,
          end: 26.859,
          start: 26.719,
          word: " see",
        },
        {
          confidence: 0.89,
          end: 27.312,
          start: 26.953,
          word: " Barnaby",
        },
        {
          confidence: 0.99,
          end: 27.812,
          start: 27.469,
          word: " caring",
        },
        {
          confidence: 0.99,
          end: 27.953,
          start: 27.828,
          word: " for",
        },
        {
          confidence: 0.98,
          end: 28.109,
          start: 27.969,
          word: " their",
        },
        {
          confidence: 1,
          end: 28.422,
          start: 28.203,
          word: " son.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 31.991,
      language: "en",
      sentence:
        "From that day on, Barnaby was no longer lonely.",
      start: 29.548,
      words: [
        {
          confidence: 0.98,
          end: 29.708,
          start: 29.548,
          word: " From",
        },
        {
          confidence: 0.98,
          end: 29.949,
          start: 29.769,
          word: " that",
        },
        {
          confidence: 1,
          end: 30.129,
          start: 29.989,
          word: " day",
        },
        {
          confidence: 1,
          end: 30.369,
          start: 30.229,
          word: " on,",
        },
        {
          confidence: 0.89,
          end: 30.811,
          start: 30.45,
          word: " Barnaby",
        },
        {
          confidence: 1,
          end: 31.03,
          start: 30.891,
          word: " was",
        },
        {
          confidence: 0.97,
          end: 31.191,
          start: 31.071,
          word: " no",
        },
        {
          confidence: 1,
          end: 31.532,
          start: 31.251,
          word: " longer",
        },
        {
          confidence: 0.85,
          end: 31.991,
          start: 31.632,
          word: " lonely.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 35.718,
      language: "en",
      sentence:
        "He was a hero, and the village embraced him as one of their own.",
      start: 32.532,
      words: [
        {
          confidence: 1,
          end: 32.654,
          start: 32.532,
          word: " He",
        },
        {
          confidence: 1,
          end: 32.814,
          start: 32.695,
          word: " was",
        },
        {
          confidence: 0.99,
          end: 32.935,
          start: 32.815,
          word: " a",
        },
        {
          confidence: 0.99,
          end: 33.255,
          start: 32.974,
          word: " hero,",
        },
        {
          confidence: 1,
          end: 33.777,
          start: 33.656,
          word: " and",
        },
        {
          confidence: 1,
          end: 33.874,
          start: 33.778,
          word: " the",
        },
        {
          confidence: 0.99,
          end: 34.156,
          start: 33.875,
          word: " village",
        },
        {
          confidence: 0.91,
          end: 34.656,
          start: 34.195,
          word: " embraced",
        },
        {
          confidence: 1,
          end: 34.777,
          start: 34.657,
          word: " him",
        },
        {
          confidence: 1,
          end: 34.937,
          start: 34.816,
          word: " as",
        },
        {
          confidence: 0.96,
          end: 35.136,
          start: 35.019,
          word: " one",
        },
        {
          confidence: 1,
          end: 35.238,
          start: 35.159,
          word: " of",
        },
        {
          confidence: 1,
          end: 35.417,
          start: 35.257,
          word: " their",
        },
        {
          confidence: 1,
          end: 35.718,
          start: 35.538,
          word: " own.",
        },
      ],
    },
  ],
  utterances: [
    {
      channel: 0,
      confidence: 0.95,
      end: 1.061,
      language: "en",
      start: 0.1,
      text: "Once upon a time,",
      words: [
        {
          confidence: 0.92,
          end: 0.24,
          start: 0.1,
          word: "Once",
        },
        {
          confidence: 0.97,
          end: 0.48,
          start: 0.28,
          word: " upon",
        },
        {
          confidence: 0.99,
          end: 0.581,
          start: 0.481,
          word: " a",
        },
        {
          confidence: 0.92,
          end: 1.061,
          start: 0.621,
          word: " time,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.93,
      end: 4.406,
      language: "en",
      start: 1.221,
      text: "high in the snowy mountains lived a lonely yeti named Barnaby.",
      words: [
        {
          confidence: 0.84,
          end: 1.461,
          start: 1.221,
          word: " high",
        },
        {
          confidence: 0.97,
          end: 1.562,
          start: 1.481,
          word: " in",
        },
        {
          confidence: 0.99,
          end: 1.662,
          start: 1.563,
          word: " the",
        },
        {
          confidence: 0.96,
          end: 2.021,
          start: 1.742,
          word: " snowy",
        },
        {
          confidence: 0.99,
          end: 2.523,
          start: 2.102,
          word: " mountains",
        },
        {
          confidence: 1,
          end: 2.803,
          start: 2.623,
          word: " lived",
        },
        {
          confidence: 0.98,
          end: 2.902,
          start: 2.804,
          word: " a",
        },
        {
          confidence: 0.83,
          end: 3.242,
          start: 2.963,
          word: " lonely",
        },
        {
          confidence: 0.8,
          end: 3.562,
          start: 3.324,
          word: " yeti",
        },
        {
          confidence: 1,
          end: 3.904,
          start: 3.664,
          word: " named",
        },
        {
          confidence: 0.9,
          end: 4.406,
          start: 4.004,
          word: " Barnaby.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 6.648,
      language: "en",
      start: 5.387,
      text: "All he wanted was a friend,",
      words: [
        {
          confidence: 1,
          end: 5.504,
          start: 5.387,
          word: " All",
        },
        {
          confidence: 0.99,
          end: 5.625,
          start: 5.505,
          word: " he",
        },
        {
          confidence: 0.93,
          end: 5.965,
          start: 5.707,
          word: " wanted",
        },
        {
          confidence: 1,
          end: 6.105,
          start: 5.984,
          word: " was",
        },
        {
          confidence: 1,
          end: 6.246,
          start: 6.125,
          word: " a",
        },
        {
          confidence: 0.94,
          end: 6.648,
          start: 6.285,
          word: " friend,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 8.852,
      language: "en",
      start: 6.727,
      text: "but everyone was too scared to get close.",
      words: [
        {
          confidence: 1,
          end: 6.848,
          start: 6.727,
          word: " but",
        },
        {
          confidence: 1,
          end: 7.309,
          start: 6.969,
          word: " everyone",
        },
        {
          confidence: 1,
          end: 7.445,
          start: 7.328,
          word: " was",
        },
        {
          confidence: 0.91,
          end: 7.688,
          start: 7.527,
          word: " too",
        },
        {
          confidence: 0.96,
          end: 8.086,
          start: 7.766,
          word: " scared",
        },
        {
          confidence: 1,
          end: 8.188,
          start: 8.087,
          word: " to",
        },
        {
          confidence: 1,
          end: 8.352,
          start: 8.211,
          word: " get",
        },
        {
          confidence: 0.98,
          end: 8.852,
          start: 8.43,
          word: " close.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 10.273,
      language: "en",
      start: 9.969,
      text: "One day,",
      words: [
        {
          confidence: 0.91,
          end: 10.094,
          start: 9.969,
          word: " One",
        },
        {
          confidence: 1,
          end: 10.273,
          start: 10.133,
          word: " day,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 13.695,
      language: "en",
      start: 10.289,
      text: "a little boy named Timmy got lost in the mountains during a blizzard.",
      words: [
        {
          confidence: 1,
          end: 10.391,
          start: 10.289,
          word: " a",
        },
        {
          confidence: 0.91,
          end: 10.594,
          start: 10.406,
          word: " little",
        },
        {
          confidence: 1,
          end: 10.852,
          start: 10.648,
          word: " boy",
        },
        {
          confidence: 1,
          end: 11.148,
          start: 10.93,
          word: " named",
        },
        {
          confidence: 0.89,
          end: 11.492,
          start: 11.188,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 11.812,
          start: 11.648,
          word: " got",
        },
        {
          confidence: 0.98,
          end: 12.195,
          start: 11.93,
          word: " lost",
        },
        {
          confidence: 1,
          end: 12.312,
          start: 12.211,
          word: " in",
        },
        {
          confidence: 1,
          end: 12.391,
          start: 12.313,
          word: " the",
        },
        {
          confidence: 0.97,
          end: 12.812,
          start: 12.414,
          word: " mountains",
        },
        {
          confidence: 0.96,
          end: 13.07,
          start: 12.875,
          word: " during",
        },
        {
          confidence: 1,
          end: 13.195,
          start: 13.094,
          word: " a",
        },
        {
          confidence: 0.75,
          end: 13.695,
          start: 13.25,
          word: " blizzard.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 16.953,
      language: "en",
      start: 14.773,
      text: "Barnaby found Timmy shivering and alone.",
      words: [
        {
          confidence: 0.89,
          end: 15.094,
          start: 14.773,
          word: " Barnaby",
        },
        {
          confidence: 0.99,
          end: 15.477,
          start: 15.219,
          word: " found",
        },
        {
          confidence: 0.91,
          end: 15.734,
          start: 15.516,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 16.375,
          start: 15.938,
          word: " shivering",
        },
        {
          confidence: 0.95,
          end: 16.516,
          start: 16.391,
          word: " and",
        },
        {
          confidence: 0.9,
          end: 16.953,
          start: 16.517,
          word: " alone.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 19.656,
      language: "en",
      start: 17.625,
      text: "He gently carried Timmy back to his cave,",
      words: [
        {
          confidence: 1,
          end: 17.734,
          start: 17.625,
          word: " He",
        },
        {
          confidence: 0.95,
          end: 18.141,
          start: 17.812,
          word: " gently",
        },
        {
          confidence: 0.88,
          end: 18.5,
          start: 18.203,
          word: " carried",
        },
        {
          confidence: 0.9,
          end: 18.734,
          start: 18.516,
          word: " Timmy",
        },
        {
          confidence: 1,
          end: 19,
          start: 18.844,
          word: " back",
        },
        {
          confidence: 1,
          end: 19.125,
          start: 19.001,
          word: " to",
        },
        {
          confidence: 1,
          end: 19.266,
          start: 19.141,
          word: " his",
        },
        {
          confidence: 1,
          end: 19.656,
          start: 19.312,
          word: " cave,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.9,
      end: 21.266,
      language: "en",
      start: 20.141,
      text: "shared his warm soup,",
      words: [
        {
          confidence: 1,
          end: 20.406,
          start: 20.141,
          word: " shared",
        },
        {
          confidence: 1,
          end: 20.547,
          start: 20.422,
          word: " his",
        },
        {
          confidence: 0.96,
          end: 20.844,
          start: 20.625,
          word: " warm",
        },
        {
          confidence: 0.65,
          end: 21.266,
          start: 20.953,
          word: " soup,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.98,
      end: 23.406,
      language: "en",
      start: 21.297,
      text: "and kept him safe until the storm passed.",
      words: [
        {
          confidence: 1,
          end: 21.422,
          start: 21.297,
          word: " and",
        },
        {
          confidence: 1,
          end: 21.766,
          start: 21.547,
          word: " kept",
        },
        {
          confidence: 1,
          end: 21.875,
          start: 21.767,
          word: " him",
        },
        {
          confidence: 0.88,
          end: 22.234,
          start: 22,
          word: " safe",
        },
        {
          confidence: 1,
          end: 22.484,
          start: 22.281,
          word: " until",
        },
        {
          confidence: 1,
          end: 22.625,
          start: 22.5,
          word: " the",
        },
        {
          confidence: 1,
          end: 22.938,
          start: 22.656,
          word: " storm",
        },
        {
          confidence: 0.97,
          end: 23.406,
          start: 23,
          word: " passed.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.96,
      end: 25.812,
      language: "en",
      start: 24.469,
      text: "When Timmy's parents arrived,",
      words: [
        {
          confidence: 0.99,
          end: 24.578,
          start: 24.469,
          word: " When",
        },
        {
          confidence: 0.89,
          end: 24.938,
          start: 24.656,
          word: " Timmy's",
        },
        {
          confidence: 0.99,
          end: 25.328,
          start: 25,
          word: " parents",
        },
        {
          confidence: 0.97,
          end: 25.812,
          start: 25.359,
          word: " arrived,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.97,
      end: 28.422,
      language: "en",
      start: 25.828,
      text: "they were amazed to see Barnaby caring for their son.",
      words: [
        {
          confidence: 0.97,
          end: 25.938,
          start: 25.828,
          word: " they",
        },
        {
          confidence: 1,
          end: 26.109,
          start: 25.969,
          word: " were",
        },
        {
          confidence: 0.94,
          end: 26.594,
          start: 26.125,
          word: " amazed",
        },
        {
          confidence: 0.99,
          end: 26.703,
          start: 26.609,
          word: " to",
        },
        {
          confidence: 1,
          end: 26.859,
          start: 26.719,
          word: " see",
        },
        {
          confidence: 0.89,
          end: 27.312,
          start: 26.953,
          word: " Barnaby",
        },
        {
          confidence: 0.99,
          end: 27.812,
          start: 27.469,
          word: " caring",
        },
        {
          confidence: 0.99,
          end: 27.953,
          start: 27.828,
          word: " for",
        },
        {
          confidence: 0.98,
          end: 28.109,
          start: 27.969,
          word: " their",
        },
        {
          confidence: 1,
          end: 28.422,
          start: 28.203,
          word: " son.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 30.369,
      language: "en",
      start: 29.548,
      text: "From that day on,",
      words: [
        {
          confidence: 0.98,
          end: 29.708,
          start: 29.548,
          word: " From",
        },
        {
          confidence: 0.98,
          end: 29.949,
          start: 29.769,
          word: " that",
        },
        {
          confidence: 1,
          end: 30.129,
          start: 29.989,
          word: " day",
        },
        {
          confidence: 1,
          end: 30.369,
          start: 30.229,
          word: " on,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.94,
      end: 31.991,
      language: "en",
      start: 30.45,
      text: "Barnaby was no longer lonely.",
      words: [
        {
          confidence: 0.89,
          end: 30.811,
          start: 30.45,
          word: " Barnaby",
        },
        {
          confidence: 1,
          end: 31.03,
          start: 30.891,
          word: " was",
        },
        {
          confidence: 0.97,
          end: 31.191,
          start: 31.071,
          word: " no",
        },
        {
          confidence: 1,
          end: 31.532,
          start: 31.251,
          word: " longer",
        },
        {
          confidence: 0.85,
          end: 31.991,
          start: 31.632,
          word: " lonely.",
        },
      ],
    },
    {
      channel: 0,
      confidence: 1,
      end: 33.255,
      language: "en",
      start: 32.532,
      text: "He was a hero,",
      words: [
        {
          confidence: 1,
          end: 32.654,
          start: 32.532,
          word: " He",
        },
        {
          confidence: 1,
          end: 32.814,
          start: 32.695,
          word: " was",
        },
        {
          confidence: 0.99,
          end: 32.935,
          start: 32.815,
          word: " a",
        },
        {
          confidence: 0.99,
          end: 33.255,
          start: 32.974,
          word: " hero,",
        },
      ],
    },
    {
      channel: 0,
      confidence: 0.99,
      end: 35.718,
      language: "en",
      start: 33.656,
      text: "and the village embraced him as one of their own.",
      words: [
        {
          confidence: 1,
          end: 33.777,
          start: 33.656,
          word: " and",
        },
        {
          confidence: 1,
          end: 33.874,
          start: 33.778,
          word: " the",
        },
        {
          confidence: 0.99,
          end: 34.156,
          start: 33.875,
          word: " village",
        },
        {
          confidence: 0.91,
          end: 34.656,
          start: 34.195,
          word: " embraced",
        },
        {
          confidence: 1,
          end: 34.777,
          start: 34.657,
          word: " him",
        },
        {
          confidence: 1,
          end: 34.937,
          start: 34.816,
          word: " as",
        },
        {
          confidence: 0.96,
          end: 35.136,
          start: 35.019,
          word: " one",
        },
        {
          confidence: 1,
          end: 35.238,
          start: 35.159,
          word: " of",
        },
        {
          confidence: 1,
          end: 35.417,
          start: 35.257,
          word: " their",
        },
        {
          confidence: 1,
          end: 35.718,
          start: 35.538,
          word: " own.",
        },
      ],
    },
  ],
},
  images: [
  {
    duration: 9.852,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97ack72e2c1d1wq5ksjk288cs7n1kq1/images/Demo-1754330174625-0.png",
    start: 0,
  },
  {
    duration: 7.984,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97ack72e2c1d1wq5ksjk288cs7n1kq1/images/Demo-1754330174625-1.png",
    start: 9.969,
  },
  {
    duration: 6.781,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97ack72e2c1d1wq5ksjk288cs7n1kq1/images/Demo-1754330174625-2.png",
    start: 17.625,
  },
  {
    duration: 12.249,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j97ack72e2c1d1wq5ksjk288cs7n1kq1/images/Demo-1754330174626-3.png",
    start: 24.469,
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
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          videoData: videoData
        }}
        schema={z.object({ videoData: videoDataSchema })}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
