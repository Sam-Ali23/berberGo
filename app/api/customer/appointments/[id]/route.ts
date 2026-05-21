import { getApiSessionUser } from "@/lib/auth";
import { getCustomerAppointmentById } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await context.params;
  const appointment = await getCustomerAppointmentById(id, auth.user.id);

  if (!appointment) {
    return apiError("الحجز غير موجود.", 404);
  }

  return apiSuccess(appointment);
}
