import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const currentPlaybackState = atom<{
  trackId: string | null;
  isPlaying: boolean;
}>({
  key: "currentPlaybackState",
  default: {
    trackId: null,
    isPlaying: false,
  },
});
