# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2026-04-10 | **Model:** v2.0.0-qwen-ai | **AI:** Minimax (OpenRouter) | **Status:** Running in Deterministic Mode

## Project Overview

**CoffeeInsightAI** is a retail analytics platform that helps coffee shop operators make data-driven decisions about operating hours and location strategies. It combines deterministic geospatial calculations with AI-powered insights to provide transparent, explainable business recommendations.

**Technology Stack:** React 19 + Vite | Node.js/Express | PostgreSQL (Neon) | OpenRouter (Qwen)

It's a monorepo containing two main services:

1. **coffee-dashboard**: React/Vite frontend displaying analytics, competitor insights, and simulation results
2. **coffee-intent-service**: Node.js/Express backend API providing geospatial analytics, revenue forecasting, and simulation engines

The system uses OpenAI integration for intelligent analysis, PostgreSQL for persistence, and a deterministic calculation engine for transparent, explainable recommendations.

## Architecture

### Backend (coffee-intent-service)

**Core Structure:**
- `server.js` - Entry point that initializes database, runs migrations, and starts the scheduler
- `src/app.js` - Express app setup with CORS, health endpoints, and route mounting
- `src/routes/` - API endpoints mounted under `/api/v1`
- `src/controllers/` - Request handlers (dashboard, simulation, location analysis)
- `src/services/` - Business logic:
  - `simulation.service.js` - Multi-scenario opening hour optimization
  - `insight.service.js` - AI-powered analysis via OpenAI
  - `data-enrichment.service.js` - Processing competitor and market data
  - `scheduler.service.js` - Scheduled tasks via node-cron
- `src/db/` - Database initialization and migrations
- `src/utils/`:
  - `deterministic.js` - Transparent calculation formulas (Geo Score, Revenue Impact, Confidence)
  - `response.js` - Response formatting utilities
  - `branches.js` - Branch-related helpers

**Database Schema:**
- `branches` - Store locations with opening times, ratings, traffic percentages, peak hours
- `competitors` - Competitor data (distance, opening hours, ratings) linked to branches
- `simulations` - Historical simulation results stored for trend analysis

**API Endpoints (all under `/api/v1`):**
- `GET /dashboard` - Returns analytics dashboard with geo scores, competitors, insights
- `GET /branches` - List all branch locations
- `POST /simulate-multi` - Run multi-scenario analysis for opening hour optimization
- `GET /simulations/:branchId/history` - Simulation history for trend tracking
- `POST /location/analyze` - Dynamic location analysis with OpenAI enrichment
- `GET /location/search` - Geocoding/location search
- `GET /location/reverse` - Reverse geocoding

### Frontend (coffee-dashboard)

**Core Structure:**
- `src/main.jsx` - React entry point
- `src/App.jsx` - Top-level component
- `src/pages/Dashboard.jsx` - Main dashboard view
- `src/services/api.js` - HTTP client with fallback mock data when backend unavailable
- `src/components/` - 20+ display components:
  - Analytics cards: `KPI.jsx`, `Card.jsx`
  - Visualizations: `IntentPie.jsx`, `HourBar.jsx`, `WorkTrend.jsx`, `GeoScoreTrend.jsx`
  - Insight panels: `AIInsightBox.jsx`, `LogicTransparency.jsx`
  - Interactive: `MultiScenarioSimulator.jsx`, `LocationAnalyzerModal.jsx`
  - Controls: `Toast.jsx`, `SecurityGate.jsx`
  - Navigation: `Navigation.jsx` - Improved site navigation with location selector priority, breadcrumb, sidebar menu (NEW)
- `src/utils/translations.js` - i18n for English/Thai
- `vite.config.js` - Vite build configuration with React SWC plugin
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS with Tailwind

**Styling:** Tailwind CSS v4 with cafe-inspired color system (espresso, latte, cream, caramel). See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete design guidelines

## Development

### Setup

**Backend:**

```bash
cd coffee-intent-service
npm install
# Create .env with DATABASE_URL and OPENAI_API_KEY
npm run dev        # Start with --watch for hot reload
npm start          # Production start
```

**Frontend:**
```bash
cd coffee-dashboard
npm install
# Create .env file (copy from .env.example)
cp .env.example .env
# Update password in .env if needed
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to dist/
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

**Environment Variables (Frontend):**
- `VITE_APP_PASSWORD` - Login password (default: 1234)
- `VITE_API_BASE_URL` - Backend API endpoint (default: http://localhost:3000/api/v1)
- `VITE_ENABLE_DEMO_MODE` - Bypass authentication (default: false)
- `VITE_ENABLE_ANALYTICS` - Enable tracking (default: true)

See `.env.example` for all available variables.

### Common Tasks

**Run entire system locally:**
1. Start PostgreSQL (ensure connection string works)
2. `cd coffee-intent-service && npm run dev`
3. In another terminal: `cd coffee-dashboard && npm run dev`
4. Frontend will proxy to backend at `http://localhost:3000/api/v1`

**Diagnose system issues:**
```bash
cd coffee-intent-service
node debug-logs.js  # Checks: env config, database, API connection, endpoints
```

**Database initialization:**
- Runs automatically on server startup via `migrateStaticToDb()`
- Manual check: `node db-check.js`
- Patches: `node db-patch.js`

**Testing API endpoints:**
- All requests require `x-tenant-id` header (default: "retail-enterprise-01")
- Optional `x-branch-id` header to target specific branch
- Rate limiting simulation: requests from "blocked-tenant" return 429

**View API documentation:**
- Health check: `GET /health`
- Manual page: `GET /manual` (HTML documentation with formulas)
- Metadata: `GET /api/v1/meta`

## Navigation Structure

**NEW (v2.0.0):** Improved site navigation implemented via `Navigation.jsx` component (React hooks-based):

- **Top Bar**: Logo, location selector (PRIORITY), language toggle, help buttons
  - Location dropdown shows all available branches with responsive sizing
  - Selection triggers automatic data refresh via `onBranchChange()`
  - Hover effect (border turns orange) for better visibility
  
- **Breadcrumb**: Shows current page path with clickable items
  - Format: "Home > Current Page > Sub-section"
  - Allows quick navigation between levels
  
- **Sidebar**: Collapsible hamburger menu (closed by default on page load)
  - Main sections: Dashboard, Analytics, Simulation, Locations, Settings
  - Expandable submenus with keyboard accessibility
  - Responsive width: `w-56 sm:w-72` with smooth animations
  
- **Status Bar**: System status indicators at bottom
  - Connection status (Connected/Offline)
  - Operational mode (Deterministic/Live AI)
  - Systems Online indicator

**Page Structure (Implemented):**

- Dashboard (home) - Overview with KPIs, competitor insights, AI insights
- Analytics Hub (upcoming) → Geo-Spatial, Demand, Revenue subsections
- Simulation Engine - Multi-scenario analysis with historical tracking
- Location Management (upcoming) - Add/edit branches
- Settings (upcoming) - Preferences and configuration

See `SITEMAP.md` for detailed navigation design and user journey flows.

## Key Design Patterns

### Deterministic Engine
The backend avoids AI hallucinations by using explicit mathematical formulas for core calculations:
- **Geo Score**: Weighted combination of proximity, competitiveness, alignment, quality
- **Revenue Impact**: Percentage uplift based on opening hour gap vs competitors
- **Confidence Score**: Reflects data quality and assumption certainty

All formulas are documented in `deterministic.js` and exposed via `/manual` endpoint for transparency.

### Graceful Degradation
Frontend has built-in fallback logic in `api.js`:
- If backend unavailable, returns mock data matching real schema
- Allows frontend development/testing without backend running
- Mock data includes explainability breakdown matching real responses

### Multi-Tenant Architecture
- Tenant isolation via `x-tenant-id` header
- Branch-level scoping with `x-branch-id`
- Supports different opening strategies per location

### Simulation Workflow
1. User provides list of candidate opening times
2. Backend calculates Geo Score and revenue uplift for each scenario
3. Results ranked by "Market Leader" positioning
4. History persisted to detect trends and patterns

## AI Integration (Minimax Model)

**Model:** `minimax/minimax-m2.5:free` via OpenRouter

**Configuration:**
- API Key: `OPENROUTER_API_KEY` (in .env)
- Real AI: `ENABLE_REAL_AI=true` in .env to use Minimax for insights
- Current Status: `ENABLE_REAL_AI=false` (deterministic mode due to API rate limiting)
- Fallback: When disabled, uses deterministic mock data (no API calls needed)

**AI Usage:**
- `generateExecutiveInsight()`: Analyzes geo-score breakdowns and generates strategic insights
- `analyzeDashboardStats()`: Creates business intelligence from market context
- `generateDailyHeadline()`: Produces executive summaries and action items
- Cache: 1-hour TTL on insights to minimize API costs
- Language: Supports English and Thai output

**Cost Optimization:**

- Uses free tier of Minimax via OpenRouter (limited daily requests)
- Caching prevents duplicate requests for same context
- Deterministic calculations run before AI (faster, no API needed)
- **Note:** System fully functional in deterministic mode without API costs or rate limits

## Testing

**Framework:** Vitest + React Testing Library (jsdom environment)

**Setup:**

```bash
cd coffee-dashboard
npm test                # Run all tests
npm run test:ui        # Interactive test UI
npm run test:coverage  # Generate coverage report
```

**Test Files:**

- `src/components/Navigation.test.jsx` - 26 tests covering hamburger menu, location selector, breadcrumb, sidebar, accessibility
- `src/components/KPI.test.jsx` - 12 tests covering card rendering, styling, responsive behavior
- `src/test/setup.js` - Test environment configuration (window.matchMedia mock, IntersectionObserver polyfill)

**Configuration:**

- `vitest.config.js` - Vitest settings with jsdom environment
- Tests use `vi.fn()` for mocks and `fireEvent` for user interactions
- All tests follow AAA pattern (Arrange, Act, Assert)

**Key Testing Patterns:**

- Component rendering with React Testing Library
- User interaction simulation (clicks, keyboard navigation)
- Accessibility attribute verification (aria-label, role, title)
- Responsive design breakpoint testing
- State change verification
- Internationalization (i18n) testing

**Running Single Test:**

```bash
npm test -- Navigation.test.jsx
npm test -- Navigation.test.jsx -t "hamburger menu"
```

## Troubleshooting

### Issue: Location Switching Doesn't Update KPI Values

**Symptoms:** Selecting different branch in dropdown doesn't change Market Captured Traffic, Morning Intensity, or other KPI values.

**Root Cause:** Possible reasons are backend not running, API returning same data, or stale browser cache.

**Solution:**

1. Verify backend is running: `curl http://localhost:3000/api/v1/meta`
2. Check API returns different data per branch:

   ```bash
   curl "http://localhost:3000/api/v1/dashboard?branch=asoke-01" -H "x-tenant-id: retail-enterprise-01"
   curl "http://localhost:3000/api/v1/dashboard?branch=sukhumvit-24" -H "x-tenant-id: retail-enterprise-01"
   # Compare "totalQueries" values - should differ
   ```

3. Hard refresh browser: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
4. Check console (F12): Look for `✅ Dashboard data fetched` and `📍 Switching to branch:` messages
5. Verify loading animation appears briefly during switch

See `LOCATION-SWITCH-FIX.md` for detailed debugging steps.

### Issue: Ari District Shows Wrong Competitors

**Symptoms:** Ari District location displays "Yellow Stuff Headquarters" in Suan Luang instead of Ari-area competitors.

**Root Cause:** Stale database with incorrect competitor data.

**Solution:**

```bash
cd coffee-intent-service
node restore-database.js
# Expected output: ✅ DATABASE RESTORE COMPLETE with 4 branches and 10 competitors
```

After restore:

1. Hard refresh browser: **Ctrl+Shift+R**
2. Select "Ari District" from dropdown
3. Verify competitors shown:
   - Ari Coffee House (200m, 4.7★)
   - Sunday Roast Coffee (350m, 4.4★)
   - Brew Ari (500m, 4.2★)

See `FIX-ARI-LOCATION.md` for detailed verification checklist and alternative diagnostics.

### Issue: Hamburger Menu Stays Open on Page Load

**Symptoms:** Sidebar opens automatically when page loads or after hard refresh.

**Root Cause:** Navigation.jsx had `useState(true)` for menu toggle.

**Solution:** Already fixed in Navigation.jsx line 20 - uses `useState(false)` for closed-by-default behavior. If issue recurs:

1. Check Navigation.jsx line 20: `const [sidebarOpen, setSidebarOpen] = useState(false);`
2. Clear browser cache: DevTools → Application tab → Local Storage → Clear
3. Hard refresh: **Ctrl+Shift+R**

### Issue: Backend Returns 500 Error on Simulate Endpoint

**Symptoms:** `{success: false, error_code: 'SIMULATION_ENGINE_FAULT', message: '...'}`

**Root Cause:** AI response missing expected `scenarios` property or malformed.

**Solution:**

1. Check OpenRouter API status:

   ```bash
   node test-openrouter.js
   ```

2. Verify model is available:

   ```bash
   node check-openrouter-models.js
   ```

3. Switch to deterministic mode (no API calls):
   - Set `ENABLE_REAL_AI=false` in `.env`
   - Restart backend: `npm run dev`
4. Check backend logs for AI response format issues

### Issue: "SYSTEM OFFLINE" Message with Backend 500 Error

**Symptoms:** Frontend shows "SYSTEM OFFLINE • Backend error: 500 • Safe Mode Active"

**Root Cause:** OpenRouter API rate limiting (daily quota exceeded for free models) or connection issues.

**Solution:**

1. Check OpenRouter account: [https://openrouter.ai/logs](https://openrouter.ai/logs)
2. Switch to deterministic mode:

   ```bash
   # In .env
   ENABLE_REAL_AI=false
   NODE_ENV=production
   ```

3. Restart both backend and frontend:

   ```bash
   # Terminal 1: Backend
   cd coffee-intent-service && npm run dev
   
   # Terminal 2: Frontend
   cd coffee-dashboard && npm run dev
   ```

4. Verify system goes online: "SYSTEM ONLINE" should appear

System is fully functional in deterministic mode without AI or rate limiting concerns.

### Issue: Database Connection Failed

**Symptoms:** Backend fails to start with "Error: connect ECONNREFUSED" or "FATAL: password authentication failed"

**Root Cause:** PostgreSQL not running or wrong DATABASE_URL in .env

**Solution:**

1. Verify PostgreSQL is running
2. Check .env has valid DATABASE_URL:
   - Local: `postgres://postgres:postgres@localhost:5432/coffee_insight`
   - Cloud (Neon): `postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require`
3. Test connection:

   ```bash
   node db-check.js
   ```

4. If using cloud database, ensure SSL is enabled in connection string

## Quick Diagnosis

**Check system health:**

```bash
# Terminal 1: Backend diagnostics
cd coffee-intent-service
node debug-logs.js
# Shows: Environment config, Database status, API connectivity, Available endpoints

# Terminal 2: Test API endpoints
curl http://localhost:3000/api/v1/meta
curl http://localhost:3000/api/v1/branches
```

**Check frontend:**

1. Open browser DevTools (F12)
2. Console tab: Look for `✅` messages (success) and `❌` (errors)
3. Network tab: Check `/api/v1/dashboard` requests have correct branch parameter
4. Application tab: Clear cache and local storage if data seems stale

## Technology Notes

- **ES Modules**: Both frontend and backend use `"type": "module"` in package.json
- **React Compiler**: Currently incompatible with SWC plugin; not enabled
- **Vite SWC**: Faster transpilation than Babel for development
- **Zod Validation**: Used for request/response schema validation on backend
- **CORS**: Enabled on backend to allow frontend requests from different origins
- **PostgreSQL**: Uses connection pooling via `pg` library; SSL required for cloud deployments
- **Hybrid Architecture**: Deterministic calculations + AI insights = transparent, explainable results

## File Locations Reference

**Backend Configuration:**
- Environment: `.env` (DATABASE_URL, OPENAI_API_KEY, PORT, NODE_ENV)
- SQL schema: `src/db/index.js` (CREATE TABLE statements)
- Routes: `src/routes/intent.routes.js`

**Frontend Configuration:**
- Build: `vite.config.js`
- Styling: `tailwind.config.js`, `postcss.config.js`
- Linting: `eslint.config.js`
- API base URL: hardcoded in `src/services/api.js` (line 1)

**Testing/Utilities:**

- `db-check.js` - Verify database connection
- `db-patch.js` - Apply database updates
- `test.json` - Sample test data
- `test-enrich.js` - Test OpenAI enrichment pipeline
- `debug-logs.js` - Comprehensive system diagnostics (environment, database, API, endpoints)
- `test-openrouter.js` - Test OpenRouter API connectivity
- `check-openrouter-models.js` - Test availability of multiple AI models
- `restore-database.js` - Reset database to initial state with 4 branches and 9 competitors
- `update-branches-locations.js` - Add geographic coordinates to branches
