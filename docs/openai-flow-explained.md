---
description: Data Flow Overview (Database to OpenAI Insights)
---

# CoffeeInsight AI: Data Flow & OpenAI Integration

This document outlines how real-time data stored in PostgreSQL is processed and fed into the OpenAI engine to generate dynamic, executive-level business insights on the dashboard.

## 1. The Core Tables (PostgreSQL)

The system relies on two main tables that store physical location data:

- **`branches`**: Your store's locations (e.g., COMMU Rooftop Cafe). Contains `lat`, `lng`, `current_opening` (e.g., 08:00), and `rating`.
- **`competitors`**: Nearby rival shops discovered during the Location Analysis phase. Contains `name`, `distance_meters`, `opening_time` (e.g., 07:00), and `rating`.

## 2. Extraction & Mathematical Processing (`dashboard.controller.js`)

When the user selects a branch (e.g., `GET /api/v1/dashboard?branch=dyn-123`), the backend executes the following flow:

1. **Database Query**: It fetches the specific `branch` and its associated `competitors`.
2. **Gap Calculation**: The code finds the earliest opening competitor and compares it to your branch's opening time.
   - _Example: Competitor opens at 06:30, You open at 08:00 -> `openingGap` = 90 minutes._
3. **Rating Advantage**: It compares your branch rating against the average competitor rating.
   - _Example: You (4.5) - Avg Comp (4.1) = `ratingAdvantage` = +0.4._
4. **Deterministic Math**: These raw numbers are fed into the `deterministic.js` engine to calculate the **Geo Score** and **Missed Revenue Impacts (`missedQueries`, `percentIncrease`)**.

## 3. The "Smart Context" Object

All the calculated mathematical facts are bundled into a lightweight, stripped-down object called `smartContext`. **We do not send the entire raw database to OpenAI.** By sending only aggregated numbers, we save tokens, increase speed, and guarantee that the AI strictly bases its logic on our deterministic equations.

```javascript
// Example Payload
const smartContext = {
  opening_gap_minutes: 90,
  missed_queries_estimate: 2450,
  revenue_impact_percent: 18.5,
  rating_advantage: 0.4,
  commuter_intent_weight: 0.72,
};
```

## 4. OpenAI Integration (`insight.service.js`)

The `smartContext` is passed to two parallel AI functions in `insight.service.js`:

```javascript
const [analysis, headlineReport] = await Promise.all([
  analyzeDashboardStats(smartContext, lang),
  generateDailyHeadline(smartContext, lang),
]);
```

### A. System Prompts (The Persona)

Before sending the `smartContext`, we prepend a strict **System Prompt**. This forces the AI to act as an "Executive strategic advisor" and return only structured JSON.

### B. LLM Call (`gpt-4o-mini`)

The server makes a secure call to the OpenAI API using your `OPENAI_API_KEY`:

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.2, // Low temperature for deterministic/factual responses
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: DASHBOARD_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Current Market Context: ${JSON.stringify(smartContext)}`,
    },
  ],
});
```

## 5. Caching and Rendering

1. **Caching (`insightCache`)**: Because OpenAI calls cost money and take time (~1-2 seconds), the output JSON is temporarily cached in server memory. If a user reloads the same branch, it serves the cached response instantly.
2. **Rendering (React)**: The JSON string returned by OpenAI (e.g., `{ "summary": "...", "risks": [...] }`) is safely forwarded to the Frontend, parsed, and rendered seamlessly into UI components like `AIInsightBox` and the main `Dashboard` Hero section.

---

## 🚀 Summary Checklist

- [x] Front-End requests Data for a specific Branch.
- [x] Back-End queries PostgreSQL (Branches + Competitors).
- [x] Back-End calculates Math Constraints (Gap, Missing Revenue).
- [x] Back-End packages calculations into `smartContext`.
- [x] Back-End prompts OpenAI (`gpt-4o-mini`) securely using `.env` key.
- [x] Server Receives JSON, Caches it & sends it back to the client.
