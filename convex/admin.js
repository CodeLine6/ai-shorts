import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check if user is admin
export const isUserAdmin = query({
    args: {
        userId: v.id('users'),
    },
    handler: async ({ db }, { userId }) => {
        try {
            const user = await db.get(userId);
            return user?.isAdmin === true;
        } catch (error) {
            return false;
        }
    },
});

// Get admin statistics
export const getAdminStats = query({
    args: {},
    handler: async ({ db }) => {
        try {
            // Get total users
            const totalUsers = await db.query("users").collect();
            const userCount = totalUsers.length;
            const verifiedUsers = totalUsers.filter(user => user.isVerified).length;
            
            // Get total videos
            const totalVideos = await db.query("videoData").collect();
            const videoCount = totalVideos.length;
            
            // Get total purchases
            const totalPurchases = await db.query("purchases").collect();
            const purchaseCount = totalPurchases.length;
            const totalRevenue = totalPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
            
            // Get total referrals
            const totalReferrals = await db.query("referrals").collect();
            const referralCount = totalReferrals.length;
            
            // Get recent activity (last 7 days)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recentUsers = totalUsers.filter(user => 
                new Date(user._creationTime) > oneWeekAgo
            ).length;
            
            const recentVideos = totalVideos.filter(video => 
                new Date(video._creationTime) > oneWeekAgo
            ).length;
            
            const recentPurchases = totalPurchases.filter(purchase => 
                new Date(purchase.createdAt) > oneWeekAgo.toISOString()
            ).length;
            
            return {
                success: true,
                stats: {
                    users: {
                        total: userCount,
                        verified: verifiedUsers,
                        recent: recentUsers
                    },
                    videos: {
                        total: videoCount,
                        recent: recentVideos
                    },
                    revenue: {
                        total: totalRevenue,
                        purchases: purchaseCount,
                        recent: recentPurchases
                    },
                    referrals: {
                        total: referralCount
                    }
                }
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching admin stats",
                error: error.message
            };
        }
    },
});

// Get user growth data for chart
export const getUserGrowthData = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const users = await db.query("users").collect();
            
            // Group users by creation date
            const userData = {};
            users.forEach(user => {
                const date = new Date(user._creationTime).toISOString().split('T')[0];
                userData[date] = (userData[date] || 0) + 1;
            });
            
            // Convert to array format for chart
            const chartData = Object.entries(userData).map(([date, count]) => ({
                date,
                users: count
            }));
            
            return {
                success: true,
                data: chartData
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching user growth data",
                error: error.message
            };
        }
    },
});

// Get video style distribution
export const getVideoStyleDistribution = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const videos = await db.query("videoData").collect();
            
            // Count videos by style
            const styleData = {};
            videos.forEach(video => {
                const style = video.videoStyle || "Unknown";
                styleData[style] = (styleData[style] || 0) + 1;
            });
            
            // Convert to array format for chart
            const chartData = Object.entries(styleData).map(([style, count]) => ({
                style,
                count
            }));
            
            return {
                success: true,
                data: chartData
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching video style distribution",
                error: error.message
            };
        }
    },
});

// Get revenue over time
export const getRevenueOverTime = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const purchases = await db.query("purchases").collect();
            
            // Group purchases by date
            const revenueData = {};
            purchases.forEach(purchase => {
                const date = new Date(purchase.createdAt).toISOString().split('T')[0];
                revenueData[date] = (revenueData[date] || 0) + purchase.amount;
            });
            
            // Convert to array format for chart
            const chartData = Object.entries(revenueData).map(([date, revenue]) => ({
                date,
                revenue
            }));
            
            return {
                success: true,
                data: chartData
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching revenue data",
                error: error.message
            };
        }
    },
});

// Get top referrers
export const getTopReferrers = query({
    args: {
        limit: v.optional(v.number())
    },
    handler: async ({ db }, { limit = 10 }) => {
        try {
            // Get all users with referral data
            const users = await db.query("users").collect();
            
            // Filter users who have referred others
            const referrers = users
                .filter(user => user.totalReferrals > 0)
                .map(user => ({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    totalReferrals: user.totalReferrals,
                    referralCreditsEarned: user.referralCreditsEarned
                }))
                .sort((a, b) => b.totalReferrals - a.totalReferrals)
                .slice(0, limit);
            
            return {
                success: true,
                data: referrers
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching top referrers",
                error: error.message
            };
        }
    },
});

// Set user as admin (admin only function)
export const setUserAsAdmin = mutation({
    args: {
        userId: v.id('users'),
        isAdmin: v.boolean()
    },
    handler: async ({ db }, { userId, isAdmin }) => {
        try {
            await db.patch(userId, {
                isAdmin
            });
            
            return {
                success: true,
                message: `User admin status set to ${isAdmin}`
            };
        } catch (error) {
            return {
                success: false,
                message: "Error updating user admin status",
                error: error.message
            };
        }
    },
});
