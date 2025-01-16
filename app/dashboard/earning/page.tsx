"use client";

import { isConnected } from "@/atoms/session-atom";
import { Return } from "@/components/actions/return";
import { Separator } from "@/components/ui/separator";
import { WithdrawRewards } from "@/components/withdraw/withdrawal";
import { fetcher } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";


//CHANGE PER RATE LATER
const PAY_RATE = 0.001;

const MyEarnings = () => {
    const userId = useRecoilValue(isConnected)?.userId;

    const apiUrl = userId ? `/api/user/${userId}` : null;
    const { data, error, isLoading } = useSWR(apiUrl, fetcher);

    if (isLoading) {
        return <p className="items-center text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">Failed to load data</p>;

    }

    const earnings = (data?.accumulatedTime || 0) * PAY_RATE;

    return (
        <div>
            <Return />
            <div className="px-2">
                <h1 className="text-xl font-semibold p-3">User Rewards</h1>

                <div className="w-11/12 p-3 flex flex-col bg-muted h-[20rem] rounded-md m-auto">
                    <div className="flex flex-col items-start">
                        <h1 className="text-gray-950 text-2xl">
                            {earnings === 0 ?
                                <>
                                    < div className='flex items-center space-x-2'>
                                        0
                                        < Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={20} height={20} className="ml-1" />
                                    </div>
                                </>
                                :
                                < div className='flex items-center space-x-2'>
                                    {earnings.toFixed(4)}
                                    < Image src={"https://tokenlogo.xyz/assets/chain/base.svg"} alt="base eth" width={20} height={20} className="ml-1" />
                                </div>
                            }
                        </h1>
                        <span className="text-gray-900">
                            Accumulated Time: {data?.accumulatedTime || 0}s
                        </span>
                    </div>

                    <Separator className="my-4 bg-[#232323]" />

                    <div className="m-auto">
                        <WithdrawRewards />
                    </div>
                </div>
            </div>

            {earnings === 0 && (
                <div className="flex flex-col items-center m-auto py-3">
                    <Image src="/images/wallet.png" width={156} height={100} alt="wallet" />
                    <div className="px-5 py-3">
                        <h1 className="text-[#B4B4B4] text-2xl text-center">
                            Your wallet is currently empty
                        </h1>
                        <p className="text-[#7B7B7B] text-center">
                            Please create playlists or listen to more songs to earn rewards.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEarnings;
