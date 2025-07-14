import "./globals.css";
// import { ClientProviders } from "@/lib/client-providers";
// import { cookieToInitialState } from 'wagmi';
import { headers } from "next/headers";
import dynamic from "next/dynamic";

const ClientProviders = dynamic(
  () => import('@/lib/client-providers').then((mod) => mod.ClientProviders),
  {
    ssr: false,
    loading: () => <div>Loading providers...</div>
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize the Farcaster SDK
  // This is necessary to ensure the SDK is ready before using it


  // const initialState = typeof window !== 'undefined' ? cookieToInitialState(
  //   getConfig(),
  // ) : undefined;

  return (
    <html lang="en"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bullchord</title>
        <meta name="description" content="Listen to your favorite songs on chain and earn rewards" />
      </head>
      <body>
        <ClientProviders >
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
