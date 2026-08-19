export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { seconds } = req.body;
    const delaySeconds = Math.max(1, parseInt(seconds, 10) || 90);

    const targetUrl = `https://${req.headers.host}/api/send-notification`;

    const qstashRes = await fetch("https://qstash.upstash.io/v2/publish/" + encodeURIComponent(targetUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Content-Type": "application/json",
        "Upstash-Delay": `${delaySeconds}s`,
      },
      body: JSON.stringify({}),
    });

    if (!qstashRes.ok) {
      const text = await qstashRes.text();
      return res.status(500).json({ error: "QStash error", detail: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
