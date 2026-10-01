import { Toaster } from "@/components/ui/sonner";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        mobileOffset={{ top: 16 }}
      />
    </>
  );
}
