import { http, createConfig } from "wagmi";
import { base, sepolia, baseSepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";

export const config = createConfig({
  chains: [baseSepolia, base, sepolia],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    miniAppConnector(),
    metaMask(), // Remove the chains parameter as it's not needed
    safe(),
  ],
});
