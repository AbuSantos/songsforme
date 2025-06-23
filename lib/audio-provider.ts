import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { isPlayingState, currentTrackIdState } from "@/atoms/song-atom";
import { AudioEngine } from "./audio-engine";

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const setIsPlaying = useSetRecoilState(isPlayingState);

  useEffect(() => {
    const audioEngine = new AudioEngine();

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
