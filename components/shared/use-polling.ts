"use client";

import { useEffect, useEffectEvent } from "react";

export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs = 10000,
  immediate = true,
) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (immediate) {
      void onTick();
    }

    const interval = window.setInterval(() => {
      void onTick();
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [immediate, intervalMs]);
}
