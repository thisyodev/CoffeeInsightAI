import {
  analyzeDashboardStats,
  generateDailyHeadline,
} from "../services/insight.service.js";
import {
  calculateGeoScore,
  calculateRevenueImpact,
  classifyCompetitivePosition,
  calculateConfidenceScore,
  ENGINE_METADATA,
} from "../utils/deterministic.js";
import { successResponse } from "../utils/response.js";

export async function getDashboardStats(req, res) {
  try {
    const tenantId = req.headers["x-tenant-id"] || "anon-tenant";
    const branchId =
      req.query.branch || req.headers["x-branch-id"] || "asoke-01";

    const { query: dbQuery } = await import("../db/index.js");

    // 1. Fetch Branch from DB
    const branchResult = await dbQuery("SELECT * FROM branches WHERE id = $1", [
      branchId,
    ]);
    if (branchResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Branch not found" });
    }
    const branch = branchResult.rows[0];

    // 2. Fetch Competitors from DB
    const compResult = await dbQuery(
      "SELECT * FROM competitors WHERE branch_id = $1",
      [branchId],
    );
    const competitors = compResult.rows.map((c) => ({
      name: c.name,
      openingTime: (c.opening_time || "08:00:00").substring(0, 5),
      rating: c.rating,
      distanceKm: c.distance_meters / 1000,
    }));

    const currentStore = {
      name: branch.name,
      openingTime: (branch.current_opening || "08:00:00").substring(0, 5),
      rating: branch.rating,
    };

    console.log(
      `🛠 DB Engine ${ENGINE_METADATA.version} | Tenant: ${tenantId} | Branch: ${branch.name} | Processing...`,
    );

    const timeToMins = (h) => {
      const [hrs, mins] = h.split(":").map(Number);
      return hrs * 60 + mins;
    };

    const earliestComp =
      competitors.length > 0
        ? Math.min(...competitors.map((c) => timeToMins(c.openingTime)))
        : timeToMins(currentStore.openingTime);

    const openingGap = Math.max(
      0,
      timeToMins(currentStore.openingTime) - earliestComp,
    );
    const avgCompRating =
      competitors.length > 0
        ? competitors.reduce((acc, c) => acc + c.rating, 0) / competitors.length
        : 4.0;
    const ratingAdvantage = currentStore.rating - avgCompRating;

    // DETERMINISTIC CALCULATIONS (LOGIC LAYER)
    const geoScoreData = calculateGeoScore({
      distanceScore: 9.5,
      openingGapMinutes: openingGap,
      intentWeight: 0.88,
      ratingAdvantage: ratingAdvantage,
    });

    const morningPercent = branch.morning_percent || 72;
    const workPercent = branch.work_percent || 38;

    const revenueImpactData = calculateRevenueImpact({
      morningDemandPercent: morningPercent,
      timeDifferenceMinutes: openingGap,
      averageDailyRevenue: 25000,
      hourlyDemand: [], // fallback
    });

    const smartContext = {
      opening_gap_minutes: openingGap,
      missed_queries_estimate: revenueImpactData.missedQueries,
      revenue_impact_percent: revenueImpactData.percentIncrease,
      rating_advantage: parseFloat(ratingAdvantage.toFixed(1)),
      commuter_intent_weight: branchId === "siam-square" ? 0.25 : 0.72,
      engine_version: ENGINE_METADATA.version,
    };

    const lang = req.query.lang || "th";

    // Parallel AI Insights Generation
    const [analysis, headlineReport] = await Promise.all([
      analyzeDashboardStats(smartContext, lang),
      generateDailyHeadline(smartContext, lang),
    ]);

    const dashboardData = {
      location_context: branch.name,
      totalQueries: branch.total_queries || 2450,
      morningPercent: `${morningPercent}%`,
      workPercent: `${workPercent}%`,
      peakHour: branch.peak_hour,
      geoScore: geoScoreData.score,
      geoChange: "+0.2",
      geoStatus: classifyCompetitivePosition({
        gapMinutes: openingGap,
        ratingAdvantage,
      }),
      geoSparkline: [6.1, 6.3, 6.5, geoScoreData.score],
      competitors: [{ ...currentStore, distanceKm: 0 }, ...competitors],
      intentDistribution: [
        { name: "Morning Commute", value: 600, fill: "#846358" },
        { name: "Digital Nomad", value: 400, fill: "#bfa094" },
        { name: "Quick Grab", value: 500, fill: "#eaddd7" },
        { name: "Business Meet", value: 240, fill: "#d2bab0" },
      ],
      hourlyDistribution: [
        { hour: "06:00", requests: 120 },
        { hour: "07:00", requests: 450 },
        { hour: "08:00", requests: 890 },
        { hour: "09:00", requests: 620 },
        { hour: "10:00", requests: 380 },
        { hour: "11:00", requests: 410 },
      ],
      workTrend: [
        { hour: "07:00", value: 20 },
        { hour: "08:00", value: 45 },
        { hour: "09:00", value: 80 },
        { hour: "10:00", value: 110 },
        { hour: "11:00", value: 95 },
      ],
      ai_analysis: analysis,
      daily_report: headlineReport,
    };

    const confidenceScore = calculateConfidenceScore({ ageOfDataMinutes: 0 });

    const explainability = {
      formula_breakdown: {
        geo_score: geoScoreData.breakdown,
        revenue_uplift: {
          base: revenueImpactData.percentIncrease,
          efficiency: 0.85,
        },
      },
      confidence_score: confidenceScore,
      confidence_reason:
        "High data fidelity from real-time proximity and historical morning transit signals.",
      opening_gap_minutes: openingGap,
      demand_recovered_percent: Math.round(revenueImpactData.percentIncrease),
      revenue_formula: ENGINE_METADATA.revenue_formula,
      geo_formula: ENGINE_METADATA.geo_formula,
    };

    return successResponse(res, dashboardData, explainability);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error_code: "DASHBOARD_FETCH_FAILED",
      message: err.message,
      model_version: ENGINE_METADATA.version,
    });
  }
}

export async function getBranches(req, res) {
  try {
    const { query } = await import("../db/index.js");
    const result = await query(
      "SELECT id, name FROM branches ORDER BY name ASC",
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
