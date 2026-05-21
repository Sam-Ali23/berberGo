import { getApiSessionUser } from "@/lib/auth";
import { getReviewableAppointment, refreshShopRating, serializeReview } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { getTranslator } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { t } = await getTranslator();
  const body = await request.json();
  const result = reviewSchema.safeParse(body);

  if (!result.success) {
    return apiError(t("Api.unexpectedError"), 400, result.error.flatten());
  }

  const appointment = await getReviewableAppointment(auth.user.id, result.data.appointmentId);

  if (!appointment) {
    return apiError(t("Reviews.completedOnly"), 400);
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      appointmentId: appointment.id,
      customerId: auth.user.id,
    },
  });

  if (existingReview) {
    return apiError(t("Reviews.alreadyReviewed"), 409);
  }

  const review = await prisma.review.create({
    data: {
      appointmentId: appointment.id,
      customerId: auth.user.id,
      shopId: appointment.shopId,
      rating: result.data.rating,
      comment: result.data.comment,
    },
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
  });

  await refreshShopRating(appointment.shopId);

  return apiSuccess(serializeReview(review), t("Reviews.success"));
}
