import { getShopById } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const shop = await getShopById(id);

  if (!shop) {
    return apiError("المحل غير موجود أو غير متاح حاليًا.", 404);
  }

  const { reviews, ...publicShop } = shop;

  return apiSuccess({
    ...publicShop,
    owner: undefined,
    reviews: (reviews ?? []).map((review) => ({
      ...review,
      customer: review.customer
        ? {
            id: review.customer.id,
            name: review.customer.name,
          }
        : undefined,
    })),
  });
}
