"use client";

import React, { useState, useRef } from "react";
import { musicTracks } from "@/config/musicTracks";
import { AudioItem, FormState } from "../types";
import AudioList from './AudioList'; // New import

interface MusicPreviewSelectionProps {
  onHandleInputChange: (fieldName: keyof FormState, fieldValue: any) => void;
  errors: string[];
}

function MusicPreviewSelection({
  onHandleInputChange,
  errors,
}: MusicPreviewSelectionProps) {
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
    <div className="mt-5">
      <h2 className={`${errors.length > 0 && 'text-red-500'}`}>Background Music</h2>
      <AudioList<AudioItem>
          items={musicTracks}
          errors={errors}
          selectedItemId={selectedMusicTrackUrl}
          onSelectItem={handleTrackSelect}
          onPlayPause={handleTrackPlayPause}
          currentPlayingItemId={currentPlayingTrackUrl}
          getItemKey={(item) => item.url}
          getItemName={(item) => item.name}
      />
      {errors.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{errors[0]}</p>
      )}
      <audio ref={audioRef} onEnded={() => setCurrentPlayingTrackUrl(null)} />
    </div>
  );
}

export default MusicPreviewSelection;
