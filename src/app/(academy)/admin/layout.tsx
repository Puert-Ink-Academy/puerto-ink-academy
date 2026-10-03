import { AppLayout } from "@/components/layout/app-layout";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");
  return (
    <AppLayout nav="admin" user={user}>
      {children}
    </AppLayout>
  );
}
