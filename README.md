# somethinghitme2023
Personal blog updated to use markdown, and node

[![Build & Deploy](https://github.com/anthonydgrant/somethinghitme2023/actions/workflows/main.yml/badge.svg)](https://github.com/anthonydgrant/somethinghitme2023/actions/workflows/main.yml)
[![Tests](https://github.com/anthonydgrant/somethinghitme2023/actions/workflows/tests.yml/badge.svg)](https://github.com/anthonydgrant/somethinghitme2023/actions/workflows/tests.yml)

## Running and setup

### Installation
```bash
npm install
```

### Testing
Run the test suite to verify functionality:
```bash
npm test
```

Tests include:
- **Frontmatter parsing** - Validates markdown frontmatter processing with error handling
- **Pagination logic** - Tests article pagination with edge cases
- **Tag processing** - Tests tag parsing, slug generation, and tag index building
- **Tag cloud** - Tests tag cloud rendering and font-size scaling
- **Tag pages** - Tests tag page generation and pagination
- **Template rendering** - Integration tests for EJS templates with partials

Tests run automatically in CI/CD pipeline:
- **On push to main** - Tests run as part of the build & deploy workflow
- **On pull requests** - Tests run to validate code quality before merging

### Development
For development with automatic rebuilding when files change:
```bash
npm run dev
```

This will watch for changes in source files and automatically rebuild the site.

### Serving the site
To serve the built static site locally:
```bash
npm run serve
```

The site will be available at `http://localhost:8080`.

### Development workflow
For full development workflow (rebuild on changes + serve locally), run these commands in separate terminals:
```bash
npm run dev      # Terminal 1: Watch and rebuild
npm run serve    # Terminal 2: Serve the site
```

Or use the convenience script:
```bash
npm run dev:serve
```

### Production build
To build for production:
```bash
npm run build
```

Static content will be generated in the `public` directory which can be deployed.

Site located at https://somethinghitme.com
