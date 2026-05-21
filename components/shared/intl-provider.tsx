"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

import type { AppLocale } from "@/lib/i18n/config";

export function IntlProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages | Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages as AbstractIntlMessages}
      timeZone="Europe/Istanbul"
    >
      {children}
    </NextIntlClientProvider>
  );
}
