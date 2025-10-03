"use client";

import React, { useState, useRef } from "react";
import { musicTracks } from "@/config/musicTracks";
import { AudioItem } from "@/app/(main)/(default)/create-new-video/types";
import AudioList from '@/app/(main)/(default)/create-new-video/_components/AudioList'; // New import


function MusicPreviewSelection({
  onHandleInputChange,
  className = "",
}: {
  onHandleInputChange: (fieldName: string, fieldValue: any) => void;
  className?: string
}) {
  const [currentPlayingTrackUrl, setCurrentPlayingTrackUrl] = useState<string | null>(null);
  
  const [selectedMusicTrackUrl, setSelectedMusicTrackUrl] = useState<string | null>(null); // Renamed from selectedMusicTrackName
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTrackSelect = (item: AudioItem) => {
      setSelectedMusicTrackUrl(item.url);
      onHandleInputChange("musicTrack", {url:item.url, name: item.name});
  };

  const handleTrackPlayPause = (item: AudioItem) => {
      if (audioRef.current) {
          if (currentPlayingTrackUrl === item.url) {
              audioRef.current.pause();
              setCurrentPlayingTrackUrl(null);
          } else {
              if (audioRef.current) {
                  audioRef.current.pause();
              }
              audioRef.current = new Audio(item.url);
              audioRef.current.play();
              setCurrentPlayingTrackUrl(item.url);
              setSelectedMusicTrackUrl(item.url); // Also select the track when playing
              onHandleInputChange("musicTrack", item); // Select the track when it starts playing
          }
      }
  };

  return (
    <div className={className}>
      
      <AudioList<AudioItem>
          items={musicTracks}
          errors={[]}
          selectedItemId={selectedMusicTrackUrl}
          onSelectItem={handleTrackSelect}
          onPlayPause={handleTrackPlayPause}
          currentPlayingItemId={currentPlayingTrackUrl}
          getItemKey={(item) => item.url}
          getItemName={(item) => item.name}
      />
      
      <audio ref={audioRef} onEnded={() => setCurrentPlayingTrackUrl(null)} />
    </div>
  );
}

export default MusicPreviewSelection;
