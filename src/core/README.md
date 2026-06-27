<!--
---
title: "Core Harness"
description: "Planned shared WebGPU device, canvas, timing, and buffer harness"
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
├── loop.ts       # requestAnimationFrame loop with steps-per-frame config
├── buffers.ts    # Storage/uniform buffer + ping-pong texture helpers
├── timing.ts     # FrameTimer: rolling FPS, frame time, per-pass CPU timing
├── index.ts      # Barrel re-export of all harness modules
└── README.md     # This file
```

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [device.ts](device.ts) | `initWebGPU(canvas)` plus adapter-info helpers | ✅ Active |
| [canvas.ts](canvas.ts) | `createCanvas(container)` with resize callbacks | ✅ Active |
| [loop.ts](loop.ts) | `createRenderLoop({ onFrame, onStats })` | ✅ Active |
| [buffers.ts](buffers.ts) | Buffer/texture utilities with WGSL alignment | ✅ Active |
| [timing.ts](timing.ts) | `FrameTimer` feeding `onStats` | ✅ Active |
| [index.ts](index.ts) | Barrel export | ✅ Active |

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Demos](../demos/README.md) | Consumers of the harness |
| [UI Toolkit](../ui/README.md) | Metrics panel and controls that read timing |
