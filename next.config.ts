import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/admin/login", destination: "/admin/preview", permanent: false },
      {
        source: "/demos/brightsteps",
        destination: "/demos/brightsteps/index.html",
        permanent: false,
      },
      {
        source: "/demos/brightsteps/",
        destination: "/demos/brightsteps/index.html",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/evidence/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/demos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
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
  serverExternalPackages: ["@prisma/client", "prisma", "@cursor/sdk"],
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*", "./prisma/dev.db"],
    "/api/campus-bot": [
      "./node_modules/@cursor/sdk/**/*",
      "./node_modules/@cursor/sdk-*/**/*",
      "./public/demos/brightsteps/**/*",
    ],
  },
};

export default nextConfig;
