# 🚀 Launch to Production on FREE Plan - Checklist

**Stack Overview:**
- **Frontend:** Vite + React (`coffee-dashboard`) -> Host on **Vercel**
- **Backend:** Node.js + Express (`coffee-intent-service`) -> Host on **Render**
- **Database:** PostgreSQL -> Host on **Neon** or **Supabase**
- **AI:** OpenRouter Qwen -> Already configured

---

## Phase 1: Preparation & Database

- [ ] **1. Git Repository Ready**
  - [ ] Code is committed locally.
  - [ ] Push to GitHub/GitLab: `git push origin main`
  - [ ] Verify `.env` files are in `.gitignore` (NEVER commit secrets).

- [ ] **2. Database (PostgreSQL) Setup**
  - *If you don't have a DB, create a free one.*
  - [ ] **Option A: Neon.tech (Recommended)**
    - [ ] Create account at https://neon.tech.
    - [ ] Create new project.
    - [ ] Copy Connection String (looks like `postgres://user:pass@ep-...aws.neon.tech/db`).
  - [ ] **Option B: Supabase**
    - [ ] Create account at https://supabase.com.
    - [ ] Create new project.
    - [ ] Go to Project Settings -> Database -> Connection String -> URI.
  - [ ] **Test Connection** (Optional but recommended):
    - [ ] Run `npm i dotenv pg` in backend.
    - [ ] Create a test script to connect and log "Connected".

---

## Phase 2: Backend Deployment (Render)

**Platform:** Render (https://render.com)
**Plan:** Free Instance (Sleeps after 15 mins inactivity)

- [ ] **3. Create Render Account & Service**
  - [ ] Sign in to Render with GitHub account.
  - [ ] Click **New +** -> **Web Service**.
  - [ ] Connect your Repository.
  - [ ] **Configure Service:**
    - [ ] **Name:** `coffee-intent-service`
    - [ ] **Root Directory:** `coffee-intent-service`
    - [ ] **Environment:** `Node`
    - [ ] **Region:** `Oregon` (or closest to your DB)
    - [ ] **Branch:** `main`
    - [ ] **Build Command:** `npm install`
    - [ ] **Start Command:** `node server.js`
  - [ ] **Select Free Plan** (Instance Type: Free).

- [ ] **4. Backend Environment Variables**
  - [ ] Go to the **Environment** tab in your Render service.
  - [ ] Add the following keys:
    ```text
    Key: DATABASE_URL
    Value: [Paste Connection String from Phase 1]
    
    Key: OPENROUTER_API_KEY
    Value: [Your OpenRouter Key]
    
    Key: ENABLE_REAL_AI
    Value: true
    
    Key: NODE_ENV
    Value: production
    
    Key: PORT
    Value: 3000 (or leave as default)
    ```

- [ ] **5. Trigger First Deploy**
  - [ ] Click **Create Web Service**.
  - [ ] Wait for "Live" status.
  - [ ] **Copy the URL**: e.g., `https://coffee-intent-service-xxxx.onrender.com`.
  - [ ] **Save this URL** (You need it for Phase 3).

---

## Phase 3: Frontend Deployment (Vercel)

**Platform:** Vercel (https://vercel.com)
**Plan:** Hobby (Free)

- [ ] **6. Update Frontend Config**
  - [ ] Open `coffee-dashboard/src/config/` (or wherever your API client is).
  - [ ] Ensure API Base URL uses Environment Variable.
    ```javascript
    // Example:
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    export default API_URL;
    ```

- [ ] **7. Create Vercel Account & Import**
  - [ ] Sign in to Vercel with GitHub account.
  - [ ] Click **"Add New..."** -> **Project**.
  - [ ] Import your Repository.
  - [ ] **Configure Project:**
    - [ ] **Name:** `coffee-dashboard`
    - [ ] **Root Directory:** Click "Edit" -> Select `coffee-dashboard` folder.
    - [ ] **Framework Preset:** Vite.
    - [ ] **Build Command:** `npm run build` (Default for Vite).
    - [ ] **Output Directory:** `dist` (Default for Vite).

- [ ] **8. Frontend Environment Variables**
  - [ ] Expand **Environment Variables**.
  - [ ] Add:
    ```text
    Key: VITE_API_URL
    Value: [Paste Backend URL from Step 5]
    ```
    *Example: `https://coffee-intent-service-xxxx.onrender.com`*

- [ ] **9. Deploy Frontend**
  - [ ] Click **Deploy**.
  - [ ] Wait for build success.
  - [ ] **Visit Production URL:** e.g., `https://coffee-dashboard.vercel.app`.

---

## Phase 4: Critical Configuration

- [ ] **10. Configure CORS**
  - [ ] Open `coffee-intent-service/server.js`.
  - [ ] Ensure CORS allows your new Frontend URL.
  ```javascript
  import cors from 'cors';
  
  app.use(cors({
    origin: [
      'http://localhost:5173',  // Local Dev
      'https://coffee-dashboard.vercel.app', // Production Frontend (UPDATE THIS)
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
  ```
  - [ ] **Commit & Push**: `git add . && git commit -m "Update CORS for production" && git push`
  - [ ] Render will auto-deploy the change.

---

## Phase 5: Testing & Verification

- [ ] **11. Functional Tests**
  - [ ] Open your live Vercel URL in browser.
  - [ ] **Test Search**: Does the map load?
  - [ ] **Test Insights**: Click "Generate Insight" (or however you trigger the AI).
    - *Expected*: Spins, then returns data. (First request may take 30s due to cold start).
  - [ ] **Check Console**: Open DevTools (F12) -> Console. No Red Errors.
  - [ ] **Check Network**: DevTools -> Network tab. Look for `500` or `CORS` errors.

- [ ] **12. Environment Check**
  - [ ] Verify `ENABLE_REAL_AI` is actually `true` in Render (not `false`).

---

## Phase 6: Maintenance (Important for Free Tiers!)

- [ ] **13. Keep Backend Alive (Optional)**
  - *Render free tier sleeps after 15 mins.*
  - [ ] **Option A:** Accept slow start times (30-50s) on first visit.
  - [ ] **Option B (Free):** Set up a Cron Job to ping your backend every 10 mins.
    - [ ] Go to https://cron-job.org (Free).
    - [ ] Create new job.
    - [ ] URL: `https://coffee-intent-service-xxxx.onrender.com/api/ping` (Create a dummy ping route in server.js).
    - [ ] Schedule: Every 5 minutes.

---

## 🏆 Done!

**Your URLs:**
- Frontend: `https://[your-project].vercel.app`
- Backend: `https://[your-service].onrender.com`

**Zero Monthly Cost.** ✅

### Troubleshooting Quick Links
- **500 Error on Backend:** Check Render Logs -> "Logs" tab.
- **CORS Error:** Check `server.js` origin list.
- **Database Connection Error:** Verify `DATABASE_URL` in Render and DB IP Allowlist (if using Supabase).
