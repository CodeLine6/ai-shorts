import axios from 'axios'
import { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { FormState } from '../page'

type voice = {
    voiceId: string,
    name: string
}
function Voice({onHandleInputChange, errors} : {onHandleInputChange : (fieldName : keyof FormState, fieldValue : {}) => void, errors : any}) {
  const [voices, setVoices] = useState<voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>();
  
  useEffect (() => {
    axios.get('/api/get-voice-options').then((res) => {
      if(res.data.success)
      setVoices(res.data.voices)
    })
  }, [])

  return (
    <div className='mt-5'>
        <h2 className={`${ errors.length > 0 && 'text-red-500'}`}>Video Voice</h2>
        <p className='text-sm text-gray-400'>
            Select voice for your video
        </p>
        <ScrollArea className={`h-[200px] rounded-md border p-4 ${ errors.length > 0 && 'border-red-500'}`}>
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
        {errors.length > 0 && (voices.length > 0 ? <p className='text-red-500 text-sm mt-2'>{errors}</p> : <p className='text-red-500 text-sm mt-2'>No Voice Available</p>)}
    </div>
  )
}

export default Voice