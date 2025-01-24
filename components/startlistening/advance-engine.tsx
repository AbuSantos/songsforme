import { AudioEngine } from "@/lib/audio-engine";
import { QualityManager } from "@/lib/audio-quality-manager";
import { VolumeMonitor } from "@/lib/volume-monitor"; // Import VolumeMonitor for session validation
import { PlaytimeTracker } from "@/lib/playtime-tracker"; // Import PlaytimeTracker
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AudioPreloader } from "./audio-preloader";

export function AdvancedPlayer({ trackUrl }: { trackUrl: string }) {
    const [engine] = useState(() => new AudioEngine());
    const [tracker] = useState(() => new PlaytimeTracker());
    const [quality] = useState(() => new QualityManager());
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const initializePlayer = async () => {
            try {
                // Get the optimal track URL from QualityManager
                const optimalUrl = await quality.getOptimalURL();
                await engine.loadTrack(optimalUrl);

                // Dynamically switch track quality based on network conditions
                quality.dynamicSwitch(engine);
            } catch (error) {
                console.error("Error initializing player:", error);
            }
        };

        initializePlayer();

        // Cleanup when the component unmounts
        return () => {
            engine.stop();
            tracker.stop();
        };
    }, [engine, quality, tracker, trackUrl]);
    // In your Playlisten component
    useEffect(() => {
        const updateState = () => {
            const state = engine.current.getPlaybackState();
            setIsPlaying(state.isPlaying);
        };

        const interval = setInterval(updateState, 500);
        return () => clearInterval(interval);
    }, []);

    const handlePlay = async () => {
        try {
            if (!isPlaying) {
                tracker.start(); // Start tracking playtime
                VolumeMonitor.validateListeningSession(engine); // Validate the listening session
                await engine.play(); // Play the track
            } else {
                engine.stop(); // Stop the engine
                tracker.stop(); // Stop tracking playtime
            }
            setIsPlaying(!isPlaying); // Update play state
        } catch (error) {
            console.error("Error handling play action:", error);
        }
    };

    return (
        <div className="audio-player">
            {/* Play/Pause button */}
            <Button onClick={handlePlay}>
                {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </Button>

            {/* Audio preloader for upcoming tracks */}
            <AudioPreloader
                nextTracks={[
                    "track-2-url.mp3", // Replace with actual track URLs
                    "track-3-url.mp3",
                    "track-4-url.mp3",
                ]}
            />
        </div>
    );
}
