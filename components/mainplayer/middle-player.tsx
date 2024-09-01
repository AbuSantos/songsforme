"use client";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

interface Song {
    artiste: string;
    title: string;
    url: string;
    duration: string;
}

const MiddlePlayer: React.FC = () => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [songs, setSongs] = useState<Song[]>([]); // Use Song[] to indicate it's an array of Song objects
    const audioRef = useRef<HTMLAudioElement | null>(null); // Ref type set to HTMLAudioElement

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:4000/songs");
            const data = await response.json();
            setSongs(data);

            // Set initial track to the first song if available
            if (data.length > 0) {
                setCurrentTrackId(0)
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackId]);


    const togglePlayPause = () => {
        if (songs.length > 0 && currentTrackId !== null) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNextTrack = () => {
        if (songs.length > 0) {
            const nextTrackId = (currentTrackId + 1) % songs.length;
            setCurrentTrackId(nextTrackId);
            setIsPlaying(true);
        }
    };

    const playPreviousTrack = () => {
        if (songs.length > 0) {
            const prevTrackId = (currentTrackId - 1 + songs.length) % songs.length;
            setCurrentTrackId(prevTrackId);
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex justify-center items-center space-x-6 text-xl cursor-pointer">
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
