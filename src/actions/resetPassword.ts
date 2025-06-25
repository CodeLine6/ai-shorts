"use server"
//import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'


const resetPassword = async (userId: string,password :string) => {
    //const prisma = new PrismaClient()
    try {
        /* const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        }) */

        const user = {id: 1, email: "test", username: "test", firstName: "John", lastName:"Doe"}

        if(!user) {
            return {
                success: false,
                message: "User not found"
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        /* const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        }) */

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