"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";
const inter = Inter({ subsets: ["latin"] });

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
        <ThirdwebProvider>
          <body className={inter.className}>{children}</body>
        </ThirdwebProvider>
      </RecoilRoot>
    </html>
  );
}
