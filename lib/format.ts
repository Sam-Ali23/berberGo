type FormatLocale = "ar" | "en" | "tr";

function getNumberLocale(locale: FormatLocale) {
  switch (locale) {
    case "en":
      return "en-SA";
    case "tr":
      return "tr-TR";
    case "ar":
    default:
      return "ar-SA";
  }
}

export function formatCurrency(value: number, locale: FormatLocale = "ar") {
  return new Intl.NumberFormat(getNumberLocale(locale), {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date, locale: FormatLocale = "ar") {
  return new Intl.DateTimeFormat(getNumberLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDay(value: string | Date, locale: FormatLocale = "ar") {
  return new Intl.DateTimeFormat(getNumberLocale(locale), {
    dateStyle: "full",
  }).format(new Date(value));
}

export function formatRating(value: number) {
  return `${value.toFixed(1)} ★`;
}

export function formatCoordinates(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
) {
  if (latitude == null || longitude == null) {
    return "غير محدد";
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}
