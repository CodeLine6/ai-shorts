"use client"
import RemotionComposition from "@/app/_components/RemotionComposition";
import { Player } from "@remotion/player";
import { useState } from "react";

const RemotionPlayer = ({ videoData }: { videoData: any }) => {

  return (
    <Player
      component={RemotionComposition}
      durationInFrames={parseInt((videoData.captionJson[videoData.captionJson.length - 1].end).toFixed(0)) * 30}
      compositionWidth={720}
      compositionHeight={1280}
      fps={30}
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