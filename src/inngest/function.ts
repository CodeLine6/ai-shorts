import { pollForResult } from "@/lib/utils";
import { inngest } from "./client";
import axios from "axios";
import supabase from "@/lib/supabase"; // Import Supabase client
import { gemini, config, model, a4fClient } from "@/config/AiModal";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { utterance } from "@/../convex/schema";
import { FailureEventArgs } from "inngest";
import { QueueVideo } from "@/actions/generateVideo";

const ImagePrompt = `Generate Image prompt of style {style} with all details for each scene for 30 seconds video : script : {script}
- Give accurate image prompts strictly depending on the story line
- Do not skip any part of the script
- Include image style in the image prompt
- imagePrompt should stick to what is described in sceneContent
- Follow the following schema and return JSON data (Max 4-5 Images)
- Do not add any character or dotes (...) after a sentence or word in sceneContent that was not present in the original script

[
  {
    'imagePrompt': '<Image Prompt>',
    'sceneContent': '<Script Content>'
  },
]

- If the script contains reference to real people then make sure to shorten their name in imagePrompt so that there is privacy error while generating images with image generation model while keeping original name intact in the sceneContent
  For example :
  Elizabeth Short => Liz Short Or Ms E. Short
  John Doe => J Doe Or John D.

- By combining sceneContent of each image prompt we should be able to get the exact text of the script.

-Once you have the prompts ready in the JSON format. You can identify characters that are referenced across all the imagePrompt(s) 
 give those characters a consistent character descriptions so that consistent face and bodily features are generated for a given character across all the  images 
 and finally add it to the appropriate image prompt.`;

export const GenerateVideoData = inngest.createFunction(
  {
    id: "generate-video-data",
    concurrency: {
      limit: 2, // Ensures only one instance of this function runs at a time
    },
    onFailure: async ({ event, error }: FailureEventArgs) => {
      const { recordId } = event.data.event.data;
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId,
        status: "Failed",
        comments: `Inngest function failed: ${error.message}`
      });
    },
  },
  { event: "generate-video-data" },

  async ({ event, step }) => {
    const { title, script, videoStyle, voice, recordId, audioUrl } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Generate Audio File MP3
    const GenerateAudioFile = await step.run("GenerateAudioFile", async () => {
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId,
        status: "Generating Audio File"
      });

      if (audioUrl) {
        return {
          fileName: audioUrl.split("/").pop(),
          filePath: audioUrl,
        }
      }

      const VOICE_ID = voice.voiceId;

      try {
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
              text: script.tts_text,
              model_id: "eleven_v3",
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
            upsert: true, // Set to true if you want to overwrite existing files
          });

        if (uploadError) {
          console.log("Supabase upload error:", uploadError);

          throw new Error(`Supabase upload error: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("media")
          .getPublicUrl(audioPathInStorage);

        return {
          fileName,
          filePath: publicUrlData.publicUrl, // Store the public URL
        };

      } catch (error) {
        console.log("ElevenLabs API error:", error);

        throw new Error(`ElevenLabs API error: ${error.message}`);
      }
    });

    // Generate Captions
    const GenerateCaptions = await step.run("GenerateCaptions", async () => {

      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId,
        status: "Generating Captions"
      });

      try {
        const gladiaV2BaseUrl = "https://api.gladia.io/v2/";
        const headers: Record<string, string> = {
          //@ts-ignore
          "x-gladia-key": process.env.GLADIA_API_KEY,
          "Content-Type": "application/json",
        };

        // Fetch the audio file from the public URL

        const requestData = {
          audio_url: GenerateAudioFile.filePath,
          sentences: true,
        };

        headers["Content-Type"] = "application/json";

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
      }

      catch (error) {
        throw new Error(
          `Error generating captions for record ${recordId}: ${error}`
        );
      }

    });

    // Generate Image Prompt from Script
    const GenerateImagePrompt = await step.run(
      "GenerateImagePrompt",
      async () => {

        await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
          recordId,
          status: "Generating Image Prompts"
        });

        try {
          const FINAL_PROMPT = ImagePrompt.replace("{style}", videoStyle)
            .replace("{script}", GenerateCaptions.result.transcription.full_transcript)

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

        catch (error) {

          throw new Error(
            `Error generating image prompts for record ${recordId}: ${error}`
          );
        }
      }
    );

    // Generate Images using AI
    const GenerateImages = await step.run("GenerateImages", async () => {
      await convex.mutation(api.videoData.UpdateVideoRecordStatus, {
        recordId,
        status: "Generating Images"
      });

      let images_buffer = [];

      images_buffer = await Promise.all(
        GenerateImagePrompt.map(async (prompt: { imagePrompt: string; sceneContent: string }, index: number) => {
          let base64;
          let imagen4Error = false;
          let imagen3Error = false;

          // Try Imagen 4 first
          try {
            console.log(`Generating image ${index + 1} with Imagen 4:`, prompt.imagePrompt);

            const imagen4Request = await a4fClient.images.generate({
              model: "provider-4/imagen-4",
              prompt: prompt.imagePrompt,
              response_format: "b64_json",
              output_compression: 50,
              size: "1024x1792",
            })

            base64 = imagen4Request.data?.[0]?.b64_json
          } catch (error) {
            console.log(`Imagen 4 failed for image ${index + 1}:`, error);
            imagen4Error = true;
          }

          // Fallback to Imagen 3 if Imagen 4 fails

          if (!base64 || imagen4Error) {
            try {
              console.log(`Falling back to Imagen 3 for image ${index + 1}:`, prompt.imagePrompt);

              const imagen3Request = await a4fClient.images.generate({
                model: "provider-4/imagen-3",
                prompt: prompt.imagePrompt,
                response_format: "b64_json",
                output_compression: 50,
                size: "1024x1792",
              });

              base64 = imagen3Request.data?.[0]?.b64_json;

              if (!base64) {
                throw new Error("Imagen 3 API returned no image data");
              }
            } catch (err: any) {
              console.log(`Imagen 3 also failed for image ${index + 1}:`, err)
              imagen3Error = true
            }
          }

          if (!base64 || imagen3Error) {
            try {
              console.log(`Falling back to Stability ai for image ${index + 1}:`, prompt.imagePrompt);


              const stabilityAIRequest = await fetch("https://free-image-generation-api.abhimanyutokas.workers.dev/", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                  prompt: prompt.imagePrompt,
                  width: 1024, 
                  height: 1792,
                  negative_prompt: "blurry, low quality, pixelated, distorted, text, watermark, signature, logo, bad anatomy, extra limbs, deformed hands, repetition"
                 }),
              });

              const blob = await stabilityAIRequest.blob();
              base64 = await blob.arrayBuffer();

              if (!base64) {
                throw new Error("Stability AI API returned no image data");
              }
            } catch (stabilityAIErr: any) {
              console.log(`Stability AI also failed for image ${index + 1}:`, stabilityAIErr);

              // Log the full error details
              console.log("Stability AI Details:", {
                message: stabilityAIErr.message,
                status: stabilityAIErr.status,
                prompt: prompt.imagePrompt,
                promptLength: prompt.imagePrompt.length
              });

              throw new Error(`Imagen 4, 3 and Stability AI failed for image ${index + 1}: ${stabilityAIErr.message}`);
            }
          }

          return { base64, ...prompt };
        })
      );

      console.log(`Successfully generated ${images_buffer.length} images`);
      return images_buffer;
    });

    const UploadToStorage = await step.run("UploadToStorage", async () => {
      const imagePaths = await Promise.all(
        GenerateImages.map(async (image, index) => {
          const imageName = `${title.replace(/[^a-zA-Z0-9]/g, "_") || "image"}-${Date.now()}-${index}.png`;
          const imagePathInStorage = `${recordId}/images/${imageName}`;
          const imageBuffer = Buffer.from(image.base64, "base64");

          // Upload image to Supabase Storage
          try {
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("media") // Assuming you have a bucket named 'media'
                .upload(imagePathInStorage, imageBuffer, {
                  contentType: "image/png",
                  upsert: false, // Set to true if you want to overwrite existing files
                });

            if (uploadError) {
              console.log("Supabase image upload error:", uploadError);

              throw new Error(
                `Supabase image upload error: ${uploadError.message}`
              );
            }

            const { data: publicUrlData } = supabase.storage
              .from("media")
              .getPublicUrl(imagePathInStorage);

            return {
              imageUrl: publicUrlData.publicUrl,
              sceneContent: image.sceneContent,
            };

          } catch (error) {
            console.log("Supabase image upload error:", error);
            throw new Error(
              `Supabase image upload error: ${error.message}`
            );
          }
        })
      );

      return imagePaths;
    });

    const ImageObject = await step.run("formatImageObject", async () => {
      const images = await Promise.all(
        UploadToStorage.map(async ({ imageUrl, sceneContent }, index) => {
          const relatedTranscript =
            GenerateCaptions.result.transcription.utterances.filter(
              ({ text }: utterance) => {
                return sceneContent
                  .toLowerCase()
                  .includes(text.toLowerCase()) || text.toLowerCase().includes(sceneContent.toLowerCase());
              }
            );

          const start = index === 0 ? 0 : relatedTranscript[0]?.start ? parseFloat((relatedTranscript[0]?.start).toFixed(3)) : 0;
          const end = parseFloat((relatedTranscript[relatedTranscript.length - 1]?.end).toFixed(3));

          const duration = parseFloat((end - start).toFixed(3));
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
      try {
        await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId,
          audioUrl: GenerateAudioFile.filePath, // Use the public URL from Supabase
          captionJson: {
            sentences: GenerateCaptions.result.transcription.sentences,
            utterances: GenerateCaptions.result.transcription.utterances,
          },
          images: ImageObject,
          script: GenerateCaptions.result.transcription.full_transcript,
          status: "Ready",
        });
      }
      catch (error: any) {
        console.log("Error saving to database:", error);
        throw new Error(`Error saving to database: ${error.message}`);
      }
    });

    const InitiateRender = await step.run("InitiateRender", async () => {
      // Put the video in queue
      const result = await QueueVideo(recordId);

    });

    return InitiateRender// The main function will return the result of RenderVideo step
  },
);
