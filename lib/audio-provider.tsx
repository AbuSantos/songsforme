"use client";
import { Suspense, useEffect, useState } from "react";
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

    engine.setPlaybackStateCallback((state) => {
      setPlaybackState((prev) => ({ ...prev, ...state }));
      if (typeof state.isPlaying === "boolean") setIsPlaying(state.isPlaying);
    });

    engine.setOnPlayCallback(() => setIsPlaying(true));
    engine.setOnPauseCallback(() => setIsPlaying(false));
    engine.setOnEndedCallback(() => setIsPlaying(false));

    return () => {
      //@ts-ignore
      engine.setPlaybackStateCallback(null);
      engine.setOnPlayCallback(undefined);
      engine.setOnPauseCallback(undefined);
      engine.setOnEndedCallback(undefined);
    };
  }, [setIsPlaying, setPlaybackState]);

  return <>{children}</>;
}
