import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'

export const VolumeControl = () => {
    return (
        <div className='flex justify-center items-center space-x-2 cursor-pointer'>
            <SpeakerLoudIcon />
            <SpeakerOffIcon />
        </div>
    )
}

