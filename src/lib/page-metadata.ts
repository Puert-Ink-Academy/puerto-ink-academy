import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Screen = "dashboard" | "leaderboard" | "curriculum" | "grading" | "users";

export async function screenMetadata(screen: Screen): Promise<Metadata> {
  const nav = await getTranslations("Nav");
  const pages = await getTranslations("Metadata.pages");
  return { title: nav(screen), description: pages(screen) };
}
