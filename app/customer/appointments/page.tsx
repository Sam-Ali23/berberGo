import { CustomerAppointmentsList } from "@/components/dashboard/customer-appointments-list";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

export default async function CustomerAppointmentsPage() {
  const { t } = await getTranslator();

  return (
    <div>
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Customer.appointmentsTitle")}
        description={t("Customer.appointmentsDescription")}
      />
      <CustomerAppointmentsList />
    </div>
  );
}
