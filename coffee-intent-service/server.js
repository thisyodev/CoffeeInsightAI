import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { initScheduler } from "./src/services/scheduler.service.js";
import { initDb } from "./src/db/index.js";
import { migrateStaticToDb } from "./src/db/migrate.js";

const PORT = process.env.PORT || 3000;

// Initialize Database and Run Migration
const startServer = async () => {
  await initDb();
  await migrateStaticToDb();
  initScheduler();

  app.listen(PORT, () => {
    console.log(`
☕ Coffee Insight API (DB Mode)
🚀 Server: http://localhost:${PORT}
🩺 Health: http://localhost:${PORT}/health
    `);
  });
};

startServer();
