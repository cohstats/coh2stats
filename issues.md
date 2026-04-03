# Migration Plan: _pages_old to app folder

## Analysis Summary

### Current State

- **_pages_old folder**: Contains old React Router components that need to be migrated to Next.js App Router
- **app folder**: Already has page.tsx files that currently import from _pages_old
- Most pages in app/ are simple wrappers that import components from _pages_old

### Migration Strategy

1. Move page-specific components to `_components` folders next to their pages
2. Move shared components (used by multiple pages) to `src/components/`
3. Keep helper files with their components in `_components` if page-specific
4. Convert CSS files to CSS modules where beneficial
5. Maintain existing file names (e.g., `custom-stats.tsx`)

---

## Detailed Migration Plan

### Phase 1: Identify Component Categories

#### A. Pages Already Migrated (No Action Needed)

- ✅ `/bulletins` - Already migrated directly in app/bulletins/page.tsx
- ✅ `/about` - Already migrated directly in app/about/page.tsx
- ✅ `/about/regions` - Already migrated directly in app/about/regions/page.tsx
- ✅ `/other/open-data` - Already migrated directly in app/other/open-data/page.tsx
- ✅ `/commanders` - Already has proper _components structure
- ✅ `/desktop-app` - Already has proper _components structure

#### B. Pages to Migrate (Currently importing from _pages_old)

1. **Stats Pages**
    - Current: `app/stats/page.tsx` imports `_pages_old/stats/custom-stats.tsx`
    - Current: `app/stats/[frequency]/[timestamp]/[type]/[race]/page.tsx` imports `_pages_old/stats/old-stats.tsx`

2. **Leaderboards**
    - Current: `app/leaderboards/page.tsx` imports `_pages_old/ladders/leaderboards.tsx`

3. **Live Matches**
    - Current: `app/live-matches/page.tsx` imports `_pages_old/live-matches/live-matches.tsx`

4. **Map Stats**
    - Current: `app/map-stats/page.tsx` imports `_pages_old/map-stats/map-stats.tsx`

5. **Search**
    - Current: `app/search/page.tsx` imports `_pages_old/search/search.tsx`
    - Current: `app/players/page.tsx` also imports `_pages_old/search/search.tsx` (SHARED)

6. **Players**
    - Current: `app/players/page.tsx` imports `_pages_old/players/stats/player-stats.tsx`
    - Current: `app/players/[steamid]/page.tsx` imports multiple components from `_pages_old/players/player-card/`

7. **Matches**
    - Current: `app/matches/[matchID]/page.tsx` imports `_pages_old/match/single-match.tsx`

8. **Recent Matches**
    - Current: `app/recent-matches/page.tsx` imports `_pages_old/recent-matches/recent-matches.tsx`

#### C. Shared Components (Used by Multiple Pages)

These should go to `src/components/`:

- `search/search.tsx` + `search.css` - Used by `/search` and `/players`
- `search/components/search-bulletin-card.tsx`
- `search/components/search-commander-card.tsx`
- `search/components/search-user-card.tsx`
- `search/types.ts`
- `matches/last-matches-table.tsx` - Used by player cards
- `matches/all-matches-table.tsx` - Used by player cards
- `matches/match-details.tsx` - Used by single match page
- `matches/match-details-table.tsx` - Used by match details
- `matches/tableStyle.css`

---

### Phase 2: Step-by-Step Migration Tasks

#### Task 1: Migrate Stats Page Components

**Location**: `packages/web/src/app/stats/_components/`

**Files to migrate**:

1. From `_pages_old/stats/`:
    - `custom-stats.tsx` → `app/stats/_components/custom-stats.tsx`
    - `custom-stats-details.tsx` → `app/stats/_components/custom-stats-details.tsx`
    - `custom-stats-general-data-provider.tsx` → `app/stats/_components/custom-stats-general-data-provider.tsx`
    - `custom-stats-range-data-provider.tsx` → `app/stats/_components/custom-stats-range-data-provider.tsx`
    - `general-stats.tsx` → `app/stats/_components/general-stats.tsx`
    - `old-stats.tsx` → `app/stats/_components/old-stats.tsx`
    - `stats-header.tsx` → `app/stats/_components/stats-header.tsx`
    - `components/bulletin-card.tsx` → `app/stats/_components/bulletin-card.tsx`

2. General charts (stats-specific):
    - `general-charts/average-gametime-bar.tsx` → `app/stats/_components/general-charts/average-gametime-bar.tsx`
    - `general-charts/factions-bar-stacked.tsx` → `app/stats/_components/general-charts/factions-bar-stacked.tsx`
    - `general-charts/factions-pie.tsx` → `app/stats/_components/general-charts/factions-pie.tsx`
    - `general-charts/total-games-pie.tsx` → `app/stats/_components/general-charts/total-games-pie.tsx`
    - `general-charts/total-time-pie.tsx` → `app/stats/_components/general-charts/total-time-pie.tsx`
    - `general-charts/types-games-pie.tsx` → `app/stats/_components/general-charts/types-games-pie.tsx`
    - `general-charts/winRate-bar-stacked.tsx` → `app/stats/_components/general-charts/winRate-bar-stacked.tsx`
    - `general-charts/winRate-bar.tsx` → `app/stats/_components/general-charts/winRate-bar.tsx`

**Actions**:

- Create directory structure
- Move files
- Update imports in moved files to use relative paths
- Update `app/stats/page.tsx` to import from `_components/custom-stats`
- Update `app/stats/[frequency]/[timestamp]/[type]/[race]/page.tsx` to import from `_components/old-stats`

---

#### Task 2: Migrate Leaderboards Components

**Location**: `packages/web/src/app/leaderboards/_components/`

**Files to migrate**:

1. From `_pages_old/ladders/`:
    - `leaderboards.tsx` → `app/leaderboards/_components/leaderboards.tsx`
    - `components.tsx` → `app/leaderboards/_components/leaderboard-components.tsx`

**Actions**:

- Create directory structure
- Move files
- Update imports in moved files
- Update `app/leaderboards/page.tsx` to import from `_components/leaderboards`

---

#### Task 3: Migrate Live Matches Components

**Location**: `packages/web/src/app/live-matches/_components/`

**Files to migrate**:

1. From `_pages_old/live-matches/`:
    - `live-matches.tsx` → `app/live-matches/_components/live-matches.tsx`
    - `live-matches-card.tsx` → `app/live-matches/_components/live-matches-card.tsx`
    - `live-matches-table.tsx` → `app/live-matches/_components/live-matches-table.tsx`

**Actions**:

- Create directory structure
- Move files
- Update imports in moved files
- Update `app/live-matches/page.tsx` to import from `_components/live-matches`

---

#### Task 4: Migrate Map Stats Components

**Location**: `packages/web/src/app/map-stats/_components/`

**Files to migrate**:

1. From `_pages_old/map-stats/`:
    - `map-stats.tsx` → `app/map-stats/_components/map-stats.tsx`
    - `map-stats-details.tsx` → `app/map-stats/_components/map-stats-details.tsx`
    - `map-stats-general-data-provider.tsx` → `app/map-stats/_components/map-stats-general-data-provider.tsx`
    - `map-stats-range-data-provider.tsx` → `app/map-stats/_components/map-stats-range-data-provider.tsx`

**Actions**:

- Create directory structure
- Move files
- Update imports in moved files
- Update `app/map-stats/page.tsx` to import from `_components/map-stats`

---

#### Task 5: Migrate Search Components to Shared Location

**Location**: `packages/web/src/components/search/`

**Files to migrate**:

1. From `_pages_old/search/`:
    - `search.tsx` → `components/search/search.tsx`
    - `search.css` → `components/search/search.module.css` (convert to CSS module)
    - `types.ts` → `components/search/types.ts`
    - `components/search-bulletin-card.tsx` → `components/search/search-bulletin-card.tsx`
    - `components/search-commander-card.tsx` → `components/search/search-commander-card.tsx`
    - `components/search-user-card.tsx` → `components/search/search-user-card.tsx`

**Actions**:

- Create directory structure
- Move files
- Convert `search.css` to `search.module.css` and update imports
- Update imports in moved files
- Update `app/search/page.tsx` to import from `@/components/search/search`
- Update `app/players/page.tsx` to import from `@/components/search/search`

---

#### Task 6: Migrate Player Components

**Location**: `packages/web/src/app/players/_components/`

**Files to migrate**:

1. From `_pages_old/players/`:
    - `stats/player-stats.tsx` → `app/players/_components/player-stats.tsx`

2. From `_pages_old/players/player-card/`:
    - `player-card.tsx` → `app/players/[steamid]/_components/player-card.tsx`
    - `player-standings.tsx` → `app/players/[steamid]/_components/player-standings.tsx`
    - `player-single-matches-table.tsx` → `app/players/[steamid]/_components/player-single-matches-table.tsx`
    - `player-team-matches-table.tsx` → `app/players/[steamid]/_components/player-team-matches-table.tsx`
    - `playergroup-history-chart.tsx` → `app/players/[steamid]/_components/playergroup-history-chart.tsx`
    - `data-processing.ts` → `app/players/[steamid]/_components/data-processing.ts` (helper - keep with components)
    - `helpers.ts` → `app/players/[steamid]/_components/helpers.ts` (helper - keep with components)

**Actions**:

- Create directory structures
- Move files
- Update imports in moved files
- Update `app/players/page.tsx` to import from `_components/player-stats`
- Update `app/players/[steamid]/page.tsx` - migrate the logic directly into the page file or create a main component

---

#### Task 7: Migrate Match Components to Shared Location

**Location**: `packages/web/src/components/matches/`

**Files to migrate**:

1. From `_pages_old/matches/`:
    - `last-matches-table.tsx` → `components/matches/last-matches-table.tsx`
    - `all-matches-table.tsx` → `components/matches/all-matches-table.tsx`
    - `match-details.tsx` → `components/matches/match-details.tsx`
    - `match-details-table.tsx` → `components/matches/match-details-table.tsx`
    - `tableStyle.css` → `components/matches/tableStyle.module.css` (convert to CSS module)

2. From `_pages_old/match/`:
    - `single-match.tsx` → `app/matches/[matchID]/_components/single-match.tsx`

**Actions**:

- Create directory structure
- Move files
- Convert `tableStyle.css` to CSS module and update imports
- Update imports in moved files
- Update `app/matches/[matchID]/page.tsx` to import from `_components/single-match`
- Update `app/players/[steamid]/page.tsx` to import match tables from `@/components/matches/`

---

#### Task 8: Migrate Recent Matches Components

**Location**: `packages/web/src/app/recent-matches/_components/`

**Files to migrate**:

1. From `_pages_old/recent-matches/`:
    - `recent-matches.tsx` → `app/recent-matches/_components/recent-matches.tsx`

**Actions**:

- Create directory structure
- Move files
- Update imports in moved files
- Update `app/recent-matches/page.tsx` to import from `_components/recent-matches`

---

#### Task 9: Clean Up Remaining Files

**Files that can be removed** (after verification):

1. `_pages_old/players/players-page.tsx` - Simple wrapper, logic already in app/players/page.tsx
2. `_pages_old/about/about.tsx` - Already migrated to app/about/page.tsx
3. `_pages_old/about/regions/regions.tsx` - Already migrated to app/about/regions/page.tsx
4. `_pages_old/other/open-data/open-data.tsx` - Already migrated to app/other/open-data/page.tsx
5. `_pages_old/not-found/not-found.tsx` - Already have app/not-found.tsx
6. `_pages_old/profile/` - Check if userProfile is being used

**Files to keep in _pages_old temporarily**:

- None - after migration, the entire _pages_old folder can be removed

**Actions**:

- After all migrations are complete and tested
- Verify no imports remain from _pages_old
- Delete the entire `_pages_old` folder

---

### Phase 3: Import Path Updates

After moving files, update all import statements:

**Pattern for page-specific components**:

```typescript
// Before
import CustomStats from "../../_pages_old/stats/custom-stats";

// After
import CustomStats from "./_components/custom-stats";
```

**Pattern for shared components**:

```typescript
// Before
import { searchCommanders } from "../../_pages_old/search";

// After
import { searchCommanders } from "@/components/search/search";
```

**Pattern for CSS modules**:

```typescript
// Before
import "./search.css";

// After
import styles from "./search.module.css";
// Then use: className={styles.yourClassName}
```

---

### Phase 4: Verification Steps

After migration, verify:

1. ✅ All pages load without errors
2. ✅ No imports from `_pages_old` remain
3. ✅ All functionality works as before
4. ✅ CSS styling is preserved
5. ✅ Build succeeds: `yarn build`
6. ✅ TypeScript checks pass (or same @ts-nocheck status maintained)

**Test each route**:

- `/stats`
- `/stats/[frequency]/[timestamp]/[type]/[race]` (old format redirect)
- `/leaderboards`
- `/live-matches`
- `/map-stats`
- `/search`
- `/search/[searchParam]`
- `/players`
- `/players/[steamid]`
- `/matches/[matchID]`
- `/recent-matches`

---

### Phase 5: Final Cleanup

1. Delete `_pages_old` folder entirely
2. Update any documentation referencing the old structure
3. Search codebase for any remaining references to `_pages_old`
4. Run linter and fix any issues
5. Commit changes with descriptive message

---

## File Structure After Migration

```
packages/web/src/
├── app/
│   ├── stats/
│   │   ├── _components/
│   │   │   ├── custom-stats.tsx
│   │   │   ├── custom-stats-details.tsx
│   │   │   ├── general-stats.tsx
│   │   │   ├── old-stats.tsx
│   │   │   ├── stats-header.tsx
│   │   │   ├── bulletin-card.tsx
│   │   │   ├── custom-stats-general-data-provider.tsx
│   │   │   ├── custom-stats-range-data-provider.tsx
│   │   │   └── general-charts/
│   │   │       ├── average-gametime-bar.tsx
│   │   │       ├── factions-bar-stacked.tsx
│   │   │       ├── factions-pie.tsx
│   │   │       ├── total-games-pie.tsx
│   │   │       ├── total-time-pie.tsx
│   │   │       ├── types-games-pie.tsx
│   │   │       ├── winRate-bar-stacked.tsx
│   │   │       └── winRate-bar.tsx
│   │   └── page.tsx
│   │
│   ├── leaderboards/
│   │   ├── _components/
│   │   │   ├── leaderboards.tsx
│   │   │   └── leaderboard-components.tsx
│   │   └── page.tsx
│   │
│   ├── live-matches/
│   │   ├── _components/
│   │   │   ├── live-matches.tsx
│   │   │   ├── live-matches-card.tsx
│   │   │   └── live-matches-table.tsx
│   │   └── page.tsx
│   │
│   ├── map-stats/
│   │   ├── _components/
│   │   │   ├── map-stats.tsx
│   │   │   ├── map-stats-details.tsx
│   │   │   ├── map-stats-general-data-provider.tsx
│   │   │   └── map-stats-range-data-provider.tsx
│   │   └── page.tsx
│   │
│   ├── players/
│   │   ├── _components/
│   │   │   └── player-stats.tsx
│   │   ├── [steamid]/
│   │   │   ├── _components/
│   │   │   │   ├── player-standings.tsx
│   │   │   │   ├── player-single-matches-table.tsx
│   │   │   │   ├── player-team-matches-table.tsx
│   │   │   │   ├── playergroup-history-chart.tsx
│   │   │   │   ├── data-processing.ts
│   │   │   │   └── helpers.ts
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── matches/
│   │   └── [matchID]/
│   │       ├── _components/
│   │       │   └── single-match.tsx
│   │       └── page.tsx
│   │
│   └── recent-matches/
│       ├── _components/
│       │   └── recent-matches.tsx
│       └── page.tsx
│
└── components/
    ├── search/
    │   ├── search.tsx
    │   ├── search.module.css
    │   ├── types.ts
    │   ├── search-bulletin-card.tsx
    │   ├── search-commander-card.tsx
    │   └── search-user-card.tsx
    │
    └── matches/
        ├── last-matches-table.tsx
        ├── all-matches-table.tsx
        ├── match-details.tsx
        ├── match-details-table.tsx
        └── tableStyle.module.css
```

---

## Execution Order

Follow this order for migration:

1. **Task 5** - Migrate Search (shared) - affects multiple pages
2. **Task 7** - Migrate Matches (shared) - affects multiple pages
3. **Task 1** - Migrate Stats
4. **Task 2** - Migrate Leaderboards
5. **Task 3** - Migrate Live Matches
6. **Task 4** - Migrate Map Stats
7. **Task 6** - Migrate Players
8. **Task 8** - Migrate Recent Matches
9. **Task 9** - Clean up and delete _pages_old

---

## Notes for Implementation

- Maintain `// @ts-nocheck` comments where they exist
- Keep `"use client"` directives at the top of all client components
- Maintain `export const dynamic = "force-dynamic"` in page files
- Update relative import paths carefully
- Test after each major task
- For CSS modules, update className references from strings to `styles.className`
- Preserve all existing functionality - this is a pure refactoring task
