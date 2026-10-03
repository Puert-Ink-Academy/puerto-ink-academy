import { AppLayout } from "@/components/layout/app-layout";
import { requireRole } from "@/lib/session";

export default async function ApprenticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("APPRENTICE");
  return (
    <AppLayout nav="apprentice" user={user}>
      {children}
    </AppLayout>
  );
}
