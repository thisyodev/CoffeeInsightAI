/**
 * CoffeeInsight Intelligence Engine v2.4-PRO
 * Single Source of Truth for Deterministic Formulas
 *
 * Rules:
 * 1. No Randomness.
 * 2. No Side Effects.
 * 3. Reproducible Outputs.
 * 4. Transparent Multipliers.
 */

export const ENGINE_METADATA = {
  version: "v2.0.0-qwen-ai",
  last_trained: "2026-04-10",
  methodology: "Hybrid: Deterministic Geo-Spatial + AI (Qwen) Insights",
  engine_type: "hybrid-deterministic-ai",
  ai_model: process.env.ENABLE_REAL_AI === "true" ? "minimax/minimax-m2.5:free (OpenRouter)" : "mock-local",
  revenue_formula:
    "((recovered_demand / peak_window) * 0.18 * efficiency) * (1 + rating_advantage)",
  geo_formula:
    "(Proximity * 0.4) + (Gap_Comp * 0.3) + (Demand_Match * 0.2) + (Quality * 0.1)",
  assumptions: [
    "Peak commuter window is 120 minutes (07:00-09:00)",
    "Maximum revenue uplift from early opening capped at 18%",
    "Capture efficiency constant at 0.85 for prime locations",
    "Demand decay follows linear temporal distribution",
    "AI insights powered by Qwen 3.6 Plus via OpenRouter",
  ],
};

/**
 * Calculates Geo Score (0.1 - 10.0)
 * Formula: (Proximity * 0.4) + (GapCompetitiveness * 0.3) + (DemandMatch * 0.2) + (Quality * 0.1)
 *
 * @param {Object} inputs
 * @param {number} inputs.distanceScore - 0 to 10 scale (10 is closest)
 * @param {number} inputs.openingTimeGap - Minutes lag vs market leader
 * @param {number} inputs.intentWeight - 0.0 to 1.0 (morning demand concentration)
 * @param {number} inputs.reviewScore - 0 to 5.0 (Google/Platform rating)
 * @returns {Object} { score, breakdown }
 */
export function calculateGeoScore({
  distanceScore = 5.0,
  openingGapMinutes = 0,
  intentWeight = 0.5,
  reviewScore = 4.0,
}) {
  // Alias for backward compatibility
  const openingTimeGap = openingGapMinutes;

  const distanceContribution = Math.min(10, distanceScore) * 0.4;

  // 0 gap = 10 pts, 120m+ gap = 0 pts
  const gapCompRaw = Math.max(0, (1 - openingTimeGap / 120) * 10);
  const gapContribution = gapCompRaw * 0.3;

  const demandContribution = intentWeight * 10 * 0.2;
  const qualityContribution = Math.min(10, reviewScore * 2) * 0.1;

  const total =
    distanceContribution +
    gapContribution +
    demandContribution +
    qualityContribution;

  return {
    score: parseFloat(total.toFixed(1)),
    breakdown: {
      proximity: parseFloat(distanceContribution.toFixed(2)),
      competitiveness: parseFloat(gapContribution.toFixed(2)),
      alignment: parseFloat(demandContribution.toFixed(2)),
      quality: parseFloat(qualityContribution.toFixed(2)),
    },
    signals: {
      proximity: parseFloat(distanceContribution.toFixed(2)),
      competitiveness: parseFloat(gapContribution.toFixed(2)),
      alignment: parseFloat(demandContribution.toFixed(2)),
      quality: parseFloat(qualityContribution.toFixed(2)),
    },
  };
}

/**
 * Calculates visibility increase percentage.
 * Formula: BaseGain(min/60 * 15) * QualityMultiplier
 *
 * @param {Object} inputs
 * @param {number} inputs.timeDifferenceMinutes - Minutes of early capture
 * @param {number} inputs.ratingDifference - MyRating - MarketAvgRating
 * @returns {number} Percentage (0-95)
 */
export function calculateVisibilityIncrease({
  timeDifferenceMinutes = 0,
  ratingDifference = 0,
}) {
  const baseGain = (timeDifferenceMinutes / 60) * 15;
  const ratingMultiplier = 1 + Math.max(0, ratingDifference);
  const result = Math.min(95, baseGain * ratingMultiplier);

  return parseFloat(result.toFixed(2));
}

/**
 * Calculates estimated revenue uplift percentage.
 * Formula: ((recoveredDemand / peakWindow) * 0.18 * efficiency) * (1 + ratingAdvantage)
 *
 * @param {Object} inputs
 * @param {number} inputs.recoveredDemandMinutes - Minutes captured from peak
 * @param {number} inputs.peakWindowMinutes - Reference peak window (default 120)
 * @param {number} inputs.captureEfficiency - Conversion efficiency (default 0.85)
 * @param {number} inputs.ratingAdvantage - Normalized rating delta
 * @returns {number} Percentage
 */
export function calculateRevenueUplift({
  recoveredDemandMinutes = 0,
  peakWindowMinutes = 120,
  captureEfficiency = 0.85,
  ratingAdvantage = 0,
}) {
  const windowRatio = recoveredDemandMinutes / peakWindowMinutes;
  const upliftFactor = 0.18; // 18% max uplift constant for full peak recovery
  const result =
    windowRatio * upliftFactor * captureEfficiency * (1 + ratingAdvantage);

  return parseFloat((result * 100).toFixed(2));
}

/**
 * Classifies competitive positioning in the market.
 *
 * @param {Object} inputs
 * @param {number} inputs.gapMinutes - Lag vs market leader
 * @param {number} inputs.ratingAdvantage - MyRating - AvgCompRating
 * @returns {string} One of: 'Market Leader', 'Competitive', 'Lagging'
 */
export function classifyCompetitivePosition({
  gapMinutes = 0,
  ratingAdvantage = 0,
}) {
  if (gapMinutes <= 0 && ratingAdvantage > 0.3) return "Market Leader";
  if (gapMinutes <= 15 || ratingAdvantage >= 0) return "Competitive";
  return "Lagging";
}

/**
 * Calculates data confidence score (0.0 to 1.0)
 *
 * @param {Object} inputs
 * @param {number} inputs.ageOfDataMinutes - Minutes since last data sync
 * @param {number} inputs.competitorDataVariance - Variance index (0 to 1)
 * @returns {number} Confidence decimal
 */
export function calculateConfidenceScore({
  ageOfDataMinutes = 0,
  competitorDataVariance = 0.05,
}) {
  const TemporalWeight = 0.7;
  const ReliabilityWeight = 0.3;

  const temporalConfidence =
    TemporalWeight * Math.max(0, 1 - ageOfDataMinutes / 1440); // Decay over 24h
  const dataReliability =
    ReliabilityWeight * (1 - Math.min(1, competitorDataVariance));

  const total = temporalConfidence + dataReliability;
  return parseFloat(Math.max(0.1, total).toFixed(2));
}

/**
 * Deterministic wrapper for revenue impact used by the dashboard.
 * Returns percent increase and a mock missed‑queries metric.
 */
export function calculateRevenueImpact({
  morningDemandPercent = 0,
  timeDifferenceMinutes = 0,
  averageDailyRevenue = 0,
  hourlyDemand = [],
}) {
  const peakWindow = 120;
  const recoveredDemandMinutes = Math.max(
    0,
    peakWindow - timeDifferenceMinutes,
  );
  const percentIncrease = calculateRevenueUplift({
    recoveredDemandMinutes,
    peakWindowMinutes: peakWindow,
    captureEfficiency: 0.85,
    ratingAdvantage: 0,
  });
  const missedQueries = Math.round(
    (1 - recoveredDemandMinutes / peakWindow) * 1000,
  );
  return { percentIncrease, missedQueries };
}
