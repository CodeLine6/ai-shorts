import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import type {AuthOptions} from "next-auth"
import { sendVerificationEmail } from '@/helpers/sendEmailVerifications'
import { api } from "@/../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

declare module "next-auth" {
    interface User {
        id: string;
        isVerified: boolean;
        username: string;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
        image?: string;
        credits: number;
        referralCode: string;
        referredBy?: string;
        totalReferrals: number;
        referralCreditsEarned: number;
        referralTier: number;
        isAdmin?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        isVerified: boolean;
        username: string;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
        image?: string;
        credits: number;
        referralCode: string;
        referredBy?: string;
        totalReferrals: number;
        referralCreditsEarned: number;
        referralTier: number;
        isAdmin?: boolean;
    }
}

declare module "next-auth" {
    interface Session {
        user: User
    }
}

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null
                 try {
                    const user = await convex.query(api.user.GetUser, {
                            identifier: credentials.identifier,
                    });
                    if(!user) throw new Error("User not found") 
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(!isPasswordCorrect) throw new Error("Incorrect password")
                    if(!user.isVerified) {
                        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                        const expiryDate = new Date();
                        expiryDate.setHours(expiryDate.getHours() + 1);
                        await convex.mutation(api.user.UpdateUser, {
                            username: user.username,
                            verifyCode,
                            verifyCodeExpiry: expiryDate.toISOString()
                        });
                        await sendVerificationEmail(user.email, verifyCode)
                        throw new Error(`/verify/${user.username}`)
                    }
                    return {
                        id: user._id,
                        email: user.email,
                        image: user.image,
                        isVerified: user.isVerified,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName, 
                        contactNumber: user.contactNumber,
                        credits: user.credits,
                        referralCode: user.referralCode || '',
                        referredBy: user.referredBy,
                        totalReferrals: user.totalReferrals || 0,
                        referralCreditsEarned: user.referralCreditsEarned || 0,
                        referralTier: user.referralTier || 0,
                        isAdmin: user.isAdmin
                    }
                }
                catch (error) {
                    //@ts-ignore
                    throw new Error(error)
                } 
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session}) {
            if(user) {
                token._id  = user.id.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.email = user.email
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.image = user.image
                token.contactNumber = user.contactNumber
                token.credits = user.credits
                token.referralCode = user.referralCode
                token.referredBy = user.referredBy
                token.totalReferrals = user.totalReferrals
                token.referralCreditsEarned = user.referralCreditsEarned
                token.referralTier = user.referralTier,
                token.isAdmin = user.isAdmin
            }
            if(trigger === "update" && session) {
                return {...token,...session.user}
            }
            return token
        },
        async session({ session, token }) {
            if(token && session) {
                try {
                    // Validate that user still exists in database
                    const userValidation = await convex.query(api.user.ValidateUserExists, {
                        userId: token._id as any
                    });
                    if (!userValidation.exists || !userValidation.user) {
                        // User no longer exists - clear session data but don't return null
                        console.log(`Session invalidated for deleted user: ${token._id}`);
                        // Instead of returning null, we redirect by throwing an error
                        throw new Error("USER_NOT_FOUND");
                    }
                    // User exists - update session with fresh data from database
                    const freshUser = userValidation.user;
                    session.user._id = freshUser._id
                    session.user.isVerified = freshUser.isVerified
                    session.user.username = freshUser.username
                    session.user.email = freshUser.email
                    session.user.firstName = freshUser.firstName
                    session.user.lastName = freshUser.lastName
                    session.user.image = freshUser.image
                    session.user.contactNumber = freshUser.contactNumber
                    session.user.credits = freshUser.credits
                    session.user.referralCode = freshUser.referralCode
                    session.user.referredBy = freshUser.referredBy
                    session.user.totalReferrals = freshUser.totalReferrals
                    session.user.referralCreditsEarned = freshUser.referralCreditsEarned
                    session.user.referralTier = freshUser.referralTier,
                    session.user.isAdmin = freshUser.isAdmin
                } catch (error) {
                    // If database query fails or user doesn't exist, fall back to invalid session
                    if ((error as Error).message === "USER_NOT_FOUND") {
                        console.log(`User ${token._id} no longer exists, invalidating session`);
                        // Return session with invalid user data to trigger re-authentication
                        session.user = {
                            _id: "",
                            isVerified: false,
                            username: "",
                            firstName: "",
                            lastName: "",
                            contactNumber: "",
                            email: "",
                            credits: 0,
                            referralCode: "",
                            referredBy: undefined,
                            totalReferrals: 0,
                            referralCreditsEarned: 0,
                            referralTier: 0,
                            isAdmin: false
                        };
                    } else {
                        // Database error - fall back to token data to prevent lockout
                        console.warn(`User validation failed for ${token._id}, using cached session data:`, error);
                        session.user._id = token._id
                        session.user.isVerified = token.isVerified
                        session.user.username = token.username
                        session.user.email = token.email
                        session.user.firstName = token.firstName
                        session.user.lastName = token.lastName
                        session.user.image = token.image
                        session.user.contactNumber = token.contactNumber
                        session.user.credits = token.credits
                        session.user.referralCode = token.referralCode
                        session.user.referredBy = token.referredBy
                        session.user.totalReferrals = token.totalReferrals
                        session.user.referralCreditsEarned = token.referralCreditsEarned
                        session.user.referralTier = token.referralTier,
                        session.user.isAdmin = token.isAdmin
                    }
                }
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    //adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET
}
