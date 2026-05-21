"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { LocationPicker } from "@/components/maps/location-picker";
import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BarberShopDto } from "@/types";

type ShopResponse = {
  success: boolean;
  message?: string;
  data: BarberShopDto;
};

export function ShopProfileForm() {
  const t = useTranslations("ShopProfile");
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    district: "",
    address: "",
    latitude: "",
    longitude: "",
    coverImage: "",
    images: "",
    openingTime: "10:00",
    closingTime: "22:00",
    isOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const loadProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/shop/profile", { cache: "no-store" });
      const payload: ShopResponse = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(t("loadError"));
        return;
      }

      setForm({
        name: payload.data.name,
        description: payload.data.description ?? "",
        city: payload.data.city,
        district: payload.data.district ?? "",
        address: payload.data.address,
        latitude: payload.data.latitude?.toString() ?? "",
        longitude: payload.data.longitude?.toString() ?? "",
        coverImage: payload.data.coverImage ?? "",
        images: payload.data.images.join("\n"),
        openingTime: payload.data.openingTime,
        closingTime: payload.data.closingTime,
        isOpen: payload.data.isOpen,
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/shop/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          images: form.images
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(t("saveError"));
        return;
      }

      setMessageType("success");
      setMessage(t("saved"));
      await loadProfile();
    } catch {
      setMessageType("error");
      setMessage(t("unexpectedSaveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AlertMessage variant={messageType} message={message} />

      <Card>
        <CardHeader
          title={t("basicTitle")}
          description={t("basicDescription")}
        />

        {loading ? (
          <div className="text-sm text-slate-500">{t("loading")}</div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("nameLabel")}>
                <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </FormField>
              <FormField label={t("cityLabel")}>
                <Input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("districtLabel")}>
                <Input value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} />
              </FormField>
              <FormField label={t("addressLabel")}>
                <Input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
              </FormField>
            </div>

            <FormField label={t("descriptionLabel")}>
              <Textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </FormField>

            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-800">{t("locationTitle")}</div>
              <LocationPicker
                latitude={Number.isFinite(Number(form.latitude)) ? Number(form.latitude) : null}
                longitude={Number.isFinite(Number(form.longitude)) ? Number(form.longitude) : null}
                onChange={(latitude, longitude) =>
                  setForm((current) => ({
                    ...current,
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                  }))
                }
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={t("latitudeLabel")}>
                  <Input
                    value={form.latitude}
                    onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))}
                  />
                </FormField>
                <FormField label={t("longitudeLabel")}>
                  <Input
                    value={form.longitude}
                    onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))}
                  />
                </FormField>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("coverImageLabel")}>
                <Input
                  value={form.coverImage}
                  onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
                />
              </FormField>
              <FormField label={t("imagesLabel")} hint={t("imagesHint")}>
                <Textarea
                  className="min-h-[120px]"
                  value={form.images}
                  onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t("openingLabel")}>
                <Input
                  type="time"
                  value={form.openingTime}
                  onChange={(event) => setForm((current) => ({ ...current, openingTime: event.target.value }))}
                />
              </FormField>
              <FormField label={t("closingLabel")}>
                <Input
                  type="time"
                  value={form.closingTime}
                  onChange={(event) => setForm((current) => ({ ...current, closingTime: event.target.value }))}
                />
              </FormField>
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
              <Checkbox
                checked={form.isOpen}
                onChange={(event) => setForm((current) => ({ ...current, isOpen: event.target.checked }))}
              />
              {t("openLabel")}
            </label>
          </div>
        )}
      </Card>

      <Button type="submit" loading={saving}>
        {t("saveButton")}
      </Button>
    </form>
  );
}
