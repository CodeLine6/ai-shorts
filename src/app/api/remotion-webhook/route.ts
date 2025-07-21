import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Received Remotion webhook payload:", payload);

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
