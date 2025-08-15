import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import supabase from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function pollForResult(resultUrl: string, headers: any) {
  let data
  while (true) {
    console.log("Polling for results...");
    const pollResponse = (await axios.get(resultUrl, { headers: headers }))
      .data;

    if (pollResponse.status === "done") {
      console.log("- Transcription done: \n ");
      data = pollResponse
      break;
    } else {
      console.log("Transcription status: ", pollResponse.status);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return data
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export async function moveSupabaseFile(title,audioUrl, videoId) {
  const audioPathInStorage = `${videoId}/audio/${title}.mp3`;
  
          // Fetch the audio content from the temporary URL
          const response = await fetch(audioUrl);
          if (!response.ok) {
              throw new Error(`Failed to fetch audio from ${audioUrl}: ${response.statusText}`);
          }
          const audioBlob = await response.blob(); // Get as Blob
  
          // Upload the fetched content to the 'media' bucket
          const { data: uploadData, error: uploadError } = await supabase.storage
              .from("media")
              .upload(audioPathInStorage, audioBlob, { // Pass the Blob here
                  contentType: "audio/mpeg",
                  upsert: true,
              });
  
          if (uploadError) {
              console.error("Error uploading file:", uploadError);
              throw new Error(`Failed to upload audio to media bucket: ${uploadError.message}`);
          }
  
          const { data: publicUrlData } = supabase.storage
            .from("media")
            .getPublicUrl(audioPathInStorage);
  
          
  
          // Delete the audio file from sample bucket
          // Extract the file name from the URL for removal from the 'sample' bucket
          const urlParts = audioUrl.split('/');
          const tempFileName = urlParts[urlParts.length - 1]; // Get the last part of the URL as the file name
  
          if (tempFileName) {
              await supabase.storage
                  .from("sample")
                  .remove([tempFileName]);
          }

          return publicUrlData.publicUrl
  
}

export const prefetchImages = async (imageArray: any[]) => {
  const fetchedImages = [];

  for (const image of imageArray) {
    const response = await fetch(image.image);
    const blob = await response.blob();
    fetchedImages.push({
      ...image,
      image: URL.createObjectURL(blob),
    });
  }

  return fetchedImages;
}