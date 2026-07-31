import { LEVELS, PROFILE_URL, TIKTOK_URL } from "../site-data";

export function FollowSection() {
  const currentRun = LEVELS[0];
  const progress = currentRun.progress.toFixed(currentRun.decimals);

  return (
    <section className="follow" aria-labelledby="follow-title">
      <div className="follow-grid" aria-hidden="true" />
      <p className="eyebrow reveal"><span className="pulse" /> WATCH THE FINAL PUSH</p>
      <div className="follow-progress reveal" aria-label={`EON: ${progress}% из 100%`}>
        <strong>{progress}</strong>
        <span><i style={{ "--follow-progress": currentRun.progress / 100 }} /></span>
        <strong>100</strong>
      </div>
      <h2 className="reveal" id="follow-title">SEE YOU AT <span>100%</span></h2>
      <p className="follow-copy reveal">
        Последние { (100 - currentRun.progress).toFixed(2) }% EON — впереди.
      </p>
      <div className="social-links reveal">
        <a href={TIKTOK_URL} target="_blank" rel="noreferrer">
          <small>TIKTOK</small><strong>@nahbro003</strong><span>↗</span>
        </a>
        <a href={PROFILE_URL} target="_blank" rel="noreferrer">
          <small>GEOMETRY DASH</small><strong>ketchupandmayo</strong><span>↗</span>
        </a>
      </div>
    </section>
  );
}
