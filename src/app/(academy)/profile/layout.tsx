import { AppLayout } from "@/components/layout/app-layout";
import { requireSessionUser } from "@/lib/session";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();
  return (
    <AppLayout nav="apprentice" user={user}>
      {children}
    </AppLayout>
  );
}
