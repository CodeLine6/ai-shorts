import axios from 'axios'
import { useEffect, useState, useRef, useContext } from 'react'
import { UppyContext } from '@uppy/react';
import { FormState } from '../types';
import AudioList from './AudioList'; // New import
import { AudioItem } from '../types'; // New import

export type voice = AudioItem & {
  voiceId: string, // Keep voiceId for API interaction if needed, but AudioItem's id will be used for the list
  accent?: string,
  gender?: string,
  age?: string,
  use_case?: string
}

export const accentToCountryCode: { [key: string]: string } = {
  "american": "US",
  "british": "GB",
  "australian": "AU",
  "indian": "IN",
  "canadian": "CA",
  "irish": "IE",
  // Add more mappings as needed
};

function Voice({ onHandleInputChange, errors }: { onHandleInputChange: (fieldName: keyof FormState, fieldValue: { name: string, voiceId: string } | undefined) => void, errors: any }) {
  const [voices, setVoices] = useState<voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null); // Renamed from selectedVoice
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { uppy } = useContext(UppyContext);

  useEffect(() => {
    axios.get('/api/get-voice-options').then((res) => {
      if (res.data.success) {
        const voices = res.data.voices
        setVoices(voices);
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleVoiceSelect = (item: voice) => {
    setSelectedVoiceId(item.voiceId);
    onHandleInputChange('voice', { voiceId: item.voiceId, name: item.name });
  };

  const handleVoicePlayPause = (item: voice) => {
    if (!item.url) return;

    if (playingVoiceId === item.voiceId) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingVoiceId(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(item.url);
      audioRef.current.play();
      setPlayingVoiceId(item.voiceId);

      audioRef.current.onended = () => {
        setPlayingVoiceId(null);
      };
    }
  };

  if (uppy && uppy.getFiles()?.length > 0) {
    return <></>
  }

  return (
    <div className='mt-5'>
      <h2 className={`${errors.length > 0 && 'text-red-500'}`}>Video Voice</h2>
      <p className='text-sm text-gray-400'>
        Select voice for your video
      </p>
      <AudioList<voice> 
        variant='compact'
        items={voices}
        errors={errors}
        selectedItemId={selectedVoiceId}
        onSelectItem={handleVoiceSelect}
        onPlayPause={handleVoicePlayPause}
        currentPlayingItemId={playingVoiceId}
        showFlag={true}
        getItemKey={(item) => item.voiceId}
        getItemName={(item) => item.name}
        getItemAccent={(item) => item.accent}
        renderItemDetails={(item) => (
          <>
            {item.use_case && (
              <h2 className='text-sm text-gray-400'>Use Case: {item.use_case.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</h2>
            )}
            {item.age && (
              <h2 className='text-sm text-gray-400'>Age: {item.age.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}</h2>
            )}
          </>
        )}
      />
      {errors.length > 0 && (voices.length > 0 ? <p className='text-red-500 text-sm mt-2'>{errors}</p> : <p className='text-red-500 text-sm mt-2'>No Voice Available</p>)}
    </div>
  );
}

export default Voice
