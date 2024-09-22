"use client"
import "./globals.css";
import { RecoilRoot } from "recoil";
import { ThirdwebProvider } from "thirdweb/react";

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
        </ThirdwebProvider>
      </RecoilRoot>
    </html>
  );
}
