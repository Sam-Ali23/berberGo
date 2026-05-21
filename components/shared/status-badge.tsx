"use client";

import { Badge } from "@/components/ui/badge";
import { appointmentStatusClasses } from "@/lib/constants";
import type { AppointmentStatus } from "@/types";
import { useTranslations } from "next-intl";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const t = useTranslations("Statuses");

  return <Badge className={appointmentStatusClasses[status]}>{t(status)}</Badge>;
}
