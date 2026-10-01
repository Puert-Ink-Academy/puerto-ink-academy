import { AppLayout } from "@/components/layout/app-layout";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout nav="teacher">{children}</AppLayout>;
}
