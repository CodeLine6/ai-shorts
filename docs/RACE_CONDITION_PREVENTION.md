# Preventing Race Conditions in Convex DB

This document explains the implementation of atomic credit adjustments in Convex DB to prevent race conditions, particularly concerning user credit management.

## Problem Statement

Previously, operations involving user credits (e.g., deducting credits for video creation, refunding credits on video generation failure) were susceptible to race conditions. This occurred because credit updates were performed by reading the current credit value, calculating a new value, and then writing it back. If multiple concurrent operations attempted to modify the same user's credits, the last write could overwrite previous updates, leading to incorrect credit balances.

**Example of Race Condition:**
1. User has 10 credits.
2. Operation A reads 10 credits, calculates 9 (for video creation).
3. Operation B reads 10 credits, calculates 9 (for another video creation).
4. Operation A writes 9 credits.
5. Operation B writes 9 credits (overwriting A's update).
Result: User ends up with 9 credits instead of 8.

## Solution: Atomic Credit Updates with Functional `db.patch`

To address this, Convex's transactional guarantees are leveraged by implementing atomic updates using a functional approach with `db.patch`. Convex mutations are inherently transactional and execute serially, ensuring that all operations within a single mutation succeed or fail together. By providing a function to `db.patch`, the update is based on the most recent state of the document within the transaction, eliminating race conditions.

The core idea is to adjust credits by a delta (`amount`) rather than setting an absolute `newCredits` value.

## Implemented Changes

The following files have been modified to incorporate this atomic credit adjustment mechanism:

### 1. `convex/user.js`

The `UpdateUserCredits` mutation has been refactored and renamed to `AdjustUserCredits` to reflect its new atomic behavior.

**Before:**
```javascript
export const UpdateUserCredits = mutation({
    args: {
        userId: v.id('users'),
        newCredits: v.number()
    },
    handler: async({db}, args) => {
        const result =await db.patch(args.userId, {
            credits: args.newCredits 
        });
        return result;
    }
});
```

**After:**
```javascript
export const AdjustUserCredits = mutation({
    args: {
        userId: v.id('users'),
        amount: v.number() // Positive for adding, negative for deducting
    },
    handler: async({db}, args) => {
        const result = await db.patch(args.userId, (prevUser) => ({
            credits: prevUser.credits + args.amount
        }));
        return result;
    }
});
```
This change ensures that `credits` are updated atomically by adding `args.amount` to the `prevUser.credits` value, which is guaranteed to be the latest state.

### 2. `convex/videoData.js`

The `CreateVideoData` and `UpdateVideoRecordStatus` mutations now utilize the new `users:AdjustUserCredits` mutation for credit modifications.

**`CreateVideoData` (Credit Deduction):**

**Before:**
```javascript
export const CreateVideoData = mutation({
    args : {
        // ... other args
        credits: v.number()
    },
    handler: async({db},args) => {
        const result = await db.insert('videoData',{
            // ... video data fields
        });

        await db.patch(args.uid, {
            credits: args.credits - 1
        });

        return result
    }
});
```

**After:**
```javascript
export const CreateVideoData = mutation({
    args : {
        // ... other args
    },
    handler: async({db},args) => {
        const result = await db.insert('videoData',{
            // ... video data fields
        });

        // Deduct 1 credit using the atomic AdjustUserCredits mutation
        await db.mutation("users:AdjustUserCredits", {
            userId: args.uid,
            amount: -1
        });

        return result
    }
});
```
The `credits` argument is removed from `CreateVideoData`, and the credit deduction is now handled by calling the atomic `AdjustUserCredits` mutation.

**`UpdateVideoRecordStatus` (Credit Refund):**

**Before:**
```javascript
export const UpdateVideoRecordStatus = mutation({
    args: {
        // ... other args
    },
    handler: async({db},args) => {
        const result = await db.patch(args.recordId, {
            status: args.status,
            comments: args.comments
        });
        // return credit to user if video generation gets failed without running into race condition
        if(args.status === "Failed") {
            const {uid} = await db.get(args.recordId)
            await db.patch(uid, {
                credits: await db.get(uid).credits + 1
            })
        }
        return result
    }
});
```

**After:**
```javascript
export const UpdateVideoRecordStatus = mutation({
    args: {
        // ... other args
    },
    handler: async({db},args) => {
        const result = await db.patch(args.recordId, {
            status: args.status,
            comments: args.comments
        });
        // return credit to user if video generation gets failed without running into race condition
        if(args.status === "Failed") {
            const videoRecord = await db.get(args.recordId);
            if (videoRecord) {
                // Add 1 credit using the atomic AdjustUserCredits mutation
                await db.mutation("users:AdjustUserCredits", {
                    userId: videoRecord.uid,
                    amount: 1
                });
            }
        }
        return result
    }
});
```
The credit refund logic now also uses the atomic `AdjustUserCredits` mutation to add 1 credit back to the user.

### 3. `src/app/(main)/dashboard/create-new-video/page.tsx`

The client-side call to `CreateInitialVideoRecord` has been updated to no longer pass the `credits` argument, as this is now handled server-side within the Convex mutation.

**Before:**
```javascript
const resp = await CreateInitialVideoRecord({
    // ... other args
    uid: user._id,
    createdBy: user?.email || "Unknown",
    credits: user?.credits || 0 // This line was removed
});
```

**After:**
```javascript
const resp = await CreateInitialVideoRecord({
    // ... other args
    uid: user._id,
    createdBy: user?.email || "Unknown",
});
```

## Conclusion

These changes ensure that all credit-related operations are atomic and resilient to race conditions, maintaining data integrity and consistency in the Convex DB.
