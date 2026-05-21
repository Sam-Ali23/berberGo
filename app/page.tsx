import Image from "next/image";
import Link from "next/link";

import { HeroSearchForm } from "@/components/home/hero-search-form";
import { SectionCard } from "@/components/home/section-card";
import { ShopCard } from "@/components/shop/shop-card";
import { buttonClasses } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";
import { getCustomerFacingShops, getFeaturedShops } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, featuredShops, allShops, { t }] = await Promise.all([
    getSessionUser(),
    getFeaturedShops(4),
    getCustomerFacingShops(),
    getTranslator(),
  ]);
  const primaryHref = session
    ? session.role === "CUSTOMER"
      ? "/customer/shops"
      : session.role === "SHOP_OWNER"
        ? "/shop/dashboard"
        : "/admin/dashboard"
    : "/register";
  const topRatedShops = allShops.slice(0, 3);
  const popularServices = Array.from(
    new Set(
      allShops.flatMap((shop) => (shop.services ?? []).map((service) => service.name)),
    ),
  ).slice(0, 4);

  return (
    <main className="min-h-screen pb-20">
      <section className="page-shell py-8 sm:py-12">
        <div className="overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#14213d_44%,#1d3557_100%)] shadow-[0_32px_100px_rgba(15,23,42,0.24)]">
          <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
              <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
                {t("Landing.badge")}
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {t("Landing.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {t("Landing.description")}
              </p>
              <div className="mt-8 max-w-4xl">
                <HeroSearchForm />
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={primaryHref} className={buttonClasses({ variant: "primary", size: "lg" })}>
                  {t("Landing.primaryCta")}
                </Link>
                <Link href="/register" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                  {t("Landing.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[420px] lg:min-h-[620px]">
              <Image
                src={featuredShops[0]?.coverImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80"}
                alt={featuredShops[0]?.name || "BerberGo Hero"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.35))]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-[28px] border border-white/10 bg-black/25 p-5 text-white backdrop-blur-md">
                <div className="text-sm uppercase tracking-[0.22em] text-white/65">{t("Landing.featuredTitle")}</div>
                <div className="mt-3 text-2xl font-black">{featuredShops[0]?.name}</div>
                <div className="mt-2 text-sm text-white/80">{featuredShops[0]?.description}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">{t("Landing.featuredTitle")}</h2>
            <p className="muted-text mt-2">
              {t("Landing.featuredDescription")}
            </p>
          </div>
          <Link href="/customer/shops" className={buttonClasses({ variant: "secondary", size: "sm" })}>
            {t("Common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="section-title">{t("Landing.topRatedTitle")}</h2>
          <p className="muted-text mt-2">{t("Landing.topRatedDescription")}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {topRatedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="section-title">{t("Landing.popularServicesTitle")}</h2>
          <p className="muted-text mt-2">{t("Landing.popularServicesDescription")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularServices.map((serviceName, index) => (
            <SectionCard
              key={serviceName}
              title={serviceName}
              description={t(
                index === 0
                  ? "Landing.services.haircut"
                  : index === 1
                    ? "Landing.services.beard"
                    : index === 2
                      ? "Landing.services.package"
                      : "Landing.services.kids",
              )}
              index={index}
              className="bg-white"
            />
          ))}
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="section-title">{t("Landing.howItWorksTitle")}</h2>
          <p className="muted-text mt-2">{t("Landing.howItWorksDescription")}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title={t("Landing.steps.discoverTitle")} description={t("Landing.steps.discoverDescription")} index={0} />
          <SectionCard title={t("Landing.steps.bookTitle")} description={t("Landing.steps.bookDescription")} index={1} />
          <SectionCard title={t("Landing.steps.chatTitle")} description={t("Landing.steps.chatDescription")} index={2} />
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="section-title">{t("Landing.testimonialsTitle")}</h2>
          <p className="muted-text mt-2">{t("Landing.testimonialsDescription")}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title={t("Landing.testimonials.oneAuthor")} description={t("Landing.testimonials.oneQuote")} index={0} className="bg-white" />
          <SectionCard title={t("Landing.testimonials.twoAuthor")} description={t("Landing.testimonials.twoQuote")} index={1} className="bg-white" />
          <SectionCard title={t("Landing.testimonials.threeAuthor")} description={t("Landing.testimonials.threeQuote")} index={2} className="bg-white" />
        </div>
      </section>

      <section className="page-shell py-8 sm:py-12">
        <div className="dark-panel overflow-hidden p-8 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{t("Landing.ctaTitle")}</h2>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">{t("Landing.ctaDescription")}</p>
            <div className="mt-6">
              <Link href="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
                {t("Landing.ctaButton")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
