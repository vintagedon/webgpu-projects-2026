<!--
---
title: "Site Template and Design System"
description: "Vite scaffold, neon design system, site shell, SFX, tooltips, welcome modal, and landing page"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Complete"
tags:
  - type: worklog
  - domain: [portfolio, ui, infrastructure]
  - tech: [typescript, vite, html-css, web-audio]
related_documents:
  - "[Spec 02](../spec/2026-05-18-spec-02-site-template-design-system.md)"
  - "[One-Pager](../internal-files/one-pager-webgpu-portfolio.md)"
---
-->

# Site Template and Design System

## Summary

| Attribute | Value |
|-----------|-------|
| Status | ✅ Complete |
| Sessions | 1 |
| Artifacts | 1 Vite scaffold, 4 CSS partials, 5 UI modules, 8 bundled SFX files, 1 worklog |

Objective: Build the shared static site foundation for the WebGPU Projects 2026 portfolio without adding WebGPU runtime code.

Outcome: The repo now has a strict TypeScript + Vite app, neon CSS design system, site shell/footer, Web Audio SFX manager, tooltip/glossary system, reusable welcome modal, and a root landing gallery.

---

## 1. Work Completed

| Task | Description | Result |
|------|-------------|--------|
| Vite scaffold | Added package, TypeScript, Vite config, HTML entries, and source tree | `npm run build` emits static files under `dist/` |
| Design system | Extracted neon UI variables and component patterns into reusable CSS partials | App imports the design system through `src/assets/css/index.css` |
| Site shell | Built a vanilla TypeScript shell with sticky footer, external links, author tooltip, and sound toggle | Landing page renders inside the shared shell |
| SFX manager | Copied one WAV per interaction category and implemented Web Audio playback with persistent mute | SFX play after user interaction and are bundled by Vite |
| Tooltip and glossary | Added shared tooltip positioning and glossary initialization from JSON data | Landing page glossary terms expose hover/tap definitions |
| Welcome modal | Added a reusable first-visit modal with localStorage dismissal and SFX hooks | Root page displays a dismissible introduction modal |
| Landing gallery | Added project cards for planned demos with hover/click SFX and neon panel styling | Root page presents the initial portfolio gallery |
| Documentation cleanup | Updated stale local spec paths from `assets/ui-gui/...` to the actual `assets/...` layout | Private spec now matches the checked-in asset tree |

---

## 2. Files Changed

| File | Change |
|------|--------|
| [package.json](../package.json) | Created Vite and TypeScript scripts/dependencies |
| [tsconfig.json](../tsconfig.json) | Created strict TypeScript configuration |
| [vite.config.ts](../vite.config.ts) | Created static Vite build configuration |
| [index.html](../index.html) and [public/index.html](../public/index.html) | Created app HTML entries |
| [src/app.ts](../src/app.ts) | Created root app bootstrap |
| [src/assets/css/](../src/assets/css/) | Created neon design-system partials |
| [src/assets/data/glossary.json](../src/assets/data/glossary.json) | Created glossary definitions |
| [src/assets/sfx/](../src/assets/sfx/) | Added selected WAV files for eight SFX categories |
| [src/ui/](../src/ui/) | Created shell, SFX, tooltip, glossary, and modal modules |
| [src/pages/landing.ts](../src/pages/landing.ts) | Created landing gallery page |
| [src/**/README.md](../src/README.md) and [public/README.md](../public/README.md) | Added required interior README files |

---

## 3. Issues Encountered

| Issue | Resolution |
|-------|------------|
| Spec referenced `assets/ui-gui/...`, but the repo stores packs under `assets/neon-ui-mega-bundle/` and `assets/tiny-ui-sfx-pack/` | Used the actual repo paths and updated the private spec text locally |
| Vite config initially emitted `dist/public/index.html` when using `public/index.html` as the build input | Added a root `index.html` for dev/build root output while keeping `public/index.html` as the requested scaffold artifact |
| TypeScript config lacked Node types for the Vite config | Added `@types/node` and included Node types in `tsconfig.json` |

---

## 4. Next Steps

Handoff: The site template is ready for the next spec to add the WebGPU core harness.

1. Build the core WebGPU device/canvas/render-loop modules under `src/core/`.
2. Add Playwright smoke tests once demo routes expose `window.__DEMO_TEST_STATE__`.

<!-- Source: Codex CLI session, 2026-05-18 -->
