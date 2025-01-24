"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { getNFTMetadata } from '@/actions/helper/get-metadata';
import { toast } from 'sonner';
import { endListening } from '@/actions/endListening';
import { startListening } from '@/actions/startListening';
import { AudioEngine } from '@/lib/audio-engine';
import { QualityManager } from '@/lib/audio-quality-manager';

type PlaylistIdTypes = {
    userId: string | undefined;
    playlistId?: string;
    nftId: string;
    nftContractAddress: string;
    tokenId: string;
};

export const Playlisten = ({ userId, nftId, playlistId, nftContractAddress, tokenId }: PlaylistIdTypes) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nftData, setNftData] = useState<any>();
    const [audioUrl, setAudioUrl] = useState<string>("");

    console.log("Play listen 2")

    // Audio System Refs
    const engine = useRef<AudioEngine>(new AudioEngine());
    // const tracker = useRef<PlaytimeTracker>(new PlaytimeTracker());
    const qualityManager = useRef<QualityManager>(new QualityManager());

    const formatIpfsUrl = (url: string) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await getNFTMetadata(nftContractAddress, tokenId);
                setNftData(response.raw.metadata);
                const formattedUrl = formatIpfsUrl(response.raw.metadata.animation_url);
                setAudioUrl(formattedUrl);
            } catch (error) {
                console.error("NFT Metadata error:", error);
                toast.error("Failed to load NFT audio");
            }
        };
        fetchMetadata();
    }, [nftContractAddress, tokenId]);

    useEffect(() => {
        if (!audioUrl) return;

        const initializeAudio = async () => {
            try {
                // Get optimal quality URL based on network
                const optimalUrl = await qualityManager.current.getOptimalURL(audioUrl);
                await engine.current.loadTrack(optimalUrl);

                // Set up quality switching
                qualityManager.current.initDynamicSwitching(engine.current, audioUrl);
            } catch (error) {
                console.error("Audio initialization failed:", error);
                toast.error("Error loading audio track");
            }
        };

        initializeAudio();

        return () => {
            engine.current.stop();
            // tracker.current.stop();
        };
    }, [audioUrl]);

    const handlePlayPause = async () => {
        if (!userId) {
            toast.error("Please log in to play music");
            return;
        }

        setIsLoading(true);
        try {
            if (isPlaying) {
                // Stop playback and tracking
                engine.current.stop();
                tracker.current.stop();
                await endListening(userId, playlistId);
            } else {
                // Start new session with audio metrics
                await engine.current.play();
                tracker.current.start();

                // Start reward tracking with additional metrics
                await startListening(userId, nftId, playlistId, {
                    bitrate: qualityManager.current.currentQuality,
                    playtime: tracker.current.getCurrentPlaytime(),
                    deviceType: navigator.userAgent
                });
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error("Playback error:", error);
            toast.error("Playback failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Reward validation system
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isPlaying) {
                const isValid = await engine.current.validatePlayback();
                if (!isValid) {
                    engine.current.stop();
                    // tracker.current.stop();
                    await endListening(userId, playlistId);
                    toast.warning("Playback paused - verification failed");
                    setIsPlaying(false);
                }
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div>
            {nftData ? (
                <Button
                    onClick={handlePlayPause}
                    disabled={!userId || isLoading}
                    className='bg-[var(--button-bg)] shadow-md'
                >
                    {isLoading ? (
                        <p>Hello</p>

                        // <Image src="/images/loader.svg" alt='loader' width={30} height={30} />
                    ) : isPlaying ? (
                        <PauseIcon />
                    ) : (
                        <PlayIcon />
                    )}
                </Button>
            ) : (
                <Button disabled className='bg-[var(--button-bg)] shadow-md'>
                    {/* <Image src="/images/loader.svg" alt='loader' width={30} height={30} /> */}
                </Button>
            )}
        </div>
    );
};

// Reusable icon components
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