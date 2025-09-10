"use client"
import RemotionComposition from "@/app/_components/RemotionComposition";
import { Player } from "@remotion/player";
import { sentence, utterance } from "@/../convex/schema";

const RemotionPlayer = ({ videoData }: { videoData: any }) => {
const captions: {sentences: sentence[], utterances: utterance[]} = videoData?.captionJson
const utterances = captions.utterances
  return (
    <Player
      component={RemotionComposition}
      durationInFrames={(parseInt(utterances[utterances.length - 1].end.toFixed(0)) + 1) * 30}
      fps={30}
      compositionWidth={720}
      compositionHeight={1280}
      controls
      inputProps={{
        videoData,
      }}
      className="!w-full aspect-[1/2] !h-auto md:mx-auto md:!w-[53%]" 
    />
  )
}

export default RemotionPlayer