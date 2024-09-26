"use client"
import "./globals.css";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner"
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

// export const metadata: Metadata = {
//   title: "Bullchord",
//   description: "Listen to your favorite songs on chain and earn rewards",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
