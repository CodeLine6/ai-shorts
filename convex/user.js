import { v } from "convex/values";
import { mutation,query } from "./_generated/server";
import { generateReferralCode, createReferralRecord, creditSignupRewardHelper } from "./referrals.js";

export const CreateNewUser = mutation({
    args : {
        email: v.string(),
        username: v.string(),
        hashedPassword: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        contactNumber: v.string(),
        referralCode: v.optional(v.string()),
    }
    , handler: async ({db}, {email, username, hashedPassword, firstName, lastName, contactNumber, referralCode}) => {

        const existingUserByUsername = await db.query("users").filter(q => q.eq(q.field("username"), username)).first();

        if (existingUserByUsername) {
            return {
                success: false,
                message: "Username is already taken"
            };
        }

        const existingUserByEmail = await db.query("users").filter(q => q.eq(q.field("email"), email)).first();

        if(existingUserByEmail) {
            return {
                success: false,
                message: "Email is already taken"
            };
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        try {
        // Import referral code generator        
        let referrerId = undefined;
        let initialCredits = 10; // Default credits
        
        // Check if referral code is provided and valid
        if (referralCode) {
            const referrer = await db
                .query("users")
                .withIndex("by_referralCode", q => q.eq("referralCode", referralCode))
                .first();
                
            if (referrer && referrer.isVerified) {
                referrerId = referrer._id;
                initialCredits = 20; // Double credits for referred users
            }
        }
        
        const newUser = await db.insert("users", {
            email,
            isVerified: false,
            username,
            password: hashedPassword,
            firstName,
            lastName,
            contactNumber,
            credits: initialCredits,
            verifyCode,
            verifyCodeExpiry: expiryDate.toISOString(),
            referralCode: generateReferralCode(firstName),
            referredBy: referrerId,
            totalReferrals: 0,
            referralCreditsEarned: 0,
            referralTier: 0,
            hasEverPurchased: false,
            totalPurchased: 0,
        });

        // Create referral relationship if there's a valid referrer
        if (referrerId) {
            await createReferralRecord(db, {
                referrerId,
                refereeId: newUser,
                refereeEmail: email,
            });
        }

        return {
            success: true,
            message: "User created successfully",
            verifyCode,
            bonusCredits: initialCredits > 3,
        };

        }
        catch (err) {
            console.error(err.message);
            return {
                success: false,
                message: "Error creating user"
            };
        }
    }
})

//Method to update provided user data by username
export const UpdateUser = mutation({
    args: {
        email: v.optional(v.string()),
        username: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        contactNumber: v.optional(v.string()),
        isVerified: v.optional(v.boolean()),
        verifyCode: v.optional(v.string()),
        verifyCodeExpiry: v.optional(v.string()), // Or v.number() for timestamp
        newHashedPassword: v.optional(v.string()), // Hashed password from client/API route
        credits: v.optional(v.number()),
    },
    handler: async ({ db }, args) => {
        const { username,newHashedPassword, ...rest } = args;
        const existingUser = await db.query("users").filter(q => q.eq(q.field("username"), username)).first();

        if (!existingUser) {
            return { success: false, message: "User not found." };
        }

        const updates= { ...rest };

        if (newHashedPassword) {
            updates.password = newHashedPassword;
        }

        // Add checks for unique username/email if they are being updated

        if (updates.email && updates.email !== existingUser.email) {
            const existingUserByEmail = await db.query("users").filter(q => q.eq(q.field("email"), updates.email)).first();
            if (existingUserByEmail) {
                return { success: false, message: "Email is already taken." };
            }
        }

        try {
            await db.patch(existingUser._id, updates);
            
            // If user is being verified and was referred, credit signup reward
            if (updates.isVerified === true && !existingUser.isVerified && existingUser.referredBy) {
                await creditSignupRewardHelper(db, {
                    referrerId: existingUser.referredBy,
                    refereeId: existingUser._id,
                });
            }
            
            return { success: true, message: "User updated successfully." };
        } catch (err) {
            console.log("Error updating user:", err);
            return { success: false, message: "Failed to update user." };
        }
    }
});

export const subscribeToUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return ctx.db.get(userId);
  },
});

export const GetUser = query({
  args : {
    identifier: v.string(),
  },
  handler : async ({db}, {identifier}) => {
         const normalizedIdentifier = identifier.toLowerCase().trim();

        // Try to find user by username first
        const userByUsername = await db.query("users")
            .filter(q => q.eq(q.field("username"), normalizedIdentifier))
            .first();

        if (userByUsername) {
            return userByUsername;
        }

        // If not found by username, try to find by email
        const userByEmail = await db.query("users")
            .filter(q => q.eq(q.field("email"), normalizedIdentifier))
            .first();

        return userByEmail; // This will be null if neither is found
    }
})

export const CheckUsernameAvailability = mutation({
    args : {
        username: v.string(),
    },
    handler : async ({db}, {username}) => {
        const normalizedUsername = username.toLowerCase().trim(); // Add normalization

        const existingUserByUsername = await db.query("users")
            .withIndex("by_username", q => q.eq("username", normalizedUsername)) // Use the new index
            .filter(q => q.eq(q.field("isVerified"), true)) // Apply the second filter
            .first();

        return existingUserByUsername;
    }
})

export const AdjustUserCredits = mutation({
    args: {
        userId: v.id('users'),
        amount: v.number()
    },
    handler: async(ctx, args) => {
        // Get current user
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        const newCredits = user.credits + args.amount;
        
        // Optional: Prevent negative credits
        if (newCredits < 0) {
            throw new Error("Insufficient credits");
        }
        
        // This runs in a transaction automatically in Convex
        await ctx.db.patch(args.userId, {
            credits: newCredits
        });
        
        return { newCredits };
    }
});

export const GetUserById = mutation({
    args: {
        userId: v.string()
    },
    handler: async({db}, args) => {
        const user = await db.query("users").filter(q => q.eq(q.field("_id"), args.userId)).first();
        return user;
    }
});

// Query to validate if user exists by ID - used for session validation
export const ValidateUserExists = query({
    args: {
        userId: v.id('users')
    },
    handler: async ({db}, {userId}) => {
        try {
            const user = await db.get(userId);
            return user ? {
                exists: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    isVerified: user.isVerified,
                    username: user.username,
 
                    firstName: user.firstName,
                    lastName: user.lastName, 
                    contactNumber: user.contactNumber,
                    credits: user.credits,
                    image: user.image,
                    referralCode: user.referralCode,
                    referredBy: user.referredBy,
                    totalReferrals: user.totalReferrals,
                    referralCreditsEarned: user.referralCreditsEarned,
                    referralTier: user.referralTier,
                    isAdmin: user.isAdmin
                }
            } : { exists: false, user: null };
        } catch (error) {
            // Return exists: false if user ID is invalid or user doesn't exist
            return { exists: false, user: null };
        }
    }
});

// Get all users (admin only)
export const GetAllUsers = query({
    args: {},
    handler: async ({ db }) => {
        try {
            const users = await db.query("users").collect();
            return {
                success: true,
                data: users.map(user => ({
                    _id: user._id,
                    email: user.email,
                    isVerified: user.isVerified,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    contactNumber: user.contactNumber,
                    credits: user.credits,
                    image: user.image,
                    referralCode: user.referralCode,
                    referredBy: user.referredBy,
                    totalReferrals: user.totalReferrals,
                    referralCreditsEarned: user.referralCreditsEarned,
                    referralTier: user.referralTier,
                    isAdmin: user.isAdmin,
                    hasEverPurchased: user.hasEverPurchased,
                    createdAt: user._creationTime,
                }))
            };
        } catch (error) {
            return {
                success: false,
                message: "Error fetching users",
                error: error.message
            };
        }
    }
});