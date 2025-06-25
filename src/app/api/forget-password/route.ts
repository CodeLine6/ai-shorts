import { sendPasswordResetLink } from "@/helpers/sendPasswordResetLink";
//import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server";

export async function POST(request : NextRequest) {
    //const prisma = new PrismaClient();
    try {
        const {email} = await request.json();
        if(!email) {
            return Response.json({
                success: false,
                message: "Email is required"
            }, {
                status: 400
            })
        }

        /* const user = await prisma.user.findUnique({
            where: {
                email
            }
        }) */

        const user = {id : 1,email: "test", username: "test"}
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400
            })
        }

        const resetPasswordToken = jwt.sign({user : {id: user.id, email: user.email}}, process.env.NEXTAUTH_SECRET || "", {expiresIn: "24h"})
        
        // send email with password reset link
        const emailResponse = await sendPasswordResetLink({username: user.username, email: user.email, resetPasswordToken})
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "Please check your email for password reset link"
        }, {
            status: 201
        })
    }

    catch(error) {
        console.error("Error completing password forget request", error)
        return Response.json({
            success: false,
            message: "Error completing password forget request"
        }, {
            status: 500
        })       
    }
}    