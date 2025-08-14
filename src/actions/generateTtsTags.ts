"use server"

import { gemini, config, model } from "@/config/AiModal";

const SCRIPT_PROMPT = `Take the given script for a short video and add tags specifying the tone & pace of the speaker 
for a sentence. The result will be fed to a text to speech model like ElevenLabs.

Script: {script}

- Give accurate tags strictly depending on the story line
- Do not skip any part of the script
- Follow the following schema and return JSON data

For example 

1. Narrating a story

Script : In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the “burn it all down” kind... but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed.

Output
{
 tts_text :"In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed."
}

2. A game commentary

Script: We're off under the lights here for this semi-final clash, the stadium buzzing with anticipation. ElevenLabs United in their iconic black and white shirts, pushing forward with intent straight from the opening whistle. The ball is zipped out wide, early attack here. Driving down the wing, pace to burn, skips past one, skips past two! Oh, this is beautiful. One-on-one with the full-back, cuts inside—oh, that's a lovely bit of footwork!!! PURE MAGIC on the pitch! ElevenLabs on top form tonight!

Output
{
 tts_text: "[very quickly] We're off under the lights here for this semi-final clash, the stadium buzzing with anticipation. ElevenLabs United in their iconic black and white shirts, pushing forward with intent straight from the opening whistle. [excited] The ball is zipped out wide, early attack here. Driving down the wing, pace to burn, [shouting] skips past one, skips past two! Oh, this is beautiful. One-on-one with the full-back, cuts inside—oh, that's a lovely bit of footwork!!! PURE MAGIC on the pitch! ElevenLabs on top form tonight!"
}

3. A Drill sergeant speaking to a soldier

Script: You are pure scum, private! You think you have what it takes to be the BEST?! you're an embarrassment to the force - get OUTTA MY SIGHT!! ooohh, but it's too 'DIFFICULT'..,[high pitched voice]I don't have enough strength or willpower, I'm far too scared! ENOUGH OF THAT! you amuse me, soldier, AND YOU MAKE ME SICK!

Output
{
  tts_text: "You are pure scum, private! You think you have what it takes to be the BEST?! [chuckles] you're an embarrassment to the force - get OUTTA MY SIGHT!! [high pitched voice] ooohh, but it's too 'DIFFICULT'..,[high pitched voice]I don't have enough strength or willpower, I'm far too scared! [laughs] ENOUGH OF THAT! you amuse me, soldier, AND YOU MAKE ME SICK!"
}

4. Recounting an old story

Script: Back then... we had no phones—just dirt roads, radio songs, and big dreams. I kissed her under the old elm by Miller’s Creek, swore I’d never leave. But then the war came, and youth slipped through my fingers like smoke. Funny... how a moment can last forever... even when everything else fades.

Output
{
  tts_text : "[slowly] Back then... [chuckles] we had no phones—just dirt roads, radio songs, and big dreams. [whispers] I kissed her under the old elm by Miller’s Creek, swore I’d never leave. [coughs] But then the war came, and youth slipped through my fingers like smoke. [chuckles] Funny... how a moment can last forever... even when everything else fades."  
}

Use only single word in a tag
`

const generateTtsTags = async (script: string) => {
    const prompt = SCRIPT_PROMPT.replace("{script}", script);

    try {
        const result = await gemini.models.generateContentStream({
            model,
            config,
            contents: prompt
        });

        let text = "";
        for await (const chunk of result) {
            text += chunk.text;
        }

        return {
            success: true,
            tts_text: JSON.parse(text).tts_text
        }
    } catch (error) {
        return {
            success: false,
            message: "Error generating tags"
        }
    }
}

export default generateTtsTags