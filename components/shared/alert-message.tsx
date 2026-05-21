import { cn } from "@/lib/utils";

export function AlertMessage({
  variant = "info",
  message,
}: {
  variant?: "info" | "success" | "error";
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        variant === "info" && "border-slate-200 bg-slate-50 text-slate-700",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        variant === "error" && "border-rose-200 bg-rose-50 text-rose-800",
      )}
    >
      {message}
    </div>
  );
}
