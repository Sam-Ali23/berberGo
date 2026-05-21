"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/shared/empty-state";
import { AlertMessage } from "@/components/shared/alert-message";
import { usePolling } from "@/components/shared/use-polling";
import { ShopCard } from "@/components/shop/shop-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { BarberShopDto } from "@/types";

type ShopsResponse = {
  success: boolean;
  message?: string;
  data: BarberShopDto[];
};

export function CustomerShopBrowser({
  compact = false,
  initialSearch = "",
  initialCity = "ALL",
  initialService = "ALL",
  initialDate = "",
}: {
  compact?: boolean;
  initialSearch?: string;
  initialCity?: string;
  initialService?: string;
  initialDate?: string;
}) {
  const t = useTranslations("Filters");
  const common = useTranslations("Common");
  const [shops, setShops] = useState<BarberShopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState(initialService);

  const deferredSearch = useDeferredValue(search);

  usePolling(async () => {
    try {
      const response = await fetch("/api/shops", { cache: "no-store" });
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
  }, 20000);

  const cities = useMemo(
    () => Array.from(new Set(shops.map((shop) => shop.city))).sort(),
    [shops],
  );

  const serviceNames = useMemo(
    () =>
      Array.from(
        new Set(
          shops.flatMap((shop) => (shop.services ?? []).map((service) => service.name)),
        ),
      ).sort(),
    [shops],
  );

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const searchableText = `${shop.name} ${shop.city} ${shop.district ?? ""}`.toLowerCase();
      const matchesSearch =
        deferredSearch.trim().length === 0 ||
        searchableText.includes(deferredSearch.trim().toLowerCase());

      const matchesCity = city === "ALL" || shop.city === city;
      const matchesService =
        serviceFilter === "ALL" ||
        (shop.services ?? []).some((service) => service.name === serviceFilter);

      const minPrice = shop.minServicePrice ?? 0;
      const matchesPrice =
        priceFilter === "ALL" ||
        (priceFilter === "UNDER_60" && minPrice < 60) ||
        (priceFilter === "60_100" && minPrice >= 60 && minPrice <= 100) ||
        (priceFilter === "ABOVE_100" && minPrice > 100);

      const matchesRating =
        ratingFilter === "ALL" ||
        (ratingFilter === "4_PLUS" && shop.rating >= 4) ||
        (ratingFilter === "4_5_PLUS" && shop.rating >= 4.5);

      return matchesSearch && matchesCity && matchesService && matchesPrice && matchesRating;
    });
  }, [shops, deferredSearch, city, serviceFilter, priceFilter, ratingFilter]);

  const renderedShops = compact ? filteredShops.slice(0, 6) : filteredShops;

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="ALL">{t("allCities")}</option>
            {cities.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </Select>
          <Select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
            <option value="ALL">{t("allServices")}</option>
            {serviceNames.map((serviceName) => (
              <option key={serviceName} value={serviceName}>
                {serviceName}
              </option>
            ))}
          </Select>
          <Select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            <option value="ALL">{t("allPrices")}</option>
            <option value="UNDER_60">{t("under60")}</option>
            <option value="60_100">{t("between60And100")}</option>
            <option value="ABOVE_100">{t("above100")}</option>
          </Select>
          <Select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
            <option value="ALL">{t("allRatings")}</option>
            <option value="4_PLUS">{t("fourPlus")}</option>
            <option value="4_5_PLUS">{t("fourHalfPlus")}</option>
          </Select>
        </div>
        {initialDate ? (
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {common("date")}: <strong className="text-slate-950">{initialDate}</strong>
          </div>
        ) : null}
      </div>

      <AlertMessage variant="error" message={error} />

      {loading ? (
        <div className="panel p-6 text-sm text-slate-500">{t("loading")}</div>
      ) : filteredShops.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {renderedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
