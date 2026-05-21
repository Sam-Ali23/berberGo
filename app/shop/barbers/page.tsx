import { ShopBarbersManager } from "@/components/dashboard/shop-barbers-manager";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function ShopBarbersPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Nav.barbers")}
        description={t("Shop.dashboardDescription")}
      />
      <ShopBarbersManager />
    </div>
  );
}
