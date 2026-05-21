"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { formatCurrency, formatRating } from "@/lib/format";
import type { BarberShopDto } from "@/types";

export function ShopCard({
  shop,
  href,
}: {
  shop: BarberShopDto;
  href?: string;
}) {
  const t = useTranslations("ShopCard");
  const common = useTranslations("Common");
  const locale = useLocale() as "ar" | "en" | "tr";
  const locationSeparator = locale === "ar" ? "، " : ", ";

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]">
      <div className="relative">
        <Image
          src={shop.coverImage || shop.images[0]}
          alt={shop.name}
          width={1200}
          height={800}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-black">{shop.name}</h3>
            <Badge className="bg-white/15 text-white backdrop-blur-sm">{formatRating(shop.rating)}</Badge>
          </div>
          <p className="mt-2 text-sm text-white/85">
            {shop.city}
            {shop.district ? `${locationSeparator}${shop.district}` : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="line-clamp-3 text-sm leading-7 text-slate-600">
          {shop.description || t("fallbackDescription")}
        </p>

        <div className="flex flex-wrap gap-2">
          {shop.isOpen ? (
            <Badge className="bg-emerald-100 text-emerald-800">{common("openNow")}</Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-700">{common("closedNow")}</Badge>
          )}
          <Badge className="bg-amber-100 text-amber-900">
            {common("startsFrom", {
              price: shop.minServicePrice != null ? formatCurrency(shop.minServicePrice, locale) : "—",
            })}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            {common("reviewsCount", { count: shop.totalReviews })}
          </span>
          <Link
            href={href || `/customer/shops/${shop.id}`}
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            {t("viewShop")}
          </Link>
        </div>
      </div>
    </article>
  );
}
