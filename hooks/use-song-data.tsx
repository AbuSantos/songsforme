import { getNFTMetadata } from "@/actions/helper/get-metadata";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useSongData = (address: string, tokenId: string) => {
    const [nftData, setNftData] = useState<any>(null); // Initialize with null
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchMetaData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getNFTMetadata(address, tokenId);
                setNftData(response.raw.metadata);
                console.log("NFT Metadata:\n", response);
            } catch (err) {
                console.error(err);
                setError("Failed to load NFT data.");
                toast.error("Failed to load NFT data.");
            } finally {
                setLoading(false);
            }
        };

        if (address && tokenId) {
            fetchMetaData();
        } else {
            setNftData(null);
            toast.error("Invalid address or tokenId.");
        }
    }, [address, tokenId]);

    return { nftData, loading, error };
};
