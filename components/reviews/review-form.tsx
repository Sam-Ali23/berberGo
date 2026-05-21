"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { StarRating } from "@/components/reviews/star-rating";
import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({
  appointmentId,
  shopName,
}: {
  appointmentId: string;
  shopName: string;
}) {
  const router = useRouter();
  const t = useTranslations("Reviews");
  const appointments = useTranslations("Appointments");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          rating,
          comment,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? t("completedOnly"));
        return;
      }

      setMessageType("success");
      setMessage(payload.message ?? t("success"));
      router.push(`/customer/appointments/${appointmentId}`);
      router.refresh();
    } catch {
      setMessageType("error");
      setMessage(t("completedOnly"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title={t("submit")}
          description={`${appointments("shopLabel")}: ${shopName}`}
        />

        <div className="space-y-5">
          <AlertMessage variant={messageType} message={message} />

          <FormField label={t("ratingLabel")}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <StarRating value={rating} interactive onChange={setRating} size="lg" />
            </div>
          </FormField>

          <FormField label={t("commentLabel")}>
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={t("commentLabel")}
            />
          </FormField>

          <Button type="submit" block loading={submitting}>
            {t("submit")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
