import { endListening } from "@/actions/endListening";

type PauseListenProps = {
    userId: string;
    playlistId: string;
};

export const PauseListen = ({ userId, playlistId }: PauseListenProps) => {
    const handlePause = async () => {
        try {
            // End the current listening session
            await endListening(userId, playlistId);
            console.log("Paused the current song");
        } catch (error) {
            console.error("Error pausing the listening session:", error);
        }
    };

    return (
        <button onClick={handlePause}>
            Pause
        </button>
    );
};
