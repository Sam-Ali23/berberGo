import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getOwnerAppointmentById } from "@/lib/data";
import { formatCurrency, formatDate, formatDay } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopAppointmentDetailsPage({ params }: PageProps) {
  const [user, { t, locale }] = await Promise.all([requirePageUser(["SHOP_OWNER"]), getTranslator()]);
  const { id } = await params;
  const appointment = await getOwnerAppointmentById(user.id, id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Appointments.detailsTitle")}
        description={t("Appointments.detailsDescription")}
      />

      <div className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("Appointments.bookingNumber", { id: appointment.id.slice(-6) })}
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{appointment.service.name}</h2>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label={t("Appointments.customerLabel")} value={appointment.customerName} />
          <Info label={t("Common.phone")} value={appointment.customerPhone} />
          <Info label={t("Appointments.shopLabel")} value={appointment.shop.name} />
          <Info label={t("Appointments.barberLabel")} value={appointment.barber?.name ?? t("Appointments.withoutPreference")} />
          <Info label={t("Appointments.dateLabel")} value={formatDay(appointment.appointmentDate, locale)} />
          <Info label={t("Appointments.timeLabel")} value={appointment.appointmentTime} />
          <Info label={t("Appointments.priceLabel")} value={formatCurrency(appointment.price, locale)} />
          <Info label={t("Appointments.updatedAtLabel")} value={formatDate(appointment.createdAt, locale)} />
        </div>
      </div>

      {appointment.notes ? (
        <div className="panel p-6">
          <h3 className="text-lg font-bold text-slate-950">{t("Appointments.notesTitle")}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{appointment.notes}</p>
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
