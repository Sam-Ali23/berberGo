import { LoginForm } from "@/components/forms/login-form";
import { redirectAuthenticatedUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function LoginPage() {
  const [, { t }] = await Promise.all([redirectAuthenticatedUser(), getTranslator()]);

  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="dark-panel p-8 sm:p-10">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-200">
            {t("Auth.loginBadge")}
          </span>
          <h1 className="mt-5 text-4xl font-black">{t("Auth.loginTitle")}</h1>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            {t("Auth.loginDescription")}
          </p>
        </div>
        <div className="panel p-8 sm:p-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
