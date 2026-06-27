<!--
---
title: "Core Harness"
description: "Shared WebGPU device, canvas, render loop, timing, and buffer harness"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: directory-readme
  - domain: harness
  - tech: [webgpu, typescript]
---
-->

# Core Harness

Shared WebGPU harness imported by every demo: device initialization, canvas management, render loop, buffer utilities, and timing instrumentation.

## 1. Contents

```
core/
├── device.ts     # Adapter/device acquisition, canvas context config, adapter info
├── canvas.ts     # Canvas element factory with ResizeObserver and DPR handling
├── loop.ts       # requestAnimationFrame loop: N compute steps + 1 render per frame
├── buffers.ts    # Storage/uniform buffer + ping-pong texture helpers (documented contracts)
├── timing.ts     # FrameTimer: rolling FPS, frame time, per-pass CPU timing
├── index.ts      # Barrel re-export of all harness modules
└── README.md     # This file
```

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [device.ts](device.ts) | `initWebGPU(canvas)` plus adapter-info helpers | ✅ Active |
| [canvas.ts](canvas.ts) | `createCanvas(container)` with resize callbacks | ✅ Active |
| [loop.ts](loop.ts) | `createRenderLoop({ onStep, onFrame, onStats })`; steps-per-frame | ✅ Active |
| [buffers.ts](buffers.ts) | Buffer/texture utilities with WGSL alignment and contracts | ✅ Active |
| [timing.ts](timing.ts) | `FrameTimer` feeding `onStats` (CPU pass timing) | ✅ Active |
| [index.ts](index.ts) | Barrel export | ✅ Active |

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Demos](../demos/README.md) | Consumers of the harness |
| [UI Toolkit](../ui/README.md) | Metrics panel and controls that read timing |

---

## 5. Helper Contracts

These two helpers carry implicit contracts every consumer must match. They are
frozen here so a demo's WGSL, bind-group layouts, and uniform packing line up
with the harness without trial and error.

### `createPingPongTextures(device, width, height, format, bindGroupLayout)`

Two storage textures for read/write feedback (reaction-diffusion, fluid, CA).

- **Required `bindGroupLayout` (caller-supplied):** binding `0` = read-only
  texture view (`@binding(0) var t: texture_*`), binding `1` = write storage
  texture (`@binding(1) var t: texture_storage_2d<...>`).
- **Texture usage:** both textures are created with
  `STORAGE_BINDING | TEXTURE_BINDING | COPY_SRC`, so either side can be read or
  written on a given pass.
- **Returned shape:** `{ textures, views, bindGroups, current, swap(), destroy() }`.
  `bindGroups[0]` reads view 0 / writes view 1; `bindGroups[1]` the reverse. Each
  compute pass binds `bindGroups[current]`, then `swap()` flips for the next pass.

```ts
const pp = createPingPongTextures(device, w, h, format, layout);
// pass: encoder => bind pp.bindGroups[pp.current], dispatch, then pp.swap()
```

### Uniform alignment

- **`createUniformBuffer(device, size)`** rounds `size` up to **16 bytes** — the
  WGSL uniform-address-space member alignment floor, sufficient for any
  single-bind UBO. It does **not** pad to 256.
- **`UNIFORM_ALIGN` (256)** governs **dynamic binding offsets** and
  **sub-allocated regions** carved out of one large uniform buffer, not the size
  of a standalone UBO. Use `alignTo` for that math:

```ts
const offset = alignTo(index * stride, UNIFORM_ALIGN); // dynamic-offset packing
```
