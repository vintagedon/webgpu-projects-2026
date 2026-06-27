<!--
---
title: "Stub Demo"
description: "Minimal WebGPU demo proving the shared harness end-to-end with an animated gradient"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: directory-readme
  - domain: [harness, gpu-compute]
  - tech: [webgpu, wgsl, typescript]
---
-->

# Stub Demo

A minimal demo proving the WebGPU harness works end-to-end: device init, two-pane layout, neon controls, live telemetry, and the welcome modal. It renders an animated HSB-controlled gradient through the full pipeline. No simulation logic lives here.

## 1. Contents

```
stub/
├── index.ts        # Demo entry: layout, WebGPU init, controls, render loop
├── shader.wgsl     # Fullscreen-triangle gradient shader (HSB → RGB)
└── README.md       # This file
```

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [index.ts](index.ts) | Demo wiring and render loop | ✅ Active |
| [shader.wgsl](shader.wgsl) | Vertex + fragment gradient shader | ✅ Active |

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Core Harness](../../core/README.md) | Device, canvas, loop, timing |
| [UI Toolkit](../../ui/README.md) | Layout, metrics, flyout, controls |