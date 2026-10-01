import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iOS reads the apple-mobile-web-app tags from <head> when adding to the home screen,
  // so metadata must render blocking instead of streaming into <body>.
  htmlLimitedBots: /.*/,
  async redirects() {
    return ["apprentice", "teacher", "admin"].map((role) => ({
      source: `/${role}`,
      destination: `/${role}/dashboard`,
      permanent: false,
    }));
  },
};

export default nextConfig;
