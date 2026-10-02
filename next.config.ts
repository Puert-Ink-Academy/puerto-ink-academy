import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // iOS reads the apple-mobile-web-app tags from <head> when adding to the home screen,
  // so metadata must render blocking instead of streaming into <body>.
  htmlLimitedBots: /.*/,
  async redirects() {
    const roleHomes = ["apprentice", "teacher", "admin"].map((role) => ({
      source: `/${role}`,
      destination: `/${role}/dashboard`,
      permanent: false,
    }));
    return [
      ...roleHomes,
      {
        source: "/apprentice/curriculum",
        destination: "/apprentice/dashboard",
        permanent: false,
      },
      {
        source: "/apprentice/level/:level",
        destination: "/apprentice/category/fine-line/level/:level",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
