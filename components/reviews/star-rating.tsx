"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  interactive = false,
  onChange,
  size = "md",
}: {
  value: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = value >= starValue;

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange?.(starValue)}
              className="transition hover:scale-110"
            >
              <Star
                className={cn(
                  size === "sm" && "h-4 w-4",
                  size === "md" && "h-5 w-5",
                  size === "lg" && "h-7 w-7",
                  active ? "fill-amber-400 text-amber-400" : "text-slate-300",
                )}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            className={cn(
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-7 w-7",
              active ? "fill-amber-400 text-amber-400" : "text-slate-300",
            )}
          />
        );
      })}
    </div>
  );
}
