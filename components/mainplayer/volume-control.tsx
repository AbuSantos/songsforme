"use client"
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export const VolumeControl = () => {
    const [volume, setVolume] = useState(50)

    return (
        <div className='flex justify-center items-center space-x-2 cursor-pointer'>
            <div >
                <input
                    type="range"
                    className='w-72'
                    max={100}
                    min={0}
                    value={20}
                />
            </div>
            <SpeakerLoudIcon />
            <SpeakerOffIcon />
        </div >
    )
}

