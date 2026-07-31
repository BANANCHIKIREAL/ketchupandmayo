import { LEVELS } from "../../site-data";

const GLOBAL_DEMONLIST_API =
  "https://api.demonlist.org/level/classic/get";
const CACHE_TTL = 5 * 60 * 1000;
const GLOBAL_DEMONLIST_LEVELS = LEVELS.filter(
  (level) => level.demonlist === "global",
);

let cachedPayload = null;
let cachedAt = 0;

export const dynamic = "force-dynamic";

async function fetchPlacement(level) {
  const query = new URLSearchParams({
    ingame_id: String(level.levelId),
  });
  const response = await fetch(`${GLOBAL_DEMONLIST_API}?${query}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Global Demonlist responded with ${response.status} for ${level.levelId}`,
    );
  }

  const payload = await response.json();
  const data = payload?.data;

  if (
    payload?.message !== "success" ||
    data?.ingame_id !== level.levelId ||
    !Number.isInteger(data?.placement)
  ) {
    throw new Error(`Invalid Global Demonlist data for ${level.levelId}`);
  }

  return {
    name: data.name,
    position: data.placement,
    levelId: data.ingame_id,
    demonlistId: data.id,
    url: `https://demonlist.org/classic/${data.placement}`,
  };
}

export async function GET() {
  const now = Date.now();
  if (cachedPayload && now - cachedAt < CACHE_TTL) {
    return Response.json(cachedPayload, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  }

  try {
    const results = await Promise.allSettled(
      GLOBAL_DEMONLIST_LEVELS.map(async (level) => ({
        levelId: level.levelId,
        placement: await fetchPlacement(level),
      })),
    );
    const placements = {};
    const failedLevelIds = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        placements[result.value.levelId] = result.value.placement;
      } else {
        failedLevelIds.push(GLOBAL_DEMONLIST_LEVELS[index].levelId);
      }
    });

    if (Object.keys(placements).length === 0) {
      throw new Error("Global Demonlist returned no usable placements");
    }

    cachedPayload = {
      source: "GLOBAL DEMONLIST",
      placements: {
        ...(cachedPayload?.placements ?? {}),
        ...placements,
      },
      partial: failedLevelIds.length > 0,
      failedLevelIds,
      stale: false,
    };
    cachedAt = now;

    return Response.json(cachedPayload, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    if (cachedPayload) {
      return Response.json(
        { ...cachedPayload, partial: true, stale: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      {
        source: "GLOBAL DEMONLIST",
        error: "Demonlist data is temporarily unavailable",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
