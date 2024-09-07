"use client"
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { useEffect, useState } from 'react';

interface Song {
    artist: string;
    title: string;
    url: string;
    duration: string;
    cover: string
}

const PlayerDetails = () => {
    const currentTrackId = useRecoilValue(currentTrackIdState)

    console.log(currentTrackId, "Player details")
    const [songs, setSongs] = useState<Song[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:4000/songs");
            const data = await response.json();
            setSongs(data);

        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const currentSong = currentTrackId !== null ? songs[currentTrackId] : null;
    return (
        <div className='flex space-x-2 justify-center items-center cursor-pointer'>
            {currentSong ? (
                <>
                    <Image
                        src={currentSong.cover}
                        alt={currentSong.title}
                        width={40}
                        height={30}
                        className="rounded-md"
                    />
                    <div className='flex flex-col capitalize'>
                        <small>{currentSong.title}</small>
                        <small className="text-xs text-muted-foreground ">{currentSong.artist}</small>
                    </div>
                </>
            ) : (
                <div>No song selected</div>
            )}
        </div>
    );
}

export default PlayerDetails