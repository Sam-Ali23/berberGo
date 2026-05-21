import { MessageCenter } from "@/components/messages/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { requirePageUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function AdminMessagesPage() {
  const [user, { t }] = await Promise.all([requirePageUser(["ADMIN"]), getTranslator()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Admin.dashboardEyebrow")}
        title={t("Admin.messagesTitle")}
        description={t("Admin.messagesDescription")}
      />
      <MessageCenter scope="admin" currentUserId={user.id} />
    </div>
  );
}
