import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const sectionLabelVariants = cva(
  "text-[0.7rem] font-medium tracking-[0.12em] uppercase",
  {
    variants: {
      tone: {
        muted: "text-zinc-400",
        marketing: "text-amber-400",
        admin: "text-violet-400",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  }
)

type SectionLabelProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionLabelVariants> & {
    as?: "p" | "h2" | "h3" | "span" | "dt"
  }

function SectionLabel({ as: Tag = "p", tone, className, ...props }: SectionLabelProps) {
  return (
    <Tag
      data-slot="section-label"
      className={cn(sectionLabelVariants({ tone }), className)}
      {...props}
    />
  )
}

export { SectionLabel, sectionLabelVariants }
