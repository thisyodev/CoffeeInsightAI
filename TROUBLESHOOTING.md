# 🔧 CoffeeInsightAI - Troubleshooting Guide

## Issue: Backend 500 Error / System Offline

### ✅ Status Check Script
Run to diagnose issues:
```bash
node debug-logs.js
```

This checks:
- Environment configuration
- Database connection
- OpenRouter API connectivity
- All API endpoints
- Model version

---

## Common Issues & Solutions

### 1. ❌ Rate Limit: "free-models-per-day"

**Problem:** Minimax free model has hit daily limit
```
Error: 429 Rate limit exceeded: free-models-per-day
```

**Solutions:**

**Option A: Disable Real AI (Deterministic Only)**
```bash
# Edit .env
ENABLE_REAL_AI=false
```
✅ System still works with deterministic formulas (no AI cost)

**Option B: Add Credits to OpenRouter**
1. Go to https://openrouter.ai/account/usage
2. Add $5+ credit (unlocks 1000 free requests)
3. System automatically works again

**Option C: Use Different Model**
Available free/low-cost models:
- `qwen/qwen-2.5-72b-instruct` - Free
- `gpt-3.5-turbo` - Low-cost
- `gpt-4o-mini` - Low-cost

Edit `src/services/insight.service.js` and `src/services/simulation.service.js`:
```javascript
model: "gpt-3.5-turbo",  // Change from minimax
```

---

### 2. ❌ Database Connection Failed

**Problem:**
```
❌ Database Connection: FAILED
   Error: connect ENOTFOUND...
```

**Solutions:**
1. Verify DATABASE_URL in `.env`
2. Check Neon PostgreSQL is online
3. Verify network connectivity
4. Test with:
```bash
node -e "import pg from 'pg'; const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT 1').then(() => console.log('✅')).catch(e => console.error(e))"
```

---

### 3. ❌ Port Already in Use (EADDRINUSE)

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Kill existing Node process
taskkill /F /IM node.exe

# Or restart on different port
PORT=3001 npm run dev
```

---

### 4. ⚠️ Dashboard Shows "Safe Mode Active"

This means the system is running in **fallback mode** - using deterministic calculations instead of AI.

**Check status:**
- Is OpenRouter rate limited? ✓ (See Issue #1)
- Is ENABLE_REAL_AI=false? ✓ (Check .env)
- Is AI taking too long? (check timeout)

**To fix:**
- Add OpenRouter credits
- Change to different AI model
- Or accept deterministic mode (still works!)

---

### 5. ❌ "API error: invalid_request_error"

**Problem:** Invalid model name or configuration

**Check:**
1. Model name in code matches OpenRouter
2. API key is valid
3. OpenRouter account has credits

**Valid models:**
```
minimax/minimax-m2.5:free
gpt-3.5-turbo
gpt-4o-mini
qwen/qwen-2.5-72b-instruct
deepseek/deepseek-chat
```

---

## Debugging Workflow

### Step 1: Run Diagnostics
```bash
node debug-logs.js
```

### Step 2: Check Each Component
- ✅ Database: `SELECT COUNT(*) FROM branches`
- ✅ OpenRouter: `node test-openrouter.js`
- ✅ Endpoints: `curl http://localhost:3000/health`
- ✅ Frontend: `http://localhost:5174`

### Step 3: View Logs
```bash
tail -50 /tmp/server.log
```

### Step 4: Restart Services
```bash
taskkill /F /IM node.exe
npm run dev
```

---

## Environment Variables Checklist

| Variable | Required | Status |
|----------|----------|--------|
| PORT | Optional | Default: 3000 |
| NODE_ENV | Optional | Default: development |
| DATABASE_URL | **Required** | Neon PostgreSQL |
| OPENROUTER_API_KEY | **Required** | From openrouter.ai |
| ENABLE_REAL_AI | Optional | Default: true |

---

## Database Restoration

If database is corrupted:
```bash
node restore-database.js
```

This resets:
- ✅ Branches: 4 core locations
- ✅ Competitors: 9 competitors
- ✅ Simulations: Cleared (fresh)

---

## API Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | ✅ OK | Working normally |
| 404 | Branch not found | Use valid branchId |
| 429 | Rate limit | Add OpenRouter credits |
| 500 | Server error | Check logs with `debug-logs.js` |

---

## Support Commands

```bash
# Diagnose system
node debug-logs.js

# Test OpenRouter connection
node test-openrouter.js

# Check available models
node check-openrouter-models.js

# Restore database
node restore-database.js

# Update branch locations
node update-branches-locations.js

# Backend logs
tail -50 /tmp/server.log
```

---

## Real-Time Monitoring

```bash
# Watch server logs as they arrive
tail -f /tmp/server.log | grep "Error\|❌\|⚠️"

# Monitor database
watch -n 5 'node -e "import pg from \"pg\"; const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query(\"SELECT COUNT(*) FROM branches\").then(r => console.log(\"Branches:\", r.rows[0].count)).catch(console.error)"'
```

---

**Version:** v2.0.0-qwen-ai  
**Last Updated:** 2026-04-10  
**Status:** Production Ready (with deterministic fallback)
