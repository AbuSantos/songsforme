"use server";

// import { db } from "@/lib/db";
// import { sendTransaction, getContract, prepareContractCall } from "thirdweb";
// import { sepolia } from "thirdweb/chains";

// import { ethers } from "ethers";
// import { contract } from "@/lib/client";

// const privateKey = process.env.THIRDWEB_NEW_API;

// export const withdrawRewards = async (userId: string, userAddress: string) => {
//   console.log(userId, "id from withdraw");
//   try {
//     // 1. Initialize signer with provider for on-chain transactions
//     const provider = ethers.getDefaultProvider(process.env.RPC_URL); // Ensure you have the RPC URL
//     const signer = new ethers.Wallet(privateKey, provider);

//     // 2. Fetch accumulatedTime for rewards calculation
//     const user = await db.user.findUnique({
//       where: { userId },
//       select: {
//         accumulatedTime: true,
//       },
//     });

//     console.log(user, "user from rewards");
//     const accumulatedTime = user?.accumulatedTime;
//     if (!accumulatedTime || accumulatedTime <= 0) {
//       return { message: "Invalid accumulated time." };
//     }

//     // 3. Prepare contract call transaction data
//     const transaction = prepareContractCall({
//       contract,
//       method:
//         "function distributeRewards(address listener, uint256 accumulatedTime)",
//       params: [userAddress, accumulatedTime],
//     });

//     // const { transactionHash } = await sendTransaction({
//     //   transaction,
//     // });

//     // 4. Sign and send the transaction
//     const signedTransaction = await signer.sendTransaction({
//       ...transaction,
//       to: contract.address,
//     });

//     const receipt = await signedTransaction.wait(); // Wait for transaction to be mined
//     console.log(receipt);

//     return {
//       message: "Rewards calculated and distributed.",
//       transactionHash: receipt.transactionHash,
//     };
//   } catch (error) {
//     console.error("Error withdrawing rewards:", error);
//     throw new Error("Failed to withdraw rewards.");
//   }
// };

import { contractABI, contractAddress } from "@/lib/client";
import { db } from "@/lib/db";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = contractAddress as string;
const DEPLOYMENT_NETWORK_CHAIN_ID = 11155111; // For Sepolia (or your network’s chain ID)

// Environment configuration
const privateKey =
  "";
const rpcUrl = "https://sepolia.infura.io/v3/2DPZ554hcX01LKcgC66hjR6cyIN";

if (!privateKey || !rpcUrl || !CONTRACT_ADDRESS) {
  throw new Error(
    "Server configuration error: Missing required environment variables."
  );
}

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

async function checkNetwork() {
  const network = await provider.getNetwork();
  if (network.chainId !== DEPLOYMENT_NETWORK_CHAIN_ID) {
    throw new Error(
      `Network mismatch. Expected chain ID ${DEPLOYMENT_NETWORK_CHAIN_ID} but connected to ${network.chainId}`
    );
  }
  console.log("Connected to correct network:", network.name);
}

export const withdrawRewards = async (userId: string, userAddress: string) => {
  console.log(userId, userAddress, "user Id");
  await checkNetwork(); // Confirm network before proceeding
  console.log(userId, userAddress, "user Id");
  try {
    const user = await db.user.findUnique({
      where: { userId },
      select: { accumulatedTime: true },
    });
    console.log(user, "user");
    const accumulatedTime = user?.accumulatedTime;
    if (!accumulatedTime || accumulatedTime <= 0) {
      return { message: "No rewards available to withdraw." };
    }

    const transactionData = {
      to: CONTRACT_ADDRESS,
      data: contract.interface.encodeFunctionData("distributeRewards", [
        userAddress,
        accumulatedTime,
      ]),
      value: 0,
    };
    console.log(transactionData, "transaction");
    const transactionResponse = await signer.sendTransaction(transactionData);
    const receipt = await transactionResponse.wait();

    return {
      message: "Rewards distributed successfully.",
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error("Error withdrawing rewards:", error);
    throw new Error("Failed to process withdrawal transaction.");
  }
};
