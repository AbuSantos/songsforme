"use client"
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { currentPlaybackState, currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { useEffect, useMemo, useRef, useState } from 'react';
import { ListedNFT } from '@prisma/client';
import { getAudioEngineInstance } from '@/lib/audio-engine-singleton';
import { AudioEngine } from '@/lib/audio-engine';
import { toast } from 'sonner';

interface Song {
    artist: string;
    title: string;
    url: string;
    duration: string;
    cover: string
}

const PlayerDetails = ({ tracks }: { tracks: ListedNFT[] }) => {
    const currentTrackId = useRecoilValue(currentTrackIdState);
    const [nftId, setNftId] = useState<string | null>(null);
    const isPlaying = useRecoilValue(isPlayingState);
    const engineRef = useRef<AudioEngine | null>(null);

    const returnCorrectImage = (image: string | null | undefined) => {
        if (image?.endsWith("webp")) {
            // return image.replace(".webp", ".jpg");
            return (`/images/playlisty.jpg`);
        }
        return image;
    }

    console.log("Current Track ID:", currentPlaybackState);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!engineRef.current) {
            engineRef.current = getAudioEngineInstance();
        }

        const initializeAudio = async () => {
            try {
                const nftStateId = engineRef.current?.currentTrackId;
                setNftId(nftStateId ?? null);
                console.log("Audio initialization failed:");
                toast.error("Error loading audio track");
                
            } catch (error) {
                console.error("Audio initialization failed:", error);
                toast.error("Error initializing audio engine");
            }
        };

        initializeAudio();

        return () => {
            if (engineRef.current) {
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [isPlaying]);

    console.log("playing from play details:", playback.trackId);
    console.log("Current Track ID:", currentTrackId, isPlaying);

    const trackImageUrl = tracks?.find(track => track?.id === currentTrackId)?.Single?.song_cover || "";
    const trackTitle = tracks?.find(track => track?.id === currentTrackId)?.Single?.song_name || "";
    const trackArtist = tracks?.find(track => track?.id === currentTrackId)?.Single?.artist_name || "";

    const currentTrack = useMemo(() =>
        tracks?.find(track => track?.id === currentTrackId),
        [tracks, currentTrackId]
    );

    console.log("Current Track:", currentTrack);

    return (
        <div className='flex space-x-2 justify-center items-center cursor-pointer'>
            {isPlaying || currentTrackId ? (
                <>
                    <Image
                        src={returnCorrectImage(trackImageUrl) || `/images/playlisty.jpg`}
                        alt={trackTitle}
                        width={40}
                        height={30}
                        className="rounded-sm"
                    />
                    <div className='flex flex-col capitalize'>
                        <small>{trackTitle}</small>
                        <small className="text-xs text-muted-foreground ">{trackArtist}</small>
                    </div>
                </>
            ) : (
                <div>No song selected</div>
            )}
        </div>
    );
}

export default PlayerDetails