import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={buttonClasses({ variant: "primary", size: "md" })}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
