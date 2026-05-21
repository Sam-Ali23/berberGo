import { MessageCenter } from "@/components/messages/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function CustomerMessagesPage() {
  const [user, { t }] = await Promise.all([requirePageUser(["CUSTOMER"]), getTranslator()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Customer.dashboardEyebrow")}
        title={t("Messages.title")}
        description={t("Messages.emptyDescription")}
      />
      <MessageCenter scope="customer" currentUserId={user.id} />
    </div>
  );
}
