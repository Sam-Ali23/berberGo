import { getShopReviews } from "@/lib/data";
import { apiSuccess } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const reviews = await getShopReviews(id);

  return apiSuccess(
    reviews.map((review) => ({
      ...review,
      customer: review.customer
        ? {
            id: review.customer.id,
            name: review.customer.name,
          }
        : undefined,
    })),
  );
}
