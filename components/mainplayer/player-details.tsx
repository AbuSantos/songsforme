"use client"
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { currentPlaybackState, currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAudioEngineInstance } from '@/lib/audio-engine-singleton';
import { AudioEngine } from '@/lib/audio-engine';
import { toast } from 'sonner';
import { ListedNFT } from '@/types';

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

            } catch (error) {
                console.error("Audio initialization failed:", error);
                toast.error("Error initializing audio engine");
            }
        };

        initializeAudio();

        return () => {
            if (engineRef.current) {
                //@ts-ignore
                engineRef.current.setPlaybackStateCallback(null);
            }
        };
    }, [isPlaying]);


    const currentTrack = useMemo(() =>
        tracks?.find(track => track?.id === nftId || track?.id === currentTrackId) || null,
        [tracks, nftId || currentTrackId]
    );

    return (
        <div className='flex space-x-2 justify-center items-center cursor-pointer'>
            {isPlaying || currentTrackId ? (
                <>
                    <Image
                        src={returnCorrectImage(currentTrack?.Single?.song_cover) || `/images/playlisty.jpg`}
                        alt={currentTrack?.Single?.song_name || "No song selected"}
                        width={40}
                        height={30}
                        className="rounded-sm"
                    />
                    <div className='flex flex-col capitalize'>
                        <small>{currentTrack?.Single?.song_name}</small>
                        <small className="text-xs text-muted-foreground ">{currentTrack?.Single?.artist_name}</small>
                    </div>
                </>
            ) : (
                <div>No song selected</div>
            )}
        </div>
    );
}

export default PlayerDetails