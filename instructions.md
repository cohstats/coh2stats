# Nivo Charts Upgrade Instructions

## Executive Summary

**Current Version**: 0.72.0 (May 2022)  
**Target Version**: 0.99.0 (May 2025)  
**Version Jump**: ~27 versions (3 years of updates)

This is a significant upgrade that includes React 19 support and numerous improvements. The upgrade must be combined with migrating chart components from the old React Router structure (`_pages_old`) to the new Next.js App Router structure.

## Analysis Findings

### Current Nivo Usage

The project uses the following Nivo packages (all at v0.72.0):
- `@nivo/bar` - Bar charts (ResponsiveBar)
- `@nivo/pie` - Pie charts (ResponsivePie)
- `@nivo/geo` - Geo/Choropleth maps (ResponsiveChoropleth)
- `@nivo/heatmap` - Heatmaps (HeatMap - non-responsive version)
- `@nivo/core` - Core utilities

### Chart Components Location

All chart components are currently in `packages/web/src/components/charts/`:
```
charts/
├── bulletins-bar.tsx (ResponsiveBar)
├── commanders-bar.tsx (ResponsiveBar)
├── factions-heatmap.tsx (HeatMap)
├── maps-bar.tsx (ResponsiveBar)
├── winRate-bar.tsx (ResponsiveBar)
├── wins-bar.tsx (ResponsiveBar)
├── geo-map/
│   └── geo-world-map.tsx (ResponsiveChoropleth)
└── map-stats/
    ├── maps-playtime-bar.tsx (ResponsiveBar)
    ├── maps-playtime-histogram-stacked.tsx (ResponsiveBar)
    ├── maps-winrate-bar.tsx (ResponsiveBar)
    ├── maps-winrate-faction-bar.tsx (ResponsiveBar)
    ├── maps-winrate-sqrt-root-bar.tsx (ResponsiveBar)
    └── play-time-histogram.tsx (ResponsiveBar)

charts-match/
└── simple-pie.tsx (ResponsivePie)

_pages_old/stats/general-charts/
├── average-gametime-bar.tsx (ResponsiveBar)
├── factions-bar-stacked.tsx (ResponsiveBar)
├── factions-pie.tsx (ResponsivePie)
├── total-games-pie.tsx (ResponsivePie)
├── total-time-pie.tsx (ResponsivePie)
├── types-games-pie.tsx (ResponsivePie)
├── winRate-bar.tsx (ResponsiveBar)
└── winRate-bar-stacked.tsx (ResponsiveBar)
```

### Next.js Compatibility Status

**Good news**: 
- All pages in `src/app/` already have `"use client"` directive
- The Next.js config already transpiles Ant Design packages
- Chart components are already separated from pages (mostly in `components/charts`)

**Issues**:
- Chart components have `// @ts-nocheck` which should be addressed
- Charts in `_pages_old/stats/general-charts/` need to be migrated
- The non-responsive `HeatMap` should potentially be changed to `ResponsiveHeatMap`

## Critical Breaking Changes (v0.72.0 → v0.99.0)

### 1. React 19 Support (v0.98.0)
- Nivo v0.98.0+ upgraded react-spring for React 19 support
- Current project uses React 18.3.0, so this is compatible

### 2. Responsive Charts AutoSizer (v0.97.0)
- Nivo now uses `react-virtualized-auto-sizer` for responsive charts
- This may affect how responsive charts handle resizing

### 3. New Theming Package (v0.92.0)
- Introduced `@nivo/theming` package
- May affect theme customization if used

### 4. Axes Style Overrides (v0.93.0)
- Axes now allow style overrides
- Existing axes configurations should still work

### 5. HeatMap Changes
- The project uses non-responsive `HeatMap` from `@nivo/heatmap`
- Consider migrating to `ResponsiveHeatMap` for consistency

## Upgrade Steps

### Step 1: Backup Current State
```bash
git checkout -b nivo-upgrade-v0.99
git add -A
git commit -m "Checkpoint before Nivo upgrade"
```

### Step 2: Update Dependencies

Update `packages/web/package.json`:
```bash
cd packages/web
yarn add @nivo/bar@0.99.0 @nivo/core@0.99.0 @nivo/geo@0.99.0 @nivo/heatmap@0.99.0 @nivo/pie@0.99.0
```

**Note**: Use yarn (per project guidelines), not npm.

### Step 3: Update Next.js Configuration

Add Nivo packages to transpilePackages in `packages/web/next.config.mjs`:
```javascript
transpilePackages: ["antd", "@ant-design", "@nivo/bar", "@nivo/pie", "@nivo/geo", "@nivo/heatmap", "@nivo/core"],
```

### Step 4: Migrate Chart Components

#### 4.1 Add "use client" Directive
Add `"use client";` to the top of ALL chart component files (after `// @ts-nocheck` if kept):

**Files to update**:
- All files in `packages/web/src/components/charts/`
- All files in `packages/web/src/components/charts-match/`

Example:
```typescript
// @ts-nocheck
"use client";

import { ResponsiveBar } from "@nivo/bar";
import React from "react";
// ... rest of the file
```

#### 4.2 Migrate Charts from _pages_old
Move chart components from `_pages_old/stats/general-charts/` to `components/charts/general/`:

```bash
mkdir -p packages/web/src/components/charts/general
mv packages/web/src/_pages_old/stats/general-charts/*.tsx packages/web/src/components/charts/general/
```

Then add `"use client";` to each moved file.

#### 4.3 Update Imports
Update all import statements in `_pages_old` files to reference the new location:

Before:
```typescript
import { FactionsPlayedPieChart } from "./general-charts/factions-pie";
```

After:
```typescript
import { FactionsPlayedPieChart } from "../../components/charts/general/factions-pie";
```

### Step 5: Address TypeScript Issues

#### 5.1 Remove @ts-nocheck (Optional but Recommended)
Consider removing `// @ts-nocheck` and fixing type issues. Common patterns:

**Issue**: `data as data[] | undefined`
**Fix**: Define proper data types:
```typescript
interface ChartDataItem {
  mapName: string;
  value: number;
}
const chartData: ChartDataItem[] = [];
```

#### 5.2 Fix Type Imports
Some Nivo type imports may have changed. Update as needed:
```typescript
import { BarDatum } from '@nivo/bar';
import { PieDatum } from '@nivo/pie';
```

### Step 6: Update HeatMap to ResponsiveHeatMap

In `packages/web/src/components/charts/factions-heatmap.tsx`:

Before:
```typescript
import { HeatMap } from "@nivo/heatmap";
// ...
<HeatMap width={width} height={height} data={data} ... />
```

After:
```typescript
import { ResponsiveHeatMap } from "@nivo/heatmap";
// ...
// Remove width and height props, component will auto-size
<ResponsiveHeatMap data={data} ... />
```

Update the component interface to remove width/height requirements:
```typescript
interface IProps {
  data: Array<Record<string, any>>;
  keys: Array<string>;
  // Remove: width: number;
  // Remove: height: number;
}
```

### Step 7: Test Chart Rendering

#### 7.1 Build the Project
```bash
cd packages/web
yarn build
```

**Expected**: Build should complete without errors.

#### 7.2 Run Development Server
```bash
yarn dev
```

#### 7.3 Test Each Chart Type
Navigate to pages that use charts and verify:
- ✅ Bar charts render correctly (`/stats`, `/map-stats`)
- ✅ Pie charts render correctly (`/stats`)
- ✅ Geo maps render correctly (`/stats` - country distribution)
- ✅ Heatmaps render correctly (faction matchups)
- ✅ Charts are responsive (resize browser window)
- ✅ Chart interactions work (hover, tooltips, legends)
- ✅ No console errors related to Nivo

### Step 8: Check for Deprecated Props

Review Nivo changelog for deprecated props. Common changes to check:

1. **Color schemes**: Verify `colors={{ scheme: "nivo" }}` still works
2. **Legends**: Check legend configurations
3. **Axes**: Verify axis configurations
4. **Animations**: Check animation props

If any charts break, consult: https://github.com/plouc/nivo/releases

### Step 9: Performance Testing

After upgrade, verify:
- Charts load without significant delay
- No memory leaks (use Chrome DevTools)
- Smooth animations
- Responsive resizing works well

### Step 10: Clean Up

```bash
# Remove any old chart files if fully migrated
# Update any test files that reference old chart locations
```

## Potential Issues & Solutions

### Issue 1: "Cannot add property ref, object is not extensible"
**Cause**: Nivo v0.97+ requires React 19 for some features
**Solution**: Project uses React 18.3.0 which should be compatible. If issues arise, check if chart components are being passed as props incorrectly.

### Issue 2: Charts Not Rendering
**Cause**: Missing "use client" directive
**Solution**: Ensure ALL chart components have `"use client";` at the top

### Issue 3: Type Errors
**Cause**: TypeScript definitions changed
**Solution**: Update type imports or keep `// @ts-nocheck` temporarily

### Issue 4: Responsive Charts Not Auto-Sizing
**Cause**: Parent container needs defined dimensions
**Solution**: Ensure parent `<div>` has width/height:
```typescript
<div style={{ width: '100%', height: 400 }}>
  <ResponsiveBar ... />
</div>
```

### Issue 5: Build Errors with Next.js
**Cause**: Nivo packages not transpiled
**Solution**: Add to `transpilePackages` in next.config.mjs

## Testing Checklist

After completing the upgrade, test these pages:

- [ ] `/stats` - General statistics with multiple chart types
- [ ] `/stats/[specific-stats-route]` - Custom stats with bars and pies
- [ ] `/map-stats` - Map statistics with various bar charts
- [ ] `/players/[steamid]` - Player profile (if using charts)
- [ ] Verify all chart tooltips work
- [ ] Verify all chart legends work
- [ ] Verify chart colors/themes look correct
- [ ] Test on mobile viewport (responsive behavior)
- [ ] Check browser console for warnings/errors

## Rollback Plan

If critical issues are found:
```bash
git checkout main
git branch -D nivo-upgrade-v0.99
cd packages/web
yarn install
```

## References

- Nivo Releases: https://github.com/plouc/nivo/releases
- Nivo Documentation: https://nivo.rocks/
- Next.js Client Components: https://nextjs.org/docs/app/building-your-application/rendering/client-components

## Notes for Future Maintainers

1. All Nivo charts MUST be client components (`"use client"`)
2. Keep all chart components in `components/charts/` for organization
3. Nivo packages must be in `transpilePackages` in next.config.mjs
4. Consider removing `@ts-nocheck` and properly typing chart data
5. The project is on React 18.3.0; Nivo v0.99.0 supports React 19 but works with 18

