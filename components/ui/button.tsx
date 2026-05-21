import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type ButtonSize = "sm" | "md" | "lg";

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    block && "w-full",
    size === "sm" && "h-10 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm sm:text-base",
    size === "lg" && "h-12 px-6 text-base",
    variant === "primary" &&
      "bg-[var(--brand)] text-slate-950 shadow-[0_14px_32px_rgba(199,154,43,0.32)] hover:bg-[var(--brand-deep)] hover:text-white",
    variant === "secondary" &&
      "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
    variant === "ghost" &&
      "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
    variant === "danger" &&
      "bg-rose-600 text-white hover:bg-rose-700",
    variant === "dark" &&
      "bg-slate-950 text-white hover:bg-slate-800",
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
};

export function Button({
  className,
  variant,
  size,
  block,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClasses({ variant, size, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
