"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function StartConversationButton({
  scope,
  shopId,
  appointmentId,
  label,
  variant = "secondary",
}: {
  scope: "customer" | "shop" | "admin";
  shopId?: string;
  appointmentId?: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const response = await fetch(`/api/${scope}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId,
          appointmentId,
        }),
      });

      const payload = await response.json();
      router.push(payload.data?.redirectTo || `/${scope}/messages`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant={variant} loading={loading} onClick={handleClick}>
      {label}
    </Button>
  );
}
