import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email:v.string(),
        isVerified:v.boolean(),
        username:v.string(),
        password:v.string(),
        firstName:v.string(),
        lastName:v.string(),
        contactNumber:v.string(),
        image:v.optional(v.string()),
        credits:v.number(),
        verifyCode:v.string(),
        verifyCodeExpiry:v.string(),
    }),
    videoData : defineTable({
        title: v.string(),
        topic: v.string(),
        script: v.string(),
        videoStyle: v.string(),
        caption: v.any(),
        voice: v.object({
            voiceId: v.string(),
            name: v.string()
        }),
        images: v.optional(v.any()),
        audioUrl: v.optional(v.string()),
        captionJson: v.optional(v.any()),
        uid: v.id('users'),
        createdBy: v.string(),
        status: v.optional(v.string()),
        downloadUrl: v.optional(v.string()),
    }),
})

export interface VideoData {
    title: string;
    topic: string;
    script: string;
    videoStyle: string;
    caption: any;
    voice: {
        voiceId: string;
        name: string;
    };
    images: any;
    audioUrl: string;
    captionJson: any;
    uid: string;
    createdBy: string;
    status: string;
}

export interface captionJson {
  full_transcript: string;
  language: string[];
  utterances: utterance[];
  sentences: sentence[];
  subtitles: subtitle[];
}

interface subtitle {
  format: string;
  subtitles: string;
}

interface utterance {
  channel: number;
  confidence: number;
  end: number;
  language: string;
  start: number;
  text: string;
  words: word[];
}

export interface word {
  confidence: number;
  end: number;
  start: number;
  word: string;
}

export interface sentence {
  channel: number;
  confidence: number;
  end: number;
  language: string;
  sentence: string;
  start: number;
  words: word[];
}