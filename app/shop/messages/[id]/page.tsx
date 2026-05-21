import { MessageCenter } from "@/components/messages/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopConversationPage({ params }: PageProps) {
  const [{ id }, user, { t }] = await Promise.all([
    params,
    requirePageUser(["SHOP_OWNER"]),
    getTranslator(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Shop.messagesTitle")}
        description={t("Messages.subtitle")}
      />
      <MessageCenter scope="shop" currentUserId={user.id} initialConversationId={id} />
    </div>
  );
}
