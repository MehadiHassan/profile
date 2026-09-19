# Md. Mehadi Hassan — Professional Profile

A responsive, accessible personal profile site built with plain HTML, CSS and JavaScript —
no framework, no build step, no dependencies.

**Live site:** https://mehadihassan.github.io/profile/

---

## What's here

```
index.html                 # the whole page
assets/css/styles.css      # design tokens, layout, components, print styles
assets/js/main.js          # theme, nav, scroll-spy, filters, counters, disclosures
assets/img/favicon.svg     # MH monogram
assets/docs/               # downloadable CV
.github/workflows/deploy.yml
```

## Features

- **Responsive** from 320px phones up to wide desktops
- **Dark / light theme** — follows the OS by default, remembers your choice, no flash on load
- **Interactive** — typing role animation, animated stat counters, filterable skill grid,
  expandable experience entries and recommendations, scroll-spy navigation, scroll progress bar,
  copy-to-clipboard
- **Accessible** — semantic landmarks, skip link, keyboard-operable controls, `aria-expanded` /
  `aria-pressed` / `aria-current` state, visible focus rings, `prefers-reduced-motion` support
- **Print-friendly** — prints as a clean CV with all panels expanded
- **SEO** — meta description, Open Graph tags, JSON-LD `Person` schema

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static server works; the site has no build step.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the repository
root to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Editing

- **Text and sections** — `index.html`
- **Colours, spacing, typography** — the `:root` token block at the top of `assets/css/styles.css`
  (the `[data-theme="light"]` block right below it overrides for light mode)
- **Rotating job titles** — the `roles` array in `assets/js/main.js`
- **Skills** — add an `<li class="skill" data-cat="...">` in `index.html`; the filter picks it up
  automatically

## Licence

Content © Md. Mehadi Hassan. Code is free to reuse.
