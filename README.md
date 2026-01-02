# somethinghitme2023
Personal blog updated to use markdown, and node

## Running and setup

### Installation
```bash
npm install
```

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
