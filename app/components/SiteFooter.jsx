import { LEVELS, SITE_VERSION } from "../site-data";

export function SiteFooter() {
  const currentRun = LEVELS[0];
  const progress = currentRun.progress.toFixed(currentRun.decimals);

  return (
    <footer>
      <div className="footer-credit">
        <img
          src="/assets/bananchikireal-icon-transparent.png"
          alt="Иконка BANANCHIKIREAL"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
        />
        <span>
          SITE BY <strong>BANANCHIKIREAL</strong>
          <span className="footer-social">
            <a href="https://github.com/BANANCHIKIREAL/ketchupandmayo" target="_blank" rel="noreferrer">GITHUB</a>
            <a href="https://www.tiktok.com/@bananchikireal" target="_blank" rel="noreferrer">TIKTOK</a>
            <a href="https://t.me/BANANCHIKIREALTG" target="_blank" rel="noreferrer">TELEGRAM</a>
            <span>DISCORD: BANANCHIKIREAL</span>
          </span>
        </span>
      </div>
      <span>V{SITE_VERSION} • KEEP PUSHING • {progress} → 100</span>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  );
}
