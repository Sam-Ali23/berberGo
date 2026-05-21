"use client";

import { Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { locales, type AppLocale } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const router = useRouter();
  const t = useTranslations("Locale");
  const activeLocale = useLocale() as AppLocale;
  const [value, setValue] = useState<AppLocale>(activeLocale);
  const [isPending, startTransition] = useTransition();

  async function handleChange(nextLocale: AppLocale) {
    setValue(nextLocale);

    await fetch("/api/locale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale: nextLocale }),
    });

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur-sm">
      <Globe2 className="h-4 w-4 text-slate-500" />
      <span className="sr-only">{t("switchLabel")}</span>
      <select
        className="bg-transparent outline-none"
        value={value}
        onChange={(event) => void handleChange(event.target.value as AppLocale)}
        disabled={isPending}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {t(`names.${locale}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
