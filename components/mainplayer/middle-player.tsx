"use client"
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '@/atoms/song-atom'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const MiddlePlayer = () => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(
        currentTrackIdState,
    )
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [songs, setSongs] = useState()

    const fetchData = async () => {
        const songs = await fetch("http://localhost:4000/songs")
        const data = await songs.json()
        setSongs(data)
        return data

    }

    useEffect(() => {
        fetchData()
    }, [])

    console.log(songs)


    const playing = () => {
        setIsPlaying(!isPlaying)
    }
    return (
        <div className='flex justify-center items-center space-x-6 text-xl cursor-pointer '>
            <audio src={songs?.url}>
                <source src={songs?.url} type="audio/ogg" />
                <source src={songs?.url} type="audio/mpeg" />
            </audio>
            <FaStepBackward />
            <Button variant="secondary" size="icon" className="rounded-full" onClick={playing}>
                {
                    isPlaying ? <FaPlay className="text-xl text-red-900" /> :
                        <FaPause className="text-xl text-red-900" />
                }
            </Button>
            <FaStepForward />
        </div>
    )
}

export default MiddlePlayer