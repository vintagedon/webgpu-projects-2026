<!--
---
title: "Codex Review Prompt"
description: "Staged review prompt retained from template hydration work"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: guide
  - domain: documentation
---
-->

# Template Repository Review: Pre-Hydration Evaluation

## Context

You are reviewing `D:\development-repositories\_ml01_staging\nist-crosswalk`, which is a copy of the `project-template-repository` that has been improved with new documentation patterns. This repo serves two purposes:

1. **It IS the updated project-template-repository.** The templates, guides, interior READMEs, and conventions in this repo will overwrite the current template repo and become the upstream source for all future repositories in the portfolio.

2. **It IS the first repo to be hydrated.** The `internal-files/` directory contains real source materials (one-pager, project charter, two GDR outputs) for the nistcrosswalk.com project. Once the templates are finalized, an agent will hydrate this repo using those source materials.

This dual role means you're evaluating both the template system itself and whether it's ready to be used for its first real hydration.

## What Changed

The templates in `docs/documentation-standards/` were refactored from a "structure + footnotes" pattern (template body with all guidance in a bottom comment block) to a "template + guide woven in" pattern (per-section inline guidance as HTML comments, teaching the author what to write, where to source it, and what "done" looks like).

New files were added:
- `docs/documentation-standards/project-charter-template.md` (new template)
- `docs/documentation-standards/one-pager-template.md` (new template)
- Interior READMEs for: `internal-files/`, `spec/`, `staging/`, `work-logs/`, `assets/`, `recycle/`
- `recycle/` directory with convention README

Modified files:
- `AGENTS.md`: added hydration markers (`<!-- HYDRATE:IDENTITY -->`, `<!-- HYDRATE:CONSTRAINTS -->`) and inline sourcing instructions
- `docs/documentation-standards/tagging-strategy.md`: added hydration markers (`<!-- HYDRATE:DOMAIN -->`, `<!-- HYDRATE:TECH -->`, `<!-- HYDRATE:FRAMEWORK -->`), added `charter` and `one-pager` to type tags, updated references
- All four existing templates (primary-readme, interior-readme, general-kb, worklog): refactored to template + guide woven in pattern

## Your Task

Read every file in the repo. Then evaluate:

### 1. Template + Guide Pattern Consistency

Do all templates in `docs/documentation-standards/` follow the same pattern?
- Inline HTML comment guidance above each section
- Guidance covers: what to write, where to source it, when to include/omit
- Bottom comment block (if present) is limited to cross-cutting template mechanics
- No orphaned guidance (instructions in the bottom block that should be inline)

### 2. Hydration Marker Coherence

For `AGENTS.md` and `tagging-strategy.md`:
- Are the `<!-- HYDRATE:* -->` / `<!-- /HYDRATE:* -->` markers properly paired?
- Do the sourcing instructions inside each marker point to the correct charter section?
- Is there a clear boundary between "replace this" (marked) and "keep this" (unmarked)?
- Could an agent with access to the charter and one-pager in `internal-files/` unambiguously execute the hydration for each marked section?

### 3. Interior READMEs

For each directory README (`internal-files/`, `spec/`, `staging/`, `work-logs/`, `assets/`, `recycle/`):
- Does it explain the directory's purpose clearly enough that an agent landing there orients immediately?
- Does it document the conventions that apply to that directory?
- Are the relative links in the Related section correct?
- Does it follow the interior-readme-template pattern?

### 4. Cross-File Consistency

- Do all templates reference the tagging strategy for frontmatter tags?
- Are the type tags in `tagging-strategy.md` §5 complete (do they cover every template type that exists)?
- Do the references in `tagging-strategy.md` §11 include all templates?
- Does `AGENTS.md` Documentation Conventions section reference all relevant guides?
- Are the new templates (`project-charter-template.md`, `one-pager-template.md`) referenced where they should be?

### 5. Hydration Readiness

Simulate the hydration mentally. Read the source materials in `internal-files/` (the nistcrosswalk one-pager and project charter). Then look at each file that has hydration markers or is a full-replacement template:
- Could an agent reading only the template + its inline guidance + the source materials produce project-specific content without external instructions?
- Are there sections where the guidance is too vague to produce useful output?
- Are there sections where the guidance over-specifies and would constrain the agent unnecessarily?

### 6. Gaps and Issues

- Files that exist but weren't updated and should have been
- Missing cross-references between documents
- Conventions documented in one place but not reflected in another
- Anything that would confuse an agent encountering this repo cold

## Output Format

Structure your review as:
1. **Summary verdict** (one paragraph: is this template system ready for hydration?)
2. **Issues** (specific problems with file paths and line references)
3. **Suggestions** (improvements that aren't blockers but would strengthen the system)
4. **Confirmed working** (aspects you verified are correct and consistent)

Do not rewrite any files. This is a review, not an implementation task.
