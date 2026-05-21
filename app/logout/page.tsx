"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LogoutPage() {
  const router = useRouter();
  const common = useTranslations("Common");

  useEffect(() => {
    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    }

    void logout();
  }, [router]);

  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-12">
      <div className="panel max-w-md p-8 text-center">
        <h1 className="text-2xl font-black text-slate-950">{common("loadingAction")}</h1>
        <p className="mt-3 text-sm text-slate-500">{common("loading")}</p>
      </div>
    </main>
  );
}
