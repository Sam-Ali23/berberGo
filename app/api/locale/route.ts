import { cookies } from "next/headers";

import { apiError, apiSuccess } from "@/lib/http";
import { defaultLocale, isValidLocale, localeCookieName } from "@/lib/i18n/config";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const locale = body?.locale;

  if (!isValidLocale(locale)) {
    return apiError("Invalid locale.", 400);
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale ?? defaultLocale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return apiSuccess({ locale });
}
