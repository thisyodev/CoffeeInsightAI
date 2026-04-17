# 🚀 Production Launch Checklist - CoffeeInsightAI

**Repository:** `https://github.com/thisyodev/CoffeeInsightAI`

---

## Phase 0: Pre-Flight (Done)
- [x] **Model Migration:** Updated to `qwen/qwen3.6-plus:free`.
- [x] **Code Pushed:** Changes are live on GitHub.
- [ ] **Environment Variables Check:** Ensure no secrets are hardcoded. 
        *(e.g., OPENROUTER_API_KEY and DATABASE_URL must only be in `.env` or the hosting dashboard).*

---

## Phase 1: Backend Deployment (Render)
**Target:** Deploy `coffee-intent-service` for FREE.
**Link:** https://render.com

**1. Create Service:**
- [ ] Log in to Render via GitHub.
- [ ] Click **New +** > **Web Service**.
- [ ] Select Repository: `thisyodev/CoffeeInsightAI`.

**2. Configure (Monorepo Setup):**
- [ ] **Name:** `coffee-intent-api` (or preferred name).
- [ ] **Region:** Oregon (recommended) or Frankfurt.
- [ ] **Branch:** `main`.
- [ ] **Root Directory:** `coffee-intent-service` (⚠️ **CRITICAL**: Must be this exact folder name).
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `node server.js`

**3. Add Environment Variables:**
*Go to the "Environment" tab of your new service and add:*
- [ ] **`NODE_ENV`** = `production`
- [ ] **`ENABLE_REAL_AI`** = `true`
- [ ] **`OPENROUTER_API_KEY`** = `sk-or-v1-...` (Your OpenRouter Key)
- [ ] **`DATABASE_URL`** = `postgresql://...` (Your Supabase/Neon/Render DB URL)

**4. Deploy:**
- [ ] Click **Create Web Service**.
- [ ] Wait for status "Live".
- [ ] **Copy the Service URL:** 
      `https://coffee-intent-api-xxxx.onrender.com`

---

## Phase 2: Frontend Deployment (Vercel)
**Target:** Deploy `coffee-dashboard` for FREE.
**Link:** https://vercel.com

**1. Create Project:**
- [ ] Log in to Vercel via GitHub.
- [ ] Click **Add New...** > **Project**.
- [ ] Import Repository: `thisyodev/CoffeeInsightAI`.

**2. Configure (Monorepo Setup):**
- [ ] **Project Name:** `coffee-insight-dashboard`
- [ ] **Framework Preset:** Vite.
- [ ] **Root Directory:** Click **Edit** > Select `coffee-dashboard`.
- [ ] **Build Command:** Leave default (`npm run build`).
- [ ] **Output Directory:** Leave default (`dist`).

**3. Add Environment Variables:**
- [ ] **`VITE_API_URL`** = `https://coffee-intent-api-xxxx.onrender.com` 
      *(This is the URL you copied from Render in Phase 1).*

**4. Deploy:**
- [ ] Click **Deploy**.
- [ ] Wait for success.
- [ ] **Copy the Vercel URL:** 
      `https://coffee-insight-dashboard.vercel.app`

---

## Phase 3: Final Polish

**1. Update CORS (Backend Code):**
- [ ] Open `coffee-intent-service/server.js`.
- [ ] Update CORS `origin` to include your new Vercel URL.
      *Example:* `origin: 'https://coffee-insight-dashboard.vercel.app'`
- [ ] Commit & Push to GitHub:
      ```bash
      git add coffee-intent-service/server.js
      git commit -m "fix: update CORS for production"
      git push origin main
      ```
      *Render will auto-redeploy this change.*

**2. Verify Live App:**
- [ ] Open your Vercel URL in an Incognito window.
- [ ] Perform a Search.
- [ ] Trigger an AI Insight.
      *(Note: First load might take 45s if Render is "waking up" from sleep).*
      *(Subsequent loads will be instant).*

---

## Phase 4: Maintenance (Free Tier Survival)

**Keep the Backend Awake:**
*Render's free tier sleeps the backend after 15 mins of inactivity. The next user will face a 30s delay.*

- [ ] **Option A (Manual):** Visit the Render URL manually every morning.
- [ ] **Option B (Automated):** Set up a free Cron Job.
    - [ ] Go to https://cron-job.org
    - [ ] Create account.
    - [ ] Create a job that PINGs `https://coffee-intent-api-xxxx.onrender.com/api/ping` every 10 minutes.
    - [ ] *Note: You will need to add `app.get('/api/ping', (req, res) => res.send('ok'));` to your server code.*

---

## 📝 Summary of Resources

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| **Frontend** | Vercel | `https://[your-app].vercel.app` | 🟢 Live |
| **Backend** | Render | `https://[your-app].onrender.com` | 🟢 Live |
| **Database** | Supabase/Neon | Internal Connection String | 🟢 Live |
| **AI API** | OpenRouter | Internal API Key | 🟢 Free |
