# Location Switching Fix & Troubleshooting

## ✅ Improvements Applied

### 1. **Better Visual Feedback**
- ✅ Location selector now shows 📍 icon and is highlighted
- ✅ Added "Current Location" indicator card above KPI metrics
- ✅ Shows "Last Updated" timestamp for data refresh confirmation
- ✅ Hover effect on dropdown for better visibility

### 2. **Loading State**
- ✅ Shows loading animation when switching branches
- ✅ 300ms delay to ensure UI update is visible
- ✅ Data refreshes automatically when branch changes

### 3. **Console Logging**
- ✅ Logs "📍 Switching to branch: [branch-id]" when you change location
- ✅ Helps debug if data isn't updating

### 4. **Improved Styling**
- ✅ Location selector has border highlight: `border-2 border-[#404040]`
- ✅ Focus state: `focus:border-[#f97316]`
- ✅ Hover state: `hover:border-[#f97316]`
- ✅ Better padding and font weight

## 🔍 How to Verify Location Switching Works

### Step 1: Check Console Logs
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. **Switch location** using dropdown
4. Look for message: `📍 Switching to branch: [branch-id]`

**Expected Console Output**:
```
✅ Dashboard data fetched from backend: {data: {...}, model_version: "v2.0.0-qwen-ai", ...}
📍 Switching to branch: sukhumvit-24
✅ Dashboard data fetched from backend: {data: {...}, ...}
```

### Step 2: Check Location Indicator
1. **Refresh page** - location indicator shows current location
2. **Open location dropdown** - shows all available branches
3. **Select different location** - indicator updates immediately
4. **Last Updated** timestamp changes - confirms data refresh

**Visual Feedback**:
```
📍 Selected Location
Asoke Junction                    🔄 Last Updated
                                 14:23:45
```

### Step 3: Check KPI Values
After switching location:
1. **Loading animation** should appear briefly
2. **KPI cards** (Market Captured Traffic, etc.) should update
3. **"Last Updated" time** should change to current time
4. **Location indicator** should show selected branch

## 🐛 Troubleshooting

### Issue 1: KPI Values Don't Change After Switching

**Possible Causes**:
1. Backend is returning same data for all branches
2. Mock data is being used (not real backend)
3. API call failing silently

**Debug Steps**:
```javascript
// Open DevTools Console and check:

1. Check if API call is made:
   - Look for "✅ Dashboard data fetched" message
   - Check Network tab for /api/v1/dashboard request

2. Check if branch parameter is sent:
   - Network tab → Click /api/v1/dashboard
   - Go to "Params" tab
   - Look for: ?branch=sukhumvit-24

3. Check if backend responds with different data:
   - Network tab → Response tab
   - Check if "totalQueries" value is different
```

### Issue 2: Loading Doesn't Appear

**Possible Causes**:
1. Data loads too fast (under 300ms)
2. Component isn't re-rendering

**Debug Steps**:
```bash
# Check if selectedBranch state is updating:
# Open Console and add:
console.log("Selected branch:", selectedBranch);

# Then switch location - should log new branch ID
```

### Issue 3: Console Shows Error

**Check for**:
```
❌ Dashboard fetch failed: Error: ...
```

**Solutions**:
1. **Backend not running**: Start with `npm run dev` in coffee-intent-service
2. **Wrong port**: API expects http://localhost:3000
3. **CORS error**: Backend should allow frontend requests
4. **Invalid branch ID**: Branch ID format might not match

## 🔧 Backend Verification

### Check Backend Has Different Data for Each Branch

```bash
# Terminal 1: Start backend
cd coffee-intent-service
npm run dev

# Terminal 2: Test API with different branches
curl "http://localhost:3000/api/v1/dashboard?branch=asoke-01" \
  -H "x-tenant-id: retail-enterprise-01"

curl "http://localhost:3000/api/v1/dashboard?branch=sukhumvit-24" \
  -H "x-tenant-id: retail-enterprise-01"

# Compare the "totalQueries" value - should be different
```

### Expected Response Structure
```json
{
  "data": {
    "totalQueries": 2450,        // ← Should differ per branch
    "morningPercent": "72%",     // ← Should differ per branch
    "workPercent": "38%",        // ← Should differ per branch
    "geoScore": 7.1,             // ← Should differ per branch
    ...
  },
  "model_version": "v2.0.0-qwen-ai",
  "daily_report": { ... }
}
```

## 📋 Verification Checklist

### Location Switching
- [ ] Location dropdown shows all branches
- [ ] Switching location updates the indicator card
- [ ] "Last Updated" timestamp changes
- [ ] Loading animation appears briefly
- [ ] Console logs "📍 Switching to branch: ..."

### Data Updates
- [ ] Market Captured Traffic value changes
- [ ] Morning Intensity value changes
- [ ] Retention Potential value changes
- [ ] Strategic Peak value changes
- [ ] All KPI cards update together

### Visual Feedback
- [ ] Location indicator card is visible
- [ ] Current location name is correct
- [ ] Last updated time is current
- [ ] Dropdown has hover effect (turns orange)
- [ ] Border highlights on focus

### Console Debugging
- [ ] `✅ Dashboard data fetched` appears
- [ ] `📍 Switching to branch` appears
- [ ] No error messages (`❌`)
- [ ] Network tab shows /api/v1/dashboard calls

## 🚀 Testing Steps

### Complete Test Sequence
```
1. Refresh page
   ↓
2. Check location indicator shows "Asoke Junction"
   ↓
3. Click location dropdown
   ↓
4. Select "Sukhumvit 24"
   ↓
5. Wait for loading animation
   ↓
6. Check:
   ✅ Location indicator updated to "Sukhumvit 24"
   ✅ "Last Updated" timestamp changed
   ✅ KPI values changed
   ✅ Console shows no errors
   ↓
7. Select "Siam Square"
   ↓
8. Verify KPI values changed again
```

## 💡 Key Changes Made

### Navigation.jsx
```javascript
// Location selector improvements
onChange={(e) => {
  console.log(`📍 Switching to branch: ${e.target.value}`);
  onBranchChange(e.target.value);
}}

// Better styling
className="... border-2 border-[#404040] ... focus:border-[#f97316]"
```

### Dashboard.jsx
```javascript
// Loading state
setLoading(true);

// Data refresh
const dashboardRes = await fetchDashboard(lang, selectedBranch);

// 300ms delay for UI visibility
setTimeout(() => {
  setData(dashboardRes);
  setLastUpdate(new Date().toLocaleTimeString());
  setLoading(false);
}, 300);

// Location indicator card
<div className="mb-6 md:mb-8 p-4 bg-[#1c1917] border-2 border-[#f97316]/50">
  <p>{branches.find(b => b.id === selectedBranch)?.name}</p>
  <p>{lastUpdate}</p>
</div>
```

## 📊 Files Modified

```
src/components/Navigation.jsx      ← Better location selector
src/pages/Dashboard.jsx            ← Loading state, location indicator
```

## 🎯 Next Steps If Still Not Working

1. **Check backend is running**
   ```bash
   curl http://localhost:3000/api/v1/meta
   # Should return: {"model_version": "v2.0.0-qwen-ai", ...}
   ```

2. **Check branches are loaded**
   - Open DevTools → Console
   - Look for "Branches fetched from backend: X branches"

3. **Run tests**
   ```bash
   npm test
   ```

4. **Check browser console** (F12)
   - Any error messages?
   - Is API being called?

## ✨ Summary

- ✅ Location indicator now visible
- ✅ Loading state when switching
- ✅ Console logging for debugging
- ✅ Better visual feedback
- ✅ Last updated time display
- ✅ Improved location dropdown styling

**If data still isn't changing, check that backend is running and returning different data for different branches!**
