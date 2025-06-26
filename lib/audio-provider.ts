"use client";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { isPlayingState, currentPlaybackState } from "@/atoms/song-atom";
import { getAudioEngineInstance } from "./audio-engine-singleton";

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setPlaybackState = useSetRecoilState(currentPlaybackState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const engine = getAudioEngineInstance();
    if (!engine) return;

    // Sync full playback state
    engine.setPlaybackStateCallback((state) => {
      setPlaybackState((prev) => ({ ...prev, ...state }));
      if (typeof state.isPlaying === "boolean") setIsPlaying(state.isPlaying);
    });

    // Optionally, also set individual callbacks if your engine supports them
    engine.setOnPlayCallback(() => setIsPlaying(true));
    engine.setOnPauseCallback(() => setIsPlaying(false));
    engine.setOnEndedCallback(() => setIsPlaying(false));

    return () => {
      engine.setPlaybackStateCallback(null);
      engine.setOnPlayCallback(undefined);
      engine.setOnPauseCallback(undefined);
      engine.setOnEndedCallback(undefined);
    };
  }, [setIsPlaying, setPlaybackState]);

  return children;
};
