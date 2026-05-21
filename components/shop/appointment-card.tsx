"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { formatCurrency, formatDay } from "@/lib/format";
import type { AppointmentDto } from "@/types";

export function AppointmentCard({
  appointment,
  href,
  footer,
  showCustomer = false,
  showShop = false,
}: {
  appointment: AppointmentDto;
  href?: string;
  footer?: React.ReactNode;
  showCustomer?: boolean;
  showShop?: boolean;
}) {
  const t = useTranslations("Appointments");
  const common = useTranslations("Common");
  const locale = useLocale() as "ar" | "en" | "tr";

  return (
    <div className="panel flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {t("bookingNumber", { id: appointment.id.slice(-6) })}
          </div>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{appointment.service.name}</h3>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <Info label={t("dateLabel")} value={formatDay(appointment.appointmentDate, locale)} />
        <Info label={t("timeLabel")} value={appointment.appointmentTime} />
        <Info label={t("priceLabel")} value={formatCurrency(appointment.price, locale)} />
        <Info label={t("barberLabel")} value={appointment.barber?.name ?? t("withoutPreference")} />
        {showShop ? <Info label={t("shopLabel")} value={appointment.shop.name} /> : null}
        {showCustomer ? <Info label={t("customerLabel")} value={appointment.customerName} /> : null}
      </div>

      {appointment.notes ? (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="font-semibold text-slate-800">{t("notesTitle")}</div>
          <p className="mt-2 leading-7">{appointment.notes}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {href ? (
          <Link href={href} className={buttonClasses({ variant: "secondary", size: "sm" })}>
            {common("viewDetails")}
          </Link>
        ) : (
          <span />
        )}
        {footer}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-semibold text-slate-800">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
