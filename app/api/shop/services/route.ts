import { getApiSessionUser } from "@/lib/auth";
import { getOwnerServices, serializeService } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { shopServiceSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const services = await getOwnerServices(auth.user.id);

  if (!services) {
    return apiError("تعذر تحميل خدمات المحل.", 404);
  }

  return apiSuccess(services);
}

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = shopServiceSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات الخدمة غير صالحة.", 400, result.error.flatten());
  }

  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const service = await prisma.service.create({
    data: {
      shopId: shop.id,
      ...result.data,
    },
  });

  return apiSuccess(serializeService(service), "تمت إضافة الخدمة بنجاح.");
}
