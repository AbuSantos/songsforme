import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains"; // add baseSepolia for testing
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

export function getConfig() {
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

  const connectors = [
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "smartWalletOnly",
      version: "4",
    }),
    metaMask(),
  ];

  if (walletConnectProjectId) {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
      }) as any // Type assertion to handle wagmi/walletconnect compatibility
    );
  }

  // return createConfig({
  //   chains: [baseSepolia], // add baseSepolia for testing
  //   connectors: [
  //     coinbaseWallet({
  //       appName: "OnchainKit",
  //       preference: "smartWalletOnly",
  //       version: "4",
  //     }),
  //     metaMask(),
  //     walletConnect({
  //       projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  //     }),
  //   ],

  return createConfig({
    chains: [baseSepolia], // add baseSepolia for testing
    connectors,

    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(), // add baseSepolia for testing
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
