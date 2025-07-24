import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateVideoData = mutation({
    args : {
            title: v.string(),
            topic: v.string(),
            script: v.object({
                content: v.string(),
                tts_text: v.string()
            }),
            videoStyle: v.string(),
            caption: v.any(),
            voice: v.object({
                voiceId: v.string(),
                name: v.string()
            }),
            uid: v.id('users'),
            createdBy: v.string(),
            credits: v.number()
        },
    handler: async({db},args) => {
        const result = await db.insert('videoData',{
            title: args.title,
            topic:args.topic,
            script:args.script.content,
            videoStyle:args.videoStyle,
            caption:args.caption,
            voice:args.voice,
            uid:args.uid,
            createdBy:args.createdBy,
            status: 'pending',
        });

        await db.patch(args.uid, {
            credits: args.credits - 1
        });

        return result
    }
    })

export const UpdateVideoRecord = mutation({
    args: {
        recordId: v.id('videoData'),
        audioUrl : v.optional(v.string()),
        images: v.optional(v.array(v.object({
            image: v.string(),
            start: v.any(),
            duration: v.any()
        }))),
        status: v.optional(v.string()),
        captionJson: v.optional(v.any()),
        downloadUrl: v.optional(v.string())
    },
    handler: async({db},args) => {
        const result = await db.patch(args.recordId, {
            audioUrl: args.audioUrl,
            images: args.images,
            captionJson: args.captionJson,
            status: args.status,
            downloadUrl: args.downloadUrl
        });
        return result
    }
})

export const GetUsersVideo = query({
    args: {
        uid: v.id('users')
    },
    handler: async({db},args) => {
        const result = await db.query('videoData').filter(q => q.eq(q.field('uid'), args.uid)).order('desc').collect();
        return result
    }
}) 

export const GetVideoRecord = query({
    args: {
        recordId: v.id('videoData')
    },
    handler: async({db},args) => {
        const result = await db.get(args.recordId);
        return result
    }
})
