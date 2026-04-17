import express from "express";
import cors from "cors";
import intentRoutes from "./routes/intent.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({
    message: "☕ Coffee Intent Service API is running",
    version: "1.0.0",
    docs: "/health",
  });
});

import { ENGINE_METADATA } from "./utils/deterministic.js";

// Enterprise Meta Endpoint
app.get("/api/v1/meta", (req, res) => {
  res.json({
    model_version: ENGINE_METADATA.version,
    engine_type: ENGINE_METADATA.engine_type,
    tenant_id: req.headers["x-tenant-id"] || "anon-tenant",
    environment: process.env.NODE_ENV || "development",
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// GET /manual - Simple documentation page
app.get("/manual", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>CoffeeInsight Manual</title>
        <style>
          body { background: #0c0a09; color: #e7e5e4; font-family: sans-serif; padding: 40px; line-height: 1.6; }
          .container { max-width: 800px; mx-auto; }
          h1 { color: #f97316; font-size: 2.5rem; letter-spacing: -0.05em; }
          h2 { color: #fff; margin-top: 40px; border-bottom: 1px solid #262626; padding-bottom: 10px; }
          .badge { background: #1c1917; border: 1px solid #444; padding: 4px 12px; rounded: 8px; font-size: 0.8rem; font-weight: bold; }
          .status { display: inline-block; width: 10px; h: 10px; background: #10b981; border-radius: 50%; margin-right: 8px; }
          .highlight { color: #f97316; }
          pre { background: #1c1917; padding: 20px; border-radius: 12px; border: 1px solid #262626; overflow-x: auto; }
          code { color: #fb923c; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1>CoffeeInsight <span style="color:#fff">Manual</span></h1>
            <span class="badge">v${ENGINE_METADATA.version}</span>
          </div>

          <div style="margin: 20px 0; font-size: 0.9rem; color: #78716c;">
            <span class="status"></span> System Status: Active • Mode: <span class="highlight">Deterministic</span>
          </div>

          <section>
            <h2>Overview</h2>
            <p>Welcome to the CoffeeInsight documentation. This system provides geospatial predictive analytics for retail coffee operations.</p>
          </section>

          <section>
            <h2>How it works</h2>
            <p>Our engine ingest real-time market data, competitor opening hours, and historical transit patterns. It processes these through a <strong>Deterministic Engine</strong> to avoid AI "hallucinations".</p>
          </section>

          <section>
            <h2>Transparency Model</h2>
            <p>Transparency is core to our product. Every calculation for Geo Scores and Revenue Uplift is backed by explicit mathematical formulas:</p>
            <pre><code>Geo Formula: ${ENGINE_METADATA.geo_formula}</code></pre>
          </section>

          <section>
            <h2>Simulation Explanation</h2>
            <p>The Scenario Simulator allows you to model hypothetical business changes. It runs iterative calculations vs market leader baselines to predict the revenue impact of adjusting your opening hours.</p>
          </section>

          <footer style="margin-top: 80px; border-top: 1px solid #262626; padding-top: 20px; color: #57534e; font-size: 0.8rem;">
            © 2026 CoffeeInsight AI Enterprise. All Rights Reserved.
          </footer>
        </div>
      </body>
    </html>
  `);
});

// SaaS Rate Limiting Simulation Middleware (Phase 3)
const rateLimitSimulation = (req, res, next) => {
  // Simple simulation of rate limiting based on tenant
  const tenantId = req.headers["x-tenant-id"];
  if (tenantId === "blocked-tenant") {
    return res
      .status(429)
      .json({ error: "Rate limit exceeded for this tenant" });
  }
  next();
};

app.use("/api/v1", rateLimitSimulation, intentRoutes);
app.use("/api", intentRoutes); // Backward compatibility fallback

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
