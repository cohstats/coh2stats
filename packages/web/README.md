# COH2Stats Web

This is the web package for COH2Stats, built with Next.js.

## Available Scripts

In the project directory (or from root using `yarn web <command>`), you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## Docker Build

This project is part of a Yarn workspaces monorepo. The Dockerfile is located at the repository root and handles the monorepo structure automatically.

### Building the Docker Image

From the repository root (`C:/Git/cohstats/coh2stats` or `/path/to/coh2stats`), run:

```bash
docker build -t coh2stats-web .
```

Or use the convenience script:

```bash
yarn docker:build
```

### Running the Docker Container

```bash
docker run -p 3000:3000 coh2stats-web
```

Or use the convenience script:

```bash
yarn docker:run
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Technical Details

The Dockerfile at the repository root:
- Handles the Yarn workspaces monorepo structure
- Uses the `yarn.lock` from the root directory
- Builds the web package specifically
- Creates a production-ready Next.js standalone build

## Theme System

The web application supports light and dark themes that can be toggled by the user.

### Implementation Overview

The theme system uses:
- **next-themes**: Industry-standard theme management library for Next.js with zero-flash SSR support
- **Ant Design 6.x**: Built-in theme algorithms (`theme.defaultAlgorithm` for light, `theme.darkAlgorithm` for dark)
- **localStorage**: Theme preference persists across sessions (via next-themes)
- **CSS Variables**: Custom styles that respond to theme changes
- **Zero Flash on Load**: next-themes handles SSR properly without inline scripts

### Architecture

1. **Theme Management** (`src/components/theme-provider.tsx`)
   - Uses `next-themes` library for complete theme handling
   - Stores theme preference in localStorage with key `coh2UserConfig-theme`
   - Default theme: 'light'
   - Automatically sets `data-theme` attribute on HTML element
   - Zero-flash on page load (no inline scripts needed)
   - No changes needed to existing `ConfigContext` - theme is fully managed by next-themes

2. **Ant Design Integration** (`src/app/providers.tsx`)
   - `AntdConfigProvider` component wraps Ant Design's `ConfigProvider`
   - Reads theme from `next-themes` using `useTheme()` hook
   - Applies `theme.darkAlgorithm` or `theme.defaultAlgorithm` based on current theme
   - Dynamically switches between light and dark themes

3. **Theme Toggle** (`src/components/theme-toggle.tsx`)
   - Button component with sun/moon icon
   - Located in the main header (top right)
   - Uses `next-themes` `useTheme()` hook
   - Includes mounted state check to prevent hydration mismatch

4. **CSS Styling** (`src/app/globals.css`)
   - CSS variables for background and text colors
   - `[data-theme="dark"]` selector for dark mode overrides
   - Smooth transitions between themes

5. **SSR Support** (`src/app/layout.tsx`)
   - `suppressHydrationWarning` on `<html>` tag
   - next-themes handles SSR flash prevention automatically
   - No inline scripts required

### Usage

Users can toggle between light and dark themes by clicking the sun/moon button in the header. The preference is automatically saved and persists across page reloads and browser sessions.

### Extending the Theme

To customize theme colors beyond Ant Design's defaults:

```typescript
// In src/app/providers.tsx (AntdConfigProvider component)
const themeConfig = {
  algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    // Override specific design tokens
    colorPrimary: '#1577FF',
    borderRadius: 4,
    // Add more customizations
  },
};
```

To add custom CSS for dark mode:

```css
/* In src/app/globals.css */
[data-theme="dark"] {
  --custom-color: #your-color;
}
```

To enable system theme detection:

```typescript
// In src/components/theme-provider.tsx
<NextThemesProvider
  attribute="data-theme"
  defaultTheme="system"  // Change from "light" to "system"
  enableSystem={true}    // Change from false to true
  storageKey="coh2UserConfig-theme"
  disableTransitionOnChange={false}
>
```

### Dependencies

- **next-themes** (^0.4.6): Handles theme persistence and SSR without flash

### Known Limitations

- Theme preference is stored locally and does not sync across devices
- Desktop and web applications maintain separate theme preferences
- Requires localStorage; falls back to light theme if storage is disabled
