import { mutation } from "./_generated/server";

// Migration to add purchase tracking fields to existing users
export const MigratePurchaseFields = mutation({
    handler: async ({ db }) => {
        try {
            // Get all users
            const users = await db.query("users").collect();
            
            let updatedCount = 0;
            
            for (const user of users) {
                // Only update if the fields don't exist
                if (user.hasEverPurchased === undefined || user.totalPurchased === undefined) {
                    await db.patch(user._id, {
                        hasEverPurchased: false,
                        totalPurchased: 0,
                    });
                    updatedCount++;
                }
            }
            
            return {
                success: true,
                message: `Migration completed. Updated ${updatedCount} users with purchase tracking fields.`,
                totalUsers: users.length,
                updatedUsers: updatedCount,
            };
        } catch (error) {
            return {
                success: false,
                message: "Migration failed",
                error: error.message,
            };
        }
    },
});
