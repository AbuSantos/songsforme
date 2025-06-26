"use client";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentPlaybackState, currentTrackIdState } from "@/atoms/song-atom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { getNextTrack } from "@/lib/utils";
import { ListedNFT } from "@/types";
import { AudioEngine } from "@/lib/audio-engine";
import { getAudioEngineInstance } from "@/lib/audio-engine-singleton";

const MiddlePlayer = ({ tracks }: { tracks: ListedNFT[] }) => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const currentTrackId = useRecoilValue(currentTrackIdState);
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
    const engineRef = useRef<AudioEngine | null>(null);

    console.log("MiddlePlayer tracks:", tracks);

    // Initialize the playback state callback
    useEffect(() => {
        engineRef.current = getAudioEngineInstance();
        const updateState = (state: { isPlaying?: boolean; trackId?: string }) => {
            setPlayback(prev => ({ ...prev, ...state }));
        };

        if (engineRef.current) {
            engineRef.current.setPlaybackStateCallback(updateState);
        }

        return () => {
            if (engineRef.current) {
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [setPlayback]);


    const getUrl = (trackId: string | null) => {
        if (!trackId) return '';
        const track = tracks.find(t => t.id === trackId);
        return track?.audioUrl || '';
    };


    const handleNext = async () => {
        try {
            if (typeof window === "undefined") return;
            if (!engineRef.current) {
                engineRef.current = getAudioEngineInstance();
            }

            if (!engineRef.current) {
                toast.error("Audio engine not available");
                return;
            }
            if (!tracks.length) {
                toast.warning("No tracks available");
                return;
            }

            // If no current track, start with first track
            const nextTrackId = currentTrackId
                ? getNextTrack(tracks, currentTrackId)
                : tracks[0]?.id;

            console.log("Next track ID:", nextTrackId);

            if (!nextTrackId) {
                toast.warning("No tracks available");
                return;
            }

            console.log("Switching from", currentTrackId, "to", nextTrackId);

            // Stop current playback if any
            if (playback.isPlaying) {
                engineRef.current.stop();
            }

            // Update the global state
            setCurrentTrackId(nextTrackId);
            setPlayback({
                trackId: nextTrackId,
                isPlaying: false
            });

            // Load and play new track
            const trackUrl = getUrl(nextTrackId);
            if (!trackUrl) {
                throw new Error("Track URL not found");
            }

            console.log("Loading track URL:", trackUrl);

            await engineRef.current.loadTrack(trackUrl);
            await engineRef.current.play();

            // Update state to playing
            setPlayback(prev => ({
                ...prev,
                isPlaying: true
            }));

        } catch (error) {
            console.error('Track switch failed:', error);
            toast.error('Failed to play next track');
            setPlayback(prev => ({
                ...prev,
                isPlaying: false
            }));
        }
    };

    const togglePlayPause = async () => {
        // If no track selected but we have tracks, play first track
        try {
            if (typeof window === "undefined") return;
            if (!engineRef.current) {
                engineRef.current = getAudioEngineInstance();
            }
            if (!engineRef.current) {
                toast.error("Audio engine not available");
                return;
            }

            if (!currentTrackId && tracks.length) {
                await handleNext();
                return;
            }

            if (!currentTrackId) {
                toast.warning("No track selected");
                return;
            }

            if (playback.isPlaying) {
                await engineRef.current.pause();
            } else {
                if (!engineRef.current.isTrackLoaded()) {
                    const trackUrl = getUrl(currentTrackId);
                    await engineRef.current.loadTrack(trackUrl);
                }
                await engineRef.current.play();
            }

        } catch (error) {
            console.error("Playback toggle error:", error);
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
                disabled={!tracks?.length}
            >
                {playback.isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={!tracks?.length}
            >
                <FaStepForward />
            </Button>
            {currentTrackId && (
                <span className="text-sm ml-4">
                    {tracks.find(t => t.id === currentTrackId)?.Single?.song_name || "Now Playing"}
                </span>
            )}
        </div>
    );
};

export default MiddlePlayer;