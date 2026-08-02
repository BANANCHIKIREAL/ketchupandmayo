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
            <a href="https://github.com/BANANCHIKIREAL/ketchupandmayo" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16 0 1.56-.02 2.82-.02 3.2 0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@bananchikireal" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.15v13.7c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1 0-5.88c.28 0 .55.04.8.11V9.9a6.13 6.13 0 0 0-.8-.06 6.1 6.1 0 1 0 6.1 6.1V9.28a8.9 8.9 0 0 0 4.99 1.52V7.66c-1.24 0-2.4-.4-3.3-1.08a5.9 5.9 0 0 1-.3-.76Z" />
              </svg>
            </a>
            <a href="https://t.me/BANANCHIKIREALTG" target="_blank" rel="noreferrer" aria-label="Telegram" title="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m22.05 3.28-3.06 16.24c-.23 1.02-.85 1.27-1.72.79l-4.75-3.5-2.3 2.2c-.25.25-.47.47-.96.47l.34-4.85 8.83-7.98c.38-.35-.09-.54-.6-.2L6.3 12.9l-4.7-1.47c-1.02-.32-1.04-1.02.22-1.5L20.7 2.4c.85-.32 1.6.2 1.35 1.55Z" />
              </svg>
            </a>
            <span className="footer-discord" aria-label="Discord: bananchikireal" title="Discord: bananchikireal">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.45.86-.61 1.25a18.3 18.3 0 0 0-5.48 0c-.17-.4-.4-.87-.62-1.25a.08.08 0 0 0-.08-.04c-1.7.29-3.34.8-4.89 1.52a.07.07 0 0 0-.03.03C.72 8.6-.43 12.72.14 16.79a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1 0-.13c.13-.09.25-.19.37-.28a.07.07 0 0 1 .08 0c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.29a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.88.88a.08.08 0 0 0-.04.12c.37.68.78 1.35 1.23 1.98a.07.07 0 0 0 .08.03 19.85 19.85 0 0 0 6.03-3.03.08.08 0 0 0 .03-.06c.68-4.7-.57-8.78-2.42-12.4a.06.06 0 0 0-.03-.02ZM8.02 14.34c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.17 1.1 2.15 2.42 0 1.34-.95 2.42-2.15 2.42Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.17 1.1 2.15 2.42 0 1.34-.94 2.42-2.15 2.42Z" />
              </svg>
            </span>
          </span>
        </span>
      </div>
      <span>V{SITE_VERSION} • KEEP PUSHING • {progress} → 100</span>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  );
}
