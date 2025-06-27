"use client"
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { useEffect, useState } from 'react';
import { ListedNFT } from '@prisma/client';

interface Song {
    artist: string;
    title: string;
    url: string;
    duration: string;
    cover: string
}

const PlayerDetails = ({ tracks }: { tracks: ListedNFT[] }) => {
    const currentTrackId = useRecoilValue(currentTrackIdState);
    const [songs, setSongs] = useState<Song[]>([]);

    const returnCorrectImage = (image: string | null | undefined) => {
        if (image?.endsWith("webp")) {
            // return image.replace(".webp", ".jpg");
            return (`/images/playlisty.jpg`);
        }
        return image;
    }

    const trackImageUrl = tracks?.find(track => track?.id === currentTrackId)?.Single?.song_cover || "";
    const trackTitle = tracks?.find(track => track?.id === currentTrackId)?.Single?.song_name || "";
    const trackArtist = tracks?.find(track => track?.id === currentTrackId)?.Single?.artist_name || "";

    console.log(trackImageUrl, "Player details")

    return (
        <div className='flex space-x-2 justify-center items-center cursor-pointer'>
            {currentTrackId ? (
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