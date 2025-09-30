// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import OpenAI from 'openai';


const a4fApiKey = process.env.A4F_API_KEY;
const a4fBaseUrl = 'https://api.a4f.co/v1';

  export const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  export const config = {
    responseMimeType: 'application/json',
  };
  export const model = 'gemini-2.0-flash';

  export const elevenLabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVEN_LABS_API_KEY,
  });

 export const a4fClient = new OpenAI({
    apiKey: a4fApiKey,
    baseURL: a4fBaseUrl
});


