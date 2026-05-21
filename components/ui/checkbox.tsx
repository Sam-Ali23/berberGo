import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-5 w-5 rounded border-slate-300 text-[var(--brand)] focus:ring-amber-200",
        className,
      )}
      {...props}
    />
  );
}
