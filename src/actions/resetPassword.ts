"use server"
//import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const resetPassword = async (userId: string,password :string) => {

    try {
        
        const user = await convex.mutation(api.user.GetUserById, {id: userId})

        if(!user) {
            return {
                success: false,
                message: "User not found"
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await convex.mutation(api.user.UpdateUser, {username: user.username, newHashedPassword: hashedPassword})

        return {
            success: true,
            message: "Password reset successful"
        }
    }
    catch(err : any) {
        console.error("Error resetting password", err.message)
        return {
            success: false,
            message: "Error resetting password. Please try again"
        }
    }
}

export default resetPassword    