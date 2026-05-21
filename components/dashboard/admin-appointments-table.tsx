"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { EmptyState } from "@/components/shared/empty-state";
import { usePolling } from "@/components/shared/use-polling";
import { AppointmentCard } from "@/components/shop/appointment-card";
import type { AppointmentDto } from "@/types";

type AppointmentsResponse = {
  success: boolean;
  message?: string;
  data: AppointmentDto[];
};

export function AdminAppointmentsTable() {
  const t = useTranslations("AdminAppointments");
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePolling(async () => {
    try {
      const response = await fetch("/api/admin/appointments", { cache: "no-store" });
      const payload: AppointmentsResponse = await response.json();

      if (!response.ok) {
        setError(t("loadError"));
        return;
      }

      setAppointments(payload.data);
      setError(null);
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }, 15000);

  return (
    <div className="space-y-4">
      <AlertMessage variant="error" message={error} />
      {loading ? <div className="panel p-6 text-sm text-slate-500">{t("loading")}</div> : null}
      {!loading && appointments.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showCustomer
              showShop
            />
          ))}
        </div>
      )}
    </div>
  );
}
