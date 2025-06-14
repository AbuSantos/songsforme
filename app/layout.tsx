"use client"
import "./globals.css";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner"
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { sdk } from '@farcaster/frame-sdk';
import { useEffect } from "react";
import { WagmiProvider } from 'wagmi'
import { config } from "@/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize the Farcaster SDK
  // This is necessary to ensure the SDK is ready before using it
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <html lang="en"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bullchord</title>
        <meta name="description" content="Listen to your favorite songs on chain and earn rewards" />
      </head>
      <RecoilRoot>
        <ThirdwebProvider
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

              <body >{children}</body>
              <Toaster />

            </QueryClientProvider>
          </WagmiProvider>

        </ThirdwebProvider>
      </RecoilRoot>
    </html>
  );
}
