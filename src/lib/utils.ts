import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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