# CoffeeInsight AI Technical Manual (v2.0.0-db-persisted) 🛠️

Professional developer documentation for the CoffeeInsight predictive geo-analytics engine.

---

## 1. System Architecture

The system is built on a decoupled 3-tier architecture designed for high transparency, rapid SaaS scalability, and persistent data storage.

### Frontend (React + Tailwind + Vite)

- **Design System:** High-fidelity dark executive theme.
- **State Management:** React Hooks (useState/useEffect) for live data updates.
- **Map Integration:** Leaflet.js with OpenStreetMap Nominatim Geocoding API (Debounced).
- **Responsibility:** Pure UI rendering. No business logic or mathematical calculations are performed on the client side.

### API Layer (Node.js + Express)

- **Path:** `/api/v1/`
- **Orchestration:** Controllers query the PostgreSQL database, invoke the Deterministic Engine, and enrich data with AI Insights (OpenAI) and Deterministic Mock Fallbacks.
- **Security:** Equipped with Tenant-ID validation and rate-limiting middleware.

### Database Layer (PostgreSQL)

- **Driver:** `pg` (with `sslmode=require` for secure remote connections like Neon).
- **Persistence:** All dynamic branches, local competitors, and simulated scenarios are permanently stored and queried in real-time.
- **Tables:** `branches`, `competitors`, `simulations`.

### Deterministic Engine (`deterministic.js`)

- **Core Logic:** The "Single Source of Truth" for all business formulas.
- **Principles:** Pure functions, zero randomness, 100% reproducibility.

---

## 2. API Endpoints

### `GET /api/v1/dashboard`

Fetches complete dashboard state including GEO Scores, Competitor snapshots, and Revenue analysis dynamically from the Database.

- **Query Params:** `branch` (e.g., `dyn-177...`), `lang` (th|en)
- **Headers:** `x-tenant-id` (required)

### `POST /api/v1/location/analyze`

Hyper-local territory scanning. Geocodes lat/lng, synthesizes a branch profile containing relevant competitors (via OpenAI or Fallback), and persists the raw data to PostgreSQL.

- **Body:** `{ "lat": 13.829, "lng": 100.513, "name": "COMMU Cafe" }`
- **Headers:** `x-tenant-id` (required)

### `POST /api/v1/simulate-multi`

Runs multiple business scenarios based on a list of proposed opening times, calculates the best outcome, and logs the result permanently to the `simulations` table.

- **Body:** `{ "branchId": "dyn-177...", "scenarios": ["07:00", "07:30"] }`

### `GET /api/v1/simulations/:branchId/history`

Retrieves the five most recent simulation records for a specific branch from the Database.

---

## 3. Data Enrichment & External Services

1.  **AI Engine (OpenAI):** Uses `gpt-4o-mini` to scan an area's latitude/longitude to generate realistic competitors.
2.  **Deterministic Fallback:** If OpenAI fails (e.g., Quota Exceeded/Rate Limits), the engine automatically injects a verified deterministic mock response into the database to prevent catastrophic UI failures.
3.  **Geocoding (Nominatim):** Converts user search queries to GIS coordinates. Requests are strictly debounced by 1 second to prevent `429 Too Many Requests` API IP-bans.

---

## 4. Deterministic Engine Rules

1.  **Pure Functions:** Every function in `deterministic.js` must return the same output for the same input.
2.  **No Randomness:** Use constants and coefficients derived from validated market research.
3.  **Formula Transparency:**
    - **Geo Score:** `(Proximity * 0.4) + (Gap_Comp * 0.3) + (Demand_Match * 0.2) + (Quality * 0.1)`
    - **Revenue Uplift:** `((recovered_demand / peak_window) * 0.18 * efficiency) * (1 + rating_advantage)`

---

## 5. Production Hardening Notes

1.  **PostgreSQL SSL:** Remote connection strings must enforce `sslmode=require` or `{ rejectUnauthorized: false }` to prevent Node.js `ECONNREFUSED` or libpq security warnings during cloud hosting (e.g., Vercel/Neon DB).
2.  **Environment Variables:** Always set `DATABASE_URL` and `OPENAI_API_KEY`.
3.  **CORS:** Restrict to authenticated tenant domains in production.

---

**Lead Architect: CoffeeInsight AI Infrastructure Team**
