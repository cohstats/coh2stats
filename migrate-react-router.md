# React Router v6 Migration Guide

## Overview
This document outlines the necessary changes to migrate from React Router v5 to v6 in the coh2stats web application. The project is currently using `react-router-dom-v5-compat` as a transition package.

## Files Requiring Changes

### 1. App.tsx
- Already using `Routes` and `Route` from v6 compat package
- No immediate changes needed as it's already using the new syntax
- Future enhancement: Remove `CompatRouter` once migration is complete

### 2. Main Components Using Router Features

#### main-header.tsx
- Currently using `useRouteMatch` which is deprecated in v6
- Changes needed:
  - Replace `useRouteMatch` with `useMatch`
  - Update match pattern syntax to new format
  - Consider using new route matching patterns with `*` for nested routes

#### root.tsx
- Currently using `ConnectedRouter` from `connected-react-router`
- Changes needed:
  - Replace with `BrowserRouter` from `react-router-dom`
  - Update Redux integration if needed
  - Remove history prop passing as it's handled internally in v6

### 3. Pages and Components

#### ✅ Leaderboards Component (leaderboards.tsx)
- ~Using `useHistory`~
- ~Changes needed:~
  - ~Replace `useHistory` with `useNavigate`~
  - ~Update navigation calls from `push()` to `navigate()`~
- Changes completed:
  - Replaced `useHistory` with `useNavigate`
  - Updated navigation calls to use `navigate()`
  - Kept using v5-compat package for smooth transition

#### Map Stats Components
- Files: `map-stats-range-data-provider.tsx`, `map-stats-general-data-provider.tsx`
- Already using v6 compat `useLocation`
- No immediate changes needed

#### Stats Components
- Files: `custom-stats-general-data-provider.tsx`, `custom-stats-range-data-provider.tsx`
- Already using v6 compat `useLocation`
- No immediate changes needed

#### Commander List Component (commandersList.tsx)
- Already using v6 compat `useParams` and `Link`
- No immediate changes needed

#### Search Components
- Using `useHistory` in various components
- Changes needed:
  - Replace `useHistory` with `useNavigate`
  - Update navigation logic

#### Live Matches Component (live-matches.tsx)
- Using `useHistory`
- Changes needed:
  - Replace `useHistory` with `useNavigate`
  - Update navigation calls

### 4. Store Configuration

#### store/reducer.ts and store/configure.ts
- Using `connected-react-router`
- Changes needed:
  - Remove `connected-react-router` dependency
  - Update Redux integration with React Router v6
  - Consider using Redux Toolkit for routing if needed

## Migration Steps

1. **Initial Setup**
   - ✅ Install `react-router-dom-v5-compat` (already done)
   - Install `react-router-dom@6`

2. **Component Updates**
   - Replace `useHistory` with `useNavigate`
   - Replace `useRouteMatch` with `useMatch`
   - Update route definitions to use new element prop syntax
   - Remove `exact` prop from routes (not needed in v6)

3. **Redux Integration**
   - Remove `connected-react-router`
   - Update store configuration
   - Implement new routing state management if needed

4. **Route Configuration**
   - Review and update nested routes
   - Update route parameters syntax
   - Implement new routing patterns

5. **Testing**
   - Test all navigation flows
   - Verify route parameters
   - Check nested routes
   - Validate query parameter handling

6. **Cleanup**
   - Remove v5 compatibility layer
   - Remove unused imports
   - Update any remaining v5 patterns

## Common Migration Patterns

### History to Navigate
```javascript
// Old (v5)
const history = useHistory();
history.push('/path');

// New (v6)
const navigate = useNavigate();
navigate('/path');
```

### Route Matching
```javascript
// Old (v5)
const match = useRouteMatch('/path/:id');

// New (v6)
const match = useMatch('/path/:id');
```

### Route Definitions
```javascript
// Old (v5)
<Route path="/path" component={Component} />

// New (v6)
<Route path="/path" element={<Component />} />
```

## Notes
- The codebase is partially migrated with the compatibility layer
- Most components are already using the v6 compat imports
- Main focus should be on replacing navigation patterns and route matching
- Redux integration needs careful consideration during migration 