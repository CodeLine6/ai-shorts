import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

// ✅ Create new video record
export const CreateVideoData = mutation({
    args: {
        title: v.string(),
        topic: v.optional(v.string()),
        script: v.optional(v.string()),
        videoStyle: v.string(),
        caption: v.any(),
        voice: v.optional(v.object({
            voiceId: v.string(),
            name: v.string(),
        })),
        images: v.optional(v.any()),
        audioUrl: v.optional(v.string()),
        captionJson: v.optional(v.any()),
        uid: v.id("users"),
        createdBy: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("videoData", {
            ...args,
            status: "Pending",
            renderProgress: 0,
            createdAt: new Date().toISOString(),
            trashed: false,
            config: {
                transition: "",
                subtitle: null,
                backgroundEffects: "",
                intensity: "",
            },
        });
    },
});

// ✅ Get videos currently rendering
export const getActiveRenders = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Rendering"))
            .collect();
    },
});

// ✅ Get queued videos (FIFO)
export const getQueuedVideos = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Queued"))
            .order("asc")
            .collect();
    },
});

// ✅ Add video to queue
export const queueVideo = mutation({
    args: { videoId: v.id("videoData") },
    handler: async (ctx, { videoId }) => {
        await ctx.db.patch(videoId, {
            status: "Queued",
            queuedAt: new Date().toISOString(),
        });
    },
});

// ✅ Start rendering a video
export const startRendering = mutation({
    args: {
        videoId: v.id("videoData"),
        renderId: v.optional(v.string()),
        bucketName: v.optional(v.string()),
    },
    handler: async (ctx, { videoId, renderId, bucketName }) => {
        await ctx.db.patch(videoId, {
            status: "Rendering",
            renderStartedAt: new Date().toISOString(),
            renderId,
            bucketName,
        });
    },
});

// ✅ Update video status (progress, completed, failed)
export const UpdateVideoRecordStatus = mutation({
    args: {
        recordId: v.id("videoData"),
        status: v.optional(v.string()),
        comments: v.optional(v.any()),
        renderProgress: v.optional(v.number()),
        downloadUrl: v.optional(v.string()),
    },
    handler: async (ctx, { recordId, status, comments, renderProgress, downloadUrl }) => {
        const updateData = { status };

        if (comments !== undefined) updateData.comments = comments;
        if (renderProgress !== undefined) updateData.renderProgress = renderProgress;
        if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl;

        await ctx.db.patch(recordId, updateData);
    },
});

// ✅ Get next video in queue
export const getNextQueuedVideo = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Queued"))
            .order("asc")
            .first();
    },
});

// ✅ Get position of a video in queue
export const getQueuePosition = query({
    args: { videoId: v.id("videoData") },
    handler: async (ctx, { videoId }) => {
        const video = await ctx.db.get(videoId);
        if (!video || video.status !== "Queued") return null;

        const queuedBefore = await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Queued"))
            .filter((q) => q.lt(q.field("queuedAt"), video.queuedAt))
            .collect();

        return queuedBefore.length + 1; // Position in queue (1-based)
    },
});

export const UpdateVideoRecord = mutation(
    {
        args: {
            recordId: v.id('videoData'),
            audioUrl: v.optional(v.string()),
            images: v.optional(v.array(v.object({ image: v.string(), start: v.number(), duration: v.number() }))),
            script: v.optional(v.string()), status: v.optional(v.string()),
            captionJson: v.optional(v.any()), downloadUrl: v.optional(v.string()),
            renderProgress: v.optional(v.number()),
            trashed: v.optional(v.boolean()),
            musicTrack: v.optional(v.object({ name: v.string(), url: v.string() })),
            config: v.optional(
                v.object({
                          transition: v.string(),
                          subtitle: v.any(),
                          backgroundEffects: v.string(),
                          intensity: v.string(),
                        })
            ),
            lastModified: v.optional(v.string()),
            volume: v.optional(v.object({ backgroundMusic: v.number(), voice: v.number() })),
        },
        handler: async ({ db }, args) => {
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
            if (args.trashed !== undefined) {
                updateData.trashed = args.trashed;
            }
            if (args.musicTrack !== undefined) {
                updateData.musicTrack = args.musicTrack;
            }
            if (args.config !== undefined) {
                updateData.config = args.config;
            }
            if (args.lastModified !== undefined) {
                updateData.lastModified = args.lastModified;
            }
            if (args.volume !== undefined) {
                updateData.volume = args.volume;
            }

            // Single patch operation
            const result = await db.patch(args.recordId, updateData);
            return result;
        }
    });

export const GetVideoRecord = query({
    args: { recordId: v.string() },
    handler: async ({ db }, args) => {
        try {
            const result = await db.get(args.recordId); 
            return {
                ...result,
                volume: result.volume ?? {backgroundMusic: 0.4, voice: 1},
            }
        }
        catch (error) {
            return "Video not found"
        }
    }
})

export const GetUsersVideo = query(
    {
        args: { uid: v.id('users'), paginationOpts:paginationOptsValidator },
        handler: async ({ db }, args) => {
            const result = await db.query('videoData').filter(q => q.eq(q.field('uid'), args.uid)).filter(q => q.eq(q.field('trashed'), false))
                .order('desc').paginate(args.paginationOpts);

            return result
        }
    })

export const trashVid = mutation({
    args: { recordId: v.id('videoData') },
    handler: async (ctx, args) => {
        const result = await ctx.runMutation(api.videoData.UpdateVideoRecord, {
            recordId: args.recordId,
            trashed: true
        });
        return result
    }
})

export const GetVideosPaginated = query(
    {
        args: { paginationOpts:  v.object({ cursor: v.union(v.string(), v.null()) }) },
        handler: async ({ db }, args) => {
            const result = await db.query('videoData')
                .order('desc').paginate({
                    numItems: 5,
                    cursor: args.paginationOpts.cursor
                });

            return result
        }
    });

// ✅ Get total number of videos
export const getTotalVideosCount = query({
    handler: async (ctx) => {
        const videos = await ctx.db.query("videoData").collect();
        return videos.length;
    },
});

// ✅ Get count of completed videos
export const getCompletedVideosCount = query({
    handler: async (ctx) => {
        const videos = await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Completed"))
            .collect();
        return videos.length;
    },
});

// ✅ Get count of in-progress videos
export const getInProgressVideosCount = query({
    handler: async (ctx) => {
        const videos = await ctx.db
            .query("videoData")
            .filter((q) =>
                q.and(
                    q.neq(q.field("status"), "Completed"),
                    q.neq(q.field("status"), "Failed"),
                    q.neq(q.field("trashed"), true)
                )
            )
            .collect();
        return videos.length;
    },
});

// ✅ Get count of failed videos
export const getFailedVideosCount = query({
    handler: async (ctx) => {
        const videos = await ctx.db
            .query("videoData")
            .withIndex("by_status", (q) => q.eq("status", "Failed"))
            .collect();
        return videos.length;
    },
});

// ✅ Get count of trashed videos
export const getTrashedVideosCount = query({
    handler: async (ctx) => {
        const videos = await ctx.db
            .query("videoData")
            .filter((q) => q.eq(q.field("trashed"), true))
            .collect();
        return videos.length;
    },
});
