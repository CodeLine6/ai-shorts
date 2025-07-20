import { pollForResult } from "@/lib/utils";
import { inngest } from "./client";
import axios from "axios";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import {
  gemini,
  config,
  model,
  a44Client,
} from "@/config/AiModal";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { sentence } from "../../convex/schema";
import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const ImagePrompt = `Generate Image prompt of style {style} with all details for each scene for 30 seconds video : script : {script}
- Just Give specific image prompts depends on the story line
- Do not skip any part of the script
- Do not give camera angles 
- Follow the following schema and return JSON data (Max 4-5 Images)

[
  {
    'imagePrompt': '',
    'sceneContent': '<Script Content>'
  },
]

By combining sceneContent of each image prompt we should be able to get the entire script
`;

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data" },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    const { title, script, videoStyle, voice, recordId } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Generate Audio File MP3
     const GenerateAudioFile = await step.run("GenerateAudioFile", async () => {
     const VOICE_ID =  voice.voiceId;
     
     try {
       console.log("Making ElevenLabs API request...");
       
       const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
         method: 'POST',
         headers: {
           'xi-api-key': process.env.ELEVEN_LABS_API_KEY!, // Assert non-null
           'Content-Type': 'application/json',
           'Accept': 'audio/mpeg'
         },
         body: JSON.stringify({
           text: script,
           model_id: "eleven_multilingual_v2",
           voice_settings: {
             stability: 0.5,
             similarity_boost: 0.5
           }
         })
       })

       if (!response.ok) {
         const errorText = await response.text();
         console.log("ElevenLabs API error:", errorText);
         throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
       }

       const audioBuffer = await response.arrayBuffer();
       const audioBufferNode = Buffer.from(audioBuffer);

       const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_") || "audio"}-${Date.now()}.mp3`;
       const audioPathInStorage = `${recordId}/audio/${fileName}`;

       // Upload audio to Supabase Storage
       const { data: uploadData, error: uploadError } = await supabase.storage
         .from('media') // Assuming you have a bucket named 'media'
         .upload(audioPathInStorage, audioBufferNode, {
           contentType: 'audio/mpeg',
           upsert: false, // Set to true if you want to overwrite existing files
         });

       if (uploadError) {
         console.error("Supabase upload error:", uploadError);
         throw new Error(`Supabase upload error: ${uploadError.message}`);
       }

       const { data: publicUrlData } = supabase.storage
         .from('media')
         .getPublicUrl(audioPathInStorage);

       console.log(`Audio file uploaded to: ${publicUrlData.publicUrl}`);

       return {
         fileName,
         filePath: publicUrlData.publicUrl, // Store the public URL
         audioBuffer: audioBufferNode,
       };
     }
     catch (error) {
       console.log("Error generating audio file:", error);
       throw error;
     }
    });

    // Generate Captions
    const GenerateCaptions = await step.run("GenerateCaptions", async () => {
      const gladiaV2BaseUrl = "https://api.gladia.io/v2/";
      const headers: Record<string, string> = {
        //@ts-ignore
        "x-gladia-key": process.env.NEXT_PUBLIC_GLADIA_API_KEY,
      };
      try {
        // Fetch the audio file from the public URL
        const audioResponse = await axios.get(GenerateAudioFile.filePath, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(audioResponse.data);

        // Create FormData
        const formData = new FormData();
        const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
        formData.append("audio", audioBlob, GenerateAudioFile.fileName);

        // Make the API request
        const uploadResponse = await axios.post(
          `${gladiaV2BaseUrl}upload`,
          formData,
          {
            headers,
          }
        );

        if (uploadResponse.status !== 200) {
          throw new Error(`HTTP error! status: ${uploadResponse.status}`);
        }

        const requestData = {
          audio_url: uploadResponse.data.audio_url,
          sentences: true,
        };

        headers["Content-Type"] = "application/json";

        console.log("- Sending post transcription request to Gladia API...");

        const postTranscriptionResponse = (
          await axios.post(gladiaV2BaseUrl + "transcription/", requestData, {
            headers,
          })
        ).data;

        if (!postTranscriptionResponse.result_url) {
          throw new Error(
            `Gladia API returned invalid result_url: ${postTranscriptionResponse.result_url}`
          );
        }
        const subtitles = await pollForResult(
          postTranscriptionResponse.result_url,
          headers
        );

        return subtitles;
      } catch (error) {
        console.log("Error uploading audio:", error);
        return {
          error: "Failed to upload audio file",
          //@ts-ignore
          details: error.response?.data || error.message,
          status: 500,
        };
      }
    });

    // Generate Image Prompt from Script

    const GenerateImagePrompt = await step.run(
      "GenerateImagePrompt",
      async () => {
        const FINAL_PROMPT = ImagePrompt.replace("{style}", videoStyle).replace(
          "{script}",
          GenerateCaptions.result.transcription.full_transcript
        );

        const result = await gemini.models.generateContentStream({
          model,
          config,
          contents: FINAL_PROMPT,
        });

        let prompts = "";
        for await (const chunk of result) {
          prompts += chunk.text;
        }

        return JSON.parse(prompts);
      }
    );

    // Generate Images using AI

    const GenerateImages = await step.run("GenerateImages", async () => {
      let images = [];

      images = await Promise.all(
        GenerateImagePrompt.map(
          async (
            {
              imagePrompt,
              sceneContent,
            }: { imagePrompt: string; sceneContent: string },
            index: number
          ) => {
            const result = await a44Client.images.generate({
              model: "provider-2/FLUX.1-schnell-v2",
              prompt: imagePrompt + " size: 1024x1536",
              size: "1024x1536",
              response_format: "b64_json",
              output_compression: 50,
            });

            const base64 = result.data?.[0].b64_json;
            //@ts-ignore
            const imageBuffer = Buffer.from(base64, "base64");

            const imageName = `${title.replace(/[^a-zA-Z0-9]/g, "_") || "image"}-${Date.now()}.png`;
            const imagePathInStorage = `${recordId}/images/${imageName}`;

            // Upload image to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('media') // Assuming you have a bucket named 'media'
              .upload(imagePathInStorage, imageBuffer, {
                contentType: 'image/png',
                upsert: false, // Set to true if you want to overwrite existing files
              });

            if (uploadError) {
              console.error("Supabase image upload error:", uploadError);
              throw new Error(`Supabase image upload error: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(imagePathInStorage);

            console.log(`Image file uploaded to: ${publicUrlData.publicUrl}`);

            const relatedTranscript =
              GenerateCaptions.result.transcription.sentences.filter(
                ({ sentence }: sentence) => {
                  return sceneContent
                    .toLowerCase()
                    .includes(sentence.toLowerCase());
                }
              );

            const start = relatedTranscript[0]?.start - 0.30;
            const end =
              relatedTranscript[relatedTranscript.length - 1]?.end + 0.30;

            const duration = end - start;

            console.log(
              `Duration `,
              duration,
              " Start: ",
              start,
              " End: ",
              end
            );

            return {
              image: `${publicUrlData.publicUrl}`,
              start,
              duration,
            };
          }
        )
      );

      console.log(images);

      return images;
    });

    // SAve Data to Database
    // Save All Data to Database
    const SaveToDatabase = await step.run(
      "SaveToDatabase",
      async () => {
        await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId,
          audioUrl: GenerateAudioFile.filePath, // Use the public URL from Supabase
          captionJson: GenerateCaptions.result.transcription.sentences,
          images: GenerateImages,
        });
      }
    );

    const RenderVideo = await step.run("RenderVideo", async () => {
      // Render Video
      const video = await convex.query(api.videoData.GetVideoRecord, {
        recordId,
      });

      const services = await getServices({
        region: "us-east1",
        compatibleOnly: true,
      });

      const serviceName = services[0].serviceName;

      const result = await renderMediaOnCloudrun({
        serviceName,
        region: "us-east1",
        serveUrl: process.env.GCP_SERVE_URL!, // Assert non-null
        composition: "youtubeShort",
        inputProps: {
          videoData: {
            audioUrl: GenerateAudioFile.filePath, // Use Supabase URL
            captionJson: GenerateCaptions.result.transcription.sentences,
            images: GenerateImages,
            // @ts-ignore
            caption: video.caption,
          },
        },
        codec: "h264",
      });

      if (!(result.type === "success")) {
        throw new Error(result.message);
      }

      console.log(result.bucketName);
      console.log(result.renderId);
      return result?.publicUrl;
    });

    // Update Download URL
    const UpdateDownloadUrl = await step.run(
      "UpdateDownloadUrl",
      async () => {
        await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId,
          audioUrl: GenerateAudioFile.filePath, // Use the public URL from Supabase
          captionJson: GenerateCaptions.result.transcription.sentences,
          images: GenerateImages,
          downloadUrl: RenderVideo || undefined, // Ensure it's string or undefined
        });
      }
    );

    return RenderVideo;
  }
);
