# 🗺️ CoffeeInsightAI - Improved Sitemap

## Current Issues
❌ No clear navigation structure
❌ All features crammed on one page
❌ Location/branch selection not prominent
❌ Difficult to find specific analytics
❌ No page hierarchy

---

## Proposed New Structure

```
CoffeeInsightAI (v2.0.0-qwen-ai)
│
├─ 🏠 Dashboard (Home)
│  ├─ Location Selector (Top Priority)
│  ├─ Quick KPIs
│  └─ AI Insights Summary
│
├─ 📊 Analytics Hub
│  ├─ Geo-Spatial Analysis
│  │  ├─ Geo Score Breakdown
│  │  ├─ Competitor Map
│  │  └─ Market Position
│  │
│  ├─ Demand Analysis
│  │  ├─ Intent Distribution
│  │  ├─ Hourly Trends
│  │  └─ Work Pattern Analysis
│  │
│  └─ Revenue Insights
│     ├─ Revenue Impact
│     ├─ Leakage Analysis
│     └─ Growth Potential
│
├─ 🎯 Simulation Engine
│  ├─ Scenario Builder
│  ├─ Multi-Scenario Comparison
│  ├─ Revenue Projections
│  └─ History & Trends
│
├─ 📍 Location Management
│  ├─ My Branches (List View)
│  ├─ Add New Location
│  ├─ Competitor Database
│  └─ Market Explorer
│
├─ ⚙️ Settings
│  ├─ Language (EN / TH)
│  ├─ Unit Preferences
│  ├─ Notification Settings
│  └─ Account Settings
│
└─ 📖 Help & Docs
   ├─ How It Works
   ├─ API Documentation
   ├─ Troubleshooting
   └─ Contact Support
```

---

## Improved Navigation Components

### 1. **Top Navigation Bar** (Priority)
```
┌─────────────────────────────────────────────────┐
│ ☕ CoffeeInsight │ Location: [SELECT ▼] │ EN/TH │ ⚙️ │
│                                    └─ PRIORITY! │
└─────────────────────────────────────────────────┘
```

### 2. **Left Sidebar (Collapsible)**
```
📊 ANALYTICS
 ├─ Geo-Spatial
 ├─ Demand
 └─ Revenue

🎯 SIMULATION
 ├─ Scenarios
 └─ History

📍 LOCATIONS
 ├─ My Branches
 ├─ Add New
 └─ Market

⚙️ SETTINGS
```

### 3. **Breadcrumb Navigation**
```
Home > Analytics > Geo-Spatial Analysis
```

### 4. **Location Selector (IMPROVED)**
```
Current Location: [Asoke Junction ▼]
                   ├─ Asoke Junction (4.8 ⭐)
                   ├─ Sukhumvit 24 (4.5 ⭐)
                   ├─ Siam Square (4.3 ⭐)
                   ├─ Ari District (4.6 ⭐)
                   └─ + Add New Location
```

---

## Page Layouts

### Page 1: Dashboard (Home)
```
┌─────────────────────────────────────────┐
│ 🏠 DASHBOARD                      [⚡Live] │
├─────────────────────────────────────────┤
│ Location: [Asoke Junction ▼]              │
│                                           │
│ ┌───────────────┬───────────────────┐    │
│ │ Geo Score: 7.1│ Revenue: +18%     │    │
│ │ Competitors: 5│ Peak: 08:45       │    │
│ └───────────────┴───────────────────┘    │
│                                           │
│ 💡 AI INSIGHT                             │
│ "Late opening costs ~18% revenue..."     │
│                                           │
│ [View Analytics] [Run Simulation]        │
└─────────────────────────────────────────┘
```

### Page 2: Analytics Hub > Geo-Spatial
```
┌─────────────────────────────────────────┐
│ 📊 GEO-SPATIAL ANALYSIS                  │
│ Home > Analytics > Geo-Spatial           │
├─────────────────────────────────────────┤
│ Location: [Asoke Junction ▼]              │
│                                           │
│ ┌──────────────────────────────────────┐ │
│ │ GEO SCORE: 7.1/10                   │ │
│ │ ├─ Proximity: 9.5/10                │ │
│ │ ├─ Competitiveness: 3.1/10          │ │
│ │ ├─ Alignment: 8.8/10                │ │
│ │ └─ Quality: 9.2/10                  │ │
│ └──────────────────────────────────────┘ │
│                                           │
│ ┌──────────────────────────────────────┐ │
│ │ COMPETITOR MAP (5 nearby)           │ │
│ │ 📍 BARTELS Asok (4.5⭐) 150m away  │ │
│ │ 📍 Artis Coffee (4.2⭐) 400m away  │ │
│ └──────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Page 3: Location Management
```
┌─────────────────────────────────────────┐
│ 📍 MY LOCATIONS                          │
│ Home > Locations                         │
├─────────────────────────────────────────┤
│ [+ Add New Location]                     │
│                                           │
│ 📍 Asoke Junction          [Edit] [📊]  │
│    Geo: 7.1 • Revenue: +18% • 4.8⭐    │
│                                           │
│ 📍 Sukhumvit 24            [Edit] [📊]  │
│    Geo: 6.5 • Revenue: +12% • 4.5⭐    │
│                                           │
│ 📍 Siam Square             [Edit] [📊]  │
│    Geo: 6.2 • Revenue: +8% • 4.3⭐     │
└─────────────────────────────────────────┘
```

---

## Navigation Flow

### User Journey 1: Check Performance
```
Home Dashboard 
  → Select Location [Asoke]
  → View AI Insights
  → Click "Analytics"
  → See Geo-Spatial Analysis
  → Compare with Competitors
```

### User Journey 2: Run Simulation
```
Home Dashboard
  → Select Location
  → Click "Run Simulation"
  → Choose Scenarios (07:00, 08:00)
  → View Results
  → Save to History
```

### User Journey 3: Add New Location
```
Locations Page
  → Click "+ Add New"
  → Enter Coordinates (Map or Lat/Lng)
  → System Analyzes
  → Shows Competitor Data
  → Saves to Database
```

---

## Mobile Responsive Layout

```
Tablet (768px):
┌──────────────────────┐
│ ☕ CoffeeInsight [≡] │  ← Hamburger menu
├──────────────────────┤
│ Location: [Asoke ▼]  │
│                      │
│ [Dashboard]          │
│ [Analytics]          │
│ [Simulation]         │
│ [Locations]          │
└──────────────────────┘

Mobile (320px):
┌──────────────┐
│ ☕ Insight [≡]│  ← Slide drawer menu
├──────────────┤
│Location[▼]   │
│              │
│ Main Content │
│              │
└──────────────┘
```

---

## Key Improvements

| Issue | Solution |
|-------|----------|
| No location selector | **Top-priority selector in header** |
| All features mixed | **Organized into 5 main sections** |
| Hard to find analytics | **Dedicated Analytics Hub** |
| No clear flow | **Breadcrumb navigation** |
| Clunky simulator | **Dedicated Simulation page** |
| No location management | **Dedicated Location page** |

---

## Implementation Priority

**Phase 1 (Essential):**
- ✅ Location selector (top nav)
- ✅ Breadcrumb navigation
- ✅ Sidebar menu

**Phase 2 (Recommended):**
- 📋 Separate Analytics pages
- 📋 Location Management page
- 📋 Improved Simulation page

**Phase 3 (Nice to have):**
- 🎨 Mobile optimizations
- 🎨 Settings page
- 🎨 Help & Docs section

---

**Version:** v2.0.0-qwen-ai  
**Last Updated:** 2026-04-10  
**Status:** Ready for Implementation
