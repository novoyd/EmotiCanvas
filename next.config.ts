import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '', // Leave empty for default port
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
