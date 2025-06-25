import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isPlayingState,
  currentTrackIdState,
  currentPlaybackState,
} from "@/atoms/song-atom";
import { audioEngine } from "./audio-engine-singleton";
import { AudioEngine } from "./audio-engine";

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const setIsPlaying = useSetRecoilState(isPlayingState);

  const [playbackState, setPlaybackState] =
    useRecoilState(currentPlaybackState);

  useEffect(() => {
    const engine = AudioEngine.getInstance();
    engine.setPlaybackStateCallback((state) => {
      setPlaybackState((prev) => ({ ...prev, ...state }));
    });
  }, [setPlaybackState]);

  useEffect(() => {
    audioEngine.setOnPlayCallback(() => setIsPlaying(true));
    audioEngine.setOnPauseCallback(() => setIsPlaying(false));
    audioEngine.setOnEndedCallback(() => setIsPlaying(false));

    return () => {
      audioEngine.setOnPlayCallback(undefined);
      audioEngine.setOnPauseCallback(undefined);
      audioEngine.setOnEndedCallback(undefined);
    };
  }, [setIsPlaying]);

  return children;
};
