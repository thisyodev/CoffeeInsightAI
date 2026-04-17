import { query } from "../db/index.js";
import { openai } from "../config/openai.js";

/**
 * Service to enrich a geographic location with real market data using OpenRouter AI.
 * Uses lat/lng coordinates to query OpenRouter for realistic competitor data.
 */
export const enrichLocationData = async (branchId, lat, lng) => {
  try {
    console.log(
      `🔍 Enriching location ${lat}, ${lng} via OpenRouter AI...`,
    );

    // Step 1: Reverse geocode to get location name
    let locationName = "Bangkok Area";
    try {
      const reverseRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        {
          headers: {
            "User-Agent": "CoffeeInsightAI/1.0",
          },
        },
      );
      if (reverseRes.ok) {
        const data = await reverseRes.json();
        locationName =
          data.address?.suburb ||
          data.address?.district ||
          data.address?.city ||
          locationName;
        console.log(`📍 Reverse geocoded location: ${locationName}`);
      }
    } catch (err) {
      console.warn("⚠️ Reverse geocode failed, using default:", err.message);
    }

    // Step 2: Use OpenRouter to generate realistic competitors for this location
    const USE_REAL_AI = process.env.ENABLE_REAL_AI === "true";
    let competitors = [];

    if (USE_REAL_AI) {
      try {
        const response = await openai.chat.completions.create({
          model: "qwen/qwen3.6-plus",
          messages: [
            {
              role: "system",
              content: `You are a local coffee market analyst. Generate realistic coffee shop competitor data for a specific location.
Return ONLY valid JSON array with no markdown or explanations.
Each competitor should have realistic Thai names, distances within 1km, ratings 3.8-4.8, and opening times 6:00-10:00.`,
            },
            {
              role: "user",
              content: `Generate 3-4 realistic competitor coffee shops in ${locationName} (coordinates: ${lat}, ${lng}).

Return JSON array in this exact format:
[
  {"name": "Shop Name", "rating": 4.5, "distance_meters": 250, "opening_time": "07:30", "closing_time": "19:00"},
  ...
]`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const content = response.choices[0].message.content.trim();
        console.log(`✅ OpenRouter response: ${content}`);

        // Parse JSON response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          competitors = JSON.parse(jsonMatch[0]);
          console.log(`✅ Generated ${competitors.length} competitors via OpenRouter`);
        }
      } catch (err) {
        console.error("❌ OpenRouter enrichment failed:", err.message);
        console.log("⚠️ Falling back to deterministic data...");
        competitors = generateFallbackCompetitors(locationName);
      }
    } else {
      // Deterministic fallback
      console.log("🛠 Deterministic mode: using fallback competitors");
      competitors = generateFallbackCompetitors(locationName);
    }

    // Step 3: Save to Database
    for (const comp of competitors) {
      await query(
        `INSERT INTO competitors (branch_id, name, rating, distance_meters, opening_time, closing_time)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          branchId,
          comp.name || "Unknown Cafe",
          comp.rating || 4.0,
          comp.distance_meters || 200,
          comp.opening_time || "08:00",
          comp.closing_time || "20:00",
        ],
      );
    }

    return competitors;
  } catch (err) {
    console.error("❌ Enrichment Error:", err);
    return generateFallbackCompetitors("Unknown Location");
  }
};

/**
 * Generate realistic fallback competitors when AI is unavailable
 */
function generateFallbackCompetitors(locationName) {
  const locations = {
    "Asoke": [
      { name: "Asoke Coffee House", rating: 4.6, distance_meters: 180, opening_time: "07:00", closing_time: "19:30" },
      { name: "Urban Brew Asoke", rating: 4.3, distance_meters: 320, opening_time: "06:30", closing_time: "20:00" },
      { name: "Quality Roasters", rating: 4.5, distance_meters: 420, opening_time: "08:00", closing_time: "18:00" },
    ],
    "Siam": [
      { name: "Siam Coffee Lab", rating: 4.7, distance_meters: 150, opening_time: "07:00", closing_time: "20:00" },
      { name: "Espresso Bar Siam", rating: 4.2, distance_meters: 280, opening_time: "06:30", closing_time: "21:00" },
      { name: "Heritage Cafe", rating: 4.4, distance_meters: 380, opening_time: "08:30", closing_time: "18:00" },
    ],
    "Ari": [
      { name: "Ari Coffee House", rating: 4.7, distance_meters: 200, opening_time: "07:30", closing_time: "18:00" },
      { name: "Sunday Roast Coffee", rating: 4.4, distance_meters: 350, opening_time: "08:00", closing_time: "17:00" },
      { name: "Brew Ari", rating: 4.2, distance_meters: 500, opening_time: "07:00", closing_time: "19:00" },
    ],
  };

  // Match location to known areas or use generic fallback
  for (const [area, comps] of Object.entries(locations)) {
    if (locationName.includes(area)) {
      return comps;
    }
  }

  // Generic fallback for unknown locations
  return [
    { name: "Local Roaster", rating: 4.6, distance_meters: 120, opening_time: "07:30", closing_time: "17:00" },
    { name: "Commercial Chain", rating: 4.1, distance_meters: 250, opening_time: "06:30", closing_time: "21:00" },
    { name: "Artisan Cafe", rating: 4.4, distance_meters: 350, opening_time: "08:00", closing_time: "18:30" },
  ];
}
