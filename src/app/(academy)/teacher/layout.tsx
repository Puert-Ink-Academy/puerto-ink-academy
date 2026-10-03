import { AppLayout } from "@/components/layout/app-layout";
import { requireRole } from "@/lib/session";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("TEACHER");
  return (
    <AppLayout nav="teacher" user={user}>
      {children}
    </AppLayout>
  );
}
