const ACCENT_COLOR = 0xd8ff3e;

export async function pingVisit() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const now = new Date();
  const time = now.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "long",
    timeStyle: "medium",
  });

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "👀 Новый визит на сайт",
            color: ACCENT_COLOR,
            fields: [{ name: "Время (МСК)", value: time, inline: false }],
            footer: { text: "ketchupandmayo.vercel.app" },
            timestamp: now.toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // best-effort notification, ignore failures
  }
}
