import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StarRating } from "@/components/reviews/star-rating";
import { StartConversationButton } from "@/components/messages/start-conversation-button";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getShopById } from "@/lib/data";
import { formatCoordinates, formatCurrency, formatRating } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerShopDetailsPage({ params }: PageProps) {
  const [{ id }, { t, locale }] = await Promise.all([params, getTranslator()]);
  const shop = await getShopById(id);
  const locationSeparator = locale === "ar" ? "، " : ", ";

  if (!shop) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <Image
          src={shop.coverImage || shop.images[0]}
          alt={shop.name}
          width={1600}
          height={900}
          className="h-[360px] w-full object-cover"
        />
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-100 text-amber-900">{formatRating(shop.rating)}</Badge>
                <Badge className={shop.isOpen ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}>
                  {shop.isOpen ? t("Common.openNow") : t("Common.closedNow")}
                </Badge>
              </div>
              <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">{shop.name}</h1>
              <p className="max-w-3xl text-sm leading-8 text-slate-600">
                {shop.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/customer/shops/${shop.id}/book`} className={buttonClasses({ variant: "primary", size: "lg" })}>
                {t("Customer.bookNow")}
              </Link>
              <StartConversationButton
                scope="customer"
                shopId={shop.id}
                label={t("Customer.contactShop")}
              />
            </div>
          </div>

          <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
            <Info label={t("Common.address")} value={`${shop.city}${shop.district ? `${locationSeparator}${shop.district}` : ""} - ${shop.address}`} />
            <Info label={t("Common.workingHours")} value={`${shop.openingTime} - ${shop.closingTime}`} />
            <Info label={t("Common.gps")} value={formatCoordinates(shop.latitude, shop.longitude)} />
            <Info label={t("Reviews.title")} value={t("Common.reviewsCount", { count: shop.totalReviews })} />
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="section-title">{t("Common.gallery")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {shop.images.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              src={image}
              alt={`${shop.name} ${index + 1}`}
              width={900}
              height={700}
              className="h-60 w-full rounded-[28px] object-cover shadow-sm"
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-2xl font-black text-slate-950">{t("Shop.servicesAndPricing")}</h2>
          <div className="mt-5 space-y-4">
            {(shop.services ?? []).filter((service) => service.isActive).map((service) => (
              <div key={service.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{service.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{service.description}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-black text-slate-950">{formatCurrency(service.price, locale)}</div>
                    <div className="text-sm text-slate-500">{t("Appointments.durationValue", { minutes: service.durationMinutes })}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black text-slate-950">{t("Shop.teamTitle")}</h2>
          <div className="mt-5 space-y-4">
            {(shop.barbers ?? []).filter((barber) => barber.isActive).map((barber) => (
              <div key={barber.id} className="flex items-start gap-4 rounded-3xl border border-slate-200 p-4">
                <Image
                  src={barber.image || "https://placehold.co/140x140?text=Barber"}
                  alt={barber.name}
                  width={140}
                  height={140}
                  className="h-20 w-20 rounded-3xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{barber.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {barber.bio || t("ShopCard.fallbackDescription")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-950">{t("Reviews.title")}</h2>
            <div className="flex items-center gap-3">
              <StarRating value={Math.round(shop.rating)} size="sm" />
              <span className="text-sm text-slate-500">{formatRating(shop.rating)}</span>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {(shop.reviews ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">{t("Reviews.empty")}</p>
            ) : (
              shop.reviews?.map((review) => (
                <div key={review.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-bold text-slate-950">{review.customer?.name ?? t("Reviews.customerFallback")}</div>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
