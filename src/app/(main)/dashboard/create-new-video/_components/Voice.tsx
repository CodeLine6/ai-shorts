import axios from 'axios'
import { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

type voice = {
    voiceId: string,
    name: string
}
function Voice({onHandleInputChange, formData} : {onHandleInputChange : (fieldName : string, fieldValue : {}) => void, formData : any}) {
  const [voices, setVoices] = useState<voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>(() => formData.voice?.name || '');
  
  useEffect (() => {
    axios.get('/api/get-voice-options').then((res) => {
      if(res.data.success)
      setVoices(res.data.voices)
    })
  }, [])

  return (
    <div className='mt-5'>
        <h2>Video Voice</h2>
        <p className='text-sm text-gray-400'>
            Select voice for your video
        </p>
        <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className='grid grid-cols-2 gap-3 mt-2'>
            {voices?.map((item, index) => (
                <h2 
                className={`cursor-pointer p-3 dark:bg-slate-900 dark:border rounded-lg hover:border-white ${item.name === selectedVoice && 'border-white'}`} 
                key={index}
                onClick={() => {
                    setSelectedVoice(item.name)
                    onHandleInputChange('voice', {voiceId: item.voiceId, name: item.name})}
                }>
                    {item.name}
                </h2>
            ))}
        </div>
        </ScrollArea>
    </div>
  )
}

export default Voice