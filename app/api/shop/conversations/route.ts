import { getApiSessionUser, getCurrentUserRecord } from "@/lib/auth";
import { findOrCreateAdminConversation, getShopConversations } from "@/lib/data";
import { getTranslator } from "@/lib/i18n/server";
import { apiError, apiSuccess } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const conversations = await getShopConversations(auth.user.id);

  return apiSuccess(conversations ?? []);
}

export async function POST() {
  const auth = await getApiSessionUser(["SHOP_OWNER"]);

  if ("error" in auth) {
    return auth.error;
  }

  const { t } = await getTranslator();
  const user = await getCurrentUserRecord();

  if (!user?.ownedShop) {
    return apiError(t("Api.unexpectedError"), 404);
  }

  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
    orderBy: { createdAt: "asc" },
  });

  if (!admin) {
    return apiError(t("Api.unexpectedError"), 404);
  }

  const conversation = await findOrCreateAdminConversation(user.ownedShop.id, admin.id);

  return apiSuccess(
    {
      conversation,
      redirectTo: `/shop/messages/${conversation.id}`,
    },
    t("Messages.contactAdmin"),
  );
}
