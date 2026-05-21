"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import type { BarberShopDto } from "@/types";

type CreateAppointmentResponse = {
  success: boolean;
  message?: string;
  data: {
    redirectTo: string;
  };
};

export function AppointmentBookingForm({
  shop,
  initialName,
  initialPhone,
}: {
  shop: BarberShopDto;
  initialName: string;
  initialPhone: string;
}) {
  const t = useTranslations("Appointments");
  const common = useTranslations("Common");
  const api = useTranslations("Api");
  const locale = useLocale() as "ar" | "en" | "tr";
  const router = useRouter();
  const services = useMemo(() => (shop.services ?? []).filter((service) => service.isActive), [shop.services]);
  const barbers = useMemo(() => (shop.barbers ?? []).filter((barber) => barber.isActive), [shop.barbers]);

  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [barberId, setBarberId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [customerName, setCustomerName] = useState(initialName);
  const [customerPhone, setCustomerPhone] = useState(initialPhone);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [submitting, setSubmitting] = useState(false);

  const selectedService = services.find((service) => service.id === serviceId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/customer/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: shop.id,
          serviceId,
          barberId,
          appointmentDate,
          appointmentTime,
          customerName,
          customerPhone,
          notes,
        }),
      });

      const payload: CreateAppointmentResponse = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(api("unexpectedError"));
        return;
      }

      setMessageType("success");
      setMessage(api("bookingCreated"));
      router.push(payload.data.redirectTo);
      router.refresh();
    } catch {
      setMessageType("error");
      setMessage(api("unexpectedError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader
            title={t("detailsTitle")}
            description={t("detailsDescription")}
          />

          <div className="space-y-5">
            <AlertMessage variant={messageType} message={message} />

            <FormField label={t("serviceLabel")}>
              <Select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price, locale)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label={t("barberLabel")} hint={common("optional")}>
              <Select value={barberId} onChange={(event) => setBarberId(event.target.value)}>
                <option value="">{t("withoutPreference")}</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("dateLabel")}>
                <Input type="date" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} />
              </FormField>
              <FormField label={t("timeLabel")}>
                <Input type="time" value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("customerLabel")}>
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
              </FormField>
              <FormField label={common("phone")}>
                <Input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} />
              </FormField>
            </div>

            <FormField label={t("additionalNotes")}>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </FormField>

            <Button type="submit" loading={submitting} block>
              {t("confirmBooking")}
            </Button>
          </div>
        </Card>
      </form>

      <Card>
        <CardHeader title={t("summaryTitle")} description={t("summaryDescription")} />
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="text-lg font-bold text-slate-950">{shop.name}</div>
            <p className="mt-2 text-sm leading-7 text-slate-500">{shop.address}</p>
          </div>
          {selectedService ? (
            <div className="grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{t("serviceLabel")}</span>
                <strong className="text-slate-900">{selectedService.name}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{t("priceLabel")}</span>
                <strong className="text-slate-900">{formatCurrency(selectedService.price, locale)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{t("durationLabel")}</span>
                <strong className="text-slate-900">{t("durationValue", { minutes: selectedService.durationMinutes })}</strong>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
