import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get the site URL from Netlify environment
    const siteUrl = process.env.URL || process.env.NEXTAUTH_URL;
    
    console.log("Sending Request to Background Render Function")
    // Trigger the background function
    const response = await fetch(`http://localhost:3000/api/video/start-video-rendering`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-netlify-trigger': process.env.NETLIFY_TRIGGER_SECRET || 'internal'
      }
    });

    const result = await response.text();
    console.log("Background function response:", result);

    return NextResponse.json({
      statusCode: 200,
      body: JSON.stringify({ message: "Processing triggered", result })
    });

  } catch (error) {
    console.error("Error triggering background processing:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};