import { ShopAppointmentsManager } from "@/components/dashboard/shop-appointments-manager";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function ShopAppointmentsPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Nav.appointments")}
        description={t("Shop.dashboardDescription")}
      />
      <ShopAppointmentsManager />
    </div>
  );
}
