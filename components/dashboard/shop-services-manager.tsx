"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import type { ServiceDto } from "@/types";

type ServicesResponse = {
  success: boolean;
  message?: string;
  data: ServiceDto[];
};

const initialForm = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
  isActive: true,
};

export function ShopServicesManager() {
  const t = useTranslations("ShopServices");
  const appointments = useTranslations("Appointments");
  const locale = useLocale() as "ar" | "en" | "tr";
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const loadServices = useCallback(async () => {
    try {
      const response = await fetch("/api/shop/services", { cache: "no-store" });
      const payload: ServicesResponse = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(t("loadError"));
        return;
      }

      setServices(payload.data);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  function resetForm() {
    setSelectedId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        selectedId ? `/api/shop/services/${selectedId}` : "/api/shop/services",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            durationMinutes: Number(form.durationMinutes),
            isActive: form.isActive,
          }),
        },
      );

      await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(t("saveError"));
        return;
      }

      setMessageType("success");
      setMessage(t("saved"));
      resetForm();
      await loadServices();
    } catch {
      setMessageType("error");
      setMessage(t("unexpectedSaveError"));
    } finally {
      setSaving(false);
    }
  }

  async function disableService(serviceId: string) {
    const response = await fetch(`/api/shop/services/${serviceId}`, {
      method: "DELETE",
    });
    await response.json();
    setMessageType(response.ok ? "success" : "error");
    setMessage(response.ok ? t("disableSuccess") : t("disableError"));
    await loadServices();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader
            title={selectedId ? t("editTitle") : t("createTitle")}
            description={t("description")}
          />
          <div className="space-y-4">
            <AlertMessage variant={messageType} message={message} />
            <FormField label={t("nameLabel")}>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </FormField>
            <FormField label={t("descriptionLabel")}>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("priceLabel")}>
                <Input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
              </FormField>
              <FormField label={t("durationLabel")}>
                <Input value={form.durationMinutes} onChange={(event) => setForm((current) => ({ ...current, durationMinutes: event.target.value }))} />
              </FormField>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              />
              {t("activeLabel")}
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={saving}>
                {selectedId ? t("saveEdit") : t("create")}
              </Button>
              {selectedId ? (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  {t("cancelEdit")}
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      </form>

      <div className="space-y-4">
        {loading ? <Card>{t("loading")}</Card> : null}
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader title={service.name} description={service.description ?? t("noDescription")} />
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <Info label={t("priceLabel")} value={formatCurrency(service.price, locale)} />
              <Info label={t("durationLabel")} value={appointments("durationValue", { minutes: service.durationMinutes })} />
              <Info label={t("statusLabel")} value={service.isActive ? t("activeStatus") : t("inactiveStatus")} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedId(service.id);
                  setForm({
                    name: service.name,
                    description: service.description ?? "",
                    price: String(service.price),
                    durationMinutes: String(service.durationMinutes),
                    isActive: service.isActive,
                  });
                }}
              >
                {t("editAction")}
              </Button>
              <Button variant="danger" onClick={() => disableService(service.id)}>
                {t("disableAction")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
