import { Scissors } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  subtitle,
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1e3a5f_100%)] text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)]">
        <Scissors className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black tracking-tight text-slate-950">BerberGo</div>
        {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  );
}
