"use client";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentPlaybackState, currentTrackIdState } from "@/atoms/song-atom";
import { audioEngine } from "@/lib/audio-engine-singleton";
import { toast } from "sonner";
import { useEffect } from "react";

const MiddlePlayer = () => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const currentTrackId = useRecoilValue(currentTrackIdState);

    // Initialize the playback state callback
    useEffect(() => {
        const updateState = (state: { isPlaying?: boolean }) => {
            setPlayback(prev => ({ ...prev, ...state }));
        };

        audioEngine.setPlaybackStateCallback(updateState);

        return () => {
            audioEngine.setPlaybackStateCallback(null); // Cleanup
        };
    }, [setPlayback]);

    const togglePlayPause = async () => {
        if (!currentTrackId) {
            toast.warning("No track selected");
            return;
        }

        try {
            if (playback.isPlaying) {
                await audioEngine.pause();
            } else {
                // Ensure the track is loaded before playing
                if (!audioEngine.isTrackLoaded()) {
                    toast.warning("Track is still loading");
                    return;
                }
                await audioEngine.play();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Playback failed");
        }
    };

    return (
        <div className="flex justify-center items-center space-x-6 text-xl cursor-pointer">
            <FaStepBackward />
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                disabled={!currentTrackId}
            >
                {playback.isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <FaStepForward />
            {currentTrackId && (
                <span className="text-sm ml-4">Now Playing: {currentTrackId}</span>
            )}
        </div>
    );
};

export default MiddlePlayer;