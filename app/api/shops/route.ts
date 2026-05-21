import { getCustomerFacingShops } from "@/lib/data";
import { apiSuccess } from "@/lib/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const shops = await getCustomerFacingShops({
    search: searchParams.get("search"),
    city: searchParams.get("city"),
    service: searchParams.get("service"),
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null,
  });

  return apiSuccess(shops.map((shop) => ({
    ...shop,
    owner: undefined,
    barbers: undefined,
    reviews: undefined,
  })));
}
