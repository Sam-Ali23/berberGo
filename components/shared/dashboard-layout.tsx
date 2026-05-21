import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { getTranslator } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import type { Role, SessionUser } from "@/types";

import { Logo } from "@/components/shared/logo";

export async function DashboardLayout({
  user,
  role,
  children,
}: {
  user: SessionUser;
  role: Role;
  children: React.ReactNode;
}) {
  const { t } = await getTranslator();
  const navigationByRole: Record<Role, Array<{ href: string; label: string }>> = {
    CUSTOMER: [
      { href: "/customer/dashboard", label: t("Nav.customerDashboard") },
      { href: "/customer/shops", label: t("Nav.shops") },
      { href: "/customer/appointments", label: t("Nav.appointments") },
      { href: "/customer/messages", label: t("Nav.messages") },
    ],
    SHOP_OWNER: [
      { href: "/shop/dashboard", label: t("Nav.shopDashboard") },
      { href: "/shop/profile", label: t("Nav.profile") },
      { href: "/shop/services", label: t("Nav.services") },
      { href: "/shop/barbers", label: t("Nav.barbers") },
      { href: "/shop/appointments", label: t("Nav.appointments") },
      { href: "/shop/messages", label: t("Nav.messages") },
    ],
    ADMIN: [
      { href: "/admin/dashboard", label: t("Nav.stats") },
      { href: "/admin/users", label: t("Nav.users") },
      { href: "/admin/shops", label: t("Nav.shops") },
      { href: "/admin/appointments", label: t("Nav.appointments") },
      { href: "/admin/messages", label: t("Nav.messages") },
    ],
  };
  const navigation = navigationByRole[role];

  return (
    <div className="min-h-[calc(100vh-5rem)] pb-10">
      <div className="page-shell py-5 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="dark-panel p-6">
              <Link href="/" className="block">
                <Logo subtitle={t("Dashboard.sidebarDescription")} className="items-start" />
              </Link>
              <p className="mt-2 text-sm text-slate-300">
                {APP_NAME} {t("Dashboard.sidebarDescription")}
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-400">{t("Dashboard.currentAccount")}</div>
                <div className="mt-2 text-lg font-bold">{user.name}</div>
                <div className="mt-1 text-sm text-slate-300">{user.email}</div>
                <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  {role === "CUSTOMER"
                    ? t("Auth.customer")
                    : role === "SHOP_OWNER"
                      ? t("Auth.shopOwner")
                      : t("Admin.dashboardEyebrow")}
                </div>
              </div>
            </div>

            <nav className="panel p-3">
              <div className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {t("Dashboard.navigation")}
              </div>
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/logout"
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  {t("Nav.logout")}
                </Link>
              </div>
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
