"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { EmptyState } from "@/components/shared/empty-state";
import { usePolling } from "@/components/shared/use-polling";
import { AppointmentCard } from "@/components/shop/appointment-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { AppointmentDto, AppointmentStatus } from "@/types";

type AppointmentsResponse = {
  success: boolean;
  message?: string;
  data: AppointmentDto[];
};

const transitions: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
};

export function ShopAppointmentsManager() {
  const t = useTranslations("Appointments");
  const statuses = useTranslations("Statuses");
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actingId, setActingId] = useState<string | null>(null);

  async function loadAppointments() {
    try {
      const response = await fetch("/api/shop/appointments", { cache: "no-store" });
      const payload: AppointmentsResponse = await response.json();

      if (!response.ok) {
        setError(t("loadListError"));
        return;
      }

      setAppointments(payload.data);
      setError(null);
    } catch {
      setError(t("loadDataError"));
    } finally {
      setLoading(false);
    }
  }

  usePolling(loadAppointments, 10000);

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) =>
        statusFilter === "ALL" ? true : appointment.status === statusFilter,
      ),
    [appointments, statusFilter],
  );

  async function updateStatus(appointmentId: string, status: AppointmentStatus) {
    setActingId(appointmentId);

    try {
      const response = await fetch(`/api/shop/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      await response.json();

      if (!response.ok) {
        setError(t("updateStatusError"));
        return;
      }

      await loadAppointments();
    } catch {
      setError(t("updateStatusUnexpected"));
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="ALL">{t("allStatuses")}</option>
            <option value="PENDING">{statuses("PENDING")}</option>
            <option value="CONFIRMED">{statuses("CONFIRMED")}</option>
            <option value="COMPLETED">{statuses("COMPLETED")}</option>
            <option value="CANCELLED">{statuses("CANCELLED")}</option>
            <option value="NO_SHOW">{statuses("NO_SHOW")}</option>
          </Select>
        </div>
      </div>

      <AlertMessage variant="error" message={error} />

      {loading ? <div className="panel p-6 text-sm text-slate-500">{t("listLoading")}</div> : null}

      {!loading && filteredAppointments.length === 0 ? (
        <EmptyState
          title={t("noMatchingAppointmentsTitle")}
          description={t("noMatchingAppointmentsDescription")}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              href={`/shop/appointments/${appointment.id}`}
              showCustomer
              footer={
                <div className="flex flex-wrap gap-2">
                  {(transitions[appointment.status] ?? []).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={status === "CANCELLED" ? "danger" : "secondary"}
                      loading={actingId === appointment.id}
                      onClick={() => updateStatus(appointment.id, status)}
                    >
                      {status === "CONFIRMED"
                        ? t("confirmAction")
                        : status === "COMPLETED"
                          ? t("completeAction")
                          : status === "NO_SHOW"
                            ? t("noShowAction")
                            : t("cancelAction")}
                    </Button>
                  ))}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
