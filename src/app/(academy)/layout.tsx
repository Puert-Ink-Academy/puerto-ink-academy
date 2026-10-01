import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/sonner";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        mobileOffset={{ top: 16 }}
      />
    </AppLayout>
  );
}
