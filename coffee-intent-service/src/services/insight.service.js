import { openai } from "../config/openai.js";

const DASHBOARD_SYSTEM_PROMPT = `
You are CoffeeInsight AI, a predictive geo-analytics engine for retail coffee shops.

Objective:
Detect early commuter demand shifts, evaluate opening time competitiveness within 1km radius, estimate revenue leakage, and generate executive-level strategic insights.

Instructions:
1. Analyze morning demand concentration.
2. Compare client opening time vs competitors.
3. Identify missed traffic window in minutes.
4. Estimate revenue uplift if opening earlier.
5. Highlight risks and opportunities.
6. Generate concise executive summary.

Tone:
Executive, strategic, data-driven, confident.

Output Rules:
- Return structured JSON only.
- No markdown.
- No explanations outside JSON.
- Keep summaries under 2 sentences.
- Keep action items imperative.

Required JSON Structure:
{
  "summary": "",
  "risks": [],
  "opportunities": [],
  "priority_actions": [],
  "estimated_revenue_impact": ""
}
`;

const HEADLINE_SYSTEM_PROMPT = `
You are CoffeeInsight AI generating executive dashboard alerts.

Generate:
1. Strategic headline (max 6 words)
2. Top risk (1 sentence)
3. Top opportunity (1 sentence)
4. Tactical recommendation (1 sentence imperative)

Tone:
Executive dashboard alert.
Concise and decisive.
No markdown.
Return JSON only.

Structure:
{
  "headline": "",
  "top_risk": "",
  "top_opportunity": "",
  "action_today": ""
}
`;

export async function generateExecutiveInsight(data) {
  const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";

  if (!USE_REAL_AI) {
    console.log("🛠 [LOCAL AI] Generating Executive Hub Insight...");
    return {
      summary: "Critical Morning Revenue Leakage Detected",
      risks: [
        "Opening 90m later than market leaders concedes the entire morning peak.",
      ],
      opportunities: [
        "Superior 4.8 quality rating can dominate early-bird loyalty if accessible.",
      ],
      priority_actions: ["Execute 07:00 trial opening immediately."],
      estimated_revenue_impact: "18%",
    };
  }

  const competitorList = data.competitors
    .map(
      (c) =>
        `- ${c.name}: Opens at ${c.openingTime}, Rating ${c.rating}, Distance ${c.distanceKm}km`,
    )
    .join("\n");

  const userPrompt = `
Coffee Shop Performance Snapshot:

Morning Demand: ${data.morningPercent}
Work-Friendly Demand: ${data.workPercent}
Peak Hour: ${data.peakHour}

GEO Score: ${data.geoScore}
Breakdown:
- Distance Score: ${data.geoBreakdown.distance}
- Opening Time Score: ${data.geoBreakdown.openingTime}
- Intent Match Score: ${data.geoBreakdown.intentMatch}
- Review Score: ${data.geoBreakdown.review}

Competitors:
${competitorList}

Generate executive business insight based on the performance scenario.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3.6-plus",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: DASHBOARD_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("LLM Insight Generation Error:", error.message);
    return {
      summary: "Opening Time Adjustement Required",
      risks: [
        "Current 08:30 start allows competitors to capture 100% of morning rush.",
      ],
      opportunities: ["Lead market in quality by opening 90 minutes earlier."],
      priority_actions: ["Sync schedules for 07:00 opening next week."],
      estimated_revenue_impact: "15%",
    };
  }
}

// Simple Neural Cache to save OpenAI costs
let insightCache = {
  lastContext: null,
  lastResult: null,
  timestamp: null,
};

export async function analyzeDashboardStats(context, lang = "th") {
  // Check if we have a fresh cache (younger than 1 hour) and context/lang is the same
  const CACHE_TTL = 60 * 60 * 1000; // 1 Hour
  const cacheKey = JSON.stringify({ context, lang });
  const isCacheValid =
    insightCache.lastResult &&
    cacheKey === insightCache.lastContext &&
    Date.now() - insightCache.timestamp < CACHE_TTL;

  if (isCacheValid) {
    console.log(`🧠 [CACHE HIT] Using cached Strategic Insight (${lang})...`);
    return insightCache.lastResult;
  }

  const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";
  if (!USE_REAL_AI) {
    console.log(
      `🛠 [LOCAL AI] Generating Dashboard Strategic Insight (${lang})...`,
    );

    // Localized Mock Data
    const mockResult =
      lang === "th"
        ? {
          summary: "พบความต้องการกลุ่มคนทำงานเช้าสูงมากในพื้นที่",
          risks: [
            "การเปิดร้านช้าทำให้เสียโอกาสการจับกลุ่มลูกค้าช่วงเช้าตรู่ให้คู่แข่งรายใหญ่",
            "ระดับการเปิดร้านช้าสะสมทำให้สูญเสียรายได้คาดการณ์ 15-20% ต่อวัน",
          ],
          opportunities: [
            "ความได้เปรียบด้านคะแนนความพึงพอใจสามารถดึงลูกค้าพรีเมียมได้หากปรับเวลา",
            "ความต้องการ 'พื้นที่ทำงาน' พุ่งสูงในช่วง 09:00 - 11:00 เป็นจุดแข็งหลัก",
          ],
          priority_actions: [
            "ปรับตารางการเปิดร้านเป็น 06:45 เพื่อดักหน้าคู่แข่งหลักในย่านนี้",
          ],
          estimated_revenue_impact: "+22%",
        }
        : {
          summary: "Extreme Morning Commuter Demand Identified",
          risks: [
            "Late opening yields 90 minutes of peak traffic to primary competitors.",
            "Accumulated operational lag results in 15-20% daily revenue leakage.",
          ],
          opportunities: [
            "Superior quality rating can dominate premium segments if hours align.",
            "Work-Friendly demand surge between 09:00 - 11:00 is your primary stronghold.",
          ],
          priority_actions: [
            "Execute 07:00 opening schedule to stop revenue leakage.",
          ],
          estimated_revenue_impact: "+22%",
        };

    // Update Cache
    insightCache = {
      lastContext: cacheKey,
      lastResult: mockResult,
      timestamp: Date.now(),
    };

    return mockResult;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3.6-plus",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${DASHBOARD_SYSTEM_PROMPT}\n\nIMPORTANT: YOU MUST RESPOND IN ${lang.toUpperCase()} LANGUAGE.`,
        },
        {
          role: "user",
          content: `Current Market Context: ${JSON.stringify(context)}`,
        },
      ],
    });

    const realResult = JSON.parse(response.choices[0].message.content);

    // Update Cache for Real AI too
    insightCache = {
      lastContext: cacheKey,
      lastResult: realResult,
      timestamp: Date.now(),
    };

    return realResult;
  } catch (error) {
    console.error("AI Analysis Error (Falling back to Local):", error.message);
    return {
      summary: "Manual Audit Required: Significant morning demand detected.",
      risks: ["Market gap in primary commute hours"],
      opportunities: ["Earlier opening time"],
      priority_actions: ["Review competitor opening hours"],
      estimated_revenue_impact: "10-15%",
    };
  }
}

let headlineCache = {
  lastContext: null,
  lastResult: null,
  timestamp: null,
};

export async function generateDailyHeadline(context, lang = "th") {
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours
  const cacheKey = JSON.stringify({ context, lang });
  if (
    headlineCache.lastResult &&
    cacheKey === headlineCache.lastContext &&
    Date.now() - headlineCache.timestamp < CACHE_TTL
  ) {
    return headlineCache.lastResult;
  }

  const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";
  if (!USE_REAL_AI) {
    const mock =
      lang === "th"
        ? {
          headline: "ปรับเวลาเป็น 07:00 เพื่อรับ Traffic มหาศาล",
          top_risk: "เสียรายได้ 18% ให้คู่แข่งรายใหญ่ในซอยเดิม",
          top_opportunity: "ดึงลูกค้าพรีเมียมด้วยคะแนน 4.8 ที่เป็นจุดแข็ง",
          action_today: "ประกาศปรับเวลาเปิดร้านเป็น 07:00 ทันที",
        }
        : {
          headline: "Strategic Shift: Open at 07:00",
          top_risk: "Losing 18% revenue to nearby market leaders.",
          top_opportunity: "Leverage 4.8 rating to capture early loyalty.",
          action_today: "Execute 07:00 opening schedule immediately.",
        };

    headlineCache = {
      lastContext: cacheKey,
      lastResult: mock,
      timestamp: Date.now(),
    };
    return mock;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3.6-plus",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${HEADLINE_SYSTEM_PROMPT}\n\nIMPORTANT: YOU MUST RESPOND IN ${lang.toUpperCase()} LANGUAGE.`,
        },
        { role: "user", content: `Context: ${JSON.stringify(context)}` },
      ],
    });

    const result = JSON.parse(response.choices[0].message.content);
    headlineCache = {
      lastContext: cacheKey,
      lastResult: result,
      timestamp: Date.now(),
    };
    return result;
  } catch (error) {
    return lang === "th"
      ? {
        headline: "ปรับเวลาเปิดร้านเพื่อรับ Traffic ช่วงเช้า",
        top_risk: "ข้อจำกัดเชิงเวลาเปิดร้าน",
        top_opportunity: "การเป็นผู้นำด้านคุณภาพ",
        action_today: "ตรวจสอบตารางเวลาคู่แข่ง",
      }
      : {
        headline: "Strategic Alignment: Capture Morning Peak",
        top_risk: "Operational opening gap.",
        top_opportunity: "Quality leadership advantage.",
        action_today: "Review competitor opening hours.",
      };
  }
}
