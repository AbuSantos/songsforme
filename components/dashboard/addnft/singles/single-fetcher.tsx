"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import SingleMusic from "./single-music";


export const MusicFetcher = () => {
    const account = useActiveAccount(); // Get connected user's wallet address
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        if (account) {
            setAddress(account?.address); // Update the state with the connected address
        }
    }, [account?.address]);

    return (
        <div>
            {address ? (
                <SingleMusic userId={address} />
            ) : (
                <p>Account Not Connected</p>
            )}
        </div>
    );
};
