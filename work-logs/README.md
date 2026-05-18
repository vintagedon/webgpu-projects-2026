<!--
---
title: "Work Logs"
description: "Development history for WebGPU portfolio work"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: directory-readme
  - domain: documentation
---
-->

# Work Logs

Work logs record completed repository work: what changed, which files were touched, what issues appeared, and what remains ready for follow-on work. They pair with specs by recording the actual result of each execution session.

---

## 1. Contents

```
work-logs/
├── README-pending.md                       # Placeholder marker ignored by git
├── worklog-YYYY-MM-DD.md                   # Single-day entries
├── worklog-YYYY-MM-DD-brief-topic.md       # Topic-specific entries
└── README.md                               # This file
```

---

## 2. Files

| File | Description | Status |
|------|-------------|--------|
| [README-pending.md](README-pending.md) | Placeholder marker from scaffold setup; ignored by the `*-pending.md` glob | Planned |

---

## 4. Related

| Document | Relationship |
|----------|--------------|
| [Repository Root](../README.md) | Parent directory |
| [Worklog Template](../docs/documentation-standards/worklog-readme-template.md) | Template for work log entries |

---

## 5. Conventions

Use date-primary names by default: `worklog-YYYY-MM-DD.md` or `worklog-YYYY-MM-DD-brief-topic.md` when multiple logs share a date.

Follow the worklog template in [docs/documentation-standards/worklog-readme-template.md](../docs/documentation-standards/worklog-readme-template.md).

Related entries can be gathered into milestone directories when patterns emerge. Do not pre-create milestone directory structures.

Agent-generated work logs follow the same format. Include the agent name in the author field and add source context in an HTML comment at the bottom when useful.
