import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Handle POST requests
export async function GET(req, res) {
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_LABS_API_KEY
  });

  try {

      const audio = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {

      text: "hello how are you?",

      modelId: "eleven_multilingual_v2"

    });

     const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}