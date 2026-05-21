import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requirePageUser } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requirePageUser(["CUSTOMER"]);

  return (
    <DashboardLayout user={user} role="CUSTOMER">
      {children}
    </DashboardLayout>
  );
}
