import { requireAdmin } from "@/lib/admin";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · NutriBone" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <AdminShell email={session.email} role={session.role}>
      {children}
    </AdminShell>
  );
}
