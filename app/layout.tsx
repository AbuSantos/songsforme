"use client"
import "./globals.css";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner"
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <body >{children}</body>
          <Toaster />
        </ThirdwebProvider>
      </RecoilRoot>
    </html>
  );
}
