import Link from "next/link";

import { MessageCenter } from "@/components/messages/message-center";
import { PageHeader } from "@/components/shared/page-header";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function ShopMessagesPage() {
  const [user, { t }] = await Promise.all([requirePageUser(["SHOP_OWNER"]), getTranslator()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("Shop.dashboardEyebrow")}
        title={t("Shop.messagesTitle")}
        description={t("Shop.messagesDescription")}
      />
      <div className="flex justify-end">
        <Link href="/shop/messages/new" className={buttonClasses({ variant: "secondary" })}>
          {t("Messages.contactAdmin")}
        </Link>
      </div>
      <MessageCenter scope="shop" currentUserId={user.id} />
    </div>
  );
}
