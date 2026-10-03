import { requireSessionUser } from "@/lib/auth/session";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSessionUser();
  return children;
}
