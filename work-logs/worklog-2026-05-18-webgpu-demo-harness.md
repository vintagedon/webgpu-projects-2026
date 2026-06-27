<!--
---
title: "WebGPU Demo Harness"
description: "Built the shared WebGPU harness (core, UI controls) and a stub gradient demo proving the platform end-to-end"
author: "opencode (glm-5.2)"
date: "2026-05-18"
version: "1.0"
status: "Complete"
tags:
  - type: worklog
  - domain: [harness, gpu-compute, ui]
  - tech: [webgpu, wgsl, typescript, vite]
related_documents:
  - "[Spec 03](../spec/2026-05-18-webgpu2026-spec-03-webgpu-demo-harness.md)"
  - "[One-Pager](../internal-files/one-pager-webgpu-portfolio.md)"
---
-->

# WebGPU Demo Harness

## Summary

| Attribute | Value |
|-----------|-------|
| Status | ✅ Complete |
| Sessions | 1 |
| Artifacts | 9 modules, 1 shader, 1 stylesheet, 1 HTML entry, 3 READMEs |

Objective: Build the reusable WebGPU demo harness (device, canvas, render loop, buffers, timing, two-pane layout, metrics panel, flyout, control factories) and a stub demo proving the platform works end-to-end.

Outcome: All ten deliverables implemented. `tsc --noEmit` and `vite build` pass; `/stub/` renders an HSB-controlled gradient through the full harness with live FPS sparkline and timing, while `/` keeps the landing page with a working stub card.

---

## 1. Work Completed

| Task | Description | Result |
|------|-------------|--------|
| Core device init | `src/core/device.ts` — `initWebGPU(canvas)`, adapter-info helpers | Returns context or null; no throw on failure |
| Canvas management | `src/core/canvas.ts` — `createCanvas(container)` | ResizeObserver + DPR; `onResize` callback |
| Render loop + timing | `src/core/loop.ts`, `timing.ts` — `createRenderLoop`, `FrameTimer` | Rolling FPS, frame/compute/render timing, `start/stop/isRunning`, steps-per-frame |
| Buffer utilities | `src/core/buffers.ts` | Storage/uniform buffers, `writeUniform`, ping-pong textures with alignment |
| Two-pane layout | `src/ui/layout.ts` — `createDemoLayout` | Left identity/metrics panel + right canvas pane + gear trigger; wraps site shell |
| Metrics panel | `src/ui/metrics.ts` — `createMetricsPanel` | FPS readout + Canvas2D sparkline, render/compute bars, `setMetric`, tabular-nums |
| Flyout sidebar | `src/ui/flyout.ts` — `createFlyout` | Right-edge slide-in, click-outside/Escape close, tabs, 280px default |
| Control factories | `src/ui/controls.ts` | `createSlider`, `createToggle`, `createSegment`, `createPresetSelector`; SFX on interaction |
| Welcome modal wiring | Stub demo wires spec-02 modal to WebGPU detection | Green/ready with adapter name + Start; red/unavailable warning with browser guidance |
| Stub demo | `src/demos/stub/` — gradient via fullscreen-triangle WGSL | 3 HSB sliders in flyout, live metrics, `window.__DEMO_TEST_STATE__` |
| Multi-page build | `vite.config.ts` + `stub/index.html` entry | `/` and `/stub/` both serve (200) with shared SFX chunk |
| Landing card | Added "Harness Stub" card linking to `/stub/` | Routes correctly |

---

## 2. Files Changed

| File | Change |
|------|--------|
| [src/core/device.ts](../src/core/device.ts) | Created |
| [src/core/canvas.ts](../src/core/canvas.ts) | Created |
| [src/core/loop.ts](../src/core/loop.ts) | Created |
| [src/core/buffers.ts](../src/core/buffers.ts) | Created |
| [src/core/timing.ts](../src/core/timing.ts) | Created |
| [src/core/index.ts](../src/core/index.ts) | Created (barrel) |
| [src/ui/layout.ts](../src/ui/layout.ts) | Created |
| [src/ui/metrics.ts](../src/ui/metrics.ts) | Created |
| [src/ui/flyout.ts](../src/ui/flyout.ts) | Created |
| [src/ui/controls.ts](../src/ui/controls.ts) | Created |
| [src/assets/css/demo.css](../src/assets/css/demo.css) | Created |
| [src/assets/css/index.css](../src/assets/css/index.css) | Updated (demo.css import) |
| [src/demos/stub/index.ts](../src/demos/stub/index.ts) | Created |
| [src/demos/stub/shader.wgsl](../src/demos/stub/shader.wgsl) | Created |
| [src/demos/stub/README.md](../src/demos/stub/README.md) | Created |
| [stub/index.html](../stub/index.html) | Created (multi-page entry) |
| [vite.config.ts](../vite.config.ts) | Updated (stub entry) |
| [tsconfig.json](../tsconfig.json) | Updated (`@webgpu/types`) |
| [package.json](../package.json) | Updated (`@webgpu/types` devDep) |
| [src/vite-env.d.ts](../src/vite-env.d.ts) | Updated (`__DEMO_TEST_STATE__` global) |
| [src/pages/landing.ts](../src/pages/landing.ts) | Updated (stub card) |
| [src/core/README.md](../src/core/README.md) | Updated (implemented modules) |
| [src/ui/README.md](../src/ui/README.md) | Updated (harness components) |

---

## 3. Issues Encountered

| Issue | Resolution |
|-------|------------|
| `GPUAllowSharedBufferSource` typing rejected `Float32Array`/`Uint32Array` (TS 5.7 generic-typedarray lib vs `@webgpu/types`) | Added a `toGpuSource` cast helper in `buffers.ts`; runtime unchanged |
| Spec specified `public/stub/index.html` as the entry, but with `publicDir: false` Vite mirrors the input path, yielding `/public/stub/` instead of `/stub/` | Placed the entry at root-level `stub/index.html` following Vite's multi-page convention so the `/stub/` route resolves; documented here |
| Flyout `open` boolean collided with the `open()` method name | Renamed the state flag to `opened` |

---

## 4. Next Steps

Handoff: The harness is importable by any future demo via `src/core` and the `src/ui` factories. The stub proves device init, loop, timing, layout, metrics, flyout, controls, and modal flow.

1. GPU timestamp queries are detected but pass timing currently uses CPU `performance.now()` bracketing (allowed by the spec). Wire real `timestamp-query` resolve/readback when a compute-heavy demo needs GPU-accurate pass times.
2. The left-panel mobile collapse currently stacks vertically; refine to an icon bar or behind-toggle pass if mobile polish becomes a priority.
3. Spec 04 (first real simulation) can start by importing `src/core` and `src/ui` and replacing the gradient pipeline.

<!-- Source: opencode execution of spec/2026-05-18-webgpu2026-spec-03-webgpu-demo-harness.md, 2026-05-18 -->
