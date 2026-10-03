import { requireSessionUser } from "@/lib/session";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSessionUser();
  return children;
}
