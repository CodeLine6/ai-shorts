import MusicPreviewSelection from "./MusicPreviewSelection"

const Music = ({customizeVideo, effectsData} : {customizeVideo: (property: string,value: any) => void, effectsData: any}) => {
  return (
    <MusicPreviewSelection
      onHandleInputChange={customizeVideo}
    />
  )
}

export default Music