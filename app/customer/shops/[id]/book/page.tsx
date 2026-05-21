import { notFound } from "next/navigation";

import { AppointmentBookingForm } from "@/components/forms/appointment-booking-form";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentUserRecord } from "@/lib/auth";
import { getShopById } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerBookPage({ params }: PageProps) {
  const { id } = await params;
  const [shop, user, { t }] = await Promise.all([getShopById(id), getCurrentUserRecord(), getTranslator()]);

  if (!shop || !user) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={`${t("Customer.bookNow")} ${shop.name}`}
        description={t("Appointments.detailsDescription")}
      />
      <AppointmentBookingForm
        shop={shop}
        initialName={user.name}
        initialPhone={user.phone ?? ""}
      />
    </div>
  );
}
