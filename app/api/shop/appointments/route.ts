import { getApiSessionUser } from "@/lib/auth";
import { getOwnerAppointments } from "@/lib/data";
import { apiError, apiSuccess } from "@/lib/http";

export async function GET() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const appointments = await getOwnerAppointments(auth.user.id);

  if (!appointments) {
    return apiError("تعذر تحميل الحجوزات.", 404);
  }

  return apiSuccess(appointments);
}
