import { getApiSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { shopServiceSchema } from "@/lib/validations";
import { serializeService } from "@/lib/data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = shopServiceSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الخدمة غير صالحة.", 400, result.error.flatten());
  }

  const { id } = await context.params;
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const service = await prisma.service.updateMany({
    where: {
      id,
      shopId: shop.id,
    },
    data: result.data,
  });

  if (service.count === 0) {
    return apiError("الخدمة غير موجودة.", 404);
  }

  const updated = await prisma.service.findUnique({ where: { id } });
  return apiSuccess(updated ? serializeService(updated) : null, "تم تحديث الخدمة.");
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

  const result = await prisma.service.updateMany({
    where: {
      id,
      shopId: shop.id,
    },
    data: {
      isActive: false,
    },
  });

  if (result.count === 0) {
    return apiError("الخدمة غير موجودة.", 404);
  }

  return apiSuccess({ disabled: true }, "تم تعطيل الخدمة.");
}
