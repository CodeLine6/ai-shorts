import { backgroundEffects } from "@/app/(main)/shorts/[videoId]/(customizer)/config";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable(
      {
        email: v.string(),
        isVerified: v.boolean(),
        username: v.string(),
        password: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        contactNumber: v.string(),
        image: v.optional(v.string()),
        credits: v.number(),
        verifyCode: v.string(),
        verifyCodeExpiry: v.string(),
        referralCode: v.string(),
        referredBy: v.optional(v.id('users')),
        totalReferrals: v.number(),
        referralCreditsEarned: v.number(),
        referralTier: v.number(),
        hasEverPurchased: v.optional(v.boolean()),
        firstPurchaseAt: v.optional(v.string()),
        totalPurchased: v.optional(v.number()),
        isAdmin: v.optional(v.boolean()),
      }).index("by_email", ["email"])
      .index("by_username", ["username"])
      .index("by_referralCode", ["referralCode"]),

    referrals: defineTable(
      {
        referrerId: v.id('users'),
        refereeId: v.id('users'),
        refereeEmail: v.string(),
        status: v.string(),
        signupRewardCredited: v.boolean(),
        purchaseRewardCredited: v.boolean(),
        createdAt: v.string(),
        signupCompletedAt: v.optional(v.string()),
        firstPurchaseAt: v.optional(v.string()),
      }).index("by_referrerId", ["referrerId"])
      .index("by_refereeId", ["refereeId"]),

    purchases: defineTable(
      {
        userId: v.id('users'),
        amount: v.number(),
        credits: v.number(),
        paymentMethod: v.string(),
        transactionId: v.string(),
        status: v.string(),
        createdAt: v.string(),
        isFirstPurchase: v.boolean(),
      }).index("by_userId", ["userId"]).index("by_transactionId", ["transactionId"]),

    videoData: defineTable(
      {
        title: v.string(),
        topic: v.optional(v.string()),
        script: v.optional(v.string()),
        videoStyle: v.string(),
        caption: v.any(),
        voice: v.optional(v.object({ voiceId: v.string(), name: v.string() })),
        musicTrack: v.optional(v.object({ name: v.string(), url: v.string() })),
        images: v.optional(v.any()), audioUrl: v.optional(v.string()),
        captionJson: v.optional(v.any()), uid: v.id('users'),
        createdBy: v.string(), status: v.optional(v.string()),
        renderProgress: v.optional(v.number()),
        comments: v.optional(v.any()),
        downloadUrl: v.optional(v.string()),
        queuedAt: v.optional(v.string()), // When it was added to queue 
        renderStartedAt: v.optional(v.string()), // When rendering actually started 
        renderId: v.optional(v.string()), // CloudRun render ID 
        bucketName: v.optional(v.string() || null), // GCS bucket name
        trashed: v.optional(v.boolean()),
        createdAt: v.optional(v.string()),
        config: v.optional(
          v.object({
          transition: v.optional(v.string()),
          subtitle: v.optional(v.any()),
          backgroundEffects: v.optional(v.string()),
          intensity: v.optional(v.string()),
        })
        ),
        lastModified: v.optional(v.string()),
        volume: v.optional(v.object({ backgroundMusic: v.number(), voice: v.number() }))
      }).index("by_uid", ["uid"])
      .index("by_status", ["status"])
      .index("by_queuedAt", ["queuedAt"]) // For queue ordering 
      .index("by_renderStartedAt", ["renderStartedAt"]),
  })
export interface VideoData {
  _id: string;
  title: string;
  topic?: string; // Made optional
  script?: string; // Made optional
  videoStyle: string;
  caption: any;
  voice?: { // Made optional
    voiceId: string;
    name: string;
  };
  musicTrack?: { // Made optional
    name: string;
    url: string;
  };
  images?: any; // Made optional
  audioUrl?: string; // Made optional
  captionJson?: any; // Made optional
  uid: string;
  createdBy: string;
  status?: string; // Made optional
  renderProgress?: number; // Made optional
  comments?: any; // Made optional
  downloadUrl?: string; // Made optional
  queuedAt?: string; // Added and made optional
  renderStartedAt?: string; // Added and made optional
  renderId?: string; // Added and made optional
  bucketName?: string | null; // Added and made optional
  trashed?: boolean; // Added and made optional
  createdAt?: string; // Added and made optional
  config?: {
    transition: string;
    subtitle: any;
    backgroundEffects: string;
    intensity: string;
  },
  lastModified?: string; // Added and made optional
  volume?: {
    backgroundMusic: number;
    voice: number;
  }
  _creationTime: number;
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

export interface utterance {
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
