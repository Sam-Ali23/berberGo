import { getApiSessionUser } from "@/lib/auth";
import { findOrCreateAdminConversation, getAdminConversations } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import { apiError, apiSuccess } from "@/lib/http";
import { conversationSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getApiSessionUser(["ADMIN"]);

  if ("error" in auth) {
    return auth.error;
  }

  return apiSuccess(await getAdminConversations(auth.user.id));
}

export async function POST(request: Request) {
  const auth = await getApiSessionUser(["ADMIN"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { t } = await getTranslator();
  const body = await request.json();
  const result = conversationSchema.safeParse(body);

  if (!result.success || !result.data.shopId) {
    return apiError(t("Api.unexpectedError"), 400, result.error?.flatten());
  }

  const conversation = await findOrCreateAdminConversation(result.data.shopId, auth.user.id);

  return apiSuccess(
    {
      conversation,
      redirectTo: `/admin/messages/${conversation.id}`,
    },
    t("Messages.contactAdmin"),
  );
}
