// "use client";
// // @noErrors: 2307 2580 2339 2554 - cannot find 'process', cannot find './wagmi', cannot find 'import.meta'
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { type ReactNode, useState } from 'react';
// import { getConfig } from './config';

// declare global {
//     interface Window {
//         ENV?: {
//             PUBLIC_ONCHAINKIT_API_KEY?: string;
//             [key: string]: any;
//         };
//     }
// }

// export function OnchainProviders(props: {
//     children: ReactNode;
// }) {
//     const [config] = useState(() => getConfig());
//     const [queryClient] = useState(() => new QueryClient());
//     const apiKey =
//         process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY

//     return (
//         <QueryClientProvider client={queryClient}>
//             <OnchainKitProvider
//                 apiKey={apiKey || ""}
//                 chain="base-sepolia"
//             >
//                 {props.children}
//             </OnchainKitProvider>
//         </QueryClientProvider>
//     );
// }

'use client';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base, baseSepolia } from 'wagmi/chains';

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
    return (
        <MiniKitProvider apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY} chain={baseSepolia}>
            {children}
        </MiniKitProvider>
    );
}