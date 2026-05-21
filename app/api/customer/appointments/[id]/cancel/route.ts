import { getApiSessionUser } from "@/lib/auth";
import { appointmentInclude, serializeAppointment } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await context.params;
  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      customerId: auth.user.id,
    },
  });

  if (!appointment) {
    return apiError("الحجز غير موجود.", 404);
  }

  if (!["PENDING", "CONFIRMED"].includes(appointment.status)) {
    return apiError("لا يمكن إلغاء هذا الحجز في حالته الحالية.", 409);
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: appointmentInclude,
  });

  return apiSuccess(serializeAppointment(updated), "تم إلغاء الحجز.");
}
