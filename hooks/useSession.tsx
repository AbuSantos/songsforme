"use client"
import { getSession } from "@/lib/helper";
import { useEffect, useState } from "react";

// Define the expected type for the session
type Session = string | null;

export const useSession = () => {
    const [id, setId] = useState<Session>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const address = (await getSession()) as Session;
                if (address) {
                    setId(address);
                }
            } catch (error) {
                console.error("Error fetching session", error);
                setId(null); // Handle the case where there's an error
            } finally {
                setLoading(false); // Set loading to false once done
            }
        };

        fetchSession();
    }, []);
    return { id, loading };
};