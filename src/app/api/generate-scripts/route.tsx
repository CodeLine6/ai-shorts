import { gemini, config, model} from "@/config/AiModal";
import { NextRequest, NextResponse } from "next/server";


const SCRIPT_PROMPT = `write two different script for 60 Seconds video on Topic: {topic},
• Do not add Scene descriptions
• Do not add anything in Braces. Just return plain story in text 
• Create two versions of the script, One with just text and other with text and emotions which will be used to generate text to speech.
• Give me response in JSON format and follow the schema
-{
  scripts:[
    {
      content:"",
      tts_text:""
    },
  ],
}
  
For example:

{
  "scripts": [
    {
      "content": "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the “burn it all down” kind... but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed.",
      "tts_text": "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed."
    }
  ]
}

`
export async function POST(request : NextRequest) {
    try {
    const {topic} = await request.json();

    const prompt = SCRIPT_PROMPT.replace("{topic}", topic);
    const result = await gemini.models.generateContentStream({
    model,
    config,
    contents: prompt,
  });

  let text = "";
  for await (const chunk of result) {
    text += chunk.text;
  }

  return NextResponse.json({
    success: true,
    scripts : JSON.parse(text).scripts
    
  });

} catch (error) {
    return NextResponse.json({success: false, message: "Error generating scripts"}, {status: 500})
}
}