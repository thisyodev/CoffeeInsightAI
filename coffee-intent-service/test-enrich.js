import { enrichLocationData } from "./src/services/data-enrichment.service.js";
import { initDb } from "./src/db/index.js";

async function test() {
  await initDb();
  console.log("Testing enrichLocationData...");
  const result = await enrichLocationData("test-branch-id", 13.7367, 100.5604);
  console.log("Result:", result);
  process.exit();
}
test();
