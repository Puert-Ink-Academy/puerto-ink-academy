import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { PwaIconArt } from "@/lib/pwa-icon";

const sizes = [192, 512] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size } = await params;
  const pixels = sizes.find((allowed) => String(allowed) === size);

  if (!pixels) {
    return new Response("Not found", { status: 404 });
  }

  const padded = request.nextUrl.searchParams.get("maskable") === "1";

  return new ImageResponse(<PwaIconArt size={pixels} padded={padded} />, {
    width: pixels,
    height: pixels,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
