import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    try {
        const { referralCode } = await request.json();

        if (!referralCode) {
            return NextResponse.json(
                { success: false, message: "Referral code is required" },
                { status: 400 }
            );
        }

        const result = await convex.query(api.referrals.ValidateReferralCode, {
            referralCode: referralCode.trim().toUpperCase(),
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Valid referral code from ${result.referrerName}`,
                referrerName: result.referrerName,
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error validating referral code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
