import { FormState } from '../types';
import { cx } from 'class-variance-authority';
import React, { useState } from 'react'

export const captionOptions = [{
    name: 'Youtuber',
    style: 'text-yellow-400 font-semibold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg',
    },
    {
        name: 'Supreme',
        style: 'text-white font-bold italic drop-shadow-lg px-3 py-1 rounded-lg',
    }, 
    {
        name : 'Neon',
        style : 'text-green-500 font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
    },
    {
        name : 'Glitch',
        style: 'text-pink-300 font-extrabold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg'
    },
    {
        name : 'Fire',
        style : 'text-red-500 font-extrabold uppercase px-3 py-1 rounded-lg'
    },
    {
        name : 'Futuristic',
        style: 'text-blue-500 font-semibold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
    }]
function Captions({onHandleInputChange, errors} : {onHandleInputChange : (fieldName : keyof FormState, fieldValue : {name : string, style : string}) => void, errors : any}) {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  return (
    <div className='mt-5'>
        <h2 className={`${ errors.length > 0 && 'text-red-500'}`}>Caption Style</h2>
        <p className='text-sm text-gray-400'>Select Caption Style</p>

        <div className='flex flex-wrap gap-4 mt-2'>
            {captionOptions.map((item, index) => (
                <div key={index} 
                  className={cx('cursor-pointer p-1 dark:bg-slate-900 dark:border rounded-lg hover:border-white', item.name === selectedStyle && 'border-white', errors.length > 0 && 'border-red-500')} 
                  onClick={() => {
                    onHandleInputChange('captionStyle', item)
                    setSelectedStyle(item.name)
                  }}>
                    <h2 className={`${item.style} text-3xl`}>{item.name}</h2>
                </div>
            ))}
        </div>
        {errors.length > 0 && errors.map((error, index) => <p key={index} className='text-red-500 text-sm mt-2'>{error}</p>)}
    </div>
  )
}

export default Captions