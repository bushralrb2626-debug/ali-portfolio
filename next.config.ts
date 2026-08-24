import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/admin/login", destination: "/admin/preview", permanent: false },
    ];
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "[::1]",
    "192.168.100.10",
    "192.168.1.10",
    "192.168.0.10",
  ],
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*", "./prisma/dev.db"],
  },
};

export default nextConfig;
