import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static output: no server, no cold start. Every number is precomputed
  // at build time by scripts/export_web.py into public/data.json.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
