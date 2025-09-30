import { QueueVideo } from '@/actions/generateVideo';
import { a4fClient } from '@/config/AiModal';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Ensure route is always dynamic and never cached
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Handle POST requests
export async function GET(req, res) {
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_LABS_API_KEY
  });

  try {

    /* const audio = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {

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
    }); */

    // get prompt from search parameter
    const prompt = req.nextUrl.searchParams.get('prompt');

    const fluxReq = await a4fClient.images.generate({
      model: "provider-4/imagen-3",
      prompt: prompt,
      response_format: "b64_json",
      output_compression: 50,
      size: "1024x1792",
    });

    const base64 = fluxReq.data?.[0]?.b64_json;

    const imageBuffer = Buffer.from(base64, 'base64');
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      },
    });

    // get prompt from search parameter
    /* const prompt = req.nextUrl.searchParams.get('prompt');

    const fluxReq = await fetch("https://free-image-generation-api.abhimanyutokas.workers.dev/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer omnamobhagvatevasudevae",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, width: 1024, height: 1792,negative_prompt: "blurry, low quality, pixelated, distorted, text, watermark, signature, logo, bad anatomy, extra limbs, deformed hands, repetition" }),
    });

    const blob = await fluxReq.blob();
    const base64 = await blob.arrayBuffer();

    const imageBuffer = Buffer.from(base64, 'base64');
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      },
    }); */

    /* const id = req.nextUrl.searchParams.get('id');
    const result = await QueueVideo(id);

    return Response.json(result); */

  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
