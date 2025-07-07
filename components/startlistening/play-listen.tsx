"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { getNFTMetadata } from '@/actions/helper/get-metadata';
import { toast } from 'sonner';
import { endListening } from '@/actions/endListening';
import { startListening } from '@/actions/startListening';
// import { audioEngine } from "@/lib/audio-engine-singleton";
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentPlaybackState, isPlayingState } from '@/atoms/song-atom';
import { QualityManager } from '@/lib/audio-quality-manager';
import { CacheManager } from '@/lib/cache-manager';
import { AudioEngine } from '@/lib/audio-engine';
import { getAudioEngineInstance } from '@/lib/audio-engine-singleton';




type PlaylistIdTypes = {
    userId: string | undefined;
    playlistId?: string;
    nftId: string;
    nftContractAddress: string;
    tokenId: string;
};

export const Playlisten = ({ userId, nftId, playlistId, nftContractAddress, tokenId }: PlaylistIdTypes) => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string>("");
    const engineRef = useRef<AudioEngine | null>(null);
    const qualityManager = useRef<QualityManager>(new QualityManager());

    console.log("Playlisten component initialized with:", playlistId);

    const isPlaying = playback.trackId === nftId && playback.isPlaying;

    const formatIpfsUrl = (url: string) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

    // Initialize audio engine callbacks
    useEffect(() => {
        const updatePlaybackState = (state: { isPlaying: boolean, trackId?: string }) => {
            setPlayback(prev => ({
                ...prev,
                ...state,
                trackId: state.trackId || prev.trackId
            }));
        };

        if (typeof window === "undefined") return;

        engineRef.current = getAudioEngineInstance();

        if (engineRef.current) {
            engineRef.current.setPlaybackStateCallback(updatePlaybackState);
        }

        return () => {
            if (engineRef.current) {
                //@ts-ignore
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [setPlayback]);

    // Fetch NFT metadata
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const cacheKey = `nft-metadata-${nftContractAddress}-${tokenId}`;
                const cachedData = CacheManager.get(cacheKey) as { animation_url: string };

                if (cachedData) {
                    const formattedUrl = formatIpfsUrl(cachedData.animation_url);
                    setAudioUrl(formattedUrl);
                    return;
                }

                const response = await getNFTMetadata(nftContractAddress, tokenId);
                const metadata = response.raw.metadata;
                CacheManager.set(cacheKey, metadata);
                const formattedUrl = formatIpfsUrl(metadata.animation_url);
                setAudioUrl(formattedUrl);
            } catch (error) {
                console.error("NFT Metadata error:", error);
                toast.error("Failed to load NFT audio");
            }
        };
        fetchMetadata();
    }, [nftContractAddress, tokenId]);

    // Initialize audio when URL changes
    useEffect(() => {
        if (!audioUrl) return;
        if (typeof window === "undefined") return;
        engineRef.current = getAudioEngineInstance();

        const initializeAudio = async () => {
            try {
                const optimalUrl = await qualityManager.current.getOptimalURL(audioUrl);
                if (engineRef.current) {
                    await engineRef.current.loadTrack(optimalUrl, nftId);
                    qualityManager.current.initDynamicSwitching(engineRef.current, audioUrl, nftId);
                }
            } catch (error) {
                console.error("Audio initialization failed:", error);
                toast.error("Error loading audio track");
            }
        };

        initializeAudio();

        return () => {
            if (engineRef.current) {
                //@ts-ignore
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [audioUrl]);

    // Playback validation
    useEffect(() => {
        if (typeof window === "undefined") return;
        const interval = setInterval(async () => {
            const engine = getAudioEngineInstance();
            if (!engine) return;

            if (isPlaying) {
                const isValid = await engine.validatePlayback();
                if (!isValid) {
                    engine.stop();
                    await endListening(userId, playlistId);
                    toast.warning("Playback paused - verification failed");
                }
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [isPlaying, userId, playlistId]);

    const handlePlayPause = async () => {
        if (!userId) {
            toast.error("Please log in to play music");
            return;
        }

        setIsLoading(true);
        try {
            // Ensure singleton instance
            if (typeof window === "undefined") return;
            if (!engineRef.current) {
                engineRef.current = getAudioEngineInstance();
            }

            if (!engineRef.current) {
                toast.error("Audio engine not available");
                return;
            }

            if (isPlaying) {
                engineRef.current.pause();
                await endListening(userId, playlistId);
                setPlayback({ trackId: null, isPlaying: false });
            } else {

                // Stop any currently playing track first
                if (isPlaying) {
                    engineRef.current.stop();
                    await endListening(userId, playlistId);
                    setPlayback({ trackId: null, isPlaying: false });
                }

                // Ensure track is loaded before playing
                if (!engineRef.current.isTrackLoaded() || playback.trackId !== nftId) {
                    await engineRef.current.loadTrack(audioUrl, nftId);
                }

                engineRef.current.play();
                await startListening(userId, nftId, playlistId);
                setPlayback({ trackId: nftId, isPlaying: true });
            }
        } catch (error) {
            console.error("Playback error:", error);
            toast.error(error instanceof Error ? error.message : "Playback failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handlePlayPause}
                disabled={!userId || isLoading}
                className='bg-[var(--button-bg)] shadow-md border-[1px] border-[#2A2A2A] hover:bg-[var(--button-bg-hover)]'
            >
                {isLoading ? (
                    <Image src="/images/loaderrr.svg" alt='loader' width={30} height={30} />
                ) : isPlaying ? (
                    <PauseIcon />
                ) : (
                    <PlayIcon />
                )}
            </Button>
        </div>
    );
};

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#EDEEF0" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#EDEEF0" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
);