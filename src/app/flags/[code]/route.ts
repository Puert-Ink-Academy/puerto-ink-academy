import * as flags from "country-flag-icons/string/3x2";

import { countryCodes, isCountryCode } from "@/lib/countries";

export const dynamic = "force-static";
export const dynamicParams = false;

const svgByCode = new Map<string, string>(Object.entries(flags));

export function generateStaticParams() {
  return countryCodes.map((code) => ({ code }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const svg = isCountryCode(code) ? svgByCode.get(code) : undefined;

  if (!svg) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
