import { AdminShopsTable } from "@/components/dashboard/admin-shops-table";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function AdminShopsPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Admin.dashboardEyebrow")}
        title={t("Nav.shops")}
        description={t("Admin.dashboardDescription")}
      />
      <AdminShopsTable />
    </div>
  );
}
