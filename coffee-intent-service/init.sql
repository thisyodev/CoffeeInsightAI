-- Create the database (optional, change name if needed)
-- CREATE DATABASE coffee_analytics;

-- Create intents_log table
CREATE TABLE IF NOT EXISTS intents_log (
  id BIGSERIAL PRIMARY KEY,
  raw_query TEXT NOT NULL,
  parsed_json JSONB NOT NULL,
  confidence FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance on confidence scores (optional)
CREATE INDEX IF NOT EXISTS idx_intents_confidence ON intents_log(confidence);

-- Index for searching within JSONB (optional)
CREATE INDEX IF NOT EXISTS idx_intents_jsonb ON intents_log USING GIN (parsed_json);

-- Daily Strategic Reports
CREATE TABLE IF NOT EXISTS daily_reports (
    id SERIAL PRIMARY KEY,
    headline TEXT,
    top_risk TEXT,
    top_opportunity TEXT,
    action_today TEXT,
    created_at DATE DEFAULT CURRENT_DATE
);
