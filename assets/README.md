<!--
---
title: "Assets"
description: "Visual and audio assets for the WebGPU portfolio site"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: directory-readme
  - domain: [portfolio, ui]
---
-->

# Assets

Assets for the WebGPU Projects 2026 portfolio site. This directory holds repository graphics, demo screenshots, architecture images, the neon UI source pack, and the Tiny UI SFX pack used by the shared browser UI.

---

## 1. Contents

```
assets/
├── neon-ui-mega-bundle/       # Source HTML/CSS components for neon controls
├── tiny-ui-sfx-pack/          # UI interaction sound effects and source files
├── background-section-infographic.jpg # Documentation and portfolio background image
├── repo-banner.jpg            # Repository banner image
└── README.md                  # This file
```

---

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [repo-banner.jpg](repo-banner.jpg) | Repository banner for README and profile surfaces | Active |
| [background-section-infographic.jpg](background-section-infographic.jpg) | Background image for portfolio or documentation sections | Active |

---

## 3. Subdirectories

| Directory | Description |
|-----------|-------------|
| [neon-ui-mega-bundle/](neon-ui-mega-bundle/) | HTML/CSS asset pack used as the visual source for controls, panels, sliders, toggles, and icons |
| [tiny-ui-sfx-pack/](tiny-ui-sfx-pack/README.md) | Sound effect source files, exports, and usage notes for UI feedback |

---

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Repository Root](../README.md) | Parent project overview |
| [One-Pager](../internal-files/one-pager-webgpu-portfolio.md) | Defines how the asset packs support the shared UI |

---

## 5. Conventions

Use descriptive, lowercase, hyphenated filenames for project-created assets: `particles-screenshot.png`, `harness-diagram.svg`, `demo-gallery-thumbnail.jpg`.

Prefer SVG for diagrams and icons, PNG or JPG for screenshots and rendered portfolio images, and WAV or compressed browser-ready audio for sound effects. Keep original third-party pack filenames intact unless a file is copied into a project-specific output directory.

Link assets from Markdown with relative paths: `![Alt text](assets/filename.png)` from the repository root or `![Alt text](../assets/filename.png)` from a subdirectory.
