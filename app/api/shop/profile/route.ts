import { getApiSessionUser } from "@/lib/auth";
import { getShopForOwner } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { shopProfileSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const shop = await getShopForOwner(auth.user.id);

  if (!shop) {
    return apiError("تعذر العثور على بيانات المحل.", 404);
  }

  return apiSuccess(shop);
}

export async function PATCH(request: Request) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = shopProfileSchema.safeParse(body);

  if (!result.success) {
    return apiError("بيانات المحل غير صالحة.", 400, result.error.flatten());
  }

  await prisma.barberShop.update({
    where: { ownerId: auth.user.id },
    data: {
      name: result.data.name,
      description: result.data.description,
      city: result.data.city,
      district: result.data.district,
      address: result.data.address,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      coverImage: result.data.coverImage,
      images: result.data.images,
      openingTime: result.data.openingTime,
      closingTime: result.data.closingTime,
      isOpen: result.data.isOpen,
    },
  });

  return apiSuccess(await getShopForOwner(auth.user.id), "تم حفظ بيانات المحل.");
}
