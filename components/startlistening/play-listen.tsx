"use client"
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { startListening } from '@/actions/startListening';
import { endListening } from '@/actions/endListening';
import Image from 'next/image';

type PlaylistIdTypes = {
    userId: string | undefined;
    playlistId?: string;
    nftId: string;
};

export const Playlisten = ({ userId, nftId, playlistId }: PlaylistIdTypes) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePlayPause = async () => {
        try {
            setIsLoading(true);

            if (isPlaying) {
                // Pause current session
                await endListening(userId, playlistId);
                console.log("Listening paused");
                setIsPlaying(false); // Set playing state to false after pausing
            } else {
                try {
                    // Attempt to end any active session first
                    await endListening(userId, playlistId);
                } catch (error: any) {
                    // Gracefully handle the case where no active session exists
                    if (error.message === "play on") {
                        console.log("No active session to end, proceeding to start a new one.");
                    } else {
                        throw error; // Rethrow any other error
                    }
                }

                // Start a new listening session
                await startListening(userId, nftId, playlistId);
                console.log("Listening started");
                setIsPlaying(true); // Set playing state to true after starting
            }
        } catch (error) {
            console.error("Error handling play/pause:", error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div>
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


        </div>
    );
};
