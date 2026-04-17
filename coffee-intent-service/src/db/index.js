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

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
  try {
    console.log("🐘 Initializing Database...");

    await query(`
      CREATE TABLE IF NOT EXISTS branches (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          lat DOUBLE PRECISION,
          lng DOUBLE PRECISION,
          current_opening TIME,
          rating DOUBLE PRECISION,
          tenant_id VARCHAR(50),
          morning_percent INTEGER DEFAULT 72,
          work_percent INTEGER DEFAULT 38,
          peak_hour VARCHAR(5) DEFAULT '08:45',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS competitors (
          id SERIAL PRIMARY KEY,
          branch_id VARCHAR(50) REFERENCES branches(id),
          name VARCHAR(255),
          rating DOUBLE PRECISION,
          distance_meters INTEGER,
          opening_time TIME,
          closing_time TIME,
          is_major_player BOOLEAN DEFAULT FALSE
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS simulations (
          id SERIAL PRIMARY KEY,
          branch_id VARCHAR(50) REFERENCES branches(id),
          opening_time TIME,
          predicted_geo_score DOUBLE PRECISION,
          predicted_revenue_uplift DOUBLE PRECISION,
          simulated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database Schema Ready.");
  } catch (err) {
    console.error("❌ Database Initialization Error:", err);
  }
};
