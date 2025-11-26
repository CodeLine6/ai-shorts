import MusicPreviewSelection from "./MusicPreviewSelection";
import { Music2, MicVocal } from "lucide-react";
import Volume from "@/components/Volume";

const Music = ({
  customizeVideo,
  volumeData,
}: {
  customizeVideo: (property: string, value: any) => void;
  volumeData: { backgroundMusic: number; voice: number } | undefined;
}) => {
  const volumes = volumeData
  const updateVolume = (type: "backgroundMusic" | "voice") => {
    
    return (value: number) => {
      customizeVideo("volume", {
        ...volumes,
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
        <Volume Icon={Music2} volume={volumes?.backgroundMusic} orientation="vertical" updateVolume={updateVolume("backgroundMusic")}  />
        <Volume Icon={MicVocal} volume={volumes?.voice} orientation="vertical" updateVolume={updateVolume("voice")} />
      </div>
    </div>
  );
};

export default Music;
