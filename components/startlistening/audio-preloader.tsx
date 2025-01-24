"use client"
import { useEffect } from "react";

export const AudioPreloader = ({ nextTracks }: { nextTracks: string[] }) => {
    useEffect(() => {
        const preload = async (url: string) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'audio';
            link.href = url;
            document.head.appendChild(link);
        }

        nextTracks.slice(0, 3).forEach(preload);


        return () => {
            document.head.querySelectorAll('link[rel="preload"]').forEach((link) => {
                if (nextTracks.includes(link.getAttribute('href') || '')) {
                    link.remove();
                }
            })
        }
    }, [nextTracks]);

    return null;
}