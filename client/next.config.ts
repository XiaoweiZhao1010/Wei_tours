import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/** Pin Turbopack root so a lockfile higher in the tree (e.g. ~/bun.lock) does not hijack resolution. */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/img/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
