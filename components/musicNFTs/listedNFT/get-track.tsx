"use client";

import { client } from "@/lib/client"
import { getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains"
import { MediaRenderer, useReadContract } from "thirdweb/react";

//@ts-ignore
export const PlayTrack = ({ address }) => {
    const contract = getContract({
        client,
        address: address,
        chain: polygonAmoy,  // Use the correct chain you're working with
    });

    // Fetch the tokenURI using the contract
    const { data, isPending } = useReadContract({
        contract,
        method: "tokenURI", // Shortened method signature to match contract
        params: [1], // Pass tokenId, e.g., 1
    });

    // Ensure the URI ends with a valid extension
    const validExtensions = ['.mp3', '.wav', '.flac'];

    const correctURI = (uri: string) => {
        // Check if the URI has one of the valid extensions
        for (let ext of validExtensions) {
            if (uri?.endsWith(ext)) {
                return uri;
            }
        }

        // If the extension is invalid, remove trailing digits and add a valid extension
        const cleanedURI = uri?.replace(/\d+$/, ''); // Remove trailing digits
        return `${cleanedURI}.mp3`;
    }

    return (
        <>
            {isPending ? (
                <div>Loading...</div>
            ) : (
                <MediaRenderer
                    mimeType="mp3"
                    client={client}
                    //@ts-ignore
                    src={correctURI(data)}
                />
            )}
        </>
    );
}
