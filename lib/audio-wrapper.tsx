"use client";
import { useEffect, useRef } from "react";
import { AudioEngine } from "./audio-engine";

const AudioWrapper = () => {
    const engineRef = useRef<AudioEngine | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined" || initializedRef.current) return;

        try {
            engineRef.current = AudioEngine.getInstance();
            initializedRef.current = true;

        } catch (error) {
            console.error("AudioEngine initialization failed:", error);
        }

        return () => {
            if (engineRef.current) {
                try {
                    engineRef.current.destroy();
                } catch (cleanupError) {
                    console.error("AudioEngine cleanup failed:", cleanupError);
                }
            }
        };
    }, []);

    return null;
};

export default AudioWrapper;