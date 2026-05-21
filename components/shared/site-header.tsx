import Link from "next/link";

import { getSessionUser } from "@/lib/auth";
import { dashboardRoutes } from "@/lib/constants";
import { getTranslator } from "@/lib/i18n/server";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { buttonClasses } from "@/components/ui/button";

export async function SiteHeader() {
  const [session, { t }] = await Promise.all([getSessionUser(), getTranslator()]);
  const dashboardHref = session ? dashboardRoutes[session.role] : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(247,247,245,0.8)] backdrop-blur-xl">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0">
          <Logo subtitle={t("Brand.tagline")} />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link href="/" className={buttonClasses({ variant: "ghost", size: "sm" })}>
            {t("Nav.home")}
          </Link>
          <Link href="/customer/shops" className={buttonClasses({ variant: "ghost", size: "sm" })}>
            {t("Nav.shops")}
          </Link>
          {session?.role === "CUSTOMER" ? (
            <>
              <Link href="/customer/appointments" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.appointments")}
              </Link>
              <Link href="/customer/messages" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.messages")}
              </Link>
            </>
          ) : null}
          {session?.role === "SHOP_OWNER" ? (
            <>
              <Link href="/shop/dashboard" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.shopDashboard")}
              </Link>
              <Link href="/shop/messages" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.messages")}
              </Link>
            </>
          ) : null}
          {session?.role === "ADMIN" ? (
            <>
              <Link href="/admin/dashboard" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.adminDashboard")}
              </Link>
              <Link href="/admin/messages" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                {t("Nav.messages")}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {session ? (
            <>
              {dashboardHref ? (
                <Link href={dashboardHref} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                  {t("Nav.dashboard")}
                </Link>
              ) : null}
              <Link href="/logout" className={buttonClasses({ variant: "dark", size: "sm" })}>
                {t("Nav.logout")}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                {t("Nav.login")}
              </Link>
              <Link href="/register" className={buttonClasses({ variant: "primary", size: "sm" })}>
                {t("Nav.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
