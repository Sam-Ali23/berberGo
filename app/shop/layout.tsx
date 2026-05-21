import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requirePageUser } from "@/lib/auth";

export default async function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requirePageUser(["SHOP_OWNER"]);

  return (
    <DashboardLayout user={user} role="SHOP_OWNER">
      {children}
    </DashboardLayout>
  );
}
