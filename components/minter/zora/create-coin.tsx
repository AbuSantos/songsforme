"use client";
import { useEffect, useState } from "react";
import { createCoinCall, DeployCurrency, InitialPurchaseCurrency, ValidMetadataURI } from "@zoralabs/coins-sdk";
import { Address, parseEther } from "viem";
import { useSimulateContract, useWriteContract } from "wagmi";
import { base, zoraTestnet } from "viem/chains";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";

const coinParams = {
    name: "My Awesome Coin",
    symbol: "MAC",
    uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy" as ValidMetadataURI,
    payoutRecipient: "0x21B824524c92F9b67C5EADB6B5100A8BA76612C3" as Address,
    platformReferrer: "0x0000000000000000000000000000000000000000" as Address,
    // chainId: base.id,
    chainId: zoraTestnet.id,
    currency: DeployCurrency.ZORA,
    initialPurchase: {
        currency: InitialPurchaseCurrency.ETH,
        amount: parseEther("0.01"),
    },
};

export default function CreateCoinComponent() {
    const [contractCallParams, setContractCallParams] = useState<any>(null);
    const userId = useRecoilValue(isConnected)?.userId;
    const { data: simulationData } = useSimulateContract({
        ...contractCallParams,
        query: { enabled: !!contractCallParams },
    });

    const { writeContract, status } = useWriteContract();

    useEffect(() => {
        async function setup() {
            const params = await createCoinCall(coinParams);
            setContractCallParams(params);
        }
        setup();
    }, []);

    const handleCreate = () => {
        if (simulationData) {
            writeContract(simulationData.request);
        }
    };

    return (
        <button disabled={!simulationData || status === "pending"} onClick={handleCreate} className="w-full bg-blue-400 cursor-pointer  text-gray-900 hover:bg-blue-500 border-none text-xl transition py-2 px-4 rounded-md mt-4">
            {status === "pending" ? "Creating..." : "Create Coin"}
        </button>
    );
}
