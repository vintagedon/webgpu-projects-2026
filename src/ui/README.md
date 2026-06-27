<!--
---
title: "UI Toolkit"
description: "Vanilla TypeScript UI components for the neon portfolio shell"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: directory-readme
  - domain: ui
  - tech: [typescript, html-css, web-audio]
---
-->

# UI Toolkit

Vanilla TypeScript UI modules for the shared site shell, SFX manager, tooltip and glossary system, welcome modal, and the WebGPU demo harness (two-pane layout, metrics panel, flyout, and neon control factories).

## 1. Contents

```
ui/
├── siteShell.ts     # Site shell + footer
├── modal.ts         # Welcome modal component
├── tooltip.ts       # Tooltip system
├── glossary.ts      # Term-definition tooltips
├── sfx.ts           # Web Audio SFX manager
├── layout.ts        # Two-pane demo layout (left panel + canvas + gear)
├── metrics.ts       # Metrics panel: FPS sparkline + timing bars
├── flyout.ts        # Settings flyout with tabs
├── controls.ts      # Neon slider/toggle/segment/preset factories
└── README.md        # This file
```

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [siteShell.ts](siteShell.ts) | Shell + footer (spec 02) | ✅ Active |
| [modal.ts](modal.ts) | Welcome modal (spec 02) | ✅ Active |
| [tooltip.ts](tooltip.ts) | Tooltip system (spec 02) | ✅ Active |
| [glossary.ts](glossary.ts) | Glossary tooltips (spec 02) | ✅ Active |
| [sfx.ts](sfx.ts) | SFX manager (spec 02) | ✅ Active |
| [layout.ts](layout.ts) | `createDemoLayout` two-pane shell | ✅ Active |
| [metrics.ts](metrics.ts) | `createMetricsPanel` telemetry surface | ✅ Active |
| [flyout.ts](flyout.ts) | `createFlyout` settings sidebar | ✅ Active |
| [controls.ts](controls.ts) | Slider/toggle/segment/preset factories | ✅ Active |

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Core Harness](../core/README.md) | Provides `FrameStats` consumed by the metrics panel |
