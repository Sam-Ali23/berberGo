import { getApiSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["ADMIN"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await context.params;
  const shop = await prisma.barberShop.findUnique({ where: { id } });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  await prisma.barberShop.update({
    where: { id },
    data: {
      isApproved: true,
    },
  });

  return apiSuccess({ approved: true }, "تمت الموافقة على المحل.");
}
