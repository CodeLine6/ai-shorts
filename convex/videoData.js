import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateVideoData = mutation({
    args : {
            title: v.string(),
            topic: v.optional(v.string()),
            videoStyle: v.string(),
            caption: v.any(),
            voice: v.optional(v.object({
                voiceId: v.string(),
                name: v.string()
            })),
            uid: v.id('users'),
            createdBy: v.string(),
        },
    handler: async(ctx, args) => {
        const result = await ctx.db.insert('videoData',{
            title: args.title,
            topic:args.topic,
            videoStyle:args.videoStyle,
            caption:args.caption,
            voice:args.voice,
            uid:args.uid,
            createdBy:args.createdBy,
            status: 'Queued',
        });

        // Deduct 1 credit using the atomic AdjustUserCredits mutation
        await ctx.runMutation("user:AdjustUserCredits", {
            userId: args.uid,
            amount: -1
        });

        return result
    }
    })

export const UpdateVideoRecord = mutation({
    args: {
        recordId: v.id('videoData'),
        audioUrl: v.optional(v.string()),
        images: v.optional(v.array(v.object({
            image: v.string(),
            start: v.number(),
            duration: v.number()
        }))),
        script: v.optional(v.string()),
        status: v.optional(v.string()),
        captionJson: v.optional(v.any()),
        downloadUrl: v.optional(v.string()),
        renderProgress: v.optional(v.number())
    }, // Added missing closing brace
    handler: async({db}, args) => {
        // Build update object with only provided fields
        const updateData = {};
        
        if (args.audioUrl !== undefined) {
            updateData.audioUrl = args.audioUrl;
        }
        
        if (args.images !== undefined) {
            updateData.images = args.images;
        }
        
        if (args.captionJson !== undefined) {
            updateData.captionJson = args.captionJson;
        }
        
        if (args.status !== undefined) {
            updateData.status = args.status;
        }
        
        if (args.script !== undefined) {
            updateData.script = args.script;
        }
        
        if (args.downloadUrl !== undefined) {
            updateData.downloadUrl = args.downloadUrl;
        }
        
        if (args.renderProgress !== undefined) {
            updateData.renderProgress = args.renderProgress;
        }
        
        // Single patch operation
        const result = await db.patch(args.recordId, updateData);
        return result;
    }
});

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


// Update status of video record

export const UpdateVideoRecordStatus = mutation({
    args: {
        recordId: v.id('videoData'),
        status: v.string(),
        comments: v.optional(v.any())
    },
    handler: async(ctx, args) => {
        
        const videoRecord = await ctx.db.get(args.recordId);
        if(!videoRecord._id) return

        const result = await ctx.db.patch(args.recordId, {
            status: args.status,
            comments: args.comments
        });

        // return credit to user if video generation gets failed without running into race condition
        if(args.status === "Failed" && videoRecord.status !== "Failed") {
                // Add 1 credit using the atomic AdjustUserCredits mutation
                await ctx.runMutation("user:AdjustUserCredits", {
                    userId: videoRecord.uid,
                    amount: 1
                });
        }
        return result
    }
})
// Get all videos (admin only)
export const GetAllVideos = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const videos = await db.query("videoData").collect();
            return {
                success: true,
                data: videos.map(video => ({
                    _id: video._id,
                    title: video.title,
                    topic: video.topic,
                    script: video.script,
                    videoStyle: video.videoStyle,
                    caption: video.caption,
                    voice: video.voice,
                    uid: video.uid,
                    createdBy: video.createdBy,
                    status: video.status,
                    audioUrl: video.audioUrl,
                    images: video.images,
                    captionJson: video.captionJson,
                    downloadUrl: video.downloadUrl,
                    createdAt: video._creationTime,
                }))
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching videos",
                error: error.message
            };
        }
    }
});
