"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopCreateConversationPage() {
  const router = useRouter();

  useEffect(() => {
    async function createConversation() {
      const response = await fetch("/api/shop/conversations", {
        method: "POST",
      });
      const payload = await response.json();
      router.replace(payload.data?.redirectTo || "/shop/messages");
    }

    void createConversation();
  }, [router]);

  return null;
}
