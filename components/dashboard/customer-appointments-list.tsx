"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { EmptyState } from "@/components/shared/empty-state";
import { usePolling } from "@/components/shared/use-polling";
import { AppointmentCard } from "@/components/shop/appointment-card";
import { Button } from "@/components/ui/button";
import type { AppointmentDto } from "@/types";

type AppointmentsResponse = {
  success: boolean;
  message?: string;
  data: AppointmentDto[];
};

export function CustomerAppointmentsList() {
  const t = useTranslations("Customer");
  const appointmentsT = useTranslations("Appointments");
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  async function loadAppointments() {
    try {
      const response = await fetch("/api/customer/appointments", { cache: "no-store" });
      const payload: AppointmentsResponse = await response.json();

      if (!response.ok) {
        setError(appointmentsT("loadListError"));
        return;
      }

      setAppointments(payload.data);
      setError(null);
    } catch {
      setError(appointmentsT("loadDataError"));
    } finally {
      setLoading(false);
    }
  }

  usePolling(loadAppointments, 10000);

  async function cancelAppointment(appointmentId: string) {
    setActingId(appointmentId);

    try {
      const response = await fetch(`/api/customer/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await response.json();

      if (!response.ok) {
        setError(appointmentsT("cancelError"));
        return;
      }

      await loadAppointments();
    } catch {
      setError(appointmentsT("cancelUnexpected"));
    } finally {
      setActingId(null);
    }
  }

  if (!loading && appointments.length === 0) {
    return (
      <EmptyState
        title={t("noAppointmentsTitle")}
        description={t("noAppointmentsDescription")}
        actionLabel={t("shopsTitle")}
        actionHref="/customer/shops"
      />
    );
  }

  return (
    <div className="space-y-4">
      <AlertMessage variant="error" message={error} />
      {loading ? <div className="panel p-6 text-sm text-slate-500">{appointmentsT("listLoading")}</div> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            href={`/customer/appointments/${appointment.id}`}
            showShop
            footer={
              <div className="flex flex-wrap gap-2">
                {["PENDING", "CONFIRMED"].includes(appointment.status) ? (
                  <Button
                    size="sm"
                    variant="danger"
                    loading={actingId === appointment.id}
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    {appointmentsT("cancelAction")}
                  </Button>
                ) : null}
                {appointment.status === "COMPLETED" && !appointment.review ? (
                  <Link
                    href={`/customer/appointments/${appointment.id}/review`}
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    {t("rateExperience")}
                  </Link>
                ) : null}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
