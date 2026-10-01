import { ImageResponse } from "next/og";

import { PwaIconArt } from "@/lib/pwa-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<PwaIconArt size={size.width} />, size);
}
