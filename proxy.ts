import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { dashboardRoutes, SESSION_COOKIE_NAME } from "@/lib/constants";
import { defaultLocale, isValidLocale, localeCookieName } from "@/lib/i18n/config";
import { verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const localeCookie = request.cookies.get(localeCookieName)?.value;
  const locale = isValidLocale(localeCookie) ? localeCookie : defaultLocale;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isCustomerPage = pathname.startsWith("/customer");
  const isShopPage = pathname.startsWith("/shop");
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedPage = isCustomerPage || isShopPage || isAdminPage;

  if (isAuthPage && session) {
    const response = NextResponse.redirect(new URL(dashboardRoutes[session.role], request.url));
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (!isProtectedPage) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (isCustomerPage && session.role !== "CUSTOMER") {
    const response = NextResponse.redirect(new URL(dashboardRoutes[session.role], request.url));
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (isShopPage && session.role !== "SHOP_OWNER") {
    const response = NextResponse.redirect(new URL(dashboardRoutes[session.role], request.url));
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (isAdminPage && session.role !== "ADMIN") {
    const response = NextResponse.redirect(new URL(dashboardRoutes[session.role], request.url));
    response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/login", "/register", "/customer/:path*", "/shop/:path*", "/admin/:path*"],
};
