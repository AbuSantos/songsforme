"use client";
import { AudioEngine } from "./audio-engine";

let audioEngine: AudioEngine | null = null;

export const getAudioEngineInstance = () => {
  if (typeof window === "undefined") return null;
  
  if (!audioEngine) {
    audioEngine = AudioEngine.getInstance();
  }
  return audioEngine;
};
