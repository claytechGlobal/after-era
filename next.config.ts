import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images-api.printify.com" },
      { protocol: "https", hostname: "cdn.printify.com" },
      { protocol: "https", hostname: "printify-upload.s3.amazonaws.com" },
      { protocol: "https", hostname: "images.printify.com" },
      { protocol: "https", hostname: "pfy-prod-image-storage.s3.us-east-2.amazonaws.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.printify.com" }
    ]
  }
};

export default nextConfig;
