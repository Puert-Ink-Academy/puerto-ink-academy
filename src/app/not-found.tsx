import { getTranslations } from "next-intl/server";

import { Custom404 } from "@/components/custom-404";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("notFound") };
}

export default function NotFound() {
  return <Custom404 />;
}
