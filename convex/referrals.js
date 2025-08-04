import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper functions that can be called from other Convex functions
export const createReferralRecord = async (db, { referrerId, refereeId, refereeEmail }) => {
    try {
        const referral = await db.insert("referrals", {
            referrerId,
            refereeId,
            refereeEmail,
            status: "signup_complete",
            signupRewardCredited: false,
            purchaseRewardCredited: false,
            createdAt: new Date().toISOString(),
            signupCompletedAt: new Date().toISOString(),
        });
        return {
            success: true,
            referralId: referral,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error creating referral relationship",
        };
    }
};

export const creditSignupRewardHelper = async (db, { referrerId, refereeId }) => {
    // Find the referral record
    const referral = await db
        .query("referrals")
        .withIndex("by_referrerId", q => q.eq("referrerId", referrerId))
        .filter(q => q.eq(q.field("refereeId"), refereeId))
        .first();

    if (!referral || referral.signupRewardCredited) {
        return { success: false, message: "Referral not found or already credited" };
    }

    try {
        // Get current referrer data
        const referrer = await db.get(referrerId);
        if (!referrer) {
            return { success: false, message: "Referrer not found" };
        }

        // Credit 5 credits for signup
        const newCredits = referrer.credits + 5;
        const newReferralCredits = referrer.referralCreditsEarned + 5;
        const newTotalReferrals = referrer.totalReferrals + 1;

        // Calculate tier bonuses (25 credits every 5 referrals)
        let tierBonus = 0;
        const newTier = Math.floor(newTotalReferrals / 5);
        const oldTier = referrer.referralTier;
        if (newTier > oldTier) {
            tierBonus = (newTier - oldTier) * 25; // 25 credits per tier
        }

        // Update referrer credits and stats
        await db.patch(referrerId, {
            credits: newCredits + tierBonus,
            referralCreditsEarned: newReferralCredits + tierBonus,
            totalReferrals: newTotalReferrals,
            referralTier: newTier,
        });

        // Mark signup reward as credited
        await db.patch(referral._id, {
            signupRewardCredited: true,
        });

        return {
            success: true,
            creditsAwarded: 5 + tierBonus,
            tierBonus: tierBonus,
            newTier: newTier,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error crediting signup reward",
        };
    }
};

// Generate a unique referral code
export const generateReferralCode = (firstName) => {
    const cleanName = firstName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${cleanName.substring(0, 4)}${randomNum}`;
};

// Credit first purchase reward to referrer
export const CreditPurchaseReward = mutation({
    args: {
        referrerId: v.id('users'),
        refereeId: v.id('users'),
    },
    handler: async ({ db }, { referrerId, refereeId }) => {
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
    },
});

// Validate referral code
export const ValidateReferralCode = query({
    args: {
        referralCode: v.string(),
    },
    handler: async ({ db }, { referralCode }) => {
        try {
            const user = await db
                .query("users")
                .withIndex("by_referralCode", q => q.eq("referralCode", referralCode))
                .first();

            if (user && user.isVerified) {
                return {
                    success: true,
                    referrerId: user._id,
                    referrerName: `${user.firstName} ${user.lastName}`,
                };
            }

            return {
                success: false,
                message: "Invalid referral code",
            };
        } catch (error) {
            return {
                success: false,
                message: "Error validating referral code",
            };
        }
    },
});

// Get referred user info (who referred this user)
export const GetReferredByInfo = query({
    args: {
        userId: v.id('users'),
    },
    handler: async ({ db }, { userId }) => {
        try {
            const user = await db.get(userId);
            if (!user || !user.referredBy) {
                return { success: false, message: "No referrer found" };
            }

            const referrer = await db.get(user.referredBy);
            if (!referrer) {
                return { success: false, message: "Referrer not found" };
            }

            return {
                success: true,
                referrerName: `${referrer.firstName} ${referrer.lastName}`,
                referrerUsername: referrer.username,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching referrer info",
            };
        }
    },
});

// Clean up referral relationships when a user is deleted
export const CleanupUserReferrals = mutation({
    args: {
        deletedUserId: v.id('users'),
    },
    handler: async ({ db }, { deletedUserId }) => {
        try {
            // Mark all referrals where this user was the referrer as inactive
            const referralsMadeByUser = await db
                .query("referrals")
                .withIndex("by_referrerId", q => q.eq("referrerId", deletedUserId))
                .collect();

            // Update referrals to mark them as having a deleted referrer
            for (const referral of referralsMadeByUser) {
                await db.patch(referral._id, {
                    status: "referrer_deleted",
                });
            }

            // Find referrals where this user was referred (referee)
            const referralsReceivedByUser = await db
                .query("referrals")
                .withIndex("by_refereeId", q => q.eq("refereeId", deletedUserId))
                .collect();

            // Mark these referrals as having a deleted referee
            for (const referral of referralsReceivedByUser) {
                await db.patch(referral._id, {
                    status: "referee_deleted",
                });
            }

            return {
                success: true,
                referralsMadeCount: referralsMadeByUser.length,
                referralsReceivedCount: referralsReceivedByUser.length,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error cleaning up referrals",
            };
        }
    },
});

// Get referral stats with better error handling for deleted users
export const GetReferralStatsSecure = query({
    args: {
        userId: v.id('users'),
    },
    handler: async ({ db }, { userId }) => {
        try {
            // Get user data
            const user = await db.get(userId);
            if (!user) {
                return { success: false, message: "User not found" };
            }

            // Get all referrals made by this user, excluding deleted ones
            const referrals = await db
                .query("referrals")
                .withIndex("by_referrerId", q => q.eq("referrerId", userId))
                .filter(q => 
                    q.neq(q.field("status"), "referrer_deleted") && 
                    q.neq(q.field("status"), "referee_deleted")
                )
                .collect();

            // Get referee details with safe handling for deleted users
            const referralDetails = await Promise.all(
                referrals.map(async (referral) => {
                    try {
                        const referee = await db.get(referral.refereeId);
                        return {
                            ...referral,
                            refereeUsername: referee?.username || "[Deleted User]",
                            refereeName: referee ? 
                                `${referee.firstName} ${referee.lastName}` : 
                                "[Deleted User]",
                            refereeActive: !!referee,
                        };
                    } catch (error) {
                        return {
                            ...referral,
                            refereeUsername: "[Error]",
                            refereeName: "[Error Loading User]",
                            refereeActive: false,
                        };
                    }
                })
            );

            return {
                success: true,
                referralCode: user.referralCode,
                totalReferrals: user.totalReferrals,
                referralCreditsEarned: user.referralCreditsEarned,
                referralTier: user.referralTier,
                pendingTierCredits: user.referralTier * 5 < user.totalReferrals ? 
                    (Math.floor(user.totalReferrals / 5) - user.referralTier) * 25 : 0,
                referrals: referralDetails.filter(r => r.refereeActive), // Only show active referrals
                deletedReferrals: referralDetails.filter(r => !r.refereeActive).length,
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching referral stats",
            };
        }
    },
});
