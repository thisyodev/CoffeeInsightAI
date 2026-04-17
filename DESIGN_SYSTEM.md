# CoffeeInsight AI Design System

**Version:** 2.0.0 | **Last Updated:** April 2026 | **Theme:** Cafe-Inspired

---

## 🎨 Color Palette

### Espresso (Primary - Deep Brown)
Deep, rich coffee tones for primary UI elements and backgrounds.

```
espresso-50:  #f5f3f1 (Lightest)
espresso-100: #e8e3df
espresso-200: #d9cec6
espresso-300: #c4b0a3
espresso-400: #a8926b
espresso-500: #6f4e37 (Deep Espresso) ⭐
espresso-600: #5c3f2f
espresso-700: #4a3229 (Sidebar/Header)
espresso-800: #3d2817
espresso-900: #2a1810 (Darkest)
```

**Usage:**
- Navigation bars and headers
- Sidebar backgrounds
- Text and headings on light backgrounds
- Prominent buttons and CTAs

### Latte (Secondary - Warm Tan)
Creamy, warm tones reminiscent of coffee with milk.

```
latte-50:  #fffbf8 (Lightest)
latte-100: #fef5f0
latte-200: #fce8df
latte-300: #f9d9cc
latte-400: #f4c4aa
latte-500: #f0ad86 (Warm Latte) ⭐
latte-600: #e89970 (Error/Alert states)
latte-700: #dd7d55
latte-800: #d16a48
latte-900: #b84a2f (Darkest)
```

**Usage:**
- Error/alert notifications
- Hover effects on dark backgrounds
- Accent borders and highlights
- Secondary text on espresso backgrounds

### Cream (Tertiary - Soft Background)
Light, airy tones for backgrounds and light surfaces.

```
cream-50:  #fefdfb (Lightest - Main background)
cream-100: #fdf9f2 (Card backgrounds)
cream-200: #faf1e3
cream-300: #f6e9d0
cream-400: #f1ddb3
cream-500: #ead4a3 (Soft Cream) ⭐
cream-600: #dfc089
cream-700: #d4a865
cream-800: #c68f48
cream-900: #a87033 (Darkest)
```

**Usage:**
- Page background (cream-50)
- Card/panel backgrounds (cream-100)
- Light overlays and backgrounds
- Text labels and secondary text

### Caramel (Accent - Warm Gold)
Warm, golden tones for CTAs, highlights, and interactive elements.

```
caramel-50:  #fffbf5 (Lightest)
caramel-100: #fff5e6
caramel-200: #fce3c0
caramel-300: #f8cfa0 (Borders/accents)
caramel-400: #f4b580
caramel-500: #e8905a (Warm Caramel) ⭐ (Primary CTA)
caramel-600: #dc743a
caramel-700: #d65c2a
caramel-800: #c04a20
caramel-900: #a53820 (Darkest)
```

**Usage:**
- Primary buttons and CTAs
- Active menu items
- Borders on cards and interactive elements
- Hover/focus states for buttons
- Location indicator cards

---

## 📐 Component Colors

### Navigation
- **Background:** `from-espresso-600 to-espresso-700` (Gradient)
- **Border:** `border-caramel-400`
- **Text:** `text-cream-100` or `text-cream-50`
- **Menu Button:** `bg-caramel-500 hover:bg-caramel-600`
- **Location Selector:** `bg-cream-100 border-caramel-300`

### Cards & Panels
- **Background:** `from-cream-100 to-latte-50` (Gradient)
- **Border:** `border-2 border-caramel-200`
- **Text:** `text-espresso-900`
- **Hover:** `hover:border-caramel-400 hover:shadow-lg`

### Buttons
- **Primary (CTA):** `from-caramel-500 to-caramel-600 text-cream-50`
- **Secondary:** `bg-cream-100 text-espresso-900 border-espresso-900`
- **Tertiary:** `text-espresso-600 hover:text-caramel-500`
- **Hover:** Scale up slightly, brighten shadow
- **Active:** Scale down slightly

### Status/Alerts
- **Success:** `bg-espresso-700` with `border-caramel-400`
- **Warning:** `from-caramel-500 to-caramel-600`
- **Error:** `from-latte-600 to-latte-700`

### Location Indicator Card
- **Background:** `from-espresso-500 to-espresso-600` (Gradient)
- **Border:** `border-2 border-caramel-300`
- **Primary Text:** `text-cream-50`
- **Secondary Text:** `text-caramel-200`

### Input Fields
- **Background:** `bg-cream-100` or `bg-cream-200/40`
- **Border:** `border-2 border-caramel-300`
- **Text:** `text-espresso-900`
- **Focus:** `focus:border-caramel-500 focus:bg-cream-100`
- **Placeholder:** `text-espresso-600`

### Login/Security Gate
- **Background:** `from-cream-50 to-latte-100` (Gradient)
- **Card:** `from-cream-100 to-latte-50`
- **Border:** `border-2 border-caramel-400`
- **Button:** `from-caramel-500 to-caramel-600`

---

## 🎯 Typography

- **Headlines:** Espresso-900 or Espresso-800 (`text-espresso-900`)
- **Subheadings:** Espresso-700 (`text-espresso-700`)
- **Body Text:** Espresso-600 (`text-espresso-600`)
- **Secondary Text:** Espresso-500 or Cream-600 (`text-espresso-500`)
- **Labels:** Uppercase, smaller size, cream or espresso colors

**Font Weights:**
- Headlines: `font-bold` or `font-black`
- Buttons: `font-semibold` or `font-bold`
- Body: `font-medium` or `font-normal`
- Labels: `font-semibold` (uppercase)

---

## 🌈 Gradients

### Background Gradients
```css
/* Coffee Gradient - Dark to Rich */
background: linear-gradient(135deg, #2a1810 0%, #4a3229 100%);

/* Latte Gradient - Light */
background: linear-gradient(135deg, #fef5f0 0%, #faf1e3 100%);

/* Cafe Gradient - Full Spectrum */
background: linear-gradient(135deg, #2a1810 0%, #6f4e37 50%, #f0ad86 100%);
```

### Component Gradients
- **Navigation:** `from-espresso-600 to-espresso-700`
- **Sidebar (Active):** `from-espresso-700 to-espresso-800`
- **Cards:** `from-cream-100 to-latte-50`
- **Buttons (Primary):** `from-caramel-500 to-caramel-600`
- **Location Indicator:** `from-espresso-500 to-espresso-600`

---

## 📏 Spacing & Sizing

### Padding
- **Compact:** `p-3` or `p-4`
- **Standard:** `p-6` or `p-8`
- **Large:** `p-10` or `p-12`

### Margins
- **Component Gap:** `gap-4 md:gap-6 lg:gap-8`
- **Vertical Spacing:** `mb-6 md:mb-8`
- **Grid Gap:** `gap-4 md:gap-6 lg:gap-8`

### Border Radius
- **Small:** `rounded-lg` (8px)
- **Medium:** `rounded-2xl` (16px)
- **Large:** `rounded-[3rem]` (48px)

---

## 🎭 Interactive States

### Hover States
- **Buttons:** Brighten color, scale up (`hover:scale-[1.02]`)
- **Cards:** Increase shadow (`hover:shadow-lg`)
- **Text Links:** Change to caramel color (`hover:text-caramel-300`)
- **Borders:** Brighten to caramel (`hover:border-caramel-400`)

### Focus States
- **Input Fields:** `focus:border-caramel-500`
- **Buttons:** Visual highlight with shadow
- **Links:** Underline or color change

### Active States
- **Menu Items:** Full color background with border
- **Buttons:** Scale down (`active:scale-95`)
- **Tabs:** Underline or background highlight

---

## 🔄 Transition Effects

```css
/* Standard Transition */
transition-all duration-300

/* Smooth Color Change */
transition-colors duration-300

/* Smooth Shadow */
transition-shadow duration-300

/* Page Load Animation */
animation-fade-in duration-500
```

---

## ✨ Special Effects

### Shadows
- **Default:** `shadow-md`
- **Cards:** `shadow-lg`
- **Interactive:** `shadow-xl`
- **Hover:** `hover:shadow-lg` or `hover:shadow-xl`

### Opacity
- **Subtle:** `opacity-50` (50% opacity)
- **Medium:** `opacity-75` (75% opacity)
- **Full:** `opacity-100` (100% opacity)

### Blur
- **Light Blur:** `blur-sm`
- **Medium Blur:** `blur-md`
- **Heavy Blur:** `blur-lg`

---

## 📱 Responsive Design

### Breakpoints
```
sm: 640px   - Tablets & large phones
md: 768px   - Small laptops
lg: 1024px  - Standard laptops
xl: 1280px  - Wide screens
2xl: 1536px - Extra wide
```

### Mobile-First Approach
- Start with mobile styles
- Use `md:`, `lg:` prefixes for larger screens
- Example: `px-4 sm:px-6 md:px-8` (Progressive padding)

---

## 🎯 Best Practices

1. **Maintain Consistency:** Use the defined colors, not random hex values
2. **Hierarchy:** Use espresso for primary content, cream for backgrounds
3. **Contrast:** Ensure text is readable on backgrounds
4. **Accessibility:** Test color combinations for colorblind users
5. **Spacing:** Use consistent gaps and padding throughout
6. **Interactions:** Provide visual feedback on hover/click/focus

---

## 🚀 Implementation Examples

### Card Component
```jsx
<Card className="bg-gradient-to-br from-cream-100 to-latte-50 border-2 border-caramel-200 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-caramel-400">
  <h3 className="text-espresso-900 font-bold mb-3">Title</h3>
  <p className="text-espresso-600">Content here</p>
</Card>
```

### Button Component
```jsx
<button className="bg-gradient-to-r from-caramel-500 to-caramel-600 text-cream-50 px-6 py-3 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all">
  Click Me
</button>
```

### Navigation Bar
```jsx
<div className="bg-gradient-to-r from-espresso-600 to-espresso-700 border-b-4 border-caramel-400 shadow-lg">
  {/* Content */}
</div>
```

---

## 📝 Notes

- This design system emphasizes warmth and approachability
- The cafe-inspired palette creates a friendly, professional atmosphere
- Colors are designed to work well on light backgrounds
- Ensure sufficient contrast for accessibility (WCAG AA standards)
- Test design on real devices and different lighting conditions
