export async function pingVisit() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const time = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "short",
    timeStyle: "medium",
  });

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `Кто-то зашёл на сайт — ${time} (МСК)` }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // best-effort notification, ignore failures
  }
}
