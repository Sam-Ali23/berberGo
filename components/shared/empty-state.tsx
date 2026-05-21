import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="panel flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-slate-100 p-4 text-2xl">✂️</div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-950">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-7 text-slate-500">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={buttonClasses({ variant: "primary" })}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
