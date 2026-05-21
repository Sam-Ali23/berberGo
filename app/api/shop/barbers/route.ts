import { getApiSessionUser } from "@/lib/auth";
import { getOwnerBarbers, serializeBarber } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { shopBarberSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const barbers = await getOwnerBarbers(auth.user.id);

  if (!barbers) {
    return apiError("تعذر تحميل الحلاقين.", 404);
  }

  return apiSuccess(barbers);
}

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = shopBarberSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الحلاق غير صالحة.", 400, result.error.flatten());
  }

  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const barber = await prisma.barber.create({
    data: {
      shopId: shop.id,
      ...result.data,
    },
  });

  return apiSuccess(serializeBarber(barber), "تمت إضافة الحلاق.");
}
