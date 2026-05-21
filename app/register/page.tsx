import { RegisterForm } from "@/components/forms/register-form";
import { redirectAuthenticatedUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function RegisterPage() {
  const [, { t }] = await Promise.all([redirectAuthenticatedUser(), getTranslator()]);

  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="dark-panel p-8 sm:p-10">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-200">
            {t("Auth.registerBadge")}
          </span>
          <h1 className="mt-5 text-4xl font-black">{t("Auth.registerTitle")}</h1>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            {t("Auth.registerDescription")}
          </p>
        </div>
        <div className="panel p-8 sm:p-10">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
