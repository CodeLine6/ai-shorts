import { pollForResult } from "@/lib/utils";
import { inngest } from "./client";
import axios from "axios";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { gemini, config, model, a44Client } from "@/config/AiModal";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { sentence } from "../../convex/schema";
import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const ImagePrompt = `Generate Image prompt of style {style} with all details for each scene for 30 seconds video : script : {script}
- Give accurate image prompts strictly depending on the story line
- Do not skip any part of the script
- imagePrompt should strictly stick to what is described in sceneContent
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
      const VOICE_ID = voice.voiceId;

      try {
        console.log("Making ElevenLabs API request...");

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": process.env.ELEVEN_LABS_API_KEY!, // Assert non-null
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: script,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log("ElevenLabs API error:", errorText);
          throw new Error(
            `ElevenLabs API error: ${response.status} - ${errorText}`
          );
        }

        const audioBuffer = await response.arrayBuffer();
        const audioBufferNode = Buffer.from(audioBuffer);

        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_") || "audio"}-${Date.now()}.mp3`;
        const audioPathInStorage = `${recordId}/audio/${fileName}`;

        // Upload audio to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media") // Assuming you have a bucket named 'media'
          .upload(audioPathInStorage, audioBufferNode, {
            contentType: "audio/mpeg",
            upsert: false, // Set to true if you want to overwrite existing files
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw new Error(`Supabase upload error: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("media")
          .getPublicUrl(audioPathInStorage);

        console.log(`Audio file uploaded to: ${publicUrlData.publicUrl}`);

        return {
          fileName,
          filePath: publicUrlData.publicUrl, // Store the public URL
          audioBuffer: audioBufferNode,
        };
      } catch (error) {
        console.log("Error generating audio file:", error);
        throw error;
      }
    });

    /* const GenerateAudioFile = {
      fileName: "PJ-1753112766673.mp3",
      filePath: "https://ltdxxqeuuoibizgjzxqo.supabase.co/storage/v1/object/public/media/j975p2372h9g22vsefb5a768457m7jsy/audio/PJ2-1753182964386.mp3",
    } */

    // Generate Captions
    const GenerateCaptions = await step.run("GenerateCaptions", async () => {
      const gladiaV2BaseUrl = "https://api.gladia.io/v2/";
      const headers: Record<string, string> = {
        //@ts-ignore
        "x-gladia-key": process.env.NEXT_PUBLIC_GLADIA_API_KEY,
      };
      try {
        // Fetch the audio file from the public URL
        const audioResponse = await axios.get(GenerateAudioFile.filePath, {
          responseType: "arraybuffer",
        });
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
      let images_buffer = [];

      images_buffer = await Promise.all(
        GenerateImagePrompt.map(
          async (
            prompt: { imagePrompt: string; sceneContent: string },
            index: number
          ) => {
            /* const result = await a44Client.images.generate({
              model: "provider-2/FLUX.1-schnell-v2",
              prompt: prompt.imagePrompt + " size: 1024x1536",
              size: "1024x1536",
              response_format: "b64_json",
              output_compression: 50,
            }); */

            const result = await gemini.models.generateImages({
                    model: 'models/imagen-4.0-generate-preview-06-06',
                    prompt: prompt.imagePrompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '9:16',
                    },
            });

            if (!result?.generatedImages) {
                throw new Error('Failed to generate images');
            }

            const base64 = result.generatedImages?.[0]?.image?.imageBytes;
            //@ts-ignore
            
            return { base64, ...prompt };
          }
        )
      );
      
      return images_buffer;
    });
    
    const UploadToStorage = await step.run("UpdateVideoRecord", async () => {
      const imagePaths = await Promise.all(
        GenerateImages.map(async (image, index) => {
          const imageName = `${title.replace(/[^a-zA-Z0-9]/g, "_") || "image"}-${Date.now()}.png`;
          const imagePathInStorage = `${recordId}/images/${imageName}`;
          const imageBuffer = Buffer.from(image.base64, "base64");

          // Upload image to Supabase Storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("media") // Assuming you have a bucket named 'media'
              .upload(imagePathInStorage, imageBuffer, {
                contentType: "image/png",
                upsert: false, // Set to true if you want to overwrite existing files
              });

          if (uploadError) {
            console.error("Supabase image upload error:", uploadError);
            throw new Error(
              `Supabase image upload error: ${uploadError.message}`
            );
          }

          const { data: publicUrlData } = supabase.storage
            .from("media")
            .getPublicUrl(imagePathInStorage);
          console.log(`Image file uploaded to: ${publicUrlData.publicUrl}`);

          return {
            imageUrl: publicUrlData.publicUrl,
            sceneContent: image.sceneContent,
          };
        })
      );

      return imagePaths;
    });

    const ImageObject = await step.run("formatImageObject", async () => {
      const images = await Promise.all(
        UploadToStorage.map(async ({ imageUrl, sceneContent }, index) => {
          const relatedTranscript =
            GenerateCaptions.result.transcription.sentences.filter(
              ({ sentence }: sentence) => {
                return sceneContent
                  .toLowerCase()
                  .includes(sentence.toLowerCase());
              }
            );

          const start = relatedTranscript[0]?.start - 0.3;
          const end =
            relatedTranscript[relatedTranscript.length - 1]?.end + 0.3;

          const duration = end - start;
          console.log(`Duration `, duration, " Start: ", start, " End: ", end);

          return {
            image: imageUrl,
            start,
            duration,
          };
        })
      );

      return images;
    });

    // Save All Data to Database
    const SaveToDatabase = await step.run("SaveToDatabase", async () => {
      await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId,
        audioUrl: GenerateAudioFile.filePath, // Use the public URL from Supabase
        captionJson: GenerateCaptions.result.transcription.sentences,
        images: ImageObject,
      });
    });

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

      let renderResult;
      try {
        const renderVideo = renderMediaOnCloudrun({
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
          renderStatusWebhook: {
            url: `${process.env.NEXTAUTH_URL}/api/remotion-webhook`, // Point to the new API route
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              recordId, // Pass recordId to the webhook
            },
            webhookProgressInterval: 1, // Add this back as it was in the user's original code
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log(`Remotion render initiated.`);
        return "initiated";
      } catch (error) {
        console.error("Error initiating Remotion render:", error);
        // If the await itself throws (e.g., network error, or a very fast timeout),
        // we might not even get a renderId.
        return {
          renderId: null,
          recordId,
          status: "initiation_error",
          message: (error as Error).message,
        };
      }
    });

    // The main function will return the result of RenderVideo step
    return RenderVideo;
  }
);

export const HandleRemotionRenderWebhook = inngest.createFunction(
  { id: "handle-remotion-render-webhook" },
  { event: "remotion/render.status" }, // Listen for the event sent by the webhook API route
  async ({ event, step }) => {
    const { recordId, renderId, progress, error } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const video = await convex.query(api.videoData.GetVideoRecord, {
      recordId,
    });

    if (!video) {
      console.error(`Video record not found for recordId: ${recordId}`);
      return { message: "Video record not found" };
    }

    console.log(
      `Remotion render status update for record ${recordId}, render ${renderId}: Progress ${progress}, Error: ${error}`
    );

    if (error) {
      console.error(
        `Remotion render failed for record ${recordId}, render ${renderId}: ${error}`
      );
      await step.run("update-video-record-failed", async () => {
        await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId,
          audioUrl: video.audioUrl, // Use the public URL from Supabase
          captionJson: video.captionJson,
          images: video.images,
          status: "failed", // Removed as it's not in schema
          // errorMessage: error, // Removed as it's not in schema
        });
      });
      return { message: "Render failed, database updated" };
    }

    if (progress === 1) {
      const downloadUrl =
        "https://storage.googleapis.com/remotioncloudrun-wdehybeugz/renders/" +
        renderId +
        "/out.mp4";
      console.log(
        `Remotion render completed for record ${recordId}, render ${renderId}. Public URL: ${downloadUrl}`
      );
      await step.run("update-video-record-success", async () => {
        await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId,
          downloadUrl,
          audioUrl: video.audioUrl, // Use the public URL from Supabase
          captionJson: video.captionJson,
          images: video.images,
          status: "completed", // Removed as it's not in schema
        });
      });
      return { message: "Render completed, database updated" };
    }

    // If not completed and no error, just acknowledge the progress update
    return { message: "Render progress update received" };
  }
);
