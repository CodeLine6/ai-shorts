import { cx } from 'class-variance-authority';
import React, { useState } from 'react'

export const captionOptions = [{
    name: 'Youtuber',
    style: 'text-yellow-400 text-3xl font-semibold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg',
    },
    {
        name: 'Supreme',
        style: 'text-white text-3xl font-bold italic drop-shadow-lg px-3 py-1 rounded-lg',
    }, 
    {
        name : 'Neon',
        style : 'text-green-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
    },
    {
        name : 'Glitch',
        style: 'text-pink-300 text-3xl font-extrabold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg'
    },
    {
        name : 'Fire',
        style : 'text-red-500 text-3xl font-extrabold uppercase px-3 py-1 rounded-lg'
    },
    {
        name : 'Futuristic',
        style: 'text-blue-500 text-3xl font-semibold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
    }]
function Captions({onHandleInputChange, formData} : {onHandleInputChange : (fieldName : string, fieldValue : {name : string, style : string}) => void, formData : any}) {
  const [selectedStyle, setSelectedStyle] = useState<string>(() => formData.captionStyle?.name || '');
  return (
    <div className='mt-5'>
        <h2>Caption Style</h2>
        <p className='text-sm text-gray-400'>Select Caption Style</p>

        <div className='flex flex-wrap gap-4 mt-2'>
            {captionOptions.map((item, index) => (
                <div key={index} 
                  className={cx('cursor-pointer p-1 dark:bg-slate-900 dark:border rounded-lg hover:border-white', item.name === selectedStyle && 'border-white')} 
                  onClick={() => {
                    onHandleInputChange('captionStyle', item)
                    setSelectedStyle(item.name)
                  }}>
                    <h2 className={item.style}>{item.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Captions