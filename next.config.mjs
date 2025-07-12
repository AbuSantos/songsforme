// next.config.js

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // Prevent SSR from bundling browser-only libs
    config.externals.push({
      "@walletconnect/ethereum-provider":
        "commonjs @walletconnect/ethereum-provider",
    });
    config.externals.push("pino-pretty");
    config.externals.push("encoding");

    return config;
  },
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: [
      "@walletconnect/ethereum-provider",
      "@wagmi/connectors",
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
