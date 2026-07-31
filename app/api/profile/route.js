import { PLAYER_NAME } from "../../site-data";

const GDBROWSER_PROFILE_API = `https://gdbrowser.com/api/profile/${PLAYER_NAME}`;
const CACHE_TTL = 5 * 60 * 1000;
const REQUEST_TIMEOUT = 8000;
const REQUIRED_NUMBER_FIELDS = [
  "playerID",
  "accountID",
  "rank",
  "stars",
  "moons",
  "diamonds",
  "coins",
  "userCoins",
  "demons",
  "cp",
];

let cachedProfile = null;
let cachedAt = 0;

export const dynamic = "force-dynamic";

function isValidProfile(profile) {
  return (
    profile?.username === PLAYER_NAME &&
    REQUIRED_NUMBER_FIELDS.every((field) => Number.isFinite(Number(profile[field])))
  );
}

export async function GET() {
  const now = Date.now();
  if (cachedProfile && now - cachedAt < CACHE_TTL) {
    return Response.json(
      { profile: cachedProfile, fetchedAt: cachedAt, stale: false },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  }

  try {
    const response = await fetch(GDBROWSER_PROFILE_API, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`GDBrowser responded with ${response.status}`);
    }

    const profile = await response.json();
    if (!isValidProfile(profile)) {
      throw new Error("GDBrowser returned an invalid profile payload");
    }

    cachedProfile = profile;
    cachedAt = Date.now();

    return Response.json(
      { profile, fetchedAt: cachedAt, stale: false },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch {
    if (cachedProfile) {
      return Response.json(
        { profile: cachedProfile, fetchedAt: cachedAt, stale: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      { error: "Profile data is temporarily unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
