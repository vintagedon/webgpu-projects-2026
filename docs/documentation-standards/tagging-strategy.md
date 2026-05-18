<!--
---
title: "Tagging Strategy Guide"
description: "Controlled vocabulary for document classification in the WebGPU Projects repository"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
tags:
  - type: guide
  - domain: documentation
related_documents:
  - "[Primary README Template](primary-readme-template.md)"
  - "[Interior README Template](interior-readme-template.md)"
  - "[General KB Template](general-kb-template.md)"
  - "[Worklog README Template](worklog-readme-template.md)"
  - "[One-Pager Template](one-pager-template.md)"
  - "[Project Charter Template](project-charter-template.md)"
---
-->

# Tagging Strategy Guide

## 1. Purpose

This guide defines the controlled tag vocabulary for the WebGPU Projects 2026 repository. Consistent tagging enables human navigation and RAG system retrieval. All Markdown files with YAML frontmatter must use values from this vocabulary.

---

## 2. Why Controlled Vocabulary

Uncontrolled tagging leads to synonyms fragmenting search (`webgpu` vs `gpu` vs `graphics`), inconsistent granularity (`particle-sim` vs `simulation`), and tag proliferation that reduces signal. A controlled vocabulary defines allowed values upfront, ensuring consistency across contributors and time.

---

## 3. Tag Categories

Each category answers a different question about the document. Keep categories orthogonal; each captures a distinct dimension.

| Category | Question Answered | Required |
|----------|-------------------|----------|
| `type` | What kind of document is this? | Yes |
| `domain` | What subject area? | Yes |
| `status` | What's the lifecycle state? | Recommended |
| `tech` | What technologies involved? | When applicable |

---

## 4. Domain Tags

Domain tags are specific to this repository's content areas.

```yaml
domain:
  - gpu-compute         # Compute shader work: particle systems, simulations, parallel algorithms
  - rendering           # Render pipelines, shaders, colormaps, visual output
  - simulation          # Physics simulations, cellular automata, fluid dynamics, agent systems
  - ui                  # Control panels, sliders, toggles, flyouts, metrics displays
  - harness             # Shared core: device init, canvas, render loop, buffer utilities
  - portfolio           # Site-level concerns: landing page, routing, deployment, branding
  - documentation       # Templates, standards, meta-content about how we document
  - infrastructure      # Build tooling, CI/CD, Azure SWA config, dev preview setup
```

### Boundary Rules

- `gpu-compute` vs `rendering`: compute is the simulation pass (storage buffers, dispatch); rendering is the visual output pass (draw calls, fragment shaders, colormaps). A demo that does both gets the primary domain based on which aspect the document focuses on.
- `simulation` vs `gpu-compute`: simulation is the domain concept (particles, boids, fluid); gpu-compute is the implementation mechanism. Use simulation for design docs and one-pagers; use gpu-compute for shader-level technical docs.
- `harness` vs `ui`: harness is the GPU plumbing (device, buffers, render loop); ui is the control surface (sliders, panels, flyouts). They're separate modules in the codebase.
- If a document spans two domains, use the primary one. Multi-value only when genuinely split.

---

## 5. Type Tags

| Tag | Use For |
|-----|---------|
| `project-root` | Repository root README |
| `directory-readme` | Interior README for any directory |
| `worklog` | Work log entries and milestone documentation |
| `charter` | Project charter (frozen scope and architectural commitments) |
| `one-pager` | Ideation capture (portable context unit for AI handoffs) |
| `guide` | Step-by-step procedures and how-to documents |
| `reference` | Lookup information: inventories, schemas, API docs |
| `specification` | Agent specs, formal requirements, demo definitions |
| `report` | Analysis, findings, audit results, summaries |

---

## 6. Status Tags

| Tag | Description |
|-----|-------------|
| `draft` | In development, not yet complete |
| `active` | Current, maintained, approved |
| `under-review` | Scheduled or triggered review in progress |
| `deprecated` | Superseded, avoid for new work |
| `archived` | Historical reference only |

---

## 7. Tech Tags

Canonical names, lowercase, hyphenated. This list grows as the project's stack evolves.

```yaml
tech:
  - webgpu            # WebGPU API
  - wgsl              # WebGPU Shading Language
  - typescript         # TypeScript source code
  - vite              # Build tooling
  - html-css          # Markup and styling (neon UI components)
  - canvas2d          # Canvas 2D API (sparklines, preview graphs)
  - web-audio         # Web Audio API (SFX, audio-reactive demos)
  - playwright        # End-to-end testing
  - azure-swa         # Azure Static Web Apps deployment
  - threejs           # Three.js (only when a specific demo uses it)
```

---

## 8. Implementation

### Standard Frontmatter

```yaml
<!--
---
title: "Document Title"
description: "What this document covers"
author: "VintageDon (https://github.com/vintagedon/)"
date: "YYYY-MM-DD"
version: "1.0"
status: "Active"
tags:
  - type: guide
  - domain: [gpu-compute]
  - tech: [webgpu, wgsl, typescript]
related_documents:
  - "[Related Doc](path/to/doc.md)"
---
-->
```

### Conventions

- Use lowercase, hyphenated values (`gpu-compute` not `GPU Compute` or `gpucompute`)
- Tech tags use canonical names
- One value per line for readability, or array syntax for multi-value
- `related_documents` links use relative paths within the repo

---

## 9. Maintaining the Vocabulary

### Adding New Tags

1. Check if an existing tag covers the concept
2. If not, add the new tag with a boundary definition to this document
3. Backfill existing documents if the new tag applies retroactively

### Governance

- This document is the authoritative source for allowed tag values
- Prefer broader tags over proliferating specific ones
- Review additions for overlap with existing tags

---

## 10. References

| Resource | Description |
|----------|-------------|
| [Primary README Template](primary-readme-template.md) | Shows tag usage in repository root READMEs |
| [Interior README Template](interior-readme-template.md) | Shows tag usage in directory READMEs |
| [General KB Template](general-kb-template.md) | Shows tag usage for standalone docs |
| [Worklog README Template](worklog-readme-template.md) | Shows tag usage for work log entries |
| [One-Pager Template](one-pager-template.md) | Shows tag usage for ideation documents |
| [Project Charter Template](project-charter-template.md) | Shows tag usage for project charters |
