import { SignJWT, jwtVerify } from "jose";

import type { Role, SessionUser } from "@/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "development-secret-change-me",
);

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    role: user.role,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub || !payload.role || !payload.name || !payload.email) {
      return null;
    }

    return {
      id: payload.sub,
      role: payload.role as Role,
      name: payload.name as string,
      email: payload.email as string,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}
