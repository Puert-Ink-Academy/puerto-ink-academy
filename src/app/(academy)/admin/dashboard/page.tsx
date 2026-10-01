import { AdminUsers } from "@/components/admin/admin-users";
import { platformUsers } from "@/lib/mock/admin-users";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-violet-400 uppercase">
          Admin
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          User Management
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {platformUsers.length} accounts
        </p>
      </header>
      <AdminUsers initialUsers={platformUsers} />
    </main>
  );
}
