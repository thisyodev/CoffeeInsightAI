import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes("?") ? "&" : "?"}sslmode=require`
    : "postgres://postgres:postgres@localhost:5432/coffee_insight",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Initial branch data
const initialBranches = [
  {
    id: "asoke-01",
    name: "Asoke Junction",
    lat: 13.7563,
    lng: 100.5518,
    current_opening: "08:30",
    rating: 4.8,
    tenant_id: "retail-enterprise-01",
  },
  {
    id: "sukhumvit-24",
    name: "Sukhumvit 24",
    lat: 13.7419,
    lng: 100.5578,
    current_opening: "08:00",
    rating: 4.5,
    tenant_id: "retail-enterprise-01",
  },
  {
    id: "siam-square",
    name: "Siam Square",
    lat: 13.7453,
    lng: 100.5348,
    current_opening: "09:00",
    rating: 4.3,
    tenant_id: "retail-enterprise-01",
  },
  {
    id: "ari-01",
    name: "Ari District",
    lat: 13.8211,
    lng: 100.5562,
    current_opening: "08:15",
    rating: 4.6,
    tenant_id: "retail-enterprise-01",
  },
  {
    id: "sam-chuk",
    name: "Sam Chuk",
    lat: 14.7937,
    lng: 100.1076,
    current_opening: "08:00",
    rating: 4.5,
    tenant_id: "retail-enterprise-01",
  },
];

// Competitor data for each branch
const competitorsByBranch = {
  "asoke-01": [
    { name: "BARTELS Asok", rating: 4.5, distance_meters: 150, opening_time: "07:00", closing_time: "22:00" },
    { name: "Artis Coffee", rating: 4.2, distance_meters: 400, opening_time: "07:00", closing_time: "18:30" },
    { name: "Bru Cafe", rating: 4.5, distance_meters: 600, opening_time: "07:00", closing_time: "20:00" },
  ],
  "sukhumvit-24": [
    { name: "Local Roaster", rating: 4.6, distance_meters: 200, opening_time: "07:30", closing_time: "17:00" },
    { name: "Coffee House", rating: 4.1, distance_meters: 350, opening_time: "06:30", closing_time: "21:00" },
  ],
  "siam-square": [
    { name: "Siam Coffee", rating: 4.4, distance_meters: 100, opening_time: "08:00", closing_time: "20:00" },
    { name: "Espresso Bar", rating: 4.0, distance_meters: 250, opening_time: "08:30", closing_time: "19:00" },
  ],
  "ari-01": [
    { name: "Ari Coffee House", rating: 4.7, distance_meters: 200, opening_time: "07:00", closing_time: "20:00" },
    { name: "Sunday Roast Coffee", rating: 4.4, distance_meters: 350, opening_time: "07:30", closing_time: "18:00" },
    { name: "Brew Ari", rating: 4.2, distance_meters: 500, opening_time: "08:00", closing_time: "19:30" },
  ],
  "sam-chuk": [
    { name: "Local Roaster", rating: 4.6, distance_meters: 120, opening_time: "07:30", closing_time: "17:00" },
    { name: "Commercial Chain", rating: 4.1, distance_meters: 250, opening_time: "06:30", closing_time: "21:00" },
    { name: "Artisan Cafe", rating: 4.3, distance_meters: 350, opening_time: "08:00", closing_time: "20:00" },
    { name: "Local Brew House", rating: 4.2, distance_meters: 800, opening_time: "07:00", closing_time: "18:30" },
  ],
};

async function restoreDatabase() {
  try {
    console.log("🔄 Restoring Database...\n");

    // 1. Clear simulations
    console.log("🗑️  Clearing simulations table...");
    await pool.query("DELETE FROM simulations");
    console.log("✅ Simulations cleared");

    // 2. Clear competitors
    console.log("🗑️  Clearing competitors table...");
    await pool.query("DELETE FROM competitors");
    console.log("✅ Competitors cleared");

    // 3. Clear branches (except the initial ones we'll add back)
    console.log("🗑️  Clearing branches table...");
    await pool.query("DELETE FROM branches");
    console.log("✅ Branches cleared");

    // 4. Re-insert initial branches
    console.log("\n📍 Restoring branches...");
    for (const branch of initialBranches) {
      await pool.query(
        `INSERT INTO branches (id, name, lat, lng, current_opening, rating, tenant_id, morning_percent, work_percent, peak_hour)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          branch.id,
          branch.name,
          branch.lat,
          branch.lng,
          branch.current_opening,
          branch.rating,
          branch.tenant_id,
          72,
          38,
          "08:45",
        ]
      );
      console.log(`  ✅ ${branch.name} [${branch.lat}, ${branch.lng}]`);
    }

    // 5. Re-insert competitors
    console.log("\n🏪 Restoring competitors...");
    for (const [branchId, competitors] of Object.entries(competitorsByBranch)) {
      for (const comp of competitors) {
        await pool.query(
          `INSERT INTO competitors (branch_id, name, rating, distance_meters, opening_time, closing_time)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [branchId, comp.name, comp.rating, comp.distance_meters, comp.opening_time, comp.closing_time]
        );
      }
      console.log(`  ✅ ${branchId}: ${competitors.length} competitors added`);
    }

    console.log("\n════════════════════════════════════════════════════");
    console.log("✅ DATABASE RESTORE COMPLETE");
    console.log("════════════════════════════════════════════════════");
    console.log("\n📊 Restored Data:");
    console.log(`  • Branches: ${initialBranches.length}`);
    console.log(`  • Competitors: ${Object.values(competitorsByBranch).flat().length}`);
    console.log(`  • Simulations: 0 (fresh start)`);
    console.log("\n🎯 All tables reset to initial state");

    await pool.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

restoreDatabase();
