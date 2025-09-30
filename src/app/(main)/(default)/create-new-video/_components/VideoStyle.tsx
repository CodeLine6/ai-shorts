import { FormState } from '../types';
import Image from 'next/image'
import React, { useState } from 'react'

export const videoStyles = [
    {
        name: 'Realistic',
        image : '/realistic.png'
    },
    {
        name: 'Cinematic',
        image : '/cinematic.png'
    },
    {
        name: '3D Pixar',
        image : '/3d.png'
    },
    {
        name: 'Watercolor',
        image : '/watercolor.png'
    },
    {
        name : 'Cyberpunk',
        image : '/cyberpunk.png'
    },
    {
        name: 'GTA',
        image : '/gta.png'
    },
    {
        name:'Anime',
        image : '/anim.png'
    }
]

function VideoStyle({onHandleInputChange,errors} : {onHandleInputChange : (fieldName : keyof FormState, fieldValue : string) => void, errors : any[]}) {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  return (
    <div className={`mt-5`}>
        <h2 className={`${ errors.length > 0 && 'text-red-500'}`}>Video Style</h2>
        <p className='text-sm text-gray-400 mb-1'>
            Select Video Style
        </p>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 '>
            {videoStyles?.map((item, index) => (
                <div key={index} className='relative'>
                    <Image src={item.image} 
                    className={`object-cover h-[70px] lg:h-[90px] xl:h-[180px] rounded-lg p-1 hover:border border-gray-300 cursor-pointer ${selectedStyle === item.name && 'border border-primary'} ${errors.length > 0 && 'border border-red-500'}`}
                    alt={item.name} 
                    width={500} 
                    height={120} 
                    onClick={() => {
                        onHandleInputChange('videoStyle', item.name)
                        setSelectedStyle(item.name)
                    }}/>
                    <h2 className='absolute bottom-1 text-center w-full'>{item.name}</h2>
                </div>
            ))}
        </div>
        {errors.length > 0 && errors.map((error, index) => <p key={index} className='text-red-500 text-sm mt-2'>{error}</p>)}
    </div>
  )
}

export default VideoStyle