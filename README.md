# Japanese Animation History Archive (Client)

A React single-page application that documents major eras, studios, creators, and influential series in Japanese animation history.

## Tech Stack

- React 19
- React Router 7 (`HashRouter`)
- React Scripts 5 (Create React App toolchain)
- Testing Library + Jest
- Playwright (custom responsive navigation check)

## Key Features

- Multi-page client experience with nested routes and a shared layout.
- Theme system (light/dark) with `localStorage` persistence.
- Universal search overlay with filters and predictive suggestions.
- Era-focused pages, studio/creator profiles, and influential-series exploration.
- Mobile-first navigation with dedicated responsive validation script.

## Routes

Top-level route shell is defined in `src/index.js` and `src/Layout.jsx`.

- `/` - Home
- `/anime-eras` - Anime Eras
- `/studios-creators` - Studios & Creators
- `/influential-series` - Influential Series
- `/all-influential-series` - Expanded series archive
- `/user-feedback` - User Feedback Page
- `/about` - About
- `/:decade` - Dynamic decade page (for example `/1980s`)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm start
```

Default local URL:

- `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode.
- `npm run build` - Creates an optimized production build in `build/`.
- `npm test` - Runs unit/integration tests with Jest.
- `npm run test:nav-responsive` - Runs Playwright-based nav responsiveness checks and stores screenshots in `responsive-reports/`.
- `npm run deploy` - Builds and deploys to GitHub Pages (`gh-pages -d build`).

## Responsive Navigation Test

The custom responsive test expects a running app URL (defaults to `http://127.0.0.1:3000`).

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run test:nav-responsive
```

Optional flags:

```bash
npm run test:nav-responsive -- --url http://127.0.0.1:3000 --viewports 320x568,768x1024 --toggle-breakpoint 1167
```

## Build and Deployment Notes

- `package.json` uses `"homepage": "/library"` for GitHub Pages hosting.
- Routing uses `HashRouter`, which is compatible with static hosting.
- Deploy pipeline:
	1. `npm run predeploy` (build)
	2. `npm run deploy`

## Project Structure (Client)

```text
src/
	components/      Reusable UI components
	context/         React context providers (theme)
	css/             Page/component styles
	data/            Static datasets and site metadata
	hooks/           Custom hooks
	pages/           Route-level page components
	utils/           Utility modules (search, helpers)
	__tests__/       Jest + Testing Library suites
scripts/
	check-nav-responsive.mjs
```

## Quality Checks

Recommended local verification flow:

```bash
npm test -- --watch=false
npm run build
```

If you are preparing a deployment, also run:

```bash
npm run test:nav-responsive
```

## Troubleshooting

- If port `3000` is already in use, React Scripts prompts for another port.
- If Playwright is missing browser binaries, run:

```bash
npx playwright install chromium
```

- If GitHub Pages assets load incorrectly, confirm `homepage` in `package.json` matches the repo path.