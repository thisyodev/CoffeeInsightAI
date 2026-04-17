import express from "express";
import {
  getDashboardStats,
  getBranches,
} from "../controllers/dashboard.controller.js";
import {
  simulateMultiScenarios,
  getSimulationHistory,
} from "../controllers/simulation.controller.js";
import {
  analyzeLocation,
  searchLocation,
  reverseGeocodeLocation,
} from "../controllers/location.controller.js";

const router = express.Router();

// Coffee Insight Core API Endpoints
router.get("/dashboard", getDashboardStats);
router.get("/branches", getBranches);
router.post("/simulate-multi", simulateMultiScenarios);
router.get("/simulations/:branchId/history", getSimulationHistory);

// Phase 2: Dynamic Location Analysis
router.post("/location/analyze", analyzeLocation);
router.get("/location/search", searchLocation);
router.get("/location/reverse", reverseGeocodeLocation);

export default router;
