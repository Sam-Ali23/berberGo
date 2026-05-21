import { ShopProfileForm } from "@/components/forms/shop-profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function ShopProfilePage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Nav.profile")}
        description={t("Shop.dashboardDescription")}
      />
      <ShopProfileForm />
    </div>
  );
}
