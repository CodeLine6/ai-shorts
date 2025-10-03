"use client";
import React, {useState} from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useParams } from "next/navigation";
import RemotionPlayer from "../(customizer)/_components/RemotionPlayer";
import CutstomizerPanel from "../(customizer)/CutstomizerPanel";
import CustomizerHeader from "../(customizer)/_components/CustomizerHeader";
import { VideoData } from "@/../convex/schema";

const PlayVideo = () => {
  const { videoId } : { videoId: string }  = useParams();
  const [activeTab, setActiveTab] = useState('motion');
  const videoData = useQuery(api.videoData.GetVideoRecord, { recordId: videoId}) as VideoData | string;
  
  if (typeof videoData === "string") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-2xl">{videoData}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
          <CustomizerHeader videoData={videoData} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="w-full md:w-3/4 mx-auto py-4 flex-grow grid place-content-center grid-cols-1 md:grid-cols-2 gap-4">
              <CutstomizerPanel videoData={videoData} activeTab={activeTab} />
              <RemotionPlayer videoData={videoData} className="rounded-md  w-full aspect-[9/16] !h-auto md:mx-auto md:!w-[48%]" />
          </div>
    </div>
  );
};

export default PlayVideo;
