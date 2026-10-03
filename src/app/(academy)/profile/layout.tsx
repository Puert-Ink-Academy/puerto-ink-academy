import { AppLayout } from "@/components/layout/app-layout";
import { navKeyFor, requireSessionUser } from "@/lib/auth/session";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();
  return (
    <AppLayout nav={navKeyFor(user.role)} user={user}>
      {children}
    </AppLayout>
  );
}
