# Japanese Animation History Archive

A React single-page app that explores the history of Japanese animation through era timelines, studio and creator spotlights, and influential series collections.

The app is built for responsive use across mobile, tablet, and desktop, with both component tests and a Playwright navigation-responsiveness check.

## Stack

- React 19
- React Router 7 (`HashRouter`)
- Create React App toolchain (`react-scripts` 5)
- Jest + Testing Library
- Playwright (custom script for nav responsiveness)

## Highlights

- Shared route layout with page-level experiences for eras, creators, and series.
- Light/dark theme support with persisted state.
- Universal search overlay with preview support.
- Dynamic decade route (`/:decade`) for archive-style browsing.
- Responsive navigation with automated viewport validation and screenshots.

## Routes

Defined in `src/index.js` with shared layout in `src/Layout.jsx`:

- `/` - Home
- `/anime-eras` - Anime Eras
- `/studios-creators` - Studios & Creators
- `/influential-series` - Influential Series
- `/all-influential-series` - All Influential Series
- `/user-feedback` - User Feedback
- `/about` - About
- `/:decade` - Decade page (example: `/1980s`)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

Default URL: `http://localhost:3000`

## Scripts

- `npm start` - Run development server.
- `npm test` - Run Jest tests in watch mode.
- `npm run build` - Create a production build in `build/`.
- `npm run test:nav-responsive` - Run Playwright nav checks and save screenshots to `responsive-reports/`.
- `npm run predeploy` - Build before deploy.
- `npm run deploy` - Deploy `build/` to GitHub Pages.

## Recommended Verification

Run before shipping:

```bash
npm test -- --watchAll=false --runInBand
npm run build
npm run test:nav-responsive
```

This validates:

- Component/page behavior (Jest + Testing Library).
- Production build integrity.
- Navigation responsiveness across configured viewport sizes.

## Responsive Navigation Check

The script in `scripts/check-nav-responsive.mjs` defaults to `http://127.0.0.1:3000`.

Run app and check in separate terminals:

```bash
npm start
npm run test:nav-responsive
```

Optional flags:

```bash
npm run test:nav-responsive -- --url http://127.0.0.1:3000 --viewports 320x568,768x1024 --toggle-breakpoint 1167
```

If Playwright browser binaries are not installed:

```bash
npx playwright install chromium
```

## Deployment Notes

- GitHub Pages path is set via `"homepage": "/library"` in `package.json`.
- `HashRouter` is used for static-host compatibility.
- Deploy flow: `npm run predeploy` then `npm run deploy`.

## Project Structure

```text
src/
  components/   Reusable UI components
  context/      Theme context and global state
  css/          Shared and page-specific styles
  data/         Static content/data sources
  hooks/        Custom hooks
  pages/        Route-level pages
  utils/        Utility logic
  __tests__/    Jest and Testing Library tests
scripts/
  check-nav-responsive.mjs
public/
  Static assets and HTML templates
```

## Troubleshooting

- If port `3000` is in use, React Scripts will offer another port.
- If deploy assets do not resolve, verify the `homepage` value in `package.json`.