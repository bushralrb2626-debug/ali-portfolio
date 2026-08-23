import { execSync } from "node:child_process";
import type { NextConfig } from "next";

const isProdBuild =
  process.env.NODE_ENV === "production" &&
  process.argv.some((arg) => arg === "build" || arg.endsWith("build"));

if (isProdBuild) {
  execSync(
    "npx prisma generate && npx prisma db push && npx tsx prisma/reseed-ads.ts",
    { stdio: "inherit" },
  );
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.10", "127.0.0.1"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*"],
  },
};

export default nextConfig;
