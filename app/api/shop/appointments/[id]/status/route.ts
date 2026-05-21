import { getApiSessionUser } from "@/lib/auth";
import { appointmentInclude, serializeAppointment } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { appointmentStatusSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const transitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const result = appointmentStatusSchema.safeParse(body);

  if (!result.success) {
    return apiError("حالة الحجز غير صالحة.", 400, result.error.flatten());
  }

  const { id } = await context.params;
  const shop = await prisma.barberShop.findUnique({
    where: { ownerId: auth.user.id },
    select: { id: true },
  });

  if (!shop) {
    return apiError("المحل غير موجود.", 404);
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      shopId: shop.id,
    },
  });

  if (!appointment) {
    return apiError("الحجز غير موجود.", 404);
  }

  if (appointment.status === result.data.status) {
    const same = await prisma.appointment.findUnique({
      where: { id },
      include: appointmentInclude,
    });

    return apiSuccess(same ? serializeAppointment(same) : null, "تم الاحتفاظ بالحالة الحالية.");
  }

  const allowed = transitions[appointment.status] ?? [];

  if (!allowed.includes(result.data.status)) {
    return apiError("هذا الانتقال بين الحالات غير مسموح.", 409);
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status: result.data.status,
    },
    include: appointmentInclude,
  });

  return apiSuccess(serializeAppointment(updated), "تم تحديث حالة الحجز.");
}
