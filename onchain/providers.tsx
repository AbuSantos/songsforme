"use client";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { getConfig } from './config';

interface Window {
    ENV?: {
        PUBLIC_ONCHAINKIT_API_KEY?: string;
        [key: string]: any;
    };
}

export function OnchainProviders(props: {
    children: ReactNode;
    initialState?: State;
}) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());
    const apiKey =
        typeof window !== 'undefined'
            ? (window as Window).ENV?.PUBLIC_ONCHAINKIT_API_KEY
            : process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={apiKey || ""}
                    chain={baseSepolia}
                >
                    {props.children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}