import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/song-atom";

export function useAudioPlayer() {
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    //@ts-ignore
    const [currentTrackId, setCurrentTrackId] = useRecoilState<number | null>(currentTrackIdState);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current && currentTrackId !== null) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackId]);

    const togglePlayPause = () => {
        if (audioRef.current && currentTrackId !== null) {
            setIsPlaying(!isPlaying);
        }
    };

    const setTrack = (trackId: number) => {
        setCurrentTrackId(trackId);
        setIsPlaying(true);
    };

    return {
        audioRef,
        isPlaying,
        currentTrackId,
        togglePlayPause,
        setTrack,
    };
}
