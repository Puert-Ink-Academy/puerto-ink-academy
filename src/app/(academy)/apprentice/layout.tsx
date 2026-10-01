import { AppLayout } from "@/components/layout/app-layout";

export default function ApprenticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout nav="apprentice">{children}</AppLayout>;
}
