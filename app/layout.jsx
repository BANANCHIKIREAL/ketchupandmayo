import "../styles.css";
import { VercelAnalytics } from "./components/VercelAnalytics";
import { LEVELS } from "./site-data";

const currentRun = LEVELS[0];
const currentProgress = currentRun.progress.toFixed(currentRun.decimals);

export const metadata = {
  title: `ketchupandmayo — ${currentProgress}% on ${currentRun.title.join("")}`,
  description:
    `Фан-сайт Geometry Dash игрока ketchupandmayo — Bloodbath пройден и ${currentProgress}% на EON.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#050505" />
        <link
          rel="icon"
          href="/assets/cube.png?v=1"
          type="image/png"
          sizes="114x114"
        />
        <link rel="apple-touch-icon" href="/assets/cube.png?v=1" />
      </head>
      <body>
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
