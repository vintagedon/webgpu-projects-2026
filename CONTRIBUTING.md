<!--
---
title: "Contributing"
description: "Contribution workflow and documentation standards for WebGPU Projects 2026"
author: "VintageDon (https://github.com/vintagedon/)"
date: "2026-05-18"
version: "1.0"
status: "Active"
tags:
  - type: guide
  - domain: documentation
related_documents:
  - "[Documentation Standards](docs/documentation-standards/README.md)"
  - "[Agent Instructions](AGENTS.md)"
---
-->

# Contributing

These guidelines keep WebGPU Projects 2026 contributions consistent with the repository's raw WebGPU architecture, static deployment target, and documentation standards.

## How Can I Contribute?

### Reporting Bugs

- Check existing issues first to avoid duplicates.
- Open a new issue with a clear title, detailed description, browser version, operating system, and reproduction steps.

### Suggesting Enhancements

- Open a new issue with a clear title and detailed description.
- Explain which demo, harness module, UI component, or documentation area the enhancement affects.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. Keep compute and rendering demos on raw WebGPU and WGSL unless a demo spec explicitly permits a 3D scene graph library.
3. Include YAML frontmatter on any new Markdown files (see `docs/documentation-standards/tagging-strategy.md`).
4. Add interior READMEs to any new directories.
5. Use the appropriate script header template for new scripts.
6. Write clear commit messages (present tense, imperative mood, 72-char first line).
7. Update relevant documentation if your change affects it.
8. Expose `window.__DEMO_TEST_STATE__` for new browser demos so Playwright smoke tests can inspect state.
9. Submit your pull request with a clear description of the changes and validation performed.

## Documentation Standards

This project uses RAG-optimized documentation with YAML frontmatter. Before contributing documentation, review:

- [Tagging Strategy](docs/documentation-standards/tagging-strategy.md): controlled vocabulary for tags
- [Code Commenting](docs/documentation-standards/code-commenting-dual-audience.md): dual-audience commenting for humans and AI agents
- [Writing Style Guide](docs/documentation-standards/writing-style-guide.md): prose rules for project documentation
- Template selection guide in [Documentation Standards README](docs/documentation-standards/README.md)

## Style Guidelines

- Follow existing patterns and match the style of surrounding files.
- Keep documentation lean. Do not pad sections for completeness.
- Use semantic numbering and preserve gaps if sections are omitted
- Use project tags from the controlled vocabulary.
- Keep Markdown links relative inside the repository.

## Questions?

Open an issue with your question, or reach out via the contact information in [SECURITY.md](SECURITY.md).
