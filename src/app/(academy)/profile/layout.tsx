import { AppLayout } from "@/components/layout/app-layout";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout nav="apprentice">{children}</AppLayout>;
}
