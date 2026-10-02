import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const panelVariants = cva("rounded-xl border border-zinc-800", {
  variants: {
    variant: {
      solid: "bg-zinc-900",
      muted: "bg-zinc-900/40",
      dashed: "border-dashed bg-zinc-900/50",
    },
    padding: {
      none: "",
      flush: "overflow-hidden",
      md: "p-4 sm:p-5",
      lg: "p-5 sm:p-6",
    },
  },
  defaultVariants: {
    variant: "solid",
    padding: "md",
  },
})

type PanelProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof panelVariants> & {
    as?: "div" | "section" | "article" | "header" | "ul"
  }

function Panel({ as: Tag = "div", variant, padding, className, ...props }: PanelProps) {
  return (
    <Tag
      data-slot="panel"
      className={cn(panelVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

export { Panel, panelVariants }
