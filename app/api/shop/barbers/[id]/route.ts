import { getApiSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { shopBarberSchema } from "@/lib/validations";
import { serializeBarber } from "@/lib/data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = shopBarberSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الحلاق غير صالحة.", 400, result.error.flatten());
  }

  const { id } = await context.params;
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const updateResult = await prisma.barber.updateMany({
    where: {
      id,
      shopId: shop.id,
    },
    data: result.data,
  });

  if (updateResult.count === 0) {
    return apiError("الحلاق غير موجود.", 404);
  }

  const barber = await prisma.barber.findUnique({ where: { id } });
  return apiSuccess(barber ? serializeBarber(barber) : null, "تم تحديث الحلاق.");
}

export async function DELETE(_: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await context.params;
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const result = await prisma.barber.updateMany({
    where: {
      id,
      shopId: shop.id,
    },
    data: { isActive: false },
  });

  if (result.count === 0) {
    return apiError("الحلاق غير موجود.", 404);
  }

  return apiSuccess({ disabled: true }, "تم تعطيل الحلاق.");
}
