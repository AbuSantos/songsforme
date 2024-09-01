"use client"
import { FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '@/atoms/song-atom'
import { Button } from "@/components/ui/button";

const MiddlePlayer = () => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(
        currentTrackIdState,
    )
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playing = () => {

        setIsPlaying(!isPlaying)
    }
    return (
        <div className='flex justify-center items-center space-x-6 text-xl cursor-pointer '>
            <FaStepBackward />
            <Button variant="secondary" size="icon" className="rounded-full" onClick={playing}>
                <FaPlay />
            </Button>
            <FaStepForward />
        </div>
    )
}

export default MiddlePlayer