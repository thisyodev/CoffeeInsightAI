import dotenv from "dotenv";
import pg from "pg";
import OpenAI from "openai";

dotenv.config();

const { Pool } = pg;

console.log("\n╔═══════════════════════════════════════════════════════════╗");
console.log("║         🔍 COFFEEINSIGHTAI - SYSTEM DIAGNOSTICS         ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");

// 1. Environment Check
console.log("📋 ENVIRONMENT CONFIGURATION");
console.log("─────────────────────────────────────────────────────────");
console.log(`✅ PORT:                    ${process.env.PORT || 3000}`);
console.log(`✅ NODE_ENV:                ${process.env.NODE_ENV || "development"}`);
console.log(`✅ ENABLE_REAL_AI:          ${process.env.ENABLE_REAL_AI}`);
console.log(`✅ OPENROUTER_API_KEY:      ${process.env.OPENROUTER_API_KEY?.substring(0, 20)}...`);
console.log(`✅ DATABASE_URL:            ${process.env.DATABASE_URL?.substring(0, 40)}...`);

// 2. Database Connection Check
async function checkDatabase() {
  console.log("\n📊 DATABASE CONNECTION");
  console.log("─────────────────────────────────────────────────────────");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes("?") ? "&" : "?"}sslmode=require`
      : "postgres://postgres:postgres@localhost:5432/coffee_insight",
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  });

  try {
    const result = await pool.query("SELECT 1");
    console.log("✅ Database Connection:     WORKING");

    // Check tables
    const branchCount = await pool.query("SELECT COUNT(*) FROM branches");
    const compCount = await pool.query("SELECT COUNT(*) FROM competitors");
    const simCount = await pool.query("SELECT COUNT(*) FROM simulations");

    console.log(`✅ Branches:                ${branchCount.rows[0].count} records`);
    console.log(`✅ Competitors:             ${compCount.rows[0].count} records`);
    console.log(`✅ Simulations:             ${simCount.rows[0].count} records`);

    await pool.end();
    return true;
  } catch (err) {
    console.error("❌ Database Connection:     FAILED");
    console.error(`   Error: ${err.message}`);
    return false;
  }
}

// 3. OpenRouter API Check
async function checkOpenRouter() {
  console.log("\n🤖 OPENROUTER API CONNECTION");
  console.log("─────────────────────────────────────────────────────────");

  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  try {
    const response = await openai.chat.completions.create({
      model: "minimax/minimax-m2.5:free",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 5,
    });
    console.log("✅ OpenRouter Connection:   WORKING");
    console.log(`✅ Model:                   minimax/minimax-m2.5:free`);
    console.log(`✅ Response:                ${response.choices[0].message.content}`);
    return true;
  } catch (err) {
    console.error("❌ OpenRouter Connection:   FAILED");
    console.error(`   Error: ${err.message}`);
    return false;
  }
}

// 4. API Endpoints Check
async function checkAPIEndpoints() {
  console.log("\n🌐 API ENDPOINTS");
  console.log("─────────────────────────────────────────────────────────");

  const endpoints = [
    { name: "Health", url: "http://localhost:3000/health" },
    {
      name: "Dashboard",
      url: "http://localhost:3000/api/v1/dashboard?branch=asoke-01",
      headers: { "x-tenant-id": "retail-enterprise-01" },
    },
    {
      name: "Branches",
      url: "http://localhost:3000/api/v1/branches",
      headers: { "x-tenant-id": "retail-enterprise-01" },
    },
    {
      name: "Meta",
      url: "http://localhost:3000/api/v1/meta",
      headers: { "x-tenant-id": "retail-enterprise-01" },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        headers: endpoint.headers || {},
      });
      if (response.ok) {
        console.log(`✅ ${endpoint.name.padEnd(15)} ${response.status} OK`);
      } else {
        console.log(`⚠️  ${endpoint.name.padEnd(15)} ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error(`❌ ${endpoint.name.padEnd(15)} Connection error`);
    }
  }
}

// 5. Model Version Check
async function checkModelVersion() {
  console.log("\n🎯 MODEL VERSION");
  console.log("─────────────────────────────────────────────────────────");

  try {
    const response = await fetch("http://localhost:3000/api/v1/meta", {
      headers: { "x-tenant-id": "retail-enterprise-01" },
    });
    const data = await response.json();
    console.log(`✅ Model Version:           ${data.model_version}`);
    console.log(`✅ Engine Type:             ${data.engine_type}`);
    console.log(`✅ Environment:             ${data.environment}`);
    console.log(`✅ Uptime:                  ${data.uptime_seconds}s`);
  } catch (err) {
    console.error(`❌ Could not fetch version info: ${err.message}`);
  }
}

// Run all checks
(async () => {
  const dbOk = await checkDatabase();
  const routerOk = await checkOpenRouter();
  await checkAPIEndpoints();
  await checkModelVersion();

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║                      SYSTEM SUMMARY                       ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");

  const allOk = dbOk && routerOk;
  if (allOk) {
    console.log("✨ All systems operational - Ready for production ✨\n");
  } else {
    console.log("⚠️  Some systems require attention - Check errors above\n");
  }

  process.exit(allOk ? 0 : 1);
})();
