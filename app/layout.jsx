import "../styles.css";
import { VercelAnalytics } from "./components/VercelAnalytics";
import { VercelSpeedInsights } from "./components/VercelSpeedInsights";
import { pingVisit } from "./lib/visit-ping";
import { LEVELS } from "./site-data";

const currentRun = LEVELS[0];
const currentProgress = currentRun.progress.toFixed(currentRun.decimals);
const title = `ketchupandmayo — ${currentProgress}% on ${currentRun.title.join("")}`;
const description = `Фан-сайт Geometry Dash игрока ketchupandmayo — Bloodbath пройден и ${currentProgress}% на EON.`;

export const metadata = {
  metadataBase: new URL("https://ketchupandmayo.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "ketchupandmayo",
    images: [{ url: "/og-image.png", width: 1896, height: 1199 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }) {
  await pingVisit();

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
        <VercelSpeedInsights />
      </body>
    </html>
  );
}
