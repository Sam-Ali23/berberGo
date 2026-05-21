import { getApiSessionUser } from "@/lib/auth";
import { createConversationMessage, getConversationByIdForUser } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import { apiError, apiSuccess } from "@/lib/http";
import { emitConversationMessage } from "@/lib/socket-server";
import { messageSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await context.params;
  const data = await getConversationByIdForUser(id, auth.user);

  if (!data) {
    return apiError("Conversation not found.", 404);
  }

  return apiSuccess(data);
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { t } = await getTranslator();
  const { id } = await context.params;
  const body = await request.json();
  const result = messageSchema.safeParse(body);

  if (!result.success) {
    return apiError(t("Api.unexpectedError"), 400, result.error.flatten());
  }

  const conversation = await getConversationByIdForUser(id, auth.user);

  if (!conversation) {
    return apiError("Conversation not found.", 404);
  }

  const message = await createConversationMessage(id, auth.user.id, result.data.text);
  await emitConversationMessage(id, message);

  return apiSuccess(message, t("Api.messageSent"));
}
