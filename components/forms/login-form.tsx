"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const t = useTranslations("Auth");
  const api = useTranslations("Api");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(api("invalidLogin"));
        return;
      }

      setMessageType("success");
      setMessage(api("loginSuccess"));
      const nextUrl = searchParams?.get("next");
      router.push(nextUrl || payload.data.redirectTo);
      router.refresh();
    } catch {
      setMessageType("error");
      setMessage(api("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AlertMessage variant={messageType} message={message} />

      <FormField label={t("email")}>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <FormField label={t("password")}>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      <Button type="submit" block loading={loading}>
        {t("loginButton")}
      </Button>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="font-bold text-slate-900">{t("demoAccounts")}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            className={buttonClasses({ variant: "secondary", size: "sm", block: true })}
            onClick={() => {
              setEmail("admin@test.com");
              setPassword("password123");
            }}
          >
            {t("adminDemo")}
          </button>
          <button
            type="button"
            className={buttonClasses({ variant: "secondary", size: "sm", block: true })}
            onClick={() => {
              setEmail("customer@test.com");
              setPassword("password123");
            }}
          >
            {t("customerDemo")}
          </button>
          <button
            type="button"
            className={buttonClasses({ variant: "secondary", size: "sm", block: true })}
            onClick={() => {
              setEmail("shop@test.com");
              setPassword("password123");
            }}
          >
            {t("shopOwnerDemo")}
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-bold text-slate-950">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
