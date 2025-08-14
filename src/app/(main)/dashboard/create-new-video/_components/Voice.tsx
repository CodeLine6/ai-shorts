import axios from 'axios'
import { useEffect, useState, useRef, useContext } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FlagIcon from 'react-flagkit';
import { UppyContext } from '@uppy/react';
import { FormState } from '../types';

type voice = {
    voiceId: string,
    name: string,
    previewUrl?: string,
    accent?: string,
    gender?: string,
    age?: string,
    use_case?: string
}
function Voice({ onHandleInputChange, errors }: { onHandleInputChange: (fieldName: keyof FormState, fieldValue: {name: string, voiceId: string} | undefined) => void, errors: any }) {
  const [voices, setVoices] = useState<voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {uppy} = useContext(UppyContext);

  const accentToCountryCode: { [key: string]: string } = {
    "american": "US",
    "british": "GB",
    "australian": "AU",
    "indian": "IN",
    "canadian": "CA",
    "irish": "IE",
    // Add more mappings as needed
  };

  useEffect(() => {
    axios.get('/api/get-voice-options').then((res) => {
      if (res.data.success) {
        setVoices(res.data.voices);
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handlePreviewClick = (e: React.MouseEvent, voice: voice) => {
    e.stopPropagation();

    if (!voice.previewUrl) return;

    if (playingVoiceId === voice.voiceId) {
      // Pause if already playing
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingVoiceId(null);
      }
    } else {
      // Play new voice
      if (audioRef.current) {
        audioRef.current.pause(); // Stop any currently playing audio
      }
      audioRef.current = new Audio(voice.previewUrl);
      audioRef.current.play();
      setPlayingVoiceId(voice.voiceId);

      audioRef.current.onended = () => {
        setPlayingVoiceId(null);
      };
    }
  };

  if(uppy && uppy.getFiles()?.length > 0) {
    return <></>
  }

  return (
    <div className='mt-5'>
      <h2 className={`${errors.length > 0 && 'text-red-500'}`}>Video Voice</h2>
      <p className='text-sm text-gray-400'>
        Select voice for your video
      </p>
      <ScrollArea className={`h-[200px] rounded-md border p-4 ${errors.length > 0 && 'border-red-500'}`}>
        <div className='grid grid-cols-2 gap-3 mt-2'>
          {voices?.map((item, index) => (
            <div
              className={`cursor-pointer p-3 dark:bg-slate-900 dark:border rounded-lg hover:border-white ${item.voiceId === selectedVoice ? 'border-white' : ''}`}
              key={index}
              onClick={() => {
                setSelectedVoice(item.voiceId);
                onHandleInputChange('voice', { voiceId: item.voiceId, name: item.name });
              }}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h2 className='font-semibold'>{item.name}</h2>
                  {item.accent && accentToCountryCode[item.accent] && (
                    <FlagIcon country={accentToCountryCode[item.accent]} size={16} className='mr-1' />
                )}
                </div>
                {item.previewUrl && (
                <Button
                  onClick={(e) => handlePreviewClick(e, item)}
                  variant="ghost"
                  size="icon"
                >
                  {playingVoiceId === item.voiceId ? (
                    <PauseCircle className="h-5 w-5 text-blue-400" />
                  ) : (
                    <PlayCircle className="h-5 w-5 text-blue-400" />
                  )}
                </Button>
              )}
              </div>              
            </div>
          ))}
        </div>
      </ScrollArea>
      {errors.length > 0 && (voices.length > 0 ? <p className='text-red-500 text-sm mt-2'>{errors}</p> : <p className='text-red-500 text-sm mt-2'>No Voice Available</p>)}
    </div>
  );
}

export default Voice
