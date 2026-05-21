import { getApiSessionUser } from "@/lib/auth";
import { findOrCreateCustomerConversation, getCustomerAppointmentById, getCustomerConversations } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import { apiError, apiSuccess } from "@/lib/http";
import { conversationSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  return apiSuccess(await getCustomerConversations(auth.user.id));
}

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["CUSTOMER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { t } = await getTranslator();
  const body = await request.json();
  const result = conversationSchema.safeParse(body);

  if (!result.success) {
    return apiError(t("Api.unexpectedError"), 400, result.error.flatten());
  }

  let shopId = result.data.shopId;

  if (!shopId && result.data.appointmentId) {
    const appointment = await getCustomerAppointmentById(result.data.appointmentId, auth.user.id);
    shopId = appointment?.shopId ?? null;
  }

  if (!shopId) {
    return apiError(t("Api.unexpectedError"), 400);
  }

  const conversation = await findOrCreateCustomerConversation(auth.user.id, shopId);

  return apiSuccess(
    {
      conversation,
      redirectTo: `/customer/messages/${conversation.id}`,
    },
    t("Messages.startConversation"),
  );
}
