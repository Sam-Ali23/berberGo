"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { StartConversationButton } from "@/components/messages/start-conversation-button";
import { AlertMessage } from "@/components/shared/alert-message";
import { usePolling } from "@/components/shared/use-polling";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatRating } from "@/lib/format";
import type { BarberShopDto } from "@/types";

type ShopsResponse = {
  success: boolean;
  message?: string;
  data: BarberShopDto[];
};

export function AdminShopsTable() {
  const messages = useTranslations("Messages");
  const t = useTranslations("AdminShops");
  const common = useTranslations("Common");
  const locale = useLocale() as "ar" | "en" | "tr";
  const locationSeparator = locale === "ar" ? "، " : ", ";
  const [shops, setShops] = useState<BarberShopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  async function loadShops() {
    try {
      const response = await fetch("/api/admin/shops", { cache: "no-store" });
      const payload: ShopsResponse = await response.json();

      if (!response.ok) {
        setError(t("loadError"));
        return;
      }

      setShops(payload.data);
      setError(null);
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  usePolling(loadShops, 12000);

  async function runAction(shopId: string, action: "approve" | "disable") {
    setActingId(shopId);

    try {
      const response = await fetch(`/api/admin/shops/${shopId}/${action}`, {
        method: "PATCH",
      });
      await response.json();

      if (!response.ok) {
        setError(t("updateError"));
        return;
      }

      await loadShops();
    } catch {
      setError(t("unexpectedUpdateError"));
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <AlertMessage variant="error" message={error} />
      {loading ? <Card>{t("loading")}</Card> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {shops.map((shop) => (
          <Card key={shop.id}>
            <CardHeader
              title={shop.name}
              description={`${shop.city}${shop.district ? `${locationSeparator}${shop.district}` : ""}`}
              action={
                <Badge
                  className={
                    shop.isApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900"
                  }
                >
                  {shop.isApproved ? t("approved") : t("pendingApproval")}
                </Badge>
              }
            />
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <Info label={t("owner")} value={shop.owner?.name ?? common("notSpecified")} />
              <Info label={common("rating")} value={formatRating(shop.rating)} />
              <Info
                label={t("minPrice")}
                value={
                  shop.minServicePrice != null
                    ? formatCurrency(shop.minServicePrice, locale)
                    : common("notSpecified")
                }
              />
              <Info label={common("workingHours")} value={`${shop.openingTime} - ${shop.closingTime}`} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {!shop.isApproved ? (
                <Button loading={actingId === shop.id} onClick={() => runAction(shop.id, "approve")}>
                  {t("approveAction")}
                </Button>
              ) : null}
              <Button
                variant="danger"
                loading={actingId === shop.id}
                onClick={() => runAction(shop.id, "disable")}
              >
                {t("disableAction")}
              </Button>
              <StartConversationButton
                scope="admin"
                shopId={shop.id}
                label={messages("openConversation")}
              />
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
