const FEATURED_LEVEL_COUNT = 3;

function formatProgress(level) {
  return level.progress.toFixed(level.decimals);
}

function RankLabel({ level, placement, status }) {
  if (level.demonlist !== "global") return null;

  if (placement) {
    return (
      <a href={placement.url} target="_blank" rel="noreferrer">
        GLOBAL LIST <strong>#{placement.position}</strong> ↗
      </a>
    );
  }

  return (
    <span aria-live="polite">
      {status === "loading" ? "RANK SYNCING" : "RANK UNAVAILABLE"}
    </span>
  );
}

export function JourneyOverview({ levels, placements, demonlistStatus }) {
  const featuredLevels = levels.slice(0, FEATURED_LEVEL_COUNT);

  return (
    <section className="journey section-pad" aria-labelledby="journey-title">
      <div className="section-heading reveal">
        <div>
          <span className="section-index">PLAYER LOG / LIVE</span>
          <h2 id="journey-title">THE ROAD TO 100</h2>
        </div>
        <p>
          CURRENT RUN&nbsp;&nbsp;→&nbsp;&nbsp;NEXT HARDEST&nbsp;&nbsp;→&nbsp;&nbsp;CLEARED
        </p>
      </div>

      <div className="journey-grid">
        {featuredLevels.map((level, index) => (
          <article className={`journey-card journey-${level.id} reveal`} key={level.id}>
            <a className="journey-card-link" href={`#${level.id}`}>
              <span className="journey-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="journey-name">
                <small>{level.eyebrow}</small>
                <h3>{level.title.join("")}</h3>
              </div>
              <div className="journey-progress">
                <strong>{formatProgress(level)}</strong>
                <span>%</span>
              </div>
            </a>
            <div className="journey-rank">
              <span>{level.kickerStatus}</span>
              <RankLabel
                level={level}
                placement={placements[level.levelId]}
                status={demonlistStatus}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
