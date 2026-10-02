import Image from "next/image"
import { cn } from "cn"

import { countryName, type CountryCode } from "@/lib/countries"

const sizes = {
  sm: { width: 16, height: 11 },
  md: { width: 24, height: 16 },
} as const

function CountryFlag({
  code,
  size = "sm",
  className,
}: {
  code: CountryCode
  size?: keyof typeof sizes
  className?: string
}) {
  const name = countryName(code)
  const { width, height } = sizes[size]

  return (
    <Image
      data-slot="country-flag"
      src={`/flags/${code}`}
      alt={name}
      title={name}
      width={width}
      height={height}
      unoptimized
      className={cn(
        "inline-block shrink-0 rounded-[2px] object-cover ring-1 ring-white/15",
        className
      )}
    />
  )
}

export { CountryFlag }
