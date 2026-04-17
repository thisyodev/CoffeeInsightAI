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

// Bangkok Coffee Shop Locations (lat, lng)
const locationData = {
  "asoke-01": { lat: 13.7563, lng: 100.5518, name: "Asoke Junction" },
  "sukhumvit-24": { lat: 13.7419, lng: 100.5578, name: "Sukhumvit 24" },
  "siam-square": { lat: 13.7453, lng: 100.5348, name: "Siam Square" },
  "ari-01": { lat: 13.8211, lng: 100.5562, name: "Ari District" },
  "dyn-1772279052470": { lat: 13.7738, lng: 100.5486, name: "พระราม 9" },
  "dyn-1772279553742": { lat: 13.7305, lng: 100.5564, name: "Lumpini Park" },
  "dyn-1772278959424": { lat: 13.8085, lng: 100.5205, name: "Gateway Bangsue" },
  "dyn-1772289258992": { lat: 13.7623, lng: 100.5402, name: "Prachachiuen 20" },
  "dyn-1772290660021": { lat: 13.8211, lng: 100.5562, name: "Matcha People Ari" },
  "dyn-1772289602297": { lat: 13.8095, lng: 100.5520, name: "Commu Rooftop" },
  "dyn-1772290169070": { lat: 13.8095, lng: 100.5520, name: "Commu Rooftop Cafe" },
  "dyn-1772289837309": { lat: 13.8095, lng: 100.5520, name: "Commu Cafe" },
  "dyn-1775789035664": { lat: 13.7563, lng: 100.5518, name: "Test Coffee" },
  "dyn-1775790880558": { lat: 13.7563, lng: 100.5518, name: "Test Coffee Store" },
  "dyn-1775791141138": { lat: 13.7563, lng: 100.5518, name: "New Coffee Location" },
  "dyn-1775791151163": { lat: 13.7563, lng: 100.5518, name: "New Coffee" },
  "dyn-1775791465802": { lat: 13.7563, lng: 100.5518, name: "Premium Coffee Bangkok" },
  "dyn-1772289968626": { lat: 13.8211, lng: 100.5562, name: "Commu Test" },
  "dyn-1772290999999": { lat: 13.7305, lng: 100.5564, name: "เพิ่มพุงโภชนา" },
};

async function updateBranchLocations() {
  try {
    console.log("🗺️  Updating branch locations in database...\n");

    let updated = 0;
    let errors = 0;

    for (const [branchId, locationInfo] of Object.entries(locationData)) {
      try {
        // Check if branch exists
        const checkResult = await pool.query(
          "SELECT id FROM branches WHERE id = $1",
          [branchId]
        );

        if (checkResult.rows.length > 0) {
          // Update existing branch
          await pool.query(
            "UPDATE branches SET lat = $1, lng = $2, name = $3 WHERE id = $4",
            [locationInfo.lat, locationInfo.lng, locationInfo.name, branchId]
          );
          console.log(
            `✅ Updated: ${branchId.padEnd(25)} (${locationInfo.name}) → [${locationInfo.lat}, ${locationInfo.lng}]`
          );
          updated++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${branchId}:`, err.message);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated} branches`);
    console.log(`❌ Errors: ${errors}`);
    console.log(
      `\n🎯 All branches now have location data (lat/lng) for geospatial analytics`
    );

    // Show updated branches
    console.log("\n📍 Verification - Branches with coordinates:");
    const result = await pool.query(
      "SELECT id, name, lat, lng FROM branches WHERE lat IS NOT NULL AND lng IS NOT NULL ORDER BY name LIMIT 10"
    );
    result.rows.forEach((row) => {
      console.log(
        `  ${row.name.padEnd(35)} [${row.lat.toFixed(4)}, ${row.lng.toFixed(4)}]`
      );
    });

    await pool.end();
  } catch (err) {
    console.error("❌ Database Error:", err);
    process.exit(1);
  }
}

updateBranchLocations();
