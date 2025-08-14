import { gemini, config, model} from "@/config/AiModal";
import { NextRequest, NextResponse } from "next/server";


const SCRIPT_PROMPT = `write two different script for 30 to 50 Seconds video on Topic: {topic},
• Do not add Scene descriptions
• Do not add anything in Braces. Just return plain story in text 
• Create two versions of the script, One with just text and other with text and tags specifying the tone & pace of the speaker which will be used to generate text to speech.
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

Narrating a story & A game commentary
{
  scripts": [
    {
      "content": "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the “burn it all down” kind... but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed.",
      "tts_text" : "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed."
    },
    {
      "content" : "We're off under the lights here for this semi-final clash, the stadium buzzing with anticipation. ElevenLabs United in their iconic black and white shirts, pushing forward with intent straight from the opening whistle. The ball is zipped out wide, early attack here. Driving down the wing, pace to burn, skips past one, skips past two! Oh, this is beautiful. One-on-one with the full-back, cuts inside—oh, that's a lovely bit of footwork!!! PURE MAGIC on the pitch! ElevenLabs on top form tonight!",
      "tts_text" : "[very quickly] We're off under the lights here for this semi-final clash, the stadium buzzing with anticipation. ElevenLabs United in their iconic black and white shirts, pushing forward with intent straight from the opening whistle. [excited] The ball is zipped out wide, early attack here. Driving down the wing, pace to burn, [shouting] skips past one, skips past two! Oh, this is beautiful. One-on-one with the full-back, cuts inside—oh, that's a lovely bit of footwork!!! PURE MAGIC on the pitch! ElevenLabs on top form tonight!"
    }
  ]
}

A Drill sergeant speaking to a soldier
{
  "scripts": [
    {
        "content" : "You are pure scum, private! You think you have what it takes to be the BEST?! you're an embarrassment to the force - get OUTTA MY SIGHT!! ooohh, but it's too 'DIFFICULT'..,[high pitched voice]I don't have enough strength or willpower, I'm far too scared! ENOUGH OF THAT! you amuse me, soldier, AND YOU MAKE ME SICK!",
        "tts_text: "You are pure scum, private! You think you have what it takes to be the BEST?! [chuckles] you're an embarrassment to the force - get OUTTA MY SIGHT!! [high pitched voice] ooohh, but it's too 'DIFFICULT'..,[high pitched voice]I don't have enough strength or willpower, I'm far too scared! [laughs] ENOUGH OF THAT! you amuse me, soldier, AND YOU MAKE ME SICK!"
    }
  ]
}

Recounting an old story

{
  "scripts": [
    {
    "content" : "Back then... we had no phones—just dirt roads, radio songs, and big dreams. I kissed her under the old elm by Miller’s Creek, swore I’d never leave. But then the war came, and youth slipped through my fingers like smoke. Funny... how a moment can last forever... even when everything else fades.",
    "tts_text" : "[slowly] Back then... [chuckles] we had no phones—just dirt roads, radio songs, and big dreams. [whispers] I kissed her under the old elm by Miller’s Creek, swore I’d never leave. [coughs] But then the war came, and youth slipped through my fingers like smoke. [chuckles] Funny... how a moment can last forever... even when everything else fades."  
  }
  ]
}

Use only single word in a tag
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