# 🚀 Production Launch Checklist for CoffeeInsightAI
**Repository:** `https://github.com/thisyodev/CoffeeInsightAI`

---

## Phase 1: Push to GitHub
1.  **Local Terminal Checks:**
    - [ ] Ensure changes are staged: `git add .`
    - [ ] Commit changes: `git commit -m "chore: finalize production config and model update"`
    - [ ] Push to your repository:
      ```bash
      git push origin main
      ```
    - [ ] Verify at: `https://github.com/thisyodev/CoffeeInsightAI`

---

## Phase 2: Backend Setup (Render)
**Goal:** Deploy `coffee-intent-service`
**URL:** `render.com`

1.  **New Web Service:**
    - [ ] Log in to Render (use GitHub login).
    - [ ] Click **New +** -> **Web Service**.
    - [ ] Select repository: **thisyodev/CoffeeInsightAI**.

2.  **Configuration Settings (Crucial for Monorepos):**
    - [ ] **Name:** `coffee-intent-service`
    - [ ] **Root Directory:** `coffee-intent-service` (⚠️ Important!)
    - [ ] **Environment:** `Node`
    - [ ] **Region:** Select region closest to your users (e.g., Oregon/Frankfurt).
    - [ ] **Branch:** `main`
    - [ ] **Build Command:** `npm install`
    - [ ] **Start Command:** `node server.js`

3.  **Environment Variables:**
    - [ ] Add `NODE_ENV` = `production`
    - [ ] Add `ENABLE_REAL_AI` = `true`
    - [ ] Add `DATABASE_URL` = `Your_Postgres_Connection_String`
    - [ ] Add `OPENROUTER_API_KEY` = `sk-or-...`
    - [ ] Click **Create Web Service**.

4.  **Finalize:**
    - [ ] Wait for build success.
    - [ ] **Copy the Service URL** (ends in `.onrender.com`).
      - *Keep this handy for Phase 3.*

---

## Phase 3: Frontend Setup (Vercel)
**Goal:** Deploy `coffee-dashboard`
**URL:** `vercel.com`

1.  **New Project:**
    - [ ] Log in to Vercel (use GitHub login).
    - [ ] Click **Add New...** -> **Project**.
    - [ ] Select repository: **thisyodev/CoffeeInsightAI**.
    - [ ] Click **Import**.

2.  **Configuration Settings:**
    - [ ] **Project Name:** `coffee-dashboard`
    - [ ] **Root Directory:** Click **Edit** -> Select `coffee-dashboard`.
    - [ ] **Build Command:** Leave as default (`npm run build`).
    - [ ] **Output Directory:** Leave as default (`dist`).

3.  **Environment Variables:**
    - [ ] Add `VITE_API_URL` = `https://[YOUR_RENDER_SERVICE_URL].onrender.com`
      - *Must match your Render URL from Phase 2.*

4.  **Finalize:**
    - [ ] Click **Deploy**.
    - [ ] Wait for build success.
    - [ ] **Copy the Vercel URL**.

---

## Phase 4: Connect & Verify

1.  **Update CORS:**
    - [ ] Open `coffee-intent-service/server.js`.
    - [ ] Update `allowedHeaders` or `origin` to include your new Vercel URL (e.g., `https://coffee-dashboard.vercel.app`).
    - [ ] Push change: `git push`
    - [ ] *Render will automatically redeploy.*

2.  **Live Test:**
    - [ ] Visit your Vercel URL in Incognito mode.
    - [ ] Perform a "Search" or "Generate Insight".
    - [ ] Verify data returns (allow 30s for the first request if Render is waking up).

---

## 🛑 Troubleshooting Free Tier Issues

- **Backend Timeout/504:** This usually means Render is "waking up." Wait 30 seconds and refresh.
- **404 Not Found:** Check that your **Root Directory** settings in Vercel/Render are set to the correct subfolder (`coffee-dashboard` / `coffee-intent-service`).
- **CORS Error:** Double-check that the Vercel URL is added to `server.js` CORS settings and pushed to GitHub.
