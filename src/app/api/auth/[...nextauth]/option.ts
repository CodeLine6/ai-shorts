import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import type {AuthOptions} from "next-auth"
import { sendVerificationEmail } from '@/helpers/sendEmailVerifications'
import { api } from "../../../../../convex/_generated/api";
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
        credits: number
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
        credits: number
    }
}
declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            isVerified: boolean;
            username: string;
            firstName: string;
            lastName: string;
            contactNumber: string;
            email: string;
            image?: string;
            credits: number
        }
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
                    const user = await convex.mutation(api.user.GetUser, {
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
                        
                        //await sendVerificationEmail(user.email, verifyCode)

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
                        credits: user.credits
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
                token.contactNumber = user.contactNumber,
                token.credits = user.credits
            }

            if(trigger === "update" && session) {
                return {...token,...session.user}
            }
            return token
        },
        async session({ session, token }) {
            if(token && session) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.email = token.email
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName
                session.user.image = token.image
                session.user.contactNumber = token.contactNumber,
                session.user.credits = token.credits
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