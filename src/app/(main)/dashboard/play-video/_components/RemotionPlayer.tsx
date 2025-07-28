"use client"
import RemotionComposition from "@/app/_components/RemotionComposition";
import { Player } from "@remotion/player";
import { sentence, utterance } from "../../../../../../convex/schema";

const RemotionPlayer = ({ videoData }: { videoData: any }) => {
const captions: {sentences: sentence[], utterances: utterance[]} = videoData?.captionJson
const utterances = captions.utterances
  return (
    <Player
      component={RemotionComposition}
      durationInFrames={parseInt(utterances[utterances.length - 1].end.toFixed(0)) * 30}
      fps={30}
      compositionWidth={720}
      compositionHeight={1280}
      controls
      inputProps={{
        videoData,
      }}
      style={{
        width:'25vw',
        height:'70vh'
      }}
    />
  )
}

export default RemotionPlayer