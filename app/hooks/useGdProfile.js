"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FALLBACK_PROFILE, PROFILE_API } from "../site-data";

const CACHE_KEY = "ketchupandmayo-gd-profile:v3";
const REFRESH_INTERVAL = 5 * 60 * 1000;

function readCachedProfile() {
  try {
    const value = window.localStorage.getItem(CACHE_KEY);
    if (!value) return null;
    const payload = JSON.parse(value);
    return payload?.profile?.username === FALLBACK_PROFILE.username
      ? payload.profile
      : null;
  } catch {
    return null;
  }
}

function cacheProfile(profile) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ profile, savedAt: Date.now() }),
    );
  } catch {
    // The live response remains usable when storage is unavailable.
  }
}

export function useGdProfile() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [source, setSource] = useState("loading");
  const lastGoodProfile = useRef(null);
  const requestInFlight = useRef(null);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return requestInFlight.current;

    const request = (async () => {
      try {
        const response = await fetch(PROFILE_API, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Profile API responded with ${response.status}`);
        }

        const payload = await response.json();
        const nextProfile = payload.profile;
        if (nextProfile?.username !== FALLBACK_PROFILE.username) {
          throw new Error("Unexpected GDBrowser profile response");
        }

        lastGoodProfile.current = nextProfile;
        setProfile(nextProfile);
        setSource(payload.stale ? "cache" : "live");
        cacheProfile(nextProfile);
      } catch (error) {
        const savedProfile = lastGoodProfile.current ?? readCachedProfile();
        if (savedProfile) {
          lastGoodProfile.current = savedProfile;
          setProfile(savedProfile);
          setSource("cache");
        } else {
          setProfile(FALLBACK_PROFILE);
          setSource("fallback");
        }
        console.warn("Profile sync failed:", error);
      } finally {
        requestInFlight.current = null;
      }
    })();

    requestInFlight.current = request;
    return request;
  }, []);

  useEffect(() => {
    const cachedProfile = readCachedProfile();
    if (cachedProfile) {
      lastGoodProfile.current = cachedProfile;
      setProfile(cachedProfile);
      setSource("cache");
    }

    void refresh();
    const interval = window.setInterval(refresh, REFRESH_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  return { profile, source, refresh };
}
