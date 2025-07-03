"use client";
import { FaPause, FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentPlaybackState, currentTrackIdState, isPlayingState } from "@/atoms/song-atom";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { AudioEngine } from "@/lib/audio-engine";
import { getAudioEngineInstance } from "@/lib/audio-engine-singleton";
import { CacheManager } from '@/lib/cache-manager';
import { getNFTMetadata } from "@/actions/helper/get-metadata";
import { ListedNFT } from "@/types";
import { endListening } from "@/actions/endListening";
import { startListening } from "@/actions/startListening";
import { isConnected } from "@/atoms/session-atom";

const PlaylistPlay = ({ tracks, playlistId }: { tracks: ListedNFT[], playlistId: string }) => {
    const [playback, setPlayback] = useRecoilState(currentPlaybackState);
    const currentTrackId = useRecoilValue(currentTrackIdState);
    const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const engineRef = useRef<AudioEngine | null>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const userId = useRecoilValue(isConnected)?.userId;


    console.log("playlistId:", playlistId);

    // Initialize audio engine and track index
    useEffect(() => {
        engineRef.current = getAudioEngineInstance();
        setCurrentTrackIndex(tracks.findIndex(t => t.id === currentTrackId));

        const updateState = (state: { isPlaying?: boolean; trackId?: string }) => {
            if (state.trackId) setCurrentTrackId(state.trackId);
            if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
        };

        engineRef.current?.setPlaybackStateCallback(updateState);

        return () => {
            engineRef.current?.setPlaybackStateCallback(null);
        };
    }, [tracks, currentTrackId, setCurrentTrackId, setIsPlaying]);

    const formatIpfsUrl = (url: string) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

    const fetchMetadata = async (trackId: string) => {
        try {
            const track = tracks.find(t => t.id === trackId);
            if (!track) throw new Error("Track not found");

            const cacheKey = `nft-metadata-${track.contractAddress}-${track.tokenId}`;
            const cachedData = CacheManager.get(cacheKey) as { animation_url: string };

            if (cachedData) {
                return formatIpfsUrl(cachedData.animation_url);
            }

            const response = await getNFTMetadata(track.contractAddress, track.tokenId);
            const metadata = response.raw.metadata;
            CacheManager.set(cacheKey, metadata);
            return formatIpfsUrl(metadata.animation_url);
        } catch (error) {
            console.error("NFT Metadata error:", error);
            toast.error("Failed to load NFT audio");
            throw error;
        }
    };

    const playTrack = async (trackId: string) => {
        try {
            if (!engineRef.current) {
                engineRef.current = getAudioEngineInstance();
            }
            if (!engineRef.current) {
                toast.error("Audio engine not available");
                return;
            }

            const trackUrl = await fetchMetadata(trackId);
            await engineRef.current.loadTrack(trackUrl, trackId);
            engineRef.current.play();

            setCurrentTrackId(trackId);
            setIsPlaying(true);
            setCurrentTrackIndex(tracks.findIndex(t => t.id === trackId));
        } catch (error) {
            console.error('Error playing track:', error);
            toast.error('Failed to play track');
        }
    };

    console.log("Current track id:", currentTrackId);

    const playPlaylist = async () => {
        if (!tracks.length) {
            toast.warning("Playlist is empty");
            return;
        }

        // If already playing this playlist, just toggle pause/play
        if (isPlaying && currentTrackIndex !== -1) {
            engineRef.current?.pause();
            await endListening(userId, playlistId);
            console.log("Paused playback for playlist:", playlistId);

            return;
        }

        // If paused on a track in this playlist, resume playback
        if (!isPlaying && currentTrackIndex !== -1) {
            engineRef.current?.play();
            await startListening(userId, currentTrackId, playlistId);
            console.log("Resumed playback for track:", currentTrackId, "in playlist:", playlistId);

            return;
        }

        // Start playing from the first track
        await playTrack(tracks[0].id);
    };

    const handleTrackEnd = () => {
        const nextIndex = currentTrackIndex + 1;
        if (nextIndex < tracks.length) {
            playTrack(tracks[nextIndex].id);
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (!engineRef.current) return;

        engineRef.current.setOnEndedCallback(handleTrackEnd);

        return () => {
            engineRef.current?.setOnEndedCallback(null);
        };
    }, [currentTrackIndex, tracks]);

    return (
        <div className="flex justify-center items-center space-x-6 text-2xl cursor-pointer">
            <Button
                variant="ghost"
                size="icon"
                onClick={playPlaylist}
                disabled={!tracks?.length}
                aria-label={isPlaying ? "Pause playlist" : "Play playlist"}
                className="ml-4"
            >
                {isPlaying && currentTrackIndex !== -1 ? <FaPause className="w-[1.3rem] h-[1.3rem]" /> : <FaPlay className="w-[1.3rem] h-[1.3rem]" />}
            </Button>
        </div>
    );
};

export default PlaylistPlay;