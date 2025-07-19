//import { PrismaClient } from "@prisma/client"
import {z} from "zod";
import { userNameValidation } from "@/schemas/userSchema";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const UsernameQuerySchema = z
    .object({
        username: userNameValidation
    })

export async function GET(request : Request) {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({success: false, message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Error checking username"}, {status: 400})
        }
        const {username} = result.data;

        const existingVerifiedUser = await convex.mutation(api.user.CheckUsernameAvailability, {username});

        if(existingVerifiedUser) {
            return Response.json({success: false, message: "Username is already taken"}, {status: 400})
        }
        
        return Response.json({success: true, message: "Username is available"}, {status: 200})
    }
    catch(error) {
        console.log("Error checking username", error)
        return Response.json({success: false, message: "Error checking username"}, {status: 500})
    }
}