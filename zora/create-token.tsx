'use client';

import { useAccount, usePublicClient, useWalletClient, useWriteContract } from 'wagmi';
import { create1155 } from '@zoralabs/protocol-sdk';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isConnected } from '@/atoms/session-atom';

export default function Deploy1155() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();
  const userId = useRecoilValue(isConnected)?.userId;


  const [contractAddress, setContractAddress] = useState<string | null>(null);

  async function deploy() {
    if (!userId || !publicClient || !walletClient) {
      console.error('Missing wallet or client');
      return;
    }

    const { parameters, contractAddress } = await create1155({
      contract: {
        name: 'BullchordDrop',
        uri: 'ipfs://YOUR_CONTRACT_METADATA_URI',
      },
      token: {
        tokenMetadataURI: 'ipfs://YOUR_TOKEN_METADATA_URI'
      },
      account: userId,
      publicClient,
    });

    try {
      await writeContractAsync(parameters);
      setContractAddress(contractAddress);
      console.log('Contract deployed at:', contractAddress);
    } catch (err) {
      console.error('Write failed:', err);
    }
  }

  return (
    <div className='flex'>
      <button
        onClick={deploy}
        className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800"
      >
        Deploy Music NFT
      </button>

      {contractAddress && (
        <p className="mt-4 text-red-700 text-sm">✅ Contract deployed at: {contractAddress}</p>
      )}
    </div>
  );
}
