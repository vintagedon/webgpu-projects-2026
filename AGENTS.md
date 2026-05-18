<!--
---
title: "WebGPU Projects Agent Instructions"
description: "Agent context and constraints for WebGPU Projects 2026"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: guide
  - domain: documentation
---
-->

# Agent Instructions

## Repository Identity

WebGPU Projects 2026 is a multi-demo portfolio site showcasing WebGPU compute and rendering through interactive browser-based simulations. Each demo shares a neon-styled UI toolkit, a GPU compute harness, and a two-pane layout with persistent metrics. Deploys as a single Azure Static Web App at `webgpu.donfather.dev`.

## Context Loading

Agents working on this repository should load context in this order:

1. This file (`AGENTS.md`), which covers repository identity, constraints, and conventions
2. `README.md` for project overview and current state
3. `internal-files/one-pager-webgpu-portfolio.md` for architecture, layout, demo roadmap, and design decisions
4. `docs/documentation-standards/` for templates and standards to follow
5. The relevant demo directory's README for demo-specific context

## Architectural Constraints

- Simulation and compute demos use raw WebGPU API and WGSL shaders; do not use Three.js, Babylon.js, or any WebGPU abstraction library for the compute or render pipelines. Three.js is permitted only when a specific demo genuinely requires a 3D scene graph (e.g., the dungeon walking simulator).
- UI controls use the custom neon component toolkit (`src/ui/`). No React, Vue, Tweakpane, or other UI framework.
- All demos share the core harness (`src/core/`): device initialization, canvas management, render loop, buffer utilities, and timing instrumentation. Per-demo code imports from core; it does not duplicate it.
- Every demo exposes a `window.__DEMO_TEST_STATE__` object for Playwright smoke tests.
- All output deploys as static files compatible with Azure Static Web Apps. No server-side rendering, no dynamic backends, no databases.
- TypeScript strict mode. No `any` types except where interfacing with WebGPU API types that require it.
- WGSL shaders imported as raw strings via Vite's `?raw` import or inlined as template literals.

## Project Structure

```
webgpu-projects-2026/
├── src/
│   ├── core/           Device, canvas, timing, buffers, render loop
│   ├── ui/             Neon control components, metrics panel, flyout
│   ├── shaders/        Shared WGSL utilities
│   ├── demos/
│   │   ├── particles/  GPU Particle Playground
│   │   └── .../        Additional demos
│   ├── assets/
│   │   ├── css/        Neon UI stylesheet
│   │   └── sfx/        UI sound effects
│   └── app.ts          Router / entry point
├── public/             Static assets (index.html, favicon)
├── docs/               Documentation standards
├── internal-files/     One-pagers, design docs (gitignored in public repos)
├── spec/               Agent specifications (gitignored in public repos)
├── work-logs/          Development history
├── AGENTS.md           This file
└── README.md           Project README
```

## Documentation Conventions

- All Markdown files require YAML frontmatter (see `docs/documentation-standards/tagging-strategy.md`)
  - Exempt: standard repo furniture (CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, licenses) and source materials in `internal-files/`
- New directories require an interior README (see `docs/documentation-standards/interior-readme-template.md`)
- Script files require language-appropriate headers (see `docs/documentation-standards/script-header-*.md`)
- Follow dual-audience commenting (see `docs/documentation-standards/code-commenting-dual-audience.md`)
- Follow writing style conventions (see `docs/documentation-standards/writing-style-guide.md`)
- Agents never delete files; move unnecessary files to `recycle/` with documented justification

## Commit Messages

- Present tense, imperative mood
- 72-character first line limit
- Conventional Commits with project-specific scopes: core, ui, demo, config, docs, build

## Session Pattern

1. Load context (this file + README + relevant one-pager)
2. Work within defined scope
3. Document changes appropriately
4. Update work-logs if significant work completed
