"use client";
import { useEffect, useState, useCallback } from "react";

// Define the expected shape of the session data
interface SessionData {
    userId: string | null;
}

export const useSession = () => {
    const [id, setId] = useState<SessionData["userId"]>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSession = useCallback(async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch("/api/session");
            if (response.ok) {
                const data = await response.json();
                setId(data.userId);
            } else {
                console.warn("Session not found or could not be decrypted.");
                setId(null); // Ensure id is cleared if session is not found
            }
        } catch (error) {
            console.error("Error fetching session", error);
            setError("Failed to fetch session");
            setId(null); // Handle the case where there's an error
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return { id, loading, error, refetch: fetchSession };
};
