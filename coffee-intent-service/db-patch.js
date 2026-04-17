import { query } from "./src/db/index.js";

async function migrate() {
  try {
    console.log("Adding missing columns to branches table...");
    await query(
      "ALTER TABLE branches ADD COLUMN IF NOT EXISTS total_queries INTEGER DEFAULT 2450",
    );
    await query(
      "ALTER TABLE branches ADD COLUMN IF NOT EXISTS morning_percent INTEGER DEFAULT 72",
    );
    await query(
      "ALTER TABLE branches ADD COLUMN IF NOT EXISTS work_percent INTEGER DEFAULT 38",
    );
    await query(
      "ALTER TABLE branches ADD COLUMN IF NOT EXISTS peak_hour VARCHAR(5) DEFAULT '08:45'",
    );
    console.log("Columns added successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
