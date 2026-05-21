"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { UserDto } from "@/types";

type UsersResponse = {
  success: boolean;
  message?: string;
  data: UserDto[];
};

export function AdminUsersTable() {
  const t = useTranslations("AdminUsers");
  const roles = useTranslations("Roles");
  const common = useTranslations("Common");
  const locale = useLocale() as "ar" | "en" | "tr";
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" });
        const payload: UsersResponse = await response.json();

        if (!response.ok) {
          setError(t("loadError"));
          return;
        }

        setUsers(payload.data);
      } catch {
        setError(t("connectionError"));
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, [t]);

  return (
    <Card>
      <AlertMessage variant="error" message={error} />
      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3 font-semibold">{t("name")}</th>
              <th className="px-4 py-3 font-semibold">{t("email")}</th>
              <th className="px-4 py-3 font-semibold">{t("role")}</th>
              <th className="px-4 py-3 font-semibold">{t("phone")}</th>
              <th className="px-4 py-3 font-semibold">{t("createdAt")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  {t("loading")}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-4 py-4 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <Badge className="bg-slate-100 text-slate-800">{roles(user.role)}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{user.phone ?? common("notSpecified")}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(user.createdAt, locale)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
