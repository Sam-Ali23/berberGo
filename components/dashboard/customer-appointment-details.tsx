"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { StartConversationButton } from "@/components/messages/start-conversation-button";
import { AlertMessage } from "@/components/shared/alert-message";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePolling } from "@/components/shared/use-polling";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDay, formatDate } from "@/lib/format";
import type { AppointmentDto } from "@/types";

type AppointmentResponse = {
  success: boolean;
  message?: string;
  data: AppointmentDto;
};

export function CustomerAppointmentDetails({ appointmentId }: { appointmentId: string }) {
  const t = useTranslations("Appointments");
  const customer = useTranslations("Customer");
  const locale = useLocale() as "ar" | "en" | "tr";
  const [appointment, setAppointment] = useState<AppointmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function loadAppointment() {
    try {
      const response = await fetch(`/api/customer/appointments/${appointmentId}`, {
        cache: "no-store",
      });
      const payload: AppointmentResponse = await response.json();

      if (!response.ok) {
        setError(t("loadDetailsError"));
        return;
      }

      setAppointment(payload.data);
      setError(null);
    } catch {
      setError(t("loadDataError"));
    } finally {
      setLoading(false);
    }
  }

  usePolling(loadAppointment, 10000);

  async function cancelAppointment() {
    setCancelling(true);

    try {
      const response = await fetch(`/api/customer/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await response.json();

      if (!response.ok) {
        setError(t("cancelError"));
        return;
      }

      await loadAppointment();
    } catch {
      setError(t("cancelUnexpected"));
    } finally {
      setCancelling(false);
    }
  }

  if (loading && !appointment) {
    return <div className="panel p-6 text-sm text-slate-500">{t("detailsLoading")}</div>;
  }

  if (!appointment) {
    return <AlertMessage variant="error" message={error ?? t("unavailable")} />;
  }

  return (
    <div className="space-y-5">
      <AlertMessage variant="error" message={error} />

      <div className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("bookingNumber", { id: appointment.id.slice(-6) })}
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{appointment.shop.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {t("createdAt", { date: formatDate(appointment.createdAt, locale) })}
            </p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label={t("serviceLabel")} value={appointment.service.name} />
          <Info label={t("barberLabel")} value={appointment.barber?.name ?? t("withoutPreference")} />
          <Info label={t("dateLabel")} value={formatDay(appointment.appointmentDate, locale)} />
          <Info label={t("timeLabel")} value={appointment.appointmentTime} />
          <Info label={t("priceLabel")} value={formatCurrency(appointment.price, locale)} />
          <Info label={t("phoneLabel")} value={appointment.customerPhone} />
          <Info label={t("addressLabel")} value={appointment.shop.address} />
          <Info label={t("updatedAtLabel")} value={formatDate(appointment.updatedAt, locale)} />
        </div>
      </div>

      {appointment.notes ? (
        <div className="panel p-6">
          <h3 className="text-lg font-bold text-slate-950">{t("notesTitle")}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{appointment.notes}</p>
        </div>
      ) : null}

      <div className="panel flex flex-wrap gap-3 p-6">
        <StartConversationButton
          scope="customer"
          appointmentId={appointment.id}
          label={customer("contactShop")}
        />
        {appointment.status === "COMPLETED" && !appointment.review ? (
          <Link href={`/customer/appointments/${appointment.id}/review`} className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            {customer("rateExperience")}
          </Link>
        ) : null}
      </div>

      {["PENDING", "CONFIRMED"].includes(appointment.status) ? (
        <div className="panel p-6">
          <Button variant="danger" loading={cancelling} onClick={cancelAppointment}>
            {t("cancelAppointment")}
          </Button>
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
