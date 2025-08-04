import bcrypt from 'bcrypt'
import { sendVerificationEmail } from '@/helpers/sendEmailVerifications'
import { NextRequest } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, firstName, lastName, contactNumber, referralCode } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await convex.mutation(api.user.CreateNewUser, {
            username,
            email,
            hashedPassword,
            firstName,
            lastName,
            contactNumber,
            referralCode,
        });

        if (!result.success) {
            console.log(result.message);
            return Response.json({
                success: false,
                message: result.message
            }, {
                status: 400
            });
        }

        // send verification email
        const emailResponse = await sendVerificationEmail({ username, email, verifyCode: result.verifyCode! });
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {
            status: 201
        });

    }
    catch(error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        });
    }
}
