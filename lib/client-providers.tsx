"use client";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import '@radix-ui/themes/styles.css';
// import { sdk } from '@farcaster/frame-sdk';
import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { OnchainProviders } from "@/onchain/providers";
import '@coinbase/onchainkit/styles.css';
import { AudioProvider } from "@/lib/audio-provider";
import { config } from "@/config";
import { WagmiProvider } from "wagmi";
import { MiniKitContextProvider } from "@/onchain/providers";

const queryClient = new QueryClient();

interface ClientProvidersProps {
    children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
    // Initialize the Farcaster SDK
    useEffect(() => {
        const initializeFarcasterSDK = async () => {
            await sdk.actions.ready()
        }

        if (typeof window !== 'undefined') {
            initializeFarcasterSDK()
        }
    }, []);

    return (
        <RecoilRoot>
            <MiniKitContextProvider>
                <ThirdwebProvider>
                    {/* <OnchainProviders> */}
                    <WagmiProvider config={config}>
                        <AudioProvider>
                            <QueryClientProvider client={queryClient}>
                                {children}
                                <Toaster />
                            </QueryClientProvider>
                        </AudioProvider>
                    </WagmiProvider>
                    {/* </OnchainProviders> */}
                </ThirdwebProvider>
            </MiniKitContextProvider>
        </RecoilRoot>
    );
}