import { getApiSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeShop, serializeUser } from "@/lib/data";

export async function GET() {
  const auth = await getApiSessionUser();

  if ("error" in auth) {
    return auth.error;
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    include: {
      ownedShop: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          services: true,
          barbers: true,
          reviews: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  role: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return apiError("المستخدم غير موجود.", 404);
  }

  return apiSuccess({
    user: serializeUser(user),
    ownedShop: user.ownedShop ? serializeShop(user.ownedShop) : null,
  });
}
