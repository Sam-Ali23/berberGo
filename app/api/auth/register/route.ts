import bcrypt from "bcrypt";

import { getDashboardRoute, setSessionCookie } from "@/lib/auth";
import { defaultGalleryImages, defaultShopCover } from "@/lib/constants";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات التسجيل غير مكتملة.", 400, result.error.flatten());
  }

  const { name, email, password, phone, role, city, shopName } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return apiError("هذا البريد الإلكتروني مستخدم بالفعل.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      role,
      ...(role === "SHOP_OWNER"
        ? {
            ownedShop: {
              create: {
                name: shopName || `محل ${name}`,
                description: "أضف وصفًا جذابًا للمحل من لوحة صاحب المحل.",
                city: city || "الرياض",
                district: "غير محدد",
                address: "أضف عنوان المحل بالتفصيل",
                coverImage: defaultShopCover,
                images: defaultGalleryImages,
                openingTime: "10:00",
                closingTime: "22:00",
                isOpen: true,
                isApproved: false,
              },
            },
          }
        : {}),
    },
    include: {
      ownedShop: true,
    },
  });

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
    role === "SHOP_OWNER"
      ? "تم إنشاء حساب صاحب المحل بنجاح. أكمل بيانات المحل بانتظار موافقة الإدارة."
      : "تم إنشاء الحساب بنجاح.",
  );
}
