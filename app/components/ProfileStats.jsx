import { LEVELS, PROFILE_URL } from "../site-data";

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const STATS = [
  { key: "demons", label: "DEMONS", featured: true },
  { key: "extremes", label: "CLASSIC EXTREMES", accent: true, featured: true },
  { key: "rank", label: "GLOBAL RANK", featured: true },
  { key: "stars", label: "STARS" },
  { key: "moons", label: "MOONS" },
  { key: "diamonds", label: "DIAMONDS" },
  { key: "coins", label: "SECRET COINS" },
  { key: "userCoins", label: "USER COINS" },
];

function getProfileValue(profile, key) {
  if (key === "extremes") return profile.classicDemonsCompleted?.extreme ?? 0;
  return profile[key] ?? 0;
}

function getSyncStatus(source, iconStatus) {
  if (source === "live") {
    const iconCopy =
      iconStatus.uhd === iconStatus.total
        ? "UHD ICONS FROM GDBROWSER"
        : `UHD ICONS ${iconStatus.uhd}/${iconStatus.total}`;
    return `LIVE PROFILE • ${iconCopy}`;
  }

  if (source === "cache") {
    return "SAVED PROFILE • LIVE SYNC UNAVAILABLE";
  }

  if (source === "fallback") {
    return "PROFILE API UNAVAILABLE";
  }

  return "CONNECTING";
}

export function ProfileStats({ profile, source, iconStatus }) {
  const syncStatus = getSyncStatus(source, iconStatus);
  const profileUnavailable = source === "loading" || source === "fallback";
  const sectionNumber = String(LEVELS.length + 1).padStart(2, "0");

  return (
    <section className="stats section-pad" id="profile" aria-labelledby="profile-title">
      <div className="section-heading profile-heading reveal">
        <div>
          <span className="section-index">{sectionNumber} / LIVE GD PROFILE</span>
          <h2 id="profile-title">@{profile.username}</h2>
        </div>
        <a className="text-link" href={PROFILE_URL} target="_blank" rel="noreferrer">
          OPEN GDBROWSER ↗
        </a>
      </div>
      <div
        className={[
          "profile-sync",
          "reveal",
          source === "live" ? "live" : "",
          source === "cache" || source === "fallback" ? "error" : "",
        ].filter(Boolean).join(" ")}
        aria-live="polite"
      >
        <span className="sync-dot" />
        <strong>{syncStatus}</strong>
      </div>
      <div className="stats-grid">
        {STATS.map((stat, index) => (
          <article
            className={[
              "stat-card",
              "reveal",
              stat.accent ? "accent" : "",
              stat.featured ? "featured" : "",
            ].filter(Boolean).join(" ")}
            key={stat.key}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong data-profile-field={stat.key}>
              {profileUnavailable
                ? "—"
                : NUMBER_FORMATTER.format(getProfileValue(profile, stat.key))}
            </strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>
      <div className="profile-meta reveal">
        <span>PLAYER ID <strong>{profileUnavailable ? "—" : profile.playerID}</strong></span>
        <span>ACCOUNT ID <strong>{profileUnavailable ? "—" : profile.accountID}</strong></span>
        <span>CREATOR POINTS <strong>{profileUnavailable ? "—" : profile.cp}</strong></span>
      </div>
    </section>
  );
}
