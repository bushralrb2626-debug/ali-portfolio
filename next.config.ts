import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/admin/login", destination: "/admin/preview", permanent: false },
    ];
  },
  allowedDevOrigins: ["192.168.100.10", "127.0.0.1"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*", "./dev.db"],
  },
};

export default nextConfig;
