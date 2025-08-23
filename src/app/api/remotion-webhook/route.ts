import { inngest } from "@/inngest/client";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: Request) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  try {
    const payload = await request.json();
    console.log("Received Remotion webhook payload:", payload);

    if(payload.error) {
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId: payload.recordId,
        status: "Failed",
        comments: payload.error
      })
      return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }

    if(payload.progress < 1) 
    {
      await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId: payload.recordId,
        renderProgress : payload.progress * 100
      })
      return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }

    // Send an Inngest event with the webhook payload
    await inngest.send({
      name: "remotion/render.status",
      data: payload,
    });

    return NextResponse.json({ message: "Webhook received and Inngest event sent" }, { status: 200 });
  } catch (error) {
    console.error("Error processing Remotion webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
