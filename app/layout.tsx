import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import { IntlProvider } from "@/components/shared/intl-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { getDirection } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/server";

import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: t("SEO.defaultTitle"),
      template: `%s | BerberGo`,
    },
    description: t("SEO.defaultDescription"),
    openGraph: {
      title: t("SEO.defaultTitle"),
      description: t("SEO.defaultDescription"),
      type: "website",
      siteName: "BerberGo",
      url: appUrl,
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title: t("SEO.defaultTitle"),
      description: t("SEO.defaultDescription"),
    },
    applicationName: "BerberGo",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, messages } = await getTranslator();

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <IntlProvider locale={locale} messages={messages}>
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </IntlProvider>
      </body>
    </html>
  );
}
