"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { startListening } from '@/actions/startListening';
import { endListening } from '@/actions/endListening';
import Image from 'next/image';
import { getNFTMetadata } from '@/actions/helper/get-metadata';
import { toast } from 'sonner';

type PlaylistIdTypes = {
    userId: string | undefined;
    playlistId?: string;
    nftId: string;
    nftContractAddress: string
    tokenId: string
};
type NFTTypes = {
    image: string
    animation_url: string
    tokenId: string
}

export const Playlisten = ({ userId, nftId, playlistId, nftContractAddress, tokenId }: PlaylistIdTypes) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [nftData, setNftData] = useState<any>()

    console.log(nftContractAddress, "from tracktable")
    const formatIpfsUrl = (url: string) => {
        return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    };
    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const response = await getNFTMetadata(
                    nftContractAddress,
                    tokenId
                );
                setNftData(response.raw.metadata)
                console.log("NFT Metadata:\n", response);
            } catch (error) {
                console.log(error)
                toast.error("Failed to load NFT data.");
            }
        }

        fetchMetaData()

    }, [userId]) //USE THE ADDRESS

    console.log(nftData?.animation_url)

    // Initialize audio element with the NFT's audio URL
    useEffect(() => {
        if (nftData?.animation_url) {
            const formattedUrl = formatIpfsUrl(nftData.animation_url);

            audioRef.current = new Audio(formattedUrl);
            const handleEnded = async () => {
                setIsPlaying(false);
                await endListening(userId, playlistId);
            };
            audioRef.current.addEventListener('ended', handleEnded);

            audioRef.current.addEventListener('canplaythrough', () => {
                console.log("Audio is ready to play");
            });

            audioRef.current.addEventListener('error', (error) => {
                console.error("Error loading audio:", error);
                toast.error("Failed to load audio. Check the link.");
            });

            console.log(audioRef.current)
            return () => {
                audioRef.current?.removeEventListener('ended', handleEnded);
                audioRef.current?.pause(); // Clean up on component unmount
            }
        };
    }, [nftData]);

    // useEffect(() => {
    //     if (nftData?.animation_url) {
    //         audioRef.current = new Audio(nftData.animation_url);
    //         const handleEnded = async () => {
    //             setIsPlaying(false);
    //             await endListening(userId, playlistId);
    //         };
    //         audioRef.current.addEventListener('ended', handleEnded);
    //         return () => {
    //             audioRef.current?.removeEventListener('ended', handleEnded);
    //             audioRef.current?.pause();
    //         };
    //     }
    // }, [nftData, userId, playlistId]);


    const handlePlayPause = async () => {
        try {
            setIsLoading(true);

            if (isPlaying) {
                // Pause current session
                audioRef.current?.pause();
                await endListening(userId, playlistId);
                console.log("Listening paused");
                localStorage.setItem("playtime", "pause")

                setIsPlaying(false); // Set playing state to false after pausing
            } else {
                try {
                    // End any active session first
                    await endListening(userId, playlistId);
                } catch (error: any) {
                    if (error.message === "play on") {
                        console.log("No active session to end, proceeding to start a new one.");
                    } else {
                        throw error;
                    }
                }

                // Start a new listening session
                audioRef.current?.play();
                await startListening(userId, nftId, playlistId);
                localStorage.setItem("playtime", "play")

                console.log("Listening started");
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Error handling play/pause:", error);
            toast.error("Playback failed. Please try again.");
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            {
                nftData &&
                <Button onClick={handlePlayPause} disabled={isLoading} className='bg-slate-100'>
                    {isLoading ?

                        <Image src="/images/loader.svg" alt='loader' width={30} height={30} />
                        : isPlaying ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                    }
                </Button>
            }

        </div>
    );
};
