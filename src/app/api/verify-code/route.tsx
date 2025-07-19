import { NextRequest } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request : NextRequest) {
    try {
        const { username, code } = await request.json()
        const user = await convex.mutation(api.user.GetUser, {
                identifier: username,
        });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400
            })
        }
        if (user.verifyCode !== code) {
            return Response.json({
                success: false,
                message: "Invalid OTP"
            }, {
                status: 400
            })
        }
        
        if (new Date(user.verifyCodeExpiry) < new Date()) {
            return Response.json({
                success: false,
                message: "OTP expired"
            }, {
                status: 400
            })
        }

        await convex.mutation(api.user.UpdateUser, {
            username: user.username,
            isVerified: true
        });

        
        return Response.json({
            success: true,
            message: "Email verified successfully"
        }, {
            status: 200
        })
    }
    catch (error) {
        console.log("Error verifying email", error)
        return Response.json({
            success: false,
            message: "Error verifying email"
        }, {
            status: 500
        })
    }
}