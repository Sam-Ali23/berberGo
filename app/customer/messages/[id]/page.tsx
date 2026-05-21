import { MessageCenter } from "@/components/messages/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerConversationPage({ params }: PageProps) {
  const [{ id }, user, { t }] = await Promise.all([
    params,
    requirePageUser(["CUSTOMER"]),
    getTranslator(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Messages.title")}
        description={t("Messages.subtitle")}
      />
      <MessageCenter scope="customer" currentUserId={user.id} initialConversationId={id} />
    </div>
  );
}
