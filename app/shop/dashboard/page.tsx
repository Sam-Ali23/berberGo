import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AppointmentCard } from "@/components/shop/appointment-card";
import { Card } from "@/components/ui/card";
import { requirePageUser } from "@/lib/auth";
import { getOwnerDashboardData } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ShopDashboardPage() {
  const [user, { t }] = await Promise.all([requirePageUser(["SHOP_OWNER"]), getTranslator()]);
  const data = await getOwnerDashboardData(user.id);

  if (!data || !data.shop) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Shop.dashboardTitle", { name: data.shop.name })}
        description={t("Shop.dashboardDescription")}
        actionLabel={t("Nav.appointments")}
        actionHref="/shop/appointments"
      />

      {!data.shop.isApproved ? (
        <Card className="border-amber-200 bg-amber-50">
          <h3 className="text-lg font-bold text-amber-950">{t("Shop.pendingApprovalTitle")}</h3>
          <p className="mt-3 text-sm leading-7 text-amber-900">
            {t("Shop.pendingApprovalDescription")}
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t("Shop.todayAppointments")} value={data.stats.todayAppointments} />
        <StatCard label={t("Shop.upcomingAppointments")} value={data.stats.upcomingAppointments} />
        <StatCard label={t("Shop.pendingAppointments")} value={data.stats.pendingAppointments} />
        <StatCard label={t("Shop.servicesCount")} value={data.stats.servicesCount} />
        <StatCard label={t("Shop.shopRating")} value={data.stats.rating.toFixed(1)} />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">{t("Shop.nearestAppointments")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("Shop.nearestAppointmentsDescription")}</p>
        </div>

        {data.appointments.length === 0 ? (
          <EmptyState
            title={t("Customer.noAppointmentsTitle")}
            description={t("Customer.noAppointmentsDescription")}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {data.appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                href={`/shop/appointments/${appointment.id}`}
                showCustomer
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
