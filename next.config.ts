import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iOS reads the apple-mobile-web-app tags from <head> when adding to the home screen,
  // so metadata must render blocking instead of streaming into <body>.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
