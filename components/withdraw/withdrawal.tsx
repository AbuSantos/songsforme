"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from 'thirdweb';
import { contract } from '@/lib/client';
import { clearAccumulatedTime } from '@/actions/helper/clear-time';
import { getUserAccumulatedTime } from '@/lib/helper';
import { useRecoilValue } from 'recoil';
import { isConnected } from '@/atoms/session-atom';

export const WithdrawRewards = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [totalTime, setTotalTime] = useState<number>(0);
    const userId = useRecoilValue(isConnected);

    useEffect(() => {
        const fetchAccumulatedTime = async () => {
            setIsLoading(true);
            try {
                const time = await getUserAccumulatedTime(userId) as number;
                setTotalTime(time);
            } catch (error) {
                console.error("Error fetching accumulated time:", error);
                toast.error("Unable to fetch rewards at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccumulatedTime();
    }, [userId]);

    return (
        <div>
            <TransactionButton
                transaction={() => {
                    try {
                        // Prepare transaction for reward distribution
                        return prepareContractCall({
                            contract,
                            method: "distributeRewards",
                            // @ts-ignore
                            params: [userId, totalTime],
                        });
                    } catch (error) {
                        console.error("Transaction preparation failed:", error);
                        toast.error("Failed to prepare transaction.");
                        throw error;
                    }
                }}
                onTransactionConfirmed={async (receipt) => {
                    if (receipt.status === "success") {
                        try {
                            await clearAccumulatedTime(userId);
                            toast.success("Withdrawal successful. Tokens deposited to your wallet!");
                        } catch (error) {
                            console.error("Error clearing accumulated time:", error);
                            toast.error("Error finalizing rewards withdrawal.");
                        }
                    }
                    console.log("Transaction confirmed:", receipt);
                }}
                onError={(error) => {
                    const errorMessage = error.message.includes("Claim cooldown active")
                        ? "Withdrawal is limited to once per week."
                        : "An error occurred during withdrawal.";
                    toast.error(errorMessage);
                    console.error("Transaction error:", error);
                }}
                className='w-100 min-w-full'
            >
                Withdraw Earnings
            </TransactionButton>



            {/* <button onClick={() => console.log(totalTime)} className='text-gray-200'>
                withdraw
            </button> */}
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};
