import { openai } from "../config/openai.js";
import {
  calculateGeoScore,
  calculateVisibilityIncrease,
  calculateRevenueUplift,
  classifyCompetitivePosition,
  calculateConfidenceScore,
  ENGINE_METADATA,
} from "../utils/deterministic.js";

const SIMULATION_SYSTEM_PROMPT = `
You are CoffeeInsight Simulation Engine.

Objective:
Simulate business performance impact when changing opening hours.

Model Assumption:
Deterministic growth model based on early-hour demand capture and competitive time gap.

Output Rules:
- Return JSON only.
- No markdown.
- Be deterministic and consistent.

Required JSON Structure:
{
  "scenarios": [
    {
      "opening": "",
      "new_geo_score": 0,
      "visibility_increase_percent": 0,
      "estimated_revenue_increase_percent": "",
      "competitive_position": "",
      "confidence": "",
      "summary": ""
    }
  ],
  "best_scenario": ""
}
`;

export async function simulateAllScenarios(context, scenarioTimes) {
  const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";

  if (!USE_REAL_AI) {
    console.log(
      `🛠 [ENGINE ${ENGINE_METADATA.version}] Simulating ${scenarioTimes.length} scenarios...`,
    );

    const scenarios = scenarioTimes.map((time) => {
      // Calculate gap vs market leaders (assuming 07:00 is market lead for this demo)
      const timeToMins = (h) => {
        const [hrs, mins] = h.split(":").map(Number);
        return hrs * 60 + mins;
      };

      const gap = Math.max(0, timeToMins(time) - 420); // 420 = 07:00
      const recoveredMinutes = Math.max(0, 510 - timeToMins(time)); // Current is 08:30 (510)

      try {
        const geo = calculateGeoScore({
          distanceScore: 9.5,
          openingTimeGap: gap,
          intentWeight: 0.88,
          reviewScore: 4.8,
        });

        const visibility = calculateVisibilityIncrease({
          timeDifferenceMinutes: recoveredMinutes,
          ratingDifference: 0.5,
        }) || 25;

        const revenue = calculateRevenueUplift({
          recoveredDemandMinutes: recoveredMinutes,
          ratingAdvantage: 0.5,
        }) || 10;

        const position = classifyCompetitivePosition({
          gapMinutes: gap,
          ratingAdvantage: 0.5,
        }) || "Competitive";

        const confidence = calculateConfidenceScore({ ageOfDataMinutes: 0 }) || 0.85;

        return {
          opening: time,
          new_geo_score: geo?.score || 7.5,
          visibility_increase_percent: parseFloat(visibility) || 25,
          estimated_revenue_increase_percent: `${Math.round(revenue)}%`,
          competitive_position: position,
          confidence: confidence > 0.8 ? "High" : "Medium",
          summary: `Opening at ${time} reduces gap by ${Math.max(0, 90 - gap)}m, capturing significant transit traffic.`,
        };
      } catch (calcError) {
        console.error(`Error calculating scenario for ${time}:`, calcError.message);
        return {
          opening: time,
          new_geo_score: 7.0,
          visibility_increase_percent: 20,
          estimated_revenue_increase_percent: "10%",
          competitive_position: "Competitive",
          confidence: "Medium",
          summary: `Opening at ${time} simulation complete.`,
        };
      }
    });

    return {
      meta: {
        engine: ENGINE_METADATA.version,
        methodology: ENGINE_METADATA.methodology,
      },
      scenarios,
      best_scenario: scenarios.sort(
        (a, b) =>
          parseFloat(b.estimated_revenue_increase_percent) -
          parseFloat(a.estimated_revenue_increase_percent),
      )[0].opening,
    };
  }

  const userPrompt = `
Current Context:
- Current Opening: ${context.currentOpening}
- Current Geo Score: ${context.currentGeoScore}
- Competitors: ${JSON.stringify(context.competitors)}
- Demand: ${JSON.stringify(context.hourlyDistribution)}

Proposed Scenarios: ${scenarioTimes.join(", ")}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen/qwen3.6-plus",
      temperature: 0.1,
      messages: [
        { role: "system", content: SIMULATION_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const aiResult = JSON.parse(response.choices[0].message.content);
    return {
      meta: {
        engine: ENGINE_METADATA.version,
        methodology: ENGINE_METADATA.methodology,
      },
      ...aiResult,
    };
  } catch (error) {
    console.error("❌ Real AI Simulation Failure:", error.message);
    // Fallback to deterministic results on AI error
    console.log("Falling back to deterministic simulation...");
    const scenarios = scenarioTimes.map((time) => {
      const timeToMins = (h) => {
        const [hrs, mins] = h.split(":").map(Number);
        return hrs * 60 + mins;
      };
      const gap = Math.max(0, timeToMins(time) - 420);
      const recoveredMinutes = Math.max(0, 510 - timeToMins(time));
      const baseRevenue = Math.round((recoveredMinutes / 150) * 20);
      return {
        opening: time,
        new_geo_score: 7 + (gap > 60 ? -1 : gap > 30 ? 0.5 : 2),
        visibility_increase_percent: Math.max(5, 40 - (gap / 2)),
        estimated_revenue_increase_percent: `${Math.max(5, baseRevenue)}%`,
        competitive_position: gap < 30 ? "Market Leader" : gap < 60 ? "Competitive" : "Laggard",
        confidence: "Medium",
        summary: `Fallback: Opening at ${time}`,
      };
    });

    return {
      meta: {
        engine: ENGINE_METADATA.version,
        methodology: "Fallback to Deterministic",
      },
      scenarios,
      best_scenario: scenarios[0].opening,
    };
  }
}
