"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BarberDto } from "@/types";

type BarbersResponse = {
  success: boolean;
  message?: string;
  data: BarberDto[];
};

const initialForm = {
  name: "",
  bio: "",
  image: "",
  isActive: true,
};

export function ShopBarbersManager() {
  const t = useTranslations("ShopBarbers");
  const [barbers, setBarbers] = useState<BarberDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const loadBarbers = useCallback(async () => {
    try {
      const response = await fetch("/api/shop/barbers", { cache: "no-store" });
      const payload: BarbersResponse = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(t("loadError"));
        return;
      }

      setBarbers(payload.data);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadBarbers();
  }, [loadBarbers]);

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
        selectedId ? `/api/shop/barbers/${selectedId}` : "/api/shop/barbers",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
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
      await loadBarbers();
    } catch {
      setMessageType("error");
      setMessage(t("unexpectedSaveError"));
    } finally {
      setSaving(false);
    }
  }

  async function disableBarber(barberId: string) {
    const response = await fetch(`/api/shop/barbers/${barberId}`, {
      method: "DELETE",
    });
    await response.json();
    setMessageType(response.ok ? "success" : "error");
    setMessage(response.ok ? t("disableSuccess") : t("disableError"));
    await loadBarbers();
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
            <FormField label={t("bioLabel")}>
              <Textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
            </FormField>
            <FormField label={t("imageLabel")}>
              <Input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
            </FormField>
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
        {barbers.map((barber) => (
          <Card key={barber.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <Image
                src={barber.image || "https://placehold.co/160x160?text=Barber"}
                alt={barber.name}
                width={160}
                height={160}
                className="h-28 w-28 rounded-3xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-slate-950">{barber.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {barber.bio || t("emptyBio")}
                </p>
                <div className="mt-3 text-sm font-semibold text-slate-600">
                  {barber.isActive ? t("activeStatus") : t("inactiveStatus")}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedId(barber.id);
                  setForm({
                    name: barber.name,
                    bio: barber.bio ?? "",
                    image: barber.image ?? "",
                    isActive: barber.isActive,
                  });
                }}
              >
                {t("editAction")}
              </Button>
              <Button variant="danger" onClick={() => disableBarber(barber.id)}>
                {t("disableAction")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
