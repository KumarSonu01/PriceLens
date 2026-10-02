# PriceLens — Comprehensive UI Redesign Documentation

## 1. Design System & Aesthetics ("Ink, Bone & One Sharp Signal")
The redesign unites terminal precision with editorial publication aesthetics.
- **Palette Mapped to CSS Variables & Tailwind Tokens:**
  - `bg`: Dark `#0B0D0C` / Light `#F3F0E8`
  - `surface`: Dark `#121614` / Light `#FBF9F4`
  - `surface-2`: Dark `#1A1F1C` / Light `#EAE6DA`
  - `line`: Dark `rgba(237,233,223,0.10)` / Light `rgba(11,13,12,0.12)`
  - `text`: Dark `#EDE9DF` / Light `#111412`
  - `muted`: Dark `#8C938D` / Light `#5E655F`
  - `signal`: Dark `#C8F13B` (sharp lime) / Light `#1F5F3A` (deep forest signal)
  - `drop`: Dark `#4ADE80` (muted green) / Light `#1F7A45`
  - `rise`: Dark `#FF6B4A` (warm red-orange) / Light `#C2410C`
  - `warn`: Dark `#FFB020` / Light `#B45309`
- **Typography:**
  - Headings & Primary UI: **Bricolage Grotesque**
  - Prices & Numerical Telemetry: **Geist Mono** / JetBrains Mono (always `tabular-nums`)
  - Hero & Editorial Accent: **Instrument Serif** italic (1-2 highlighted words)
  - All fonts imported via Google Fonts with `display=swap` and system fallbacks.
- **Surface & Shape Language:**
  - 1px hairline borders (`border-line`) with ambient token backgrounds.
  - Subtle noise/grain texture overlay applied across the application background.
  - Radii: 6px (`rounded-md`), 10px (`rounded-lg`), 16px (`rounded-xl`).
  - No generic rounded cards or AI-slop purple/magenta gradients.

---

## 2. Component Architecture & Vengeance UI Adaptation
All primitive components were built in `src/components/ui/` using **Motion** and Tailwind CSS:
- `Button` (primary, secondary, outline, ghost, danger, signal variants, loading states, magnetic feel)
- `IconButton` (accessible icon button with tooltip support)
- `Card` (spotlight surface, hairline border, subtle lift)
- `Badge` (pill with status indicators, monochrome or signal accents)
- `Input` & `Textarea` (token-colored surfaces, signal focus ring)
- `Select` (custom styled native selector)
- `Switch` (spring-animated toggle)
- `FormField` (label, helper text, error text, required marker)
- `Modal` & `Drawer` (accessible dialogs with focus trap and spring entrance)
- `ConfirmDialog` (destructive action confirmation modal with loading state)
- `Tabs` (tab switcher with animated underline indicator)
- `Tooltip` (clean hover tooltip)
- `Skeleton` (subtle pulse loader using surface tokens)
- `Stat` (KPI card with count-up animation and trend indicator)
- `PriceTag` (strict tabular-nums Geist Mono with currency formatting)
- `DeltaChip` (price drop or increase indicator pill)
- `Sparkline` (SVG trendline generator for 7D/30D price movement)
- `RangeBar` (Low - Avg - High price range visualizer)
- `Rating` (star rating with count and half-star support)
- `PlatformBadge` (custom badges for Amazon, Flipkart, Zepto, and Local Sellers)
- `EmptyState` (expressive zero-state card with action button)
- `ErrorState` (graceful error fallback with retry trigger)
- `DataTable` (sortable columns, density switcher, responsive table)
- `FileDrop` (avatar / image upload drag-and-drop zone)
- `CommandPalette` (`cmdk` global spotlight search via `Ctrl+K` / `⌘+K`)
- `SplineHero` (3D aperture lens with interactive SVG/CSS fallback)

---

## 3. Scope of Work & Completed Phases

### Phase 1: Audit & Discovery
- Audited all 19 frontend pages and backend routes/controllers to map data contracts, payloads, and state requirements.
- Created `frontend/.env.example` documenting all configuration keys (`VITE_API_URL`, `VITE_SPLINE_SCENE_URL`).

### Phase 2: Design System & Foundations
- Configured `tailwind.config.js` with tokens, radii, fonts, and dark mode class.
- Configured `index.css` with CSS variables, custom scrollbars, and SVG grain texture.
- Implemented `ThemeContext` persisting `pl-theme` to `localStorage` (default: dark).
- Implemented `Layout`, `Navbar` (floating dock, recent searches dropdown, badges, command palette trigger), `Footer`, and `CompareBar`.
- Implemented `NotFoundPage` (404) with search bar and quick recovery links.
- Migrated toast system from `react-toastify` to token-styled `react-hot-toast`.

### Phase 3: Home & Catalog Discovery
- `Home.jsx`: Hero with Spline aperture, category chips, "Biggest drops" carousel, Bento category grid, 3-step value proposition, full product grid with sort/filter controls, and recently viewed section.
- `SearchPage.jsx`: Filter & sort refinement, suggestions chips, empty and error states.
- `ProductCard.jsx`: Spotlight surface, large mono `PriceTag`, sparkline, delta chip, optimistic wishlist toggle, compare checkbox.

### Phase 4: Product Detail & Comparison
- Cleaned up redundant `src/pages/PriceHistoryChart.jsx`.
- `ProductHero.jsx`: Sticky buy-box, zoom thumbnails, large mono price, Best Deal badge, RangeBar, client-side Price Verdict chip, Web Share API integration, alert modal trigger.
- `PriceHistoryChart.jsx`: Area fill gradient, 7D/30D/90D/All timeframe filters, custom tooltip, min/max statistics.
- `ComparisonTable.jsx`: Ranked merchant matrix with `PlatformBadge`, sortable price, best deal signal outline.
- `ListingCard.jsx` & `LocalSellerCard.jsx`: Direct seller offers with delivery estimates and stock status.
- `RelatedProducts.jsx`: Responsive grid of comparable models.
- `ReviewSection.jsx`: Rating breakdown, distribution bars, review list, submission form.
- `ProductPage.jsx`: Flagship product page uniting all components, price alert modal with percentage presets, mobile sticky buy bar, recently viewed tracking.
- `ComparePage.jsx`: Sticky product header, collapsible spec matrix, auto-highlight best value in each row, "Show differences only" switch, sticky first column.

### Phase 5: Authentication & User Spaces
- `LoginPage.jsx`: Split screen with Spline brand panel, show/hide password, role-based redirect.
- `RegisterPage.jsx`: 3 selectable role cards (Buyer, Local seller, Admin with secret key field), password strength meter, `FileDrop` avatar upload, animated local-seller fields.
- `ProfilePage.jsx`: Large avatar with change/remove, account/storefront tabs, live summary stats, store link save card.
- `WishlistPage.jsx`: Sorting, optimistic item removal with undo toast, empty state.
- `AlertsPage.jsx`: Split into Active and Triggered groups, target price progress bars, `ConfirmDialog` delete with undo toast.

### Phase 6: Seller Dashboard & Tools
- `SellerPage.jsx`: Dashboard with count-up KPI stats (`Stat`), quick action tiles, best practices card.
- `AddListingPage.jsx`: Stepped form (Hardware select, Pricing, Fulfillment & Offer, Stock switch) and live `ListingCard` simulation preview on the right.
- `ManageListingsPage.jsx`: Search & stock status filter, inline inventory modifier with save/cancel, `ConfirmDialog` delete.

### Phase 7: Admin Control Center
- `AdminPage.jsx`: Top KPI strip (`totalProducts`, `totalListings`, `totalSellers`, `totalUsers`, `importedProducts`, `totalAlerts`, `activeAlerts`, `triggeredAlerts`), Catalog / People / Alerts grouping with count-up, alert-health bar (active vs triggered), action grid tiles.
- `AddProductPage.jsx`: Two-column layout (form on left with Title, Brand, Category select, Description, RAM, Storage, Features chips input; live product preview card on right).
- `ImportProductPage.jsx`: URL paste hero input with auto-detection of Amazon/Flipkart/Zepto, import button with progress states, imported product result card.
- `ManageProductsPage.jsx`: `DataTable` with thumbnail, title, brand, category, edit/delete (`ConfirmDialog`), search + category filter, grid/table toggle.
- `EditProductPage.jsx`: Two-column edit form with live preview, pre-filled data, unsaved changes guard.
- `AdminListingsPage.jsx`: `DataTable` across all platform listings with platform badge, seller, price, stock, updated date, source filter (Amazon/Flipkart/Zepto/Local), search, density toggle (comfortable/compact), delete action.

---

## 4. Regression Checklist (Prompt Section 7 Verification)

| Item | Verification Target | Status | Notes |
| :--- | :--- | :---: | :--- |
| **1** | All routes resolve correctly | **PASS** | All 19 routes verified in `App.jsx`, plus `*` 404 catch-all. |
| **2** | URL query params work | **PASS** | `keyword`, `sort`, `category`, `page`, `ids` preserved in Home, Search, Compare. |
| **3** | API endpoints & payloads intact | **PASS** | Zero backend route/payload drift; all `GET`, `POST`, `PUT`, `DELETE` identical. |
| **4** | Redux auth slice & CompareContext | **PASS** | `setCredentials`, `logout`, `useCompare` all function as intended. |
| **5** | Role-based redirects preserved | **PASS** | `admin` → `/admin/dashboard`, `local_seller` → `/seller/dashboard`, `buyer` → `/`. |
| **6** | `localStorage` items intact | **PASS** | `userInfo`, `pl-theme`, `pl-compare`, `recentSearches`, `pl-recent-viewed` supported. |
| **7** | Out of stock listings handled | **PASS** | Buy button disabled with "Out of Stock" state and clear visual treatment. |
| **8** | Empty states render cleanly | **PASS** | `EmptyState` component active across Search, Wishlist, Alerts, Listings, Products. |
| **9** | Tabular numerals & Currency | **PASS** | All prices display `₹` with commas and `font-mono tabular-nums`. |
| **10** | Dark & Light modes work | **PASS** | `ThemeContext` toggles `dark` class on `<html>` with CSS variables. |
| **11** | Mobile responsive layouts | **PASS** | Mobile navbar dock, sticky buy bar, responsive sheets, drawer menus. |
| **12** | Build & Lint validation | **PASS** | `npm run build` succeeds (code 0), `npm run lint` succeeds (code 0, 0 errors). |

---

## 5. Non-breaking Backend Proposals
While the frontend operates seamlessly with the existing backend API, the following non-breaking enhancements are recommended for future milestones:

1. **`GET /api/products/biggest-drops`:**
   - Return top 10 products with the highest percentage price drop in the last 24h or 7d. Currently simulated client-side using available price listings.
2. **`GET /api/products/trending`:**
   - Telemetry endpoint returning top searched, viewed, or alerted items.
3. **Optimized Catalog Payload (`GET /api/products`):**
   - Include computed fields (`lowestPrice`, `highestPrice`, `merchantCount`, `minMarketListing`) directly in the product document to eliminate N+1 listing queries on catalog listings.
4. **WebSocket / SSE for Real-time Price Drop Alerts:**
   - Instant push notifications to active browser sessions when a watched product crosses the alert threshold.
5. **Batch Listing Price Updates for Local Sellers (`PATCH /api/listings/batch`):**
   - Allow merchants to update stock or adjust prices across multiple SKUs in a single round-trip.
