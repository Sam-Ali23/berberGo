export const locales = ["ar", "en", "tr"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "ar";
export const localeCookieName = "berbergo_locale";

export function isValidLocale(value: string | null | undefined): value is AppLocale {
  return typeof value === "string" && locales.includes(value as AppLocale);
}

export function getDirection(locale: AppLocale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getLocaleLabel(locale: AppLocale) {
  switch (locale) {
    case "en":
      return "English";
    case "tr":
      return "Türkçe";
    case "ar":
    default:
      return "العربية";
  }
}
