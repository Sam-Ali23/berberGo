import { CustomerShopBrowser } from "@/components/dashboard/customer-shop-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  searchParams?: Promise<{
    city?: string | string[];
    service?: string | string[];
    date?: string | string[];
    search?: string | string[];
  }>;
};

export default async function CustomerShopsPage({ searchParams }: PageProps) {
  const [params, { t }] = await Promise.all([
    searchParams ?? Promise.resolve({} as Awaited<NonNullable<PageProps["searchParams"]>>),
    getTranslator(),
  ]);
  const city = typeof params.city === "string" ? params.city : "";
  const service = typeof params.service === "string" ? params.service : "";
  const date = typeof params.date === "string" ? params.date : "";
  const search = typeof params.search === "string" ? params.search : "";

  return (
    <div>
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Customer.shopsTitle")}
        description={t("Customer.shopsDescription")}
      />
      <CustomerShopBrowser
        initialSearch={search}
        initialCity={city || "ALL"}
        initialService={service || "ALL"}
        initialDate={date}
      />
    </div>
  );
}
