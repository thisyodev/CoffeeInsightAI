# CoffeeInsightAI Developer Skills

Quick reference for common development tasks and debugging.

## Quick Commands

### Start Services
```bash
# Backend only
cd coffee-intent-service && npm run dev

# Frontend only
cd coffee-dashboard && npm run dev

# Both (in separate terminals)
# Terminal 1: cd coffee-intent-service && npm run dev
# Terminal 2: cd coffee-dashboard && npm run dev
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/health

# Get branches
curl http://localhost:3000/api/v1/branches \
  -H "x-tenant-id: retail-enterprise-01"

# Dashboard stats
curl http://localhost:3000/api/v1/dashboard?branch=asoke-01 \
  -H "x-tenant-id: retail-enterprise-01"

# Location analysis
curl -X POST http://localhost:3000/api/v1/location/analyze \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: retail-enterprise-01" \
  -d '{"lat":13.7563,"lng":100.5018,"name":"Test"}'

# Simulation
curl -X POST http://localhost:3000/api/v1/simulate-multi \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: retail-enterprise-01" \
  -d '{"scenarios":["07:00","07:30","08:00"],"branchId":"asoke-01"}'
```

## Configuration

### Backend Environment (.env)
```
ENABLE_REAL_AI=true              # Enable Qwen AI (false = deterministic only)
OPENROUTER_API_KEY=sk-or-v1-...  # OpenRouter API key for Qwen model
DATABASE_URL=postgresql://...    # Neon PostgreSQL connection
PORT=3000                         # API port
NODE_ENV=development             # Environment mode
```

### Frontend API
- Base URL: `http://localhost:3000/api/v1` (in `src/services/api.js` line 1)
- All requests include `x-tenant-id` header: `retail-enterprise-01`
- All requests bypass cache with `?t=Date.now()` and cache headers

## Common Tasks

### Add New Location
1. POST to `/api/v1/location/analyze` with `{lat, lng, name, opening_time, rating}`
2. Returns `branch_id` that's auto-created in PostgreSQL
3. Competitors are auto-enriched from deterministic data

### Run Simulation
1. POST to `/api/v1/simulate-multi` with list of `scenarios` (opening times)
2. Returns revenue impact % and competitive position for each
3. Uses deterministic calculations (no AI cost)

### Enable/Disable Real AI
1. Edit `.env`: `ENABLE_REAL_AI=true` or `false`
2. Restart backend: `npm run dev` will auto-reload
3. When true: Uses Qwen model for insights (costs API calls, uses cache)
4. When false: Uses mock deterministic data (free, instant)

### View Dashboard Data
1. Open http://localhost:5173 in browser
2. Browser console (F12) shows:
   - `✅ Dashboard data fetched from backend`
   - `✅ Branches fetched from backend`
   - Network requests hitting real API
3. All data comes from PostgreSQL + Qwen AI insights

### Update Branch Locations
All branches are now populated with Bangkok coordinates:
```bash
# Run location update script (one-time setup)
node update-branches-locations.js

# Branches updated (19 locations):
# - Asoke Junction: [13.7563, 100.5518]
# - Sukhumvit 24: [13.7419, 100.5578]
# - Siam Square: [13.7453, 100.5348]
# - Ari District: [13.8211, 100.5562]
# - Lumpini Park: [13.7305, 100.5564]
# - Gateway Bangsue: [13.8085, 100.5205]
# - Prachachiuen 20: [13.7623, 100.5402]
# - Matcha People Ari: [13.8211, 100.5562]
# - Commu Rooftop: [13.8095, 100.5520]
# - พระราม 9: [13.7738, 100.5486]
# - เพิ่มพุงโภชนา: [13.7305, 100.5564]
# + 8 more dynamic test locations
```

### Debug API Issues
```bash
# Check server logs
tail -f /tmp/server.log

# Verify database connection
node db-check.js

# Apply database patches
node db-patch.js

# Test enrichment pipeline
node test-enrich.js

# Update all branches with locations
node update-branches-locations.js
```

## Model Versions

**Current:** `v2.0.0-qwen-ai`

- **Deterministic Engine**: Pure math formulas (no randomness, transparent)
- **AI Component**: Qwen 3.6+ for insights (via OpenRouter)
- **Hybrid**: Deterministic geo-scores + AI business insights
- **Explainability**: Every score backed by formula breakdown

## Database Schema

**branches**
- `id`: VARCHAR(50) - Branch identifier
- `name`: VARCHAR(255) - Store name
- `lat`, `lng`: DOUBLE PRECISION - Coordinates
- `current_opening`: TIME - Opening time
- `rating`: DOUBLE PRECISION - Google/platform rating
- `tenant_id`: VARCHAR(50) - Multi-tenant identifier

**competitors**
- `id`: SERIAL - Auto-increment
- `branch_id`: FK to branches
- `name`: Competitor name
- `distance_meters`: Integer - Distance from branch
- `opening_time`, `closing_time`: TIME

**simulations**
- `id`: SERIAL - Auto-increment
- `branch_id`: FK to branches
- `opening_time`: TIME - Simulated opening hour
- `predicted_geo_score`: Revenue impact forecast

## Troubleshooting

### "Backend not responding"
- Verify `npm run dev` is running on port 3000
- Check `.env` and `DATABASE_URL` is valid
- Check PostgreSQL is accessible

### "OPENROUTER_API_KEY missing"
- Add key to `.env` file
- Verify it starts with `sk-or-v1-`
- Restart backend after update

### "Database connection failed"
- Verify `DATABASE_URL` in .env
- Check network/firewall access to Neon
- Run `node db-check.js` to test

### Model showing "v1.0.0-deterministic" instead of "v2.0.0-qwen-ai"
- Restart backend: `npm run dev` (--watch should auto-reload)
- Check `ENGINE_METADATA.version` in `src/utils/deterministic.js`

### Location analysis returns 400
- Verify lat/lng are valid (lat: -90 to 90, lng: -180 to 180)
- Check request body has `lat`, `lng` (required)
- Optional: `name`, `opening_time`, `rating`

## Performance Tips

1. **Cache Insights**: 1-hour TTL prevents duplicate AI calls
2. **Deterministic First**: Geo-scores calculated before AI (fast)
3. **Batch Simulations**: Call `/simulate-multi` once with all times
4. **Use Mock Mode**: Set `ENABLE_REAL_AI=false` for development
5. **Monitor API Calls**: Check browser Network tab for caching (304 = cached, 200 = fresh)

## File Structure Reference

```
coffee-intent-service/
├── server.js                 # Entry point (setup, DB init, scheduler)
├── src/
│   ├── app.js               # Express setup
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic (AI, simulation)
│   ├── routes/              # API endpoint definitions
│   ├── db/                  # PostgreSQL setup & migration
│   ├── config/              # OpenRouter SDK config
│   └── utils/               # Deterministic formulas, response helpers
└── .env                     # Configuration (API key, DB URL, flags)

coffee-dashboard/
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Root component
│   ├── pages/Dashboard.jsx # Main view
│   ├── components/         # 20+ UI components
│   ├── services/api.js     # HTTP client (with cache busting)
│   └── utils/translations  # i18n (EN/TH)
├── vite.config.js          # Vite build config
└── tailwind.config.js      # CSS styling
```

---

**Last Updated:** 2026-04-10 | **Model:** v2.0.0-qwen-ai | **Status:** Production Ready
