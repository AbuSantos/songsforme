import { zora } from "viem/chains";
import { ethers } from "ethers";
import { ZDK } from "@zoralabs/zdk";
import { Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import {
  http,
  custom,
  createPublicClient,
  createWalletClient,
  Chain,
} from "viem";

export const chain = zora;
export const chainId = zora.id;

export const publicClient = createPublicClient({
  chain: chain as Chain,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: chain as Chain,
  transport: custom(window.ethereum!),
});

export async function getAccounts() {
  const addresses = await walletClient.getAddresses();
  return {
    creatorAccount: addresses[0]!,
    minterAccount: addresses[1]!,
    randomAccount: addresses[2]!,
  };
}
