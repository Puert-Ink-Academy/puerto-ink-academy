import type { Formats } from "next-intl";

export const formats = {
  dateTime: {
    date: { day: "numeric", month: "short", year: "numeric" },
    monthYear: { month: "short", year: "numeric" },
  },
  number: {
    score: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  },
} as const satisfies Formats;
