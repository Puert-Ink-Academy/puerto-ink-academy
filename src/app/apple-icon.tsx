import { ImageResponse } from "next/og";

import { PwaIconArt } from "@/lib/pwa-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<PwaIconArt size={size.width} />, size);
}
