import { ShopServicesManager } from "@/components/dashboard/shop-services-manager";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function ShopServicesPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Nav.services")}
        description={t("Shop.dashboardDescription")}
      />
      <ShopServicesManager />
    </div>
  );
}
