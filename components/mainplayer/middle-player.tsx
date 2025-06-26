"use client";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentPlaybackState, currentTrackIdState } from "@/atoms/song-atom";
import { audioEngine } from "@/lib/audio-engine-singleton";
import { toast } from "sonner";
import { useEffect } from "react";
import { AudioEngine } from "@/lib/audio-engine";
import { ListedNFT } from "@/types";
import { getNextTrack } from "@/lib/utils";

const MiddlePlayer = ({ tracks }: ListedNFT[]) => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const currentTrackId = useRecoilValue(currentTrackIdState);

    // Initialize the playback state callback
    useEffect(() => {
        const updateState = (state: { isPlaying?: boolean }) => {
            setPlayback(prev => ({ ...prev, ...state }));
        };

        audioEngine.setPlaybackStateCallback(updateState);

        return () => {
            audioEngine.setPlaybackStateCallback(null);
        };
    }, [setPlayback]);

    const handleNext = async () => {
        try {
            const nextTrackId = getNextTrack(tracks, currentTrackId);

            console.log("Next Track ID:", nextTrackId);


            // if (playback.isPlaying) {
            //     audioEngine.stop();
            // }

            // //update the global state
            // setCurrentTrackId(nextTrackId);
            // setPlayback(prev => ({
            //     ...prev,
            //     trackId: nextTrackId,
            //     isPlaying: false
            // }));

            // // Load and play new track
            // const trackUrl = getUrl(nextTrackId);
            // await audioEngine.loadTrack(trackUrl);
            // await audioEngine.play();

            // // Update state to playing
            // setPlayback(prev => ({
            //     ...prev,
            //     isPlaying: true
            // }));

        } catch (error) {
            console.error('Track switch failed:', error);
            toast.error('Failed to play next track');

            // Reset state on error
            setPlayback(prev => ({
                ...prev,
                isPlaying: false,
                trackId: null
            }));



        }
    };

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
            <FaStepForward onClick={handleNext} />
            {currentTrackId && (
                <span className="text-sm ml-4">Now Playing: {currentTrackId}</span>
            )}
        </div>
    );
};

export default MiddlePlayer;