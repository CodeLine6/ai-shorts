import Image from 'next/image'
import React from 'react'
import { videoStyles } from './VideoStyle'
import { captionOptions } from './Captions'

function Preview({formData}:any) {
  const selectedVideoStyle = formData && videoStyles.find(item => item.name === formData.videoStyle)
  const selectedCaptionStyle = formData && captionOptions.find(item => item.name === formData.captionStyle?.name)
  return (
    <div className='relative'>
        <h2 className='mb-3 text-2xl'>Preview</h2>
        {selectedVideoStyle && <Image
            className='w-full h-[70vh] object-cover rounded-xl' 
            src={selectedVideoStyle?.image} 
            alt={selectedVideoStyle?.name} 
            width={500} height={500} 
        />}
        <h2 className={`${selectedCaptionStyle?.style} absolute bottom-1 text-center w-full text-3xl`} >
            {formData?.captionStyle?.name}
        </h2>
    </div>
  )
}

export default Preview