import webpush from "web-push";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

webpush.setVapidDetails(
  "mailto:example@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const raw = await redis.get("push-subscription");
    if (!raw) {
      return res.status(200).json({ ok: true, skipped: "nessuna iscrizione salvata" });
    }
    const subscription = typeof raw === "string" ? JSON.parse(raw) : raw;

    const payload = JSON.stringify({
      title: "Recupero terminato",
      body: "Pronto per la prossima serie 💪",
    });

    await webpush.sendNotification(subscription, payload);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
