import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function CustomerDashboardPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Customer.dashboardTitle")}
        description={t("Customer.dashboardDescription")}
        actionLabel={t("Common.viewAll")}
        actionHref="/customer/shops"
      />
      <CustomerDashboard />
    </div>
  );
}
