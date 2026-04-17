import { ENGINE_METADATA } from "./deterministic.js";

/**
 * Standardizes API v1 Success Response
 */
export function successResponse(res, data, explainability = {}) {
  return res.json({
    success: true,
    model_version: ENGINE_METADATA.version,
    timestamp: new Date().toISOString(),
    data: data,
    explainability: {
      formula_breakdown: explainability.formula_breakdown || {},
      confidence_score: explainability.confidence_score || 1.0,
      assumptions: ENGINE_METADATA.assumptions,
      ...explainability,
    },
  });
}

/**
 * Standardizes API v1 Error Response
 */
export function errorResponse(res, code, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error_code: code,
    message: message,
    model_version: ENGINE_METADATA.version,
    timestamp: new Date().toISOString(),
  });
}
