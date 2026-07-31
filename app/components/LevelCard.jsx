"use client";

import { memo } from "react";
import acuBackground from "../../assets/acu-bg-4k.jpg";
import bloodbathBackground from "../../assets/bloodbath-bg-4k.webp";
import cataclysmBackground from "../../assets/cataclysm-bg-4k.jpg";
import denouementBackground from "../../assets/denouement-bg-4k.jpg";
import eonBackground from "../../assets/eon-bg-4k.jpg";
import zodiacBackground from "../../assets/zodiac-bg.jpg";
import { EonVideoGallery } from "./EonVideoGallery";

const LEVEL_BACKGROUNDS = {
  run: eonBackground,
  zodiac: zodiacBackground,
  hardest: bloodbathBackground,
  acu: acuBackground,
  cataclysm: cataclysmBackground,
  denouement: denouementBackground,
};

function getAssetUrl(asset) {
  return typeof asset === "string" ? asset : asset.src;
}

function formatProgress(level) {
  return level.progress.toFixed(level.decimals);
}

function getRunStatus(progress) {
  if (progress >= 100) return "CLEARED";
  if (progress >= 90) return "FINAL PUSH";
  return "IN PROGRESS";
}

function DemonlistRank({ level, placement, status }) {
  if (level.demonlist !== "global") return null;

  if (placement) {
    return (
      <a
        className="demonlist-rank live"
        href={placement.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${level.title.join("")}: позиция ${placement.position} в Global Demonlist`}
      >
        GLOBAL LIST <strong>#{placement.position}</strong> ↗
      </a>
    );
  }

  if (status === "loading") {
    return (
      <span className="demonlist-rank loading" aria-live="polite">
        GLOBAL LIST • SYNCING
      </span>
    );
  }

  return (
    <span className="demonlist-rank unavailable" aria-live="polite">
      GLOBAL LIST • UNAVAILABLE
    </span>
  );
}

function ProgressMeter({ level }) {
  const progress = Math.min(100, Math.max(0, level.progress));
  const progressText = formatProgress(level);
  const markerStyle =
    progress >= 99.5
      ? { left: "auto", right: 0, transform: "none" }
      : { left: `${progress}%` };

  return (
    <div className="run-meter reveal">
      <div className="meter-heading">
        <span>PERSONAL BEST</span>
        <span>{getRunStatus(progress)}</span>
      </div>
      <div className="meter-number">
        <strong>{progressText}</strong>
        <span>%</span>
      </div>
      <div
        className="meter-track"
        role="progressbar"
        aria-label={`Прогресс прохождения ${level.title.join("")}`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <span
          className="meter-fill"
          style={{ "--progress-scale": progress / 100 }}
        />
        <i
          className={`death-mark${progress >= 99.5 ? " is-complete" : ""}`}
          style={markerStyle}
          aria-hidden="true"
        >
          {progressText}
        </i>
      </div>
      <div className="meter-labels">
        <span>0</span>
        <span>{level.meterLabel}</span>
        <span>100</span>
      </div>
    </div>
  );
}

function LevelFacts({ level, placement, demonlistStatus }) {
  let listValue = "—";
  if (placement) listValue = `#${placement.position}`;
  else if (level.demonlist === "global" && demonlistStatus === "loading") listValue = "SYNC";

  return (
    <dl className="run-facts">
      <div>
        <dt>BEST</dt>
        <dd>{formatProgress(level)}%</dd>
      </div>
      <div>
        <dt>STATUS</dt>
        <dd>{getRunStatus(level.progress)}</dd>
      </div>
      <div>
        <dt>GLOBAL LIST</dt>
        <dd>{listValue}</dd>
      </div>
    </dl>
  );
}

export const LevelCard = memo(function LevelCard({
  level,
  index,
  total,
  placement,
  demonlistStatus,
}) {
  const title = level.title.join("");
  const kickerLabel = level.kicker.replace(/^\d+\s*\/\s*/, "");
  const watermark = `${title} • ${formatProgress(level)}% • ${getRunStatus(level.progress)}`;

  return (
    <section
      className={["run", "section-pad", level.sectionClass].filter(Boolean).join(" ")}
      id={level.id}
      style={{ "--section-order": index + 1 }}
      aria-labelledby={`${level.id}-title`}
    >
      <div className="run-shell">
        <div className="section-kicker reveal">
          <span>{String(index + 1).padStart(2, "0")} / {kickerLabel}</span>
          <span className="section-kicker-meta">
            <span>{level.kickerStatus}</span>
            <DemonlistRank
              level={level}
              placement={placement}
              status={demonlistStatus}
            />
          </span>
        </div>

        <article className={["run-layout", level.layoutClass].filter(Boolean).join(" ")}>
          <img
            className="run-media"
            src={getAssetUrl(LEVEL_BACKGROUNDS[level.id])}
            alt=""
            width="1630"
            height="700"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
          <div className="run-scrim" aria-hidden="true" />
          <div className="run-card-top">
            <span>{level.kickerStatus}</span>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="run-title reveal">
            <p>{level.eyebrow}</p>
            <h2 id={`${level.id}-title`}>
              {level.title.map((line, titleIndex) => (
                <span key={line}>
                  {titleIndex > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <ProgressMeter level={level} />
          <span className="run-watermark" aria-hidden="true">{watermark}</span>
        </article>

        <div
          className={["run-summary", level.quoteClass, "reveal"].filter(Boolean).join(" ")}
        >
          <div className="run-quote">
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>
              <strong className="quote-lead">{level.quote.before}</strong>{" "}
              <em>{level.quote.emphasis}</em>
              <br />
              <strong className="quote-lead">{level.quote.after}</strong>{" "}
              <strong className="quote-accent">{level.quote.strong}</strong>
            </p>
          </div>
          <LevelFacts
            level={level}
            placement={placement}
            demonlistStatus={demonlistStatus}
          />
        </div>
        {level.id === "run" ? <EonVideoGallery /> : null}
      </div>
    </section>
  );
});
