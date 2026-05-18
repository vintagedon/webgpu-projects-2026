<!--
---
title: "WebGPU Projects 2026"
description: "Multi-demo WebGPU portfolio site with neon UI, GPU compute harness, and interactive simulations"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.1"
status: "Active"
tags:
  - type: project-root
  - domain: [portfolio, gpu-compute]
  - tech: [webgpu, wgsl, typescript, vite]
related_documents:
  - "[One-Pager: WebGPU Portfolio](internal-files/one-pager-webgpu-portfolio.md)"
  - "[RadioAstronomy.io Organization](https://github.com/radioastronomyio)"
---
-->

# WebGPU Projects 2026

[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> Interactive WebGPU compute and rendering demos with a shared neon UI toolkit, deployed as a single portfolio site.

A collection of GPU-accelerated browser demos exploring compute shaders, particle systems, fluid simulation, evolutionary artificial life, and 3D rendering through raw WebGPU. Each demo shares a reusable harness (device init, render loop, buffer management) and a neon-styled control surface (sliders, toggles, metrics panels). Deployed at [webgpu.donfather.dev](https://webgpu.donfather.dev) via Azure Static Web Apps.

---

## Overview

The site uses a consistent two-pane layout across all demos. A persistent left panel (15-20% width) displays the demo name and live telemetry: FPS sparkline, compute/render pass timing, entity counts, and buffer memory usage. The remaining viewport is the simulation canvas. A flyout sidebar provides parameter controls (sliders, toggles, presets) using neon-styled components derived from an HTML/CSS asset pack.

The GPU compute harness and UI toolkit are the shared foundation. Each demo imports them, brings its own WGSL shaders and simulation logic, and produces a self-contained interactive experience. The harness handles device acquisition, WebGPU feature detection with graceful fallback, canvas resize, and frame timing instrumentation.

---

## Project Status

| Area | Status | Description |
|------|--------|-------------|
| Documentation Standards | ✅ Complete | Tagging strategy, templates, style guide |
| One-Pager | ✅ Complete | Architecture, layout, demo roadmap |
| Core Harness | ⬜ Planned | Device init, canvas, render loop, buffer utilities, timing |
| UI Toolkit | ⬜ Planned | Neon slider, toggle, segment, metrics panel, flyout |
| GPU Particle Playground | ⬜ Planned | Foundation demo: harness + UI toolkit proving ground |
| Portfolio Demos | ⬜ Planned | Four primary demos (see roadmap below) |
| Azure SWA Deployment | ⬜ Planned | Custom domain, static file hosting |

---

## Architecture

| Component | Implementation | Purpose |
|-----------|----------------|---------|
| Core Harness | TypeScript (`src/core/`) | WebGPU device, canvas, render loop, buffers, timing |
| UI Toolkit | TypeScript + CSS (`src/ui/`) | Neon-styled controls: sliders, toggles, panels, flyout |
| Demos | TypeScript + WGSL (`src/demos/`) | Per-demo simulation logic and shaders |
| Build | Vite multi-page | Each demo gets its own HTML entry; shared imports from core |
| Deploy | Azure Static Web Apps | Static files at `webgpu.donfather.dev` |

---

## Demo Roadmap

### Foundation

The particle playground is the first build. Its primary deliverable is the reusable harness and UI toolkit; the demo itself is a smaller gallery entry.

| Demo | Purpose | GPU Concepts |
|------|---------|-------------|
| GPU Particle Playground | Prove out harness, UI toolkit, layout, metrics, and deployment pipeline | Storage buffers, compute dispatch, point rendering, uniform updates |

### Portfolio Demos

Four primary demos, each with a distinct visual identity and a different slice of the GPU compute/rendering stack.

| Demo | Description | GPU Concepts |
|------|-------------|-------------|
| Food Coloring | Drops of dye falling into water, diffusing, mixing, settling under gravity. Click to drop color. | Multi-channel texture storage, grid compute (diffusion + advection), multi-pass pipelines, color blending |
| Chladni Patterns | Sand particles on a vibrating plate driven by audio input. Standing wave patterns emerge at nodal lines. | Web Audio FFT integration, 2D wave equation grid compute, particle simulation responding to force fields, two coupled compute systems |
| Missile Command | Classic game reimagined as a raymarching showcase. Night sky, searchlight cones, bloom trails, backlit city silhouette, volumetric clouds. | Raymarching, signed distance fields, fragment shaders, post-processing (bloom, tonemapping), additive blending |
| Chromalife | Evolutionary artificial life where organism appearance is a genetically inherited phenotype. Glow, color, trail, and pulse evolve through survival pressure. | Large storage buffers, instanced rendering with per-instance variation, multi-pass rendering (bloom, trails), compute at scale (movement, energy, reproduction) |

### Gallery Demos

Smaller entries that fill out the gallery. Quick builds once the harness exists.

| Demo | GPU Concepts |
|------|-------------|
| Boids / Swarm Lab | Ping-pong buffers, neighborhood reads |
| Conway / Game of Life | Texture compute kernels, timestep control |
| Vector Field Visualizer | Compute-driven particle motion through procedural fields |
| SDF Shape Gallery | Fragment shader raymarching, procedural 3D objects |

Additional candidates: dungeon walking simulator (3D rendering, lighting, textures), simple WebGPU games migrated from other projects.

---

## Repository Structure

```markdown
webgpu-projects-2026/
├── docs/                         # Documentation standards and templates
│   └── documentation-standards/  # Tagging strategy, templates, style guide
├── internal-files/               # One-pagers, design docs
├── spec/                         # Agent specifications
├── staging/                      # Pre-commit staging
├── work-logs/                    # Development history
├── AGENTS.md                     # Agent context loading
├── CLAUDE.md                     # Pointer to AGENTS.md
├── LICENSE                       # MIT License (code)
├── LICENSE-DATA                  # CC-BY-4.0 (data/content)
└── README.md                     # This file
```

Source directories (`src/`, `public/`) will be added when development begins.

---

## Getting Started

```bash
# Clone
git clone https://github.com/vintagedon/webgpu-projects-2026.git
cd webgpu-projects-2026

# Install dependencies (once src/ scaffold exists)
npm install

# Development server
npm run dev

# Production build
npm run build
```

Requires a browser with WebGPU support (Chrome 113+, Edge 113+, Firefox 141+, Safari 18+).

---

## License

- **Code**: [MIT License](LICENSE)
- **Data/Content**: [CC-BY-4.0](LICENSE-DATA)

---

Last Updated: May 18, 2026 | Status: Active
