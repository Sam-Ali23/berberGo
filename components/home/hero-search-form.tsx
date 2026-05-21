"use client";

import { CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearchForm() {
  const t = useTranslations("Landing");
  const common = useTranslations("Common");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (city.trim()) {
      params.set("city", city.trim());
    }

    if (service.trim()) {
      params.set("service", service.trim());
    }

    if (date) {
      params.set("date", date);
    }

    router.push(`/customer/shops${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/70 bg-white/90 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.9fr_auto]">
        <Field
          icon={<MapPin className="h-4 w-4 text-[var(--brand)]" />}
          label={common("city")}
          value={city}
          onChange={setCity}
          placeholder={common("city")}
        />
        <Field
          icon={<Sparkles className="h-4 w-4 text-[var(--brand)]" />}
          label={common("service")}
          value={service}
          onChange={setService}
          placeholder={common("service")}
        />
        <Field
          icon={<CalendarDays className="h-4 w-4 text-[var(--brand)]" />}
          label={common("date")}
          value={date}
          onChange={setDate}
          type="date"
        />
        <Button type="submit" size="lg" className="h-full min-h-16 gap-2 rounded-[24px] px-8">
          <Search className="h-4 w-4" />
          {common("search")}
        </Button>
      </div>
      <div className="px-2 pt-3 text-xs text-slate-500">{t("searchTitle")}</div>
    </form>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="rounded-[24px] border border-transparent bg-slate-50 px-4 py-3 transition focus-within:border-slate-200 focus-within:bg-white">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {icon}
        {label}
      </div>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0"
      />
    </label>
  );
}
