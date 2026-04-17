import { query } from "./index.js";
import { BRANCHES } from "../utils/branches.js";

export const migrateStaticToDb = async () => {
  try {
    console.log("🚚 Migrating Static Data to Database...");

    for (const [id, data] of Object.entries(BRANCHES)) {
      // 1. Insert Branch
      await query(
        `INSERT INTO branches (id, name, lat, lng, current_opening, rating, tenant_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, lat = EXCLUDED.lat, lng = EXCLUDED.lng`,
        [
          id,
          data.name,
          data.coords?.lat || 0,
          data.coords?.lng || 0,
          data.currentStore?.openingTime || "08:00",
          data.currentStore?.rating || 4.5,
          "partner-01",
        ],
      );

      // 2. Insert Competitors
      // Clear existing to avoid duplicates in this simple migration
      await query("DELETE FROM competitors WHERE branch_id = $1", [id]);

      if (data.competitors) {
        for (const comp of data.competitors) {
          await query(
            `INSERT INTO competitors (branch_id, name, rating, distance_meters, opening_time, closing_time, is_major_player)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id,
              comp.name,
              comp.rating || 4.0,
              Math.floor((comp.distanceKm || 0) * 1000), // convert to meters
              comp.openingTime || "08:00",
              comp.closingTime || "22:00",
              comp.is_major || false,
            ],
          );
        }
      }
    }

    console.log("🏁 Migration Complete.");
  } catch (err) {
    console.error("❌ Migration Error:", err);
  }
};
