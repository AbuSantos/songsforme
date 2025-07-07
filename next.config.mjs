/** @type {import('next').NextConfig} */
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
    config.externals.push("pino-pretty", "encoding");

    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      loader: "string-replace-loader",
      options: {
        search: "export {};",
        replace: "",
        flags: "g",
      },
    });
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
