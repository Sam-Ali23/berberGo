import bcrypt from "bcrypt";

import { getDashboardRoute, setSessionCookie } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الدخول غير صحيحة.", 400, result.error.flatten());
  }

  const { email, password } = result.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return apiError("البريد الإلكتروني أو كلمة المرور غير صحيحة.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return apiError("البريد الإلكتروني أو كلمة المرور غير صحيحة.", 401);
  }

  await setSessionCookie({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return apiSuccess(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: getDashboardRoute(user.role),
    },
    "تم تسجيل الدخول بنجاح.",
  );
}
