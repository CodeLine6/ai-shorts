"use client"
import RemotionComposition from "@/app/_components/RemotionComposition";
import { sentence, utterance, VideoData } from "@/../convex/schema";
import { Player } from "@remotion/player";

const RemotionPlayer = ({ videoData, className }: { videoData: VideoData | null | undefined, className?: string }) => {
 
 
if(!videoData) return <div className={"bg-gray-800 animate-pulse "+className}/>

const captions: {sentences: sentence[], utterances: utterance[]} = videoData?.captionJson
const utterances = captions.utterances

  return (
    <Player
      component={RemotionComposition}
      durationInFrames={(parseInt(utterances[utterances.length - 1].end.toFixed(0)) + 1) * 30}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1920}
      controls
      inputProps={{
        videoData
      }}
      className={className} 
    />
  )
}

export default RemotionPlayer