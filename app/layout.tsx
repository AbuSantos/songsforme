import "./globals.css";
import { cookieToInitialState } from 'wagmi';
import { getConfig } from "@/onchain/config";
import { headers } from "next/headers";
import { ClientProviders } from "@/lib/client-providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie')
  );

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bullchord</title>
        <meta name="description" content="Listen to your favorite songs on chain and earn rewards" />
      </head>
      <body>
        <ClientProviders initialState={initialState}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
