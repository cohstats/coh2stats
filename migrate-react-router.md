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

### 4. Store Configuration

#### store/reducer.ts and store/configure.ts
- Using `connected-react-router`
- Changes needed:
  - Remove `connected-react-router` dependency
  - Update Redux integration with React Router v6
  - Consider using Redux Toolkit for routing if needed

## Remaining Migration Steps

1. **Initial Setup**
   - Install `react-router-dom@6`

2. **Component Updates**
   - Replace `useRouteMatch` with `useMatch` in main-header.tsx
   - Update route definitions to use new element prop syntax where needed
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
- Main focus should be on replacing route matching and Redux integration
- Redux integration needs careful consideration during migration 