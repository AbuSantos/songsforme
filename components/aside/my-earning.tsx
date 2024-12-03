import React from 'react'
import { Separator } from '../ui/separator'
import { WithdrawRewards } from '../withdraw/withdrawal'
import { User } from '@/types';

export const MyEarnings = ({ data }: { data: User }) => {
    const PAY_RATE = 0.001;
    const earnings = (data?.accumulatedTime || 0) * PAY_RATE;
    return (
        <div className="my-2 w-full">
            <div className="w-full p-3 flex flex-col bg-[#191919] h-[14rem] rounded-md ">
                <div className="flex flex-col items-start">
                    <h1 className="text-gray-50 text-2xl">
                        {earnings === 0 ? "0 ETH" : `${earnings.toFixed(4)} ETH`}
                    </h1>
                    <span className="text-gray-50">
                        Accumulated Time: {data?.accumulatedTime || 0}s
                    </span>
                </div>

                <Separator className="my-4 bg-[#232323]" />

                <div className="m-auto">
                    <WithdrawRewards />
                </div>
            </div>
        </div>
    )
}
