"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
type Role = "CUSTOMER" | "SHOP_OWNER";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const api = useTranslations("Api");
  const router = useRouter();
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          shopName,
          city,
          role,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(response.status === 409 ? api("emailUsed") : api("unexpectedError"));
        return;
      }

      setMessageType("success");
      setMessage(role === "SHOP_OWNER" ? api("registerOwnerSuccess") : api("registerSuccess"));
      router.push(payload.data.redirectTo);
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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("fullName")}>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField label={t("accountType")}>
          <Select value={role} onChange={(event) => setRole(event.target.value as Role)}>
            <option value="CUSTOMER">{t("customer")}</option>
            <option value="SHOP_OWNER">{t("shopOwner")}</option>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("email")}>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
        <FormField label={t("phone")}>
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </FormField>
      </div>

      <FormField label={t("password")} hint={t("passwordHint")}>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      {role === "SHOP_OWNER" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={t("shopName")}>
              <Input value={shopName} onChange={(event) => setShopName(event.target.value)} />
            </FormField>
            <FormField label={t("city")}>
              <Input value={city} onChange={(event) => setCity(event.target.value)} />
            </FormField>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            {t("ownerNotice")}
          </div>
        </>
      ) : null}

      <Button type="submit" block loading={loading}>
        {t("registerButton")}
      </Button>

      <p className="text-sm text-slate-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-bold text-slate-950">
          {t("loginButton")}
        </Link>
      </p>
    </form>
  );
}
