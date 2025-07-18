import { gemini, config, model} from "@/config/AiModal";
import { NextRequest, NextResponse } from "next/server";


const SCRIPT_PROMPT = `write two different script for 60 Seconds video on Topic: {topic},
• Do not add Scene descriptions
• Do not add anything in Braces. Just return plain story in text 
• Give me response in JSON format and follow the schema
-{
  scripts:[
    {
      content:""
    },
  ],
}`
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