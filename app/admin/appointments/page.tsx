import { AdminAppointmentsTable } from "@/components/dashboard/admin-appointments-table";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function AdminAppointmentsPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Admin.dashboardEyebrow")}
        title={t("Nav.appointments")}
        description={t("Admin.dashboardDescription")}
      />
      <AdminAppointmentsTable />
    </div>
  );
}
