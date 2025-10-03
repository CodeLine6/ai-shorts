import MusicPreviewSelection from "./MusicPreviewSelection";
import { Music2, MicVocal } from "lucide-react";
import Volume from "@/components/Volume";

const Music = ({
  customizeVideo,
  effectsData,
}: {
  customizeVideo: (property: string, value: any) => void;
  effectsData: any;
}) => {
  const updateVolume = (type: "backgroundMusic" | "voice") => {
    const volume = effectsData.volume;
    return (value: number) => {
      customizeVideo("volume", {
        ...volume,
        [type]: value,
      });
    }
  }
  return (
    <div className="flex flex-col h-full">
      <MusicPreviewSelection
        onHandleInputChange={customizeVideo}
        className="flex-grow"
      />
      <div className="flex pt-5 gap-2">
        <Volume Icon={Music2} volume={effectsData.volume.backgroundMusic} orientation="vertical" updateVolume={updateVolume("backgroundMusic")}  />
        <Volume Icon={MicVocal} volume={effectsData.volume.voice} orientation="vertical" updateVolume={updateVolume("voice")} />
      </div>
    </div>
  );
};

export default Music;
