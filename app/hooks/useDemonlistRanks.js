"use client";

import { useCallback, useEffect, useState } from "react";

const REFRESH_INTERVAL = 5 * 60 * 1000;

export function useDemonlistRanks() {
  const [placements, setPlacements] = useState({});
  const [status, setStatus] = useState("loading");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/demonlist", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Demonlist route responded with ${response.status}`);
      }

      const payload = await response.json();
      setPlacements((current) => ({
        ...current,
        ...(payload.placements ?? {}),
      }));
      setStatus(payload.partial || payload.stale ? "partial" : "live");
    } catch (error) {
      setStatus("error");
      console.warn("Demonlist sync failed:", error);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(refresh, REFRESH_INTERVAL);

    return () => window.clearInterval(interval);
  }, [refresh]);

  return { placements, status };
}
