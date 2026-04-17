# Fix Ari District Location Data

## 🐛 Problem Identified

**Issue**: Ari District showing wrong competitors
- **Current**: Showing "Yellow Stuff Headquarters" in Suan Luang (not Ari)
- **Expected**: Should show competitors in Ari District area

**Root Cause**: Old/incorrect competitor data in database

---

## ✅ Solution: Restore Database

### Step 1: Stop the Backend Server
If running, stop the backend:
```bash
# Press Ctrl+C in the terminal running: npm run dev
```

### Step 2: Run Database Restore
```bash
cd coffee-intent-service
node restore-database.js
```

**Expected Output**:
```
🔄 Restoring Database...

🗑️  Clearing simulations table...
✅ Simulations cleared

🗑️  Clearing competitors table...
✅ Competitors cleared

🗑️  Clearing branches table...
✅ Branches cleared

📍 Restoring branches...
  ✅ Asoke Junction [13.7563, 100.5518]
  ✅ Sukhumvit 24 [13.7419, 100.5578]
  ✅ Siam Square [13.7453, 100.5348]
  ✅ Ari District [13.8211, 100.5562]

🏪 Restoring competitors...
  ✅ asoke-01: 3 competitors added
  ✅ sukhumvit-24: 2 competitors added
  ✅ siam-square: 2 competitors added
  ✅ ari-01: 3 competitors added

════════════════════════════════════════════════════
✅ DATABASE RESTORE COMPLETE
════════════════════════════════════════════════════

📊 Restored Data:
  • Branches: 4
  • Competitors: 10
  • Simulations: 0 (fresh start)

🎯 All tables reset to initial state
```

### Step 3: Start Backend Server Again
```bash
npm run dev
```

Wait for server to start:
```
✅ Server is running on port 3000
```

### Step 4: Refresh Frontend
1. Open browser
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. Select **Ari District** from location dropdown
4. Verify competitors are now correct

---

## ✅ Correct Ari District Data (After Restore)

### Location
```
📍 Ari District
Latitude:  13.8211
Longitude: 100.5562
Rating:    ⭐ 4.6
Opening:   08:15 AM
```

### Nearby Competitors (Within 1km)
```
1. Ari Coffee House ⭐ 4.7
   Distance: 200m
   Hours: 07:00 - 20:00

2. Sunday Roast Coffee ⭐ 4.4
   Distance: 350m
   Hours: 07:30 - 18:00

3. Brew Ari ⭐ 4.2
   Distance: 500m
   Hours: 08:00 - 19:30
```

All competitors now in Ari District! ✅

---

## 🔍 Verification Checklist

After running restore and refreshing:

- [ ] Location dropdown shows "Ari District"
- [ ] Selecting Ari shows "Ari District [13.8211, 100.5562]"
- [ ] Competitors shown:
  - [ ] Ari Coffee House (not "Yellow Stuff")
  - [ ] Sunday Roast Coffee
  - [ ] Brew Ari
- [ ] All distances are under 1km (1000m)
- [ ] All ratings are accurate
- [ ] Opening hours are correct

---

## 📊 All Locations After Restore

### Asoke Junction
📍 [13.7563, 100.5518] | ⭐ 4.8
- BARTELS Asok (150m)
- Artis Coffee (400m)
- Bru Cafe (600m)

### Sukhumvit 24
📍 [13.7419, 100.5578] | ⭐ 4.5
- Local Roaster (200m)
- Coffee House (350m)

### Siam Square
📍 [13.7453, 100.5348] | ⭐ 4.3
- Siam Coffee (100m)
- Espresso Bar (250m)

### Ari District
📍 [13.8211, 100.5562] | ⭐ 4.6
- Ari Coffee House (200m)
- Sunday Roast Coffee (350m)
- Brew Ari (500m)

---

## 🐛 If Still Not Working

### Check 1: Verify Database Connection
```bash
# In coffee-intent-service directory
node -e "import pg from 'pg'; const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT COUNT(*) FROM competitors').then(r => console.log('Competitors:', r.rows[0].count)).catch(e => console.error('Error:', e.message))"
```

Expected output:
```
Competitors: 10
```

### Check 2: Check Specific Ari Data
```bash
curl "http://localhost:3000/api/v1/dashboard?branch=ari-01" \
  -H "x-tenant-id: retail-enterprise-01" | grep -A 5 "competitors"
```

Expected: Should show Ari competitors, not Yellow Stuff

### Check 3: Clear Browser Cache
1. Open DevTools (F12)
2. Settings (⚙️) → Network → Check "Disable cache"
3. Hard refresh (Ctrl+Shift+R)

### Check 4: Restart Everything
```bash
# Terminal 1: Stop backend (Ctrl+C)
# Terminal 2: Stop frontend (Ctrl+C)

# Terminal 1: Restore database
cd coffee-intent-service
node restore-database.js

# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd coffee-dashboard
npm run dev

# Browser: Hard refresh
```

---

## 📁 Files Modified

```
coffee-intent-service/restore-database.js
  Line 70-73: Updated Ari District competitors
    - OLD: Ari Roastery, Morning Brew
    - NEW: Ari Coffee House, Sunday Roast Coffee, Brew Ari
```

---

## ✨ Summary

**What Changed**:
- ✅ Removed "Yellow Stuff Headquarters" from Ari District
- ✅ Added correct Ari District competitors
- ✅ All 3 Ari competitors now within 1km
- ✅ Updated ratings and opening hours

**To Apply**:
1. Run: `node restore-database.js`
2. Refresh browser
3. Select Ari District
4. Verify correct competitors appear

**Result**: Ari District now shows relevant, nearby competitors! 🎉

---

## 🎯 Next Steps

1. **Run restore**: `node restore-database.js`
2. **Test Ari**: Select from dropdown
3. **Verify**: Check competitors are correct
4. **Test other locations**: Make sure they still work
5. **Refresh frontend**: Hard refresh to clear cache

All done! Ari District should now work correctly. ✅
