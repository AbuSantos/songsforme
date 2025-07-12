"use client";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import '@radix-ui/themes/styles.css';
import { sdk } from '@farcaster/frame-sdk';
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainProviders } from "@/onchain/providers";
import '@coinbase/onchainkit/styles.css';
import { cookieToInitialState } from 'wagmi';
import { getConfig } from "@/onchain/config";
import { AudioProvider } from "@/lib/audio-provider";
import { type State } from 'wagmi';

const queryClient = new QueryClient();

interface ClientProvidersProps {
    children: React.ReactNode;
    initialState?: State;
}

export function ClientProviders({ children, initialState }: ClientProvidersProps) {
    // Initialize the Farcaster SDK
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sdk.actions.ready();
        }
    }, []);

    return (
        <RecoilRoot>
            <ThirdwebProvider>
                <OnchainProviders initialState={initialState}>
                    <AudioProvider>
                        <QueryClientProvider client={queryClient}>
                            {children}
                            <Toaster />
                        </QueryClientProvider>
                    </AudioProvider>
                </OnchainProviders>
            </ThirdwebProvider>
        </RecoilRoot>
    );
}