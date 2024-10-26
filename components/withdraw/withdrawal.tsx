"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner'; // If using a toast notification library
import { getUserAccumulatedTIme } from '@/lib/helper';
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from 'thirdweb';
import { contract } from '@/lib/client';
import { clearAccumulatedTime } from '@/actions/clear-time';

export const WithdrawRewards = ({ userId }: { userId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [totalTime, setTotalTime] = useState(0)

    useEffect(() => {
        const handleWithdrawal = async () => {
            setIsLoading(true); // Start loading before the action
            try {
                const time = await getUserAccumulatedTIme(userId) as number
                setTotalTime(time)
                console.log(time)
                // toast.success("Rewards withdrawn successfully!");
            } catch (error) {
                console.error("Withdrawal error:", error);
                // toast.error("Error withdrawing rewards.");
            } finally {
                setIsLoading(false); // Reset loading state
            }
        };

        handleWithdrawal()
    }, [userId])

    if (!userId) return

    console.log(userId)

    return (
        <div>
            <TransactionButton
                transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                        contract,
                        method: "distributeRewards",
                        params: [userId, totalTime],
                    });
                    return tx;
                }}

                onTransactionConfirmed={async (receipt) => {
                    // Handle the transaction confirmation
                    if (receipt.status === "success") {
                        await clearAccumulatedTime(userId)
                    }

                    toast.success("Withdrawal successful, Token deposited to your wallet!")
                    toast.success("Keep Streaming and keep Earning!")
                    console.log("Transaction confirmed", receipt);
                }}

                onError={(error) => {
                    if (error.message.includes("Claim cooldown active")) {
                        toast.error("Withdrawal is once a week");
                    } else {
                        toast.error(error.message);
                    }

                }}
            >
                withdraw
            </TransactionButton>

            {/* <Button onClick={handleWithdrawal} disabled={isLoading}>
                {isLoading ? "Processing..." : "Withdraw Earnings"}
            </Button> */}
            {message && <p className="mt-2 text-sm">{message}</p>} {/* Display message if exists */}
        </div>
    );
};
