"use client"
import RemotionComposition from "@/app/_components/RemotionComposition";
import { Player } from "@remotion/player";
import { useState } from "react";
import { sentence } from "../../../../../../convex/schema";

const RemotionPlayer = ({ videoData }: { videoData: any }) => {
const captions: sentence[] = videoData?.captionJson
  return (
    <Player
      component={RemotionComposition}
      durationInFrames={parseInt(captions[captions.length - 1].end.toFixed(0)) * 30}
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