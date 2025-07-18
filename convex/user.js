import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
    args : {
        email: v.string(),
        username: v.string(),
        hashedPassword: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        contactNumber: v.string(), 
    }
    , handler: async ({db}, {email, username, hashedPassword, firstName, lastName, contactNumber}) => {

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
        const newUser = await db.insert("users", {
            email,
            isVerified: false,
            username,
            password: hashedPassword,
            firstName,
            lastName,
            contactNumber,
            credits:3,
            verifyCode,
            verifyCodeExpiry: expiryDate.toISOString(),
        });

        return {
            success: true,
            message: "User created successfully",
            verifyCode
        };

        }
        catch (err) {
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
            return { success: true, message: "User updated successfully." };
        } catch (err) {
            console.error("Error updating user:", err);
            return { success: false, message: "Failed to update user." };
        }
    }
});

export const GetUser = mutation({
    args : {
        identifier: v.string(),
    },
    handler : async ({db}, {identifier}) => {
        const user = await db.query("users").filter(q => q.eq(q.field("username"), identifier) || q.eq(q.field("email"), identifier)).first();
        return user;
    }
})

export const CheckUsernameAvailability = mutation({
    args : {
        username: v.string(),
    },
    handler : async ({db}, {username}) => {
        const existingUserByUsername = await db.query("users").filter(q => q.eq(q.field("username"), username) && q.eq(q.field("isVerified"), true)).first();
        return existingUserByUsername;
    }
})

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

export const GetUserById = query({
    args: {
        userId: v.id('users')
    },
    handler: async({db}, args) => {
        const user = await db.get(args.userId);
        return user;
    }
});
