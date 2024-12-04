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
import { mutate } from 'swr';

export const WithdrawRewards = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [totalTime, setTotalTime] = useState<number>(0);
    const userId = useRecoilValue(isConnected)?.userId;


    useEffect(() => {
        const fetchAccumulatedTime = async () => {
            setIsLoading(true);
            try {
                //@ts-ignore
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
        <div className='w-full mt-2'>
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
                            mutate(`/api/user/${userId}`)
                            toast.success("Withdrawal successful. Tokens deposited to your wallet!");
                        } catch (error) {
                            toast.error("Error finalizing rewards withdrawal.");
                        }
                    }
                }}
                onError={(error) => {
                    const errorMessage = error.message.includes("Claim cooldown active")
                        ? "Withdrawal is limited to once per week."
                        : "An error occurred during withdrawal.";
                    toast.error(errorMessage);
                }}
                className='w-full min-w-full p-2'
            >
                <span className='flex space-x-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none" className='mr-2'>
                        <path d="M18.9349 13.9453L18.2646 10.2968C17.9751 8.72096 17.8303 7.93303 17.257 7.46651C16.6837 7 15.8602 7 14.2132 7H9.78685C8.1398 7 7.31628 7 6.74298 7.46651C6.16968 7.93303 6.02492 8.72096 5.73538 10.2968L5.06506 13.9453C4.46408 17.2162 4.16359 18.8517 5.08889 19.9259C6.01419 21 7.72355 21 11.1423 21H12.8577C16.2765 21 17.9858 21 18.9111 19.9259C19.8364 18.8517 19.5359 17.2162 18.9349 13.9453Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M10.4375 16.6667L10.4375 11.3333M12 11.3333V10M12 18V16.6667M10.4375 14H13.5625M13.5625 14C14.0803 14 14.5 14.4477 14.5 15V15.6667C14.5 16.219 14.0803 16.6667 13.5625 16.6667H9.5M13.5625 14C14.0803 14 14.5 13.5523 14.5 13V12.3333C14.5 11.781 14.0803 11.3333 13.5625 11.3333H9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M21 11C21.1568 10.9209 21.2931 10.8212 21.4142 10.6955C22 10.0875 22 9.10893 22 7.15176C22 5.1946 22 4.21602 21.4142 3.60801C20.8284 3 19.8856 3 18 3L6 3C4.11438 3 3.17157 3 2.58579 3.60801C2 4.21602 2 5.1946 2 7.15176C2 9.10893 2 10.0875 2.58579 10.6955C2.70688 10.8212 2.84322 10.9209 3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    Withdraw Earnings
                </span>

            </TransactionButton>

            {/* <button onClick={handleClearTime} className='text-gray-200'>
                withdraw
            </button> */}
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};
