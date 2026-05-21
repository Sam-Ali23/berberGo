import { AdminUsersTable } from "@/components/dashboard/admin-users-table";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function AdminUsersPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Admin.dashboardEyebrow")}
        title={t("Nav.users")}
        description={t("Admin.dashboardDescription")}
      />
      <AdminUsersTable />
    </div>
  );
}
