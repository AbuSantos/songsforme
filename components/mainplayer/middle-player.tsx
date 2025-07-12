"use client";

import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentPlaybackState, currentTrackIdState } from "@/atoms/song-atom";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { getNextTrack } from "@/lib/utils";
import { AudioEngine } from "@/lib/audio-engine";
import { getAudioEngineInstance } from "@/lib/audio-engine-singleton";
import { CacheManager } from '@/lib/cache-manager';
import { getNFTMetadata } from "@/actions/helper/get-metadata";
import { isPlayingState } from "@/atoms/song-atom";
import { ListedNFT } from "@/types";

const MiddlePlayer = ({ tracks }: { tracks: ListedNFT[] }) => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const currentTrackId = useRecoilValue(currentTrackIdState);
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
    const engineRef = useRef<AudioEngine | null>(null);
    const isPlaying = useRecoilValue(isPlayingState);

    const formatIpfsUrl = (url: string) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

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
                //@ts-ignore
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [setPlayback]);

    const fetchMetadata = async (trackId: string) => {
        try {
            if (!currentTrackId) return;
            const nftContractAddress = tracks.find(t => t.id === trackId)?.contractAddress;
            const tokenId = tracks.find(t => t.id === trackId)?.tokenId;

            const cacheKey = `nft-metadata-${nftContractAddress}-${tokenId}`;
            const cachedData = CacheManager.get(cacheKey) as { animation_url: string };

            if (cachedData) {
                const formattedUrl = formatIpfsUrl(cachedData.animation_url);
                return (formattedUrl);
            }

            const response = await getNFTMetadata(nftContractAddress as string, tokenId as string);
            const metadata = response.raw.metadata;
            CacheManager.set(cacheKey, metadata);
            const formattedUrl = formatIpfsUrl(metadata.animation_url);
            return formattedUrl;
            // setAudioUrl(formattedUrl);
        } catch (error) {
            console.error("NFT Metadata error:", error);
            toast.error("Failed to load NFT audio");
        }
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
            const nextTrackId = currentTrackId ? getNextTrack(tracks, currentTrackId) : tracks[0]?.id;

            if (!nextTrackId) {
                toast.warning("No tracks available");
                return;
            }

            // Stop current playback if any
            if (playback.isPlaying) {
                engineRef.current.stop();
            }

            // Update the global state
            //@ts-ignore
            setCurrentTrackId(nextTrackId);
            setPlayback({
                trackId: nextTrackId,
                isPlaying: false
            });

            // Load and play new track
            // const trackUrl = getUrl(nextTrackId);
            const trackUrl = await fetchMetadata(nextTrackId);
            if (!trackUrl) {
                throw new Error("Track URL not found");
            }

            await engineRef.current.loadTrack(trackUrl, (currentTrackId ?? "") as string);
            engineRef.current.play();

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

            if (isPlaying) {
                engineRef.current.pause();
                // setPlayback({ trackId: null, isPlaying: false });

            } else {
                if (!engineRef.current.isTrackLoaded()) {
                    const trackUrl = await fetchMetadata(currentTrackId);
                    await engineRef.current.loadTrack(trackUrl as string, currentTrackId);
                }
                engineRef.current.play();
                // setPlayback({ trackId: currentTrackId, isPlaying: true });

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
                {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={!tracks?.length}
            >
                <FaStepForward />
            </Button>
        </div>
    );
};

export default MiddlePlayer;