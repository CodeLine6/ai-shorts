import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LABS_API_KEY });

export async function GET() {
  
  try {
  const availableVoices = await client.voices.search({
    includeTotalCount: true,
    voiceType: "default",
  });

  
  return Response.json({
    success: true,
    voices: availableVoices.voices.map((voice) => ({
        voiceId: voice.voiceId,
        name: voice.name,
        url: voice.previewUrl,
        accent: voice.labels?.accent,
        gender: voice.labels?.gender,
        age: voice.labels?.age,
        use_case: voice.labels?.use_case

    }))
  });

} catch (error) {
  console.log("Error getting voices", error)
  return Response.json({success: false, message: "Error getting voices"}, {status: 500})   
}
}