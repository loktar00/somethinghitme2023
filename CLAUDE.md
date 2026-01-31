# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static site generator for a personal blog (https://somethinghitme.com). Processes Markdown articles with frontmatter metadata and generates a complete static website.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Production build (outputs to public/)
npm run dev          # Development mode with file watching
npm run serve        # Start local server at http://localhost:8080
npm test             # Run test suite (Node.js built-in test runner)
```

For development, run `npm run dev` and `npm run serve` in separate terminals.

## Architecture

### Build Pipeline (index.mjs)

The build process in `index.mjs` exports a `build()` function that:
1. Walks `src/blog/` to find all Markdown files organized by date (YYYY/MM/DD/slug/)
2. Parses YAML-like frontmatter (title, date, teaser, tags)
3. Converts Markdown to HTML using Showdown
4. Converts PNG/JPG images to WebP format using Sharp (85% quality, with smart caching)
5. Renders EJS templates with article and site data
6. Generates paginated index pages (10 articles per page)
7. Outputs static files to `public/`

### Key Directories

- `src/blog/` - Markdown articles organized by date path
- `src/templates/` - EJS templates (index.ejs for homepage, article.ejs for posts)
- `src/templates/partials/` - Reusable template components (head, header, footer, social, navigation)
- `src/siteData/` - JSON config files (author.json, main.json, projects.json)
- `test/` - Test files using Node.js test runner with JSDOM for template testing

### Frontmatter Format

```markdown
---
title: "Article Title"
date: "2024-01-15"
teaser: "Brief summary"
tags: "javascript, node"
---
```

### Special Syntax

- Gist embedding: `[gist id=12345]` embeds a GitHub gist
- Images in article directories are auto-converted to WebP and paths are updated

### Exported Functions

- `build()` - Main build function
- `processFrontMatter(content)` - Parses frontmatter from markdown content
- `pagination(articleData, articlesPerPage, siteData)` - Generates paginated index pages

## CI/CD

GitHub Actions workflow (`.github/workflows/main.yml`) runs on push/PR to main:
- Tests with Node.js 18.x
- Builds and deploys to GitHub Pages
