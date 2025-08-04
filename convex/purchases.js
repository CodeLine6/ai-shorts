import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to credit purchase reward (avoiding dynamic imports)
const creditPurchaseRewardHelper = async (db, { referrerId, refereeId }) => {
    // Find the referral record
    const referral = await db
        .query("referrals")
        .withIndex("by_referrerId", q => q.eq("referrerId", referrerId))
        .filter(q => q.eq(q.field("refereeId"), refereeId))
        .first();

    if (!referral || referral.purchaseRewardCredited) {
        return { success: false, message: "Referral not found or already credited" };
    }

    try {
        // Get current referrer data
        const referrer = await db.get(referrerId);
        if (!referrer) {
            return { success: false, message: "Referrer not found" };
        }

        // Credit 10 credits for first purchase
        const newCredits = referrer.credits + 10;
        const newReferralCredits = referrer.referralCreditsEarned + 10;

        // Update referrer credits
        await db.patch(referrerId, {
            credits: newCredits,
            referralCreditsEarned: newReferralCredits,
        });

        // Mark purchase reward as credited and update status
        await db.patch(referral._id, {
            purchaseRewardCredited: true,
            status: "first_purchase_complete",
            firstPurchaseAt: new Date().toISOString(),
        });

        return {
            success: true,
            creditsAwarded: 10,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error crediting purchase reward",
        };
    }
};

// Helper function to process a purchase atomically
export const processPurchaseHelper = async (db, { userId, amount, credits, paymentMethod, transactionId }) => {
    try {
        // Get current user data
        const user = await db.get(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Determine if this is their first purchase
        const isFirstPurchase = !user.hasEverPurchased;
        const currentTime = new Date().toISOString();

        // Create purchase record
        const purchaseId = await db.insert("purchases", {
            userId,
            amount,
            credits,
            paymentMethod,
            transactionId,
            status: "completed",
            createdAt: currentTime,
            isFirstPurchase,
        });

        // Update user credits and purchase tracking
        const newCredits = user.credits + credits;
        const newTotalPurchased = (user.totalPurchased || 0) + amount;

        const userUpdates = {
            credits: newCredits,
            hasEverPurchased: true,
            totalPurchased: newTotalPurchased,
        };

        // Set first purchase timestamp if this is their first purchase
        if (isFirstPurchase) {
            userUpdates.firstPurchaseAt = currentTime;
        }

        await db.patch(userId, userUpdates);

        return {
            success: true,
            purchaseId,
            isFirstPurchase,
            newCredits,
            totalPurchased: newTotalPurchased,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error processing purchase",
            error: error.message,
        };
    }
};

// Process purchase and handle referral rewards atomically
export const ProcessPurchase = mutation({
    args: {
        userId: v.id('users'),
        amount: v.number(),
        credits: v.number(),
        paymentMethod: v.string(),
        transactionId: v.string(),
    },
    handler: async ({ db }, args) => {
        // Process the purchase
        const purchaseResult = await processPurchaseHelper(db, args);
        
        if (!purchaseResult.success) {
            return purchaseResult;
        }

        // If this is their first purchase and they were referred, credit the referrer
        let referralReward = null;
        if (purchaseResult.isFirstPurchase) {
            const user = await db.get(args.userId);
            if (user.referredBy) {
                try {
                    const referralResult = await creditPurchaseRewardHelper(db, {
                        referrerId: user.referredBy,
                        refereeId: args.userId,
                    });
                    referralReward = referralResult;
                } catch (error) {
                    console.warn("Failed to credit referral reward:", error);
                    // Don't fail the purchase if referral reward fails
                }
            }
        }

        return {
            ...purchaseResult,
            referralReward,
        };
    },
});

// Get user's purchase history
export const GetPurchaseHistory = query({
    args: {
        userId: v.id('users'),
    },
    handler: async ({ db }, { userId }) => {
        try {
            const purchases = await db
                .query("purchases")
                .withIndex("by_userId", q => q.eq("userId", userId))
                .order("desc")
                .collect();

            const user = await db.get(userId);
            
            return {
                success: true,
                purchases,
                totalPurchased: user?.totalPurchased || 0,
                hasEverPurchased: user?.hasEverPurchased || false,
                firstPurchaseAt: user?.firstPurchaseAt,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching purchase history",
            };
        }
    },
});
// Get all purchases (admin only)
export const GetAllPurchases = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const purchases = await db.query("purchases").collect();
            return {
                success: true,
                data: purchases.map(purchase => ({
                    _id: purchase._id,
                    userId: purchase.userId,
                    amount: purchase.amount,
                    credits: purchase.credits,
                    paymentMethod: purchase.paymentMethod,
                    transactionId: purchase.transactionId,
                    status: purchase.status,
                    createdAt: purchase.createdAt,
                    isFirstPurchase: purchase.isFirstPurchase,
                }))
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching purchases",
                error: error.message
            };
        }
    }
}); 

// Check if transaction ID already exists (prevent duplicate purchases)
export const CheckTransactionExists = query({
    args: {
        transactionId: v.string(),
    },
    handler: async ({ db }, { transactionId }) => {
        try {
            const existingPurchase = await db
                .query("purchases")
                .withIndex("by_transactionId", q => q.eq("transactionId", transactionId))
                .first();

            return {
                success: true,
                exists: !!existingPurchase,
                purchase: existingPurchase,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error checking transaction",
            };
        }
    },
});

// Get purchase statistics
export const GetPurchaseStats = query({
    args: {
        userId: v.id('users'),
    },
    handler: async ({ db }, { userId }) => {
        try {
            const purchases = await db
                .query("purchases")
                .withIndex("by_userId", q => q.eq("userId", userId))
                .filter(q => q.eq(q.field("status"), "completed"))
                .collect();

            const user = await db.get(userId);

            const stats = {
                totalPurchases: purchases.length,
                totalSpent: user?.totalPurchased || 0,
                totalCreditsFromPurchases: purchases.reduce((sum, p) => sum + p.credits, 0),
                averagePurchaseAmount: purchases.length > 0 ? (user?.totalPurchased || 0) / purchases.length : 0,
                firstPurchaseAt: user?.firstPurchaseAt,
                lastPurchaseAt: purchases.length > 0 ? purchases[0].createdAt : null,
            };

            return {
                success: true,
                stats,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching purchase stats",
            };
        }
    },
});
