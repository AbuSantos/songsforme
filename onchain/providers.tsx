"use client";
// @noErrors: 2307 2580 2339 2554 - cannot find 'process', cannot find './wagmi', cannot find 'import.meta'
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { getConfig } from './config';

declare global {
    interface Window {
        ENV?: {
            PUBLIC_ONCHAINKIT_API_KEY?: string;
            [key: string]: any;
        };
    }
}


export function OnchainProviders(props: {
    children: ReactNode;
    initialState?: State;
}) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());
    const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={apiKey || ''} // Provide empty string if API key is not available
                    chain={baseSepolia} // add baseSepolia for testing
                >
                    {props.children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}