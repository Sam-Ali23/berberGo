import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AppointmentCard } from "@/components/shop/appointment-card";
import { getAdminDashboardData } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ stats, recentAppointments }, { t }] = await Promise.all([getAdminDashboardData(), getTranslator()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Admin.dashboardEyebrow")}
        title={t("Admin.dashboardTitle")}
        description={t("Admin.dashboardDescription")}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t("Admin.customersCount")} value={stats.customers} />
        <StatCard label={t("Admin.shopsCount")} value={stats.shops} />
        <StatCard label={t("Admin.appointmentsCount")} value={stats.appointments} />
        <StatCard label={t("Admin.todayAppointments")} value={stats.todayAppointments} />
        <StatCard label={t("Admin.pendingApproval")} value={stats.pendingApprovalShops} />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">{t("Admin.recentAppointments")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("Admin.recentAppointmentsDescription")}</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {recentAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showCustomer
              showShop
            />
          ))}
        </div>
      </section>
    </div>
  );
}
