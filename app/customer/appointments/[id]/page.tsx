import { CustomerAppointmentDetails } from "@/components/dashboard/customer-appointment-details";
import { PageHeader } from "@/components/shared/page-header";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerAppointmentDetailsPage({ params }: PageProps) {
  const [{ id }, { t }] = await Promise.all([params, getTranslator()]);

  return (
    <div>
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Appointments.detailsTitle")}
        description={t("Customer.appointmentsDescription")}
      />
      <CustomerAppointmentDetails appointmentId={id} />
    </div>
  );
}
