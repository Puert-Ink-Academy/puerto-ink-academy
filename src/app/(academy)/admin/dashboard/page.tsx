import { AdminUsers } from "@/components/admin/admin-users";
import { platformUsers } from "@/lib/mock/admin-users";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <AdminUsers initialUsers={platformUsers} />
    </main>
  );
}
