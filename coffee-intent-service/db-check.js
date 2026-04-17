import { query } from "./src/db/index.js";

async function check() {
  try {
    const branches = await query("SELECT * FROM branches");
    console.log(
      "Branches:",
      branches.rows.map((b) => ({ id: b.id, name: b.name })),
    );

    const comps = await query("SELECT count(*) FROM competitors");
    console.log("Total Competitors:", comps.rows[0].count);
  } catch (err) {
    console.error("Check failed:", err);
  }
}

check();
