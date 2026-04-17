import cron from "node-cron";
import { openai } from "../config/openai.js";

const REPORT_SYSTEM_PROMPT = `
You are an AI strategic auditor for local coffee shops.

Generate:
- Strategic headline (max 6 words)
- Top risk (1 sentence)
- Top opportunity (1 sentence)
- Tactical action (1 sentence, imperative tone)

Tone: Executive dashboard alert. Format: JSON only.

Example JSON:
{
  "headline": "Morning Commuter Traffic Peak Detected",
  "top_risk": "Operational lag vs primary competitors is increasing.",
  "top_opportunity": "High quality rating advantage in 1km radius.",
  "action_today": "Shift morning shift start to 07:00."
}
`;

export function initScheduler() {
  // Run daily at 06:00
  cron.schedule("0 6 * * *", async () => {
    const stats = { morningPercent: 68, workPercent: 42 };

    try {
      const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";

      let report;
      if (!USE_REAL_AI) {
        console.log("🛠 [LOCAL AI] Generating Scheduler Strategic Report...");
        report = {
          headline: "Strong Morning Commuter Demand Peak",
          top_risk: "90m opening lag vs local market leader",
          top_opportunity: "Superior quality rating capture on morning queries",
          action_today: "Prep baristas for 07:00 trial opening",
        };
      } else {
        const response = await openai.chat.completions.create({
          model: "qwen/qwen3.6-plus:free",
          temperature: 0.3,
          messages: [
            { role: "system", content: REPORT_SYSTEM_PROMPT },
            { role: "user", content: `Stats: ${JSON.stringify(stats)}` },
          ],
        });
        report = JSON.parse(response.choices[0].message.content);
      }

      console.log("📊 Daily Report Generated:", report);
    } catch (error) {
      console.error("Scheduler Error:", error.message);
    }
  });

  console.log("✅ Scheduler initialized (Daily 06:00)");
}
