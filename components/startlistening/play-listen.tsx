"use client"
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { startListening } from '@/actions/startListening';
import { endListening } from '@/actions/endListening';

type PlaylistIdTypes = {
    userId: string;
    playlistId: string;
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
            <Button onClick={handlePlayPause} disabled={isLoading}>
                {isLoading ? 'Processing...' : isPlaying ? 'Pause' : 'Play'}
            </Button>
        </div>
    );
};
