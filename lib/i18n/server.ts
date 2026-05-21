import "server-only";

import { cookies } from "next/headers";

import { defaultLocale, getDirection, isValidLocale, localeCookieName, type AppLocale } from "@/lib/i18n/config";

type MessageValue = string | number | boolean | null | MessageTree | MessageValue[];
type MessageTree = {
  [key: string]: MessageValue;
};

type TranslateValues = Record<string, string | number>;

const messageLoaders: Record<AppLocale, () => Promise<MessageTree>> = {
  ar: () => import("@/messages/ar.json").then((module) => module.default as MessageTree),
  en: () => import("@/messages/en.json").then((module) => module.default as MessageTree),
  tr: () => import("@/messages/tr.json").then((module) => module.default as MessageTree),
};

function getNestedMessage(messages: MessageTree, key: string): MessageValue | undefined {
  return key.split(".").reduce<MessageValue | undefined>((current, part) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }

    return (current as MessageTree)[part];
  }, messages);
}

function interpolate(template: string, values?: TranslateValues) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values[token];
    return value == null ? `{${token}}` : String(value);
  });
}

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isValidLocale(locale) ? locale : defaultLocale;
}

export async function getMessages(locale?: AppLocale) {
  const resolvedLocale = locale ?? (await getRequestLocale());
  return messageLoaders[resolvedLocale]();
}

export async function getTranslator(locale?: AppLocale) {
  const resolvedLocale = locale ?? (await getRequestLocale());
  const messages = await getMessages(resolvedLocale);

  return {
    locale: resolvedLocale,
    dir: getDirection(resolvedLocale),
    messages,
    t: (key: string, values?: TranslateValues) => {
      const value = getNestedMessage(messages, key);

      if (typeof value !== "string") {
        return key;
      }

      return interpolate(value, values);
    },
  };
}
