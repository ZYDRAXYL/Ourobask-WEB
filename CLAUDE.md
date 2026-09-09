# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Ourobask-WEB is the static marketing/landing site for **Ourobask**, an Android app
(source at `github.com/ZYDRAXYL/Ourobask-APP`) for tasks, notes, ideas, routines, and a
savings "quest" feature. This repo is only the website — there is no app code here.

It is a plain static site: **no build step, no dependencies, no package manager**.
Editing a file and reloading the browser is the entire dev loop.

## Structure

- `index.html` — the entire site, single page, all sections inline (header/nav, hero,
  `#features`, `#tasks`, `#quest`, `#ideas`, `#privacy`, `#download`, `#faq`, footer).
- `assets/css/styles.css` — all styling. Uses CSS custom properties as design tokens,
  defined on `:root` (light) and `:root[data-theme="dark"]` (dark).
- `assets/js/main.js` — a single IIFE, no external JS dependencies, handling:
  - light/dark theme toggle (persisted to `localStorage` under key `ourobask-theme`,
    falls back to `prefers-color-scheme`)
  - mobile nav menu open/close
  - sticky header border on scroll
  - scroll-spy nav highlighting via `IntersectionObserver`
  - scroll-reveal animations via `IntersectionObserver`
  - fetching `https://api.github.com/repos/ZYDRAXYL/Ourobask-APP/releases/latest` to
    populate the latest version, publish date, per-ABI APK download links/sizes
    (elements tagged `data-latest-version`, `data-latest-date`, `data-asset-url`,
    `data-asset-size`). If the fetch fails (offline/rate-limited), the page still works
    using the static values already written in `index.html`, and download links fall
    back to the GitHub `releases/latest` page.
- `assets/img/` — favicon, logo, Open Graph cover image.
- `.nojekyll` — disables GitHub Pages' Jekyll processing.
- `robots.txt`, `sitemap.xml` — SEO.
- `.github/workflows/deploy.yml` — CI/CD (see below).

## Running locally

Just open `index.html` in a browser. To get an `http://` origin (so the GitHub API
`fetch` behaves like it does in production, instead of failing under `file://`), serve
the directory with anything, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

There is no lint, test, or build command in this repo.

## Deployment

Every push to `main` triggers the **Deploy to GitHub Pages** workflow
(`.github/workflows/deploy.yml`), which:
1. Checks that the required files exist (`index.html`, `assets/css/styles.css`,
   `assets/js/main.js`, `assets/img/logo.svg`, `assets/img/favicon.svg`, `.nojekyll`).
2. Parses `index.html` for local `href`/`src` references (skipping external URLs,
   `mailto:`, `data:`, anchors) and fails the build if any referenced local file is
   missing.
3. Uploads the whole repo root as the Pages artifact and deploys it.

It can also be run manually via `workflow_dispatch`. The repo's Pages source is set to
**GitHub Actions**. Because of step 2, **any new local asset referenced from
`index.html` must actually exist in the repo**, or CI fails the deploy.

## Theming

Colors follow the Ourobask Android app's actual Material 3 theme, generated from seed
`#6750A4` (same value as `OurobaskApp.seed` in `lib/main.dart` of the Ourobask-APP
repo). All color tokens live in `:root` and `:root[data-theme="dark"]` in
`assets/css/styles.css`.

Theme selection: defaults to the OS preference, is overridden and persisted once the
user manually toggles it (`localStorage['ourobask-theme']`), and is applied in an
inline `<script>` in `<head>` *before* the page renders, to avoid a flash of the wrong
theme.

## Content/versioning notes

- The site's version/download info mirrors Ourobask-APP releases; it self-updates at
  runtime via the GitHub Releases API call in `main.js`, so `index.html` generally does
  not need to be edited for every new app release — the static fallback values in the
  HTML are just a fallback, not the source of truth.
- Site content is in Thai (`lang="th"`).
- License: Apache-2.0 (see `LICENSE`).
