import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from './../src/app/_components/RemotionComposition';
import './styles.css';

const videoData = {
  audioUrl: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977bd0m5zz3s4vdzs91v5gych7mf89b/audio/PJ-1753720252196.mp3",
  captionJson: {
    sentences: [
        {
          "words": [
            {
              "word": "In",
              "start": 0.02,
              "end": 0.14,
              "confidence": 0.5
            },
            {
              "word": " 1947,",
              "start": 0.141,
              "end": 1.441,
              "confidence": 0.06
            },
            {
              "word": " the",
              "start": 1.722,
              "end": 1.842,
              "confidence": 1
            },
            {
              "word": " Black",
              "start": 1.861,
              "end": 2.121,
              "confidence": 0.65
            },
            {
              "word": " Dahlia",
              "start": 2.182,
              "end": 2.562,
              "confidence": 0.74
            },
            {
              "word": " case",
              "start": 2.643,
              "end": 2.963,
              "confidence": 1
            },
            {
              "word": " gripped",
              "start": 3.062,
              "end": 3.324,
              "confidence": 0.93
            },
            {
              "word": " Los",
              "start": 3.424,
              "end": 3.645,
              "confidence": 0.99
            },
            {
              "word": " Angeles.",
              "start": 3.744,
              "end": 4.203,
              "confidence": 0.9
            }
          ],
          "language": "en",
          "start": 0.02,
          "end": 4.203,
          "channel": 0,
          "sentence": "In 1947, the Black Dahlia case gripped Los Angeles.",
          "confidence": 0.75
        },
        {
          "words": [
            {
              "word": " Elizabeth",
              "start": 4.727,
              "end": 5.227,
              "confidence": 1
            },
            {
              "word": " Short,",
              "start": 5.324,
              "end": 5.664,
              "confidence": 0.99
            },
            {
              "word": " a",
              "start": 5.805,
              "end": 5.926,
              "confidence": 1
            },
            {
              "word": " young",
              "start": 5.984,
              "end": 6.188,
              "confidence": 0.96
            },
            {
              "word": " aspiring",
              "start": 6.246,
              "end": 6.805,
              "confidence": 0.87
            },
            {
              "word": " actress,",
              "start": 6.969,
              "end": 7.406,
              "confidence": 0.91
            },
            {
              "word": " was",
              "start": 7.688,
              "end": 7.828,
              "confidence": 1
            },
            {
              "word": " found",
              "start": 7.906,
              "end": 8.266,
              "confidence": 1
            },
            {
              "word": " murdered,",
              "start": 8.391,
              "end": 8.828,
              "confidence": 0.93
            },
            {
              "word": " her",
              "start": 9.188,
              "end": 9.312,
              "confidence": 0.98
            },
            {
              "word": " body",
              "start": 9.391,
              "end": 9.672,
              "confidence": 1
            },
            {
              "word": " posed",
              "start": 9.789,
              "end": 10.211,
              "confidence": 0.95
            },
            {
              "word": " in",
              "start": 10.227,
              "end": 10.352,
              "confidence": 0.86
            },
            {
              "word": " a",
              "start": 10.353,
              "end": 10.43,
              "confidence": 1
            },
            {
              "word": " gruesome",
              "start": 10.469,
              "end": 10.914,
              "confidence": 0.63
            },
            {
              "word": " manner.",
              "start": 10.953,
              "end": 11.273,
              "confidence": 0.94
            }
          ],
          "language": "en",
          "start": 4.727,
          "end": 11.273,
          "channel": 0,
          "sentence": "Elizabeth Short, a young aspiring actress, was found murdered, her body posed in a gruesome manner.",
          "confidence": 0.94
        },
        {
          "words": [
            {
              "word": " The",
              "start": 11.812,
              "end": 11.93,
              "confidence": 1
            },
            {
              "word": " killer",
              "start": 11.969,
              "end": 12.289,
              "confidence": 0.96
            },
            {
              "word": " was",
              "start": 12.352,
              "end": 12.492,
              "confidence": 1
            },
            {
              "word": " never",
              "start": 12.57,
              "end": 12.789,
              "confidence": 0.97
            },
            {
              "word": " found,",
              "start": 12.914,
              "end": 13.352,
              "confidence": 1
            },
            {
              "word": " leaving",
              "start": 13.734,
              "end": 14.031,
              "confidence": 1
            },
            {
              "word": " behind",
              "start": 14.07,
              "end": 14.531,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 14.594,
              "end": 14.711,
              "confidence": 1
            },
            {
              "word": " chilling",
              "start": 14.797,
              "end": 15.172,
              "confidence": 0.98
            },
            {
              "word": " mystery",
              "start": 15.258,
              "end": 15.719,
              "confidence": 1
            },
            {
              "word": " that",
              "start": 16.031,
              "end": 16.156,
              "confidence": 1
            },
            {
              "word": " continues",
              "start": 16.203,
              "end": 16.75,
              "confidence": 0.98
            },
            {
              "word": " to",
              "start": 16.781,
              "end": 16.891,
              "confidence": 1
            },
            {
              "word": " fascinate",
              "start": 17,
              "end": 17.656,
              "confidence": 0.87
            },
            {
              "word": " and",
              "start": 17.672,
              "end": 17.797,
              "confidence": 1
            },
            {
              "word": " horrify.",
              "start": 17.859,
              "end": 18.5,
              "confidence": 0.86
            }
          ],
          "language": "en",
          "start": 11.812,
          "end": 18.5,
          "channel": 0,
          "sentence": "The killer was never found, leaving behind a chilling mystery that continues to fascinate and horrify.",
          "confidence": 0.98
        },
        {
          "words": [
            {
              "word": " Was",
              "start": 19.156,
              "end": 19.297,
              "confidence": 1
            },
            {
              "word": " it",
              "start": 19.312,
              "end": 19.438,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 19.439,
              "end": 19.516,
              "confidence": 1
            },
            {
              "word": " crime",
              "start": 19.562,
              "end": 19.953,
              "confidence": 0.91
            },
            {
              "word": " of",
              "start": 19.954,
              "end": 20.078,
              "confidence": 1
            },
            {
              "word": " passion",
              "start": 20.141,
              "end": 20.688,
              "confidence": 0.97
            },
            {
              "word": " or",
              "start": 21.125,
              "end": 21.234,
              "confidence": 1
            },
            {
              "word": " the",
              "start": 21.235,
              "end": 21.359,
              "confidence": 1
            },
            {
              "word": " work",
              "start": 21.406,
              "end": 21.641,
              "confidence": 1
            },
            {
              "word": " of",
              "start": 21.656,
              "end": 21.781,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 21.782,
              "end": 21.859,
              "confidence": 0.99
            },
            {
              "word": " disturbed",
              "start": 21.875,
              "end": 22.469,
              "confidence": 0.85
            },
            {
              "word": " mind?",
              "start": 22.562,
              "end": 23,
              "confidence": 1
            }
          ],
          "language": "en",
          "start": 19.156,
          "end": 23,
          "channel": 0,
          "sentence": "Was it a crime of passion or the work of a disturbed mind?",
          "confidence": 0.98
        },
        {
          "words": [
            {
              "word": " The",
              "start": 23.547,
              "end": 23.656,
              "confidence": 0.99
            },
            {
              "word": " files",
              "start": 23.75,
              "end": 24.156,
              "confidence": 0.98
            },
            {
              "word": " remain",
              "start": 24.25,
              "end": 24.609,
              "confidence": 0.99
            },
            {
              "word": " open.",
              "start": 24.781,
              "end": 25.109,
              "confidence": 1
            }
          ],
          "language": "en",
          "start": 23.547,
          "end": 25.109,
          "channel": 0,
          "sentence": "The files remain open.",
          "confidence": 0.99
        }
    ],
    utterances: [
        {
          "words": [
            {
              "word": "In",
              "start": 0.02,
              "end": 0.14,
              "confidence": 0.5
            },
            {
              "word": " 1947,",
              "start": 0.141,
              "end": 1.441,
              "confidence": 0.06
            }
          ],
          "text": "In 1947,",
          "language": "en",
          "start": 0.02,
          "end": 1.441,
          "channel": 0,
          "confidence": 0.28
        },
        {
          "words": [
            {
              "word": " the",
              "start": 1.722,
              "end": 1.842,
              "confidence": 1
            },
            {
              "word": " Black",
              "start": 1.861,
              "end": 2.121,
              "confidence": 0.65
            },
            {
              "word": " Dahlia",
              "start": 2.182,
              "end": 2.562,
              "confidence": 0.74
            },
            {
              "word": " case",
              "start": 2.643,
              "end": 2.963,
              "confidence": 1
            },
            {
              "word": " gripped",
              "start": 3.062,
              "end": 3.324,
              "confidence": 0.93
            },
            {
              "word": " Los",
              "start": 3.424,
              "end": 3.645,
              "confidence": 0.99
            },
            {
              "word": " Angeles.",
              "start": 3.744,
              "end": 4.203,
              "confidence": 0.9
            }
          ],
          "text": "the Black Dahlia case gripped Los Angeles.",
          "language": "en",
          "start": 1.722,
          "end": 4.203,
          "channel": 0,
          "confidence": 0.89
        },
        {
          "words": [
            {
              "word": " Elizabeth",
              "start": 4.727,
              "end": 5.227,
              "confidence": 1
            },
            {
              "word": " Short,",
              "start": 5.324,
              "end": 5.664,
              "confidence": 0.99
            }
          ],
          "text": "Elizabeth Short,",
          "language": "en",
          "start": 4.727,
          "end": 5.664,
          "channel": 0,
          "confidence": 0.99
        },
        {
          "words": [
            {
              "word": " a",
              "start": 5.805,
              "end": 5.926,
              "confidence": 1
            },
            {
              "word": " young",
              "start": 5.984,
              "end": 6.188,
              "confidence": 0.96
            },
            {
              "word": " aspiring",
              "start": 6.246,
              "end": 6.805,
              "confidence": 0.87
            },
            {
              "word": " actress,",
              "start": 6.969,
              "end": 7.406,
              "confidence": 0.91
            }
          ],
          "text": "a young aspiring actress,",
          "language": "en",
          "start": 5.805,
          "end": 7.406,
          "channel": 0,
          "confidence": 0.94
        },
        {
          "words": [
            {
              "word": " was",
              "start": 7.688,
              "end": 7.828,
              "confidence": 1
            },
            {
              "word": " found",
              "start": 7.906,
              "end": 8.266,
              "confidence": 1
            },
            {
              "word": " murdered,",
              "start": 8.391,
              "end": 8.828,
              "confidence": 0.93
            }
          ],
          "text": "was found murdered,",
          "language": "en",
          "start": 7.688,
          "end": 8.828,
          "channel": 0,
          "confidence": 0.98
        },
        {
          "words": [
            {
              "word": " her",
              "start": 9.188,
              "end": 9.312,
              "confidence": 0.98
            },
            {
              "word": " body",
              "start": 9.391,
              "end": 9.672,
              "confidence": 1
            },
            {
              "word": " posed",
              "start": 9.789,
              "end": 10.211,
              "confidence": 0.95
            },
            {
              "word": " in",
              "start": 10.227,
              "end": 10.352,
              "confidence": 0.86
            },
            {
              "word": " a",
              "start": 10.353,
              "end": 10.43,
              "confidence": 1
            },
            {
              "word": " gruesome",
              "start": 10.469,
              "end": 10.914,
              "confidence": 0.63
            },
            {
              "word": " manner.",
              "start": 10.953,
              "end": 11.273,
              "confidence": 0.94
            }
          ],
          "text": "her body posed in a gruesome manner.",
          "language": "en",
          "start": 9.188,
          "end": 11.273,
          "channel": 0,
          "confidence": 0.91
        },
        {
          "words": [
            {
              "word": " The",
              "start": 11.812,
              "end": 11.93,
              "confidence": 1
            },
            {
              "word": " killer",
              "start": 11.969,
              "end": 12.289,
              "confidence": 0.96
            },
            {
              "word": " was",
              "start": 12.352,
              "end": 12.492,
              "confidence": 1
            },
            {
              "word": " never",
              "start": 12.57,
              "end": 12.789,
              "confidence": 0.97
            },
            {
              "word": " found,",
              "start": 12.914,
              "end": 13.352,
              "confidence": 1
            }
          ],
          "text": "The killer was never found,",
          "language": "en",
          "start": 11.812,
          "end": 13.352,
          "channel": 0,
          "confidence": 0.99
        },
        {
          "words": [
            {
              "word": " leaving",
              "start": 13.734,
              "end": 14.031,
              "confidence": 1
            },
            {
              "word": " behind",
              "start": 14.07,
              "end": 14.531,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 14.594,
              "end": 14.711,
              "confidence": 1
            },
            {
              "word": " chilling",
              "start": 14.797,
              "end": 15.172,
              "confidence": 0.98
            },
            {
              "word": " mystery",
              "start": 15.258,
              "end": 15.719,
              "confidence": 1
            },
            {
              "word": " that",
              "start": 16.031,
              "end": 16.156,
              "confidence": 1
            },
            {
              "word": " continues",
              "start": 16.203,
              "end": 16.75,
              "confidence": 0.98
            },
            {
              "word": " to",
              "start": 16.781,
              "end": 16.891,
              "confidence": 1
            },
            {
              "word": " fascinate",
              "start": 17,
              "end": 17.656,
              "confidence": 0.87
            },
            {
              "word": " and",
              "start": 17.672,
              "end": 17.797,
              "confidence": 1
            },
            {
              "word": " horrify.",
              "start": 17.859,
              "end": 18.5,
              "confidence": 0.86
            }
          ],
          "text": "leaving behind a chilling mystery that continues to fascinate and horrify.",
          "language": "en",
          "start": 13.734,
          "end": 18.5,
          "channel": 0,
          "confidence": 0.97
        },
        {
          "words": [
            {
              "word": " Was",
              "start": 19.156,
              "end": 19.297,
              "confidence": 1
            },
            {
              "word": " it",
              "start": 19.312,
              "end": 19.438,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 19.439,
              "end": 19.516,
              "confidence": 1
            },
            {
              "word": " crime",
              "start": 19.562,
              "end": 19.953,
              "confidence": 0.91
            },
            {
              "word": " of",
              "start": 19.954,
              "end": 20.078,
              "confidence": 1
            },
            {
              "word": " passion",
              "start": 20.141,
              "end": 20.688,
              "confidence": 0.97
            },
            {
              "word": " or",
              "start": 21.125,
              "end": 21.234,
              "confidence": 1
            },
            {
              "word": " the",
              "start": 21.235,
              "end": 21.359,
              "confidence": 1
            },
            {
              "word": " work",
              "start": 21.406,
              "end": 21.641,
              "confidence": 1
            },
            {
              "word": " of",
              "start": 21.656,
              "end": 21.781,
              "confidence": 1
            },
            {
              "word": " a",
              "start": 21.782,
              "end": 21.859,
              "confidence": 0.99
            },
            {
              "word": " disturbed",
              "start": 21.875,
              "end": 22.469,
              "confidence": 0.85
            },
            {
              "word": " mind?",
              "start": 22.562,
              "end": 23,
              "confidence": 1
            }
          ],
          "text": "Was it a crime of passion or the work of a disturbed mind?",
          "language": "en",
          "start": 19.156,
          "end": 23,
          "channel": 0,
          "confidence": 0.98
        },
        {
          "words": [
            {
              "word": " The",
              "start": 23.547,
              "end": 23.656,
              "confidence": 0.99
            },
            {
              "word": " files",
              "start": 23.75,
              "end": 24.156,
              "confidence": 0.98
            },
            {
              "word": " remain",
              "start": 24.25,
              "end": 24.609,
              "confidence": 0.99
            },
            {
              "word": " open.",
              "start": 24.781,
              "end": 25.109,
              "confidence": 1
            }
          ],
          "text": "The files remain open.",
          "language": "en",
          "start": 23.547,
          "end": 25.109,
          "channel": 0,
          "confidence": 0.99
        }
      ]
  },
  images: [
  {
    duration: 4.324,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977bd0m5zz3s4vdzs91v5gych7mf89b/images/PJ-1753720298349-0.png",
    start: -0.19999999999999998,
  },
  {
    duration: 6.701000000000001,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977bd0m5zz3s4vdzs91v5gych7mf89b/images/PJ-1753720298350-1.png",
    start: 4.005,
  },
  {
    duration: 7.303000000000003,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977bd0m5zz3s4vdzs91v5gych7mf89b/images/PJ-1753720298350-2.png",
    start: 10.668999999999999,
  },
  {
    duration: 9.428,
    image:
      "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j977bd0m5zz3s4vdzs91v5gych7mf89b/images/PJ-1753720298351-3.png",
    start: 18.075,
  },
],
  caption: {
    name: "Fire",
    style: "text-red-500 text-6xl font-extrabold uppercase px-3 py-1 rounded-lg",
  }
}

const captions = videoData.captionJson
const utterances = captions.utterances

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={parseInt(utterances[utterances.length - 1].end.toFixed(0)) * 30}
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
