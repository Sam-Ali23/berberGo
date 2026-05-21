import { redirect } from "next/navigation";

import { ReviewForm } from "@/components/reviews/review-form";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getCustomerAppointmentById } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerAppointmentReviewPage({ params }: PageProps) {
  const [{ id }, user, { t }] = await Promise.all([
    params,
    requirePageUser(["CUSTOMER"]),
    getTranslator(),
  ]);

  const appointment = await getCustomerAppointmentById(id, user.id);

  if (!appointment || appointment.status !== "COMPLETED" || appointment.review) {
    redirect(`/customer/appointments/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Customer.writeReviewTitle")}
        description={t("Customer.writeReviewDescription")}
      />
      <ReviewForm appointmentId={appointment.id} shopName={appointment.shop.name} />
    </div>
  );
}
