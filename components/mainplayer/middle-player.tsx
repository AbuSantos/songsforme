"use client";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useSetRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/song-atom";

interface Song {
    artiste: string;
    title: string;
    url: string;
    duration: string;
}

const MiddlePlayer: React.FC = () => {
    const { audioRef, isPlaying, currentTrackId, togglePlayPause, setTrack } = useAudioPlayer();
    const [songs, setSongs] = useState<Song[]>([]);
    const setIsPlaying = useSetRecoilState(isPlayingState)

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:4000/songs");
            const data = await response.json();
            setSongs(data);

            if (data.length > 0) {
                setTrack(0);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const playNextTrack = () => {
        if (songs.length > 0) {
            //@ts-ignore
            const nextTrackId = (currentTrackId + 1) % songs.length;
            setTrack(nextTrackId);
            setIsPlaying(true)
        }
    };

    const playPreviousTrack = () => {
        if (songs.length > 0) {
            //@ts-ignore

            const prevTrackId = (currentTrackId - 1 + songs.length) % songs.length;
            setTrack(prevTrackId);
            setIsPlaying(true)

        }
    };

    return (
        <div className="flex justify-center items-center space-x-6 text-xl cursor-pointer">
            {/* @ts-ignore */}
            <audio ref={audioRef} src={songs[currentTrackId]?.url || ""} />
            <FaStepBackward onClick={playPreviousTrack} />
            <Button variant="secondary" size="icon" className="rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <FaPause className="text-xl text-red-900" /> : <FaPlay className="text-xl text-red-900" />}
            </Button>
            <FaStepForward onClick={playNextTrack} />
        </div>
    );
};

export default MiddlePlayer;
