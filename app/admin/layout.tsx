import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requirePageUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requirePageUser(["ADMIN"]);

  return (
    <DashboardLayout user={user} role="ADMIN">
      {children}
    </DashboardLayout>
  );
}
