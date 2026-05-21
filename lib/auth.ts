import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { dashboardRoutes, SESSION_COOKIE_NAME } from "@/lib/constants";
import { getTranslator } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import type { Role, SessionUser } from "@/types";

export function getDashboardRoute(role: Role) {
  return dashboardRoutes[role];
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function redirectAuthenticatedUser() {
  const user = await getSessionUser();

  if (user) {
    redirect(getDashboardRoute(user.role));
  }
}

export async function requirePageUser(roles?: Role[]) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (roles && !roles.includes(user.role)) {
    redirect(getDashboardRoute(user.role));
  }

  return user;
}

export async function getApiSessionUser(roles?: Role[]) {
  const user = await getSessionUser();
  const { t } = await getTranslator();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: t("Api.mustLogin") },
        { status: 401 },
      ),
    };
  }

  if (roles && !roles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { success: false, message: t("Api.forbidden") },
        { status: 403 },
      ),
    };
  }

  return { user };
}

export async function getCurrentUserRecord() {
  const session = await getSessionUser();

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.id },
    include: {
      ownedShop: {
        include: {
          services: true,
          barbers: true,
          reviews: true,
        },
      },
    },
  });
}
