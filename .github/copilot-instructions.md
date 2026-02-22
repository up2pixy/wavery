# Copilot Instructions for Wavery Project

## Project Overview

This is a monorepo containing two TypeScript packages for generating smooth wavy SVG backgrounds:

- **Wavery Library** (`src/lib/`): Core library that provides functions to generate wavy SVG backgrounds
- **Wavery App** (`src/app/`): React web application with Material-UI for visual background generation

## Project Structure

```
.
├── src/
│   ├── lib/                    # Core library
│   │   ├── src/               # Library source code
│   │   │   ├── wavery.ts      # Main library entry point
│   │   │   ├── types.ts       # TypeScript type definitions
│   │   │   └── bezier-spline.js # Spline calculation utilities
│   │   ├── test/              # Test HTML page for library
│   │   ├── package.json       # Library dependencies
│   │   ├── tsconfig.json      # Library TypeScript config
│   │   └── webpack.config.js  # Library build config (UMD)
│   └── app/                   # React web application
│       ├── App.tsx            # Main React component
│       ├── components/        # React components
│       ├── index.tsx          # App entry point
│       ├── index.html         # HTML template
│       └── dist/              # App build output
├── package.json               # App package config (for app)
├── tsconfig.json              # App TypeScript config
├── webpack.config.js          # App webpack config (for app)
└── dist/                      # App build output (app)
```

## Build Instructions

### Building the Wavery App (Root Level)

The root-level commands build the React web application:

```bash
# Install dependencies
npm install

# Production build (outputs to ./dist/)
npm run build

# Development build
npm run build:dev

# Development server (opens at http://localhost:3000)
npm start

# Watch mode for development
npm run watch
```

### Building the Wavery Library

The library has its own build process:

```bash
# Navigate to library directory
cd src/lib

# Install library dependencies
npm install

# Production build (outputs to src/lib/dist/)
npm run build

# Development build
npm run build:dev

# Watch mode
npm run watch
```

## Development Workflow

### Working on the React App

1. **Start the development server:**
   ```bash
   npm start
   ```
   This will open the app at `http://localhost:3000` with hot reloading enabled.

2. **Make changes** to files in `src/app/`:
   - `App.tsx` - Main application component
   - `components/` - UI components
   - `index.tsx` - Entry point

3. **The app will automatically reload** when you save changes.

### Working on the Library

1. **Build the library in watch mode:**
   ```bash
   cd src/lib
   npm run watch
   ```

2. **Test the library** by opening `src/lib/test/index.html` in a browser.

3. **Make changes** to files in `src/lib/src/`:
   - `wavery.ts` - Main library code
   - `types.ts` - Type definitions
   - `bezier-spline.js` - Utility functions

### Working on Both Simultaneously

To work on both the library and app at the same time:

1. **Terminal 1** - Library watch mode:
   ```bash
   cd src/lib
   npm run watch
   ```

2. **Terminal 2** - App development server:
   ```bash
   npm start
   ```

## Testing

⚠️ **Note:** This project currently does not have formal unit tests or a testing framework.

### Manual Testing

**For the Library:**
- Open `src/lib/test/index.html` in a web browser
- Verify SVG generation works correctly
- Test different parameter combinations

**For the App:**
- Run `npm start` to launch the development server
- Test the UI controls and interactions
- Verify SVG export functionality
- Test PNG download feature
- Verify real-time preview updates

## Common Commands

### Checking Build Status

```bash
# Check if the app builds successfully
npm run build

# Check if the library builds successfully
cd src/lib && npm run build
```

### Cleaning Build Artifacts

The build output directories are automatically cleaned by webpack:
- App output: `./dist/` (cleaned on each build)
- Library output: `src/lib/dist/` (cleaned on each build)

To manually remove build artifacts:
```bash
# Remove all node_modules and dist directories
rm -rf node_modules dist src/lib/node_modules src/lib/dist
```

### Installing Dependencies

```bash
# Install app dependencies (for the app)
npm install

# Install library dependencies
cd src/lib && npm install
```

## TypeScript Configuration

- **App** (`tsconfig.json`): Configured for React with JSX support
- **Library** (`src/lib/tsconfig.json`): Configured for ES2020 with DOM types
- Both use strict mode and generate source maps

## Webpack Configuration

- **App** (`webpack.config.js`): 
  - Entry: `src/app/index.tsx`
  - Output: `dist/waveryapp.js`
  - Dev server on port 3000
  - Uses HtmlWebpackPlugin

- **Library** (`src/lib/webpack.config.js`):
  - Entry: `src/wavery.ts`
  - Output: `dist/wavery.js` (UMD format)
  - Library name: `Wavery`
  - No external dependencies bundled

## Dependencies

### App Dependencies
- React 18 with React DOM
- Material-UI (MUI) v5 for UI components
- Emotion for styling
- chroma-js for color manipulation

### Library Dependencies
- chroma-js for color operations
- TypeScript for type safety

### Dev Dependencies
- TypeScript compiler
- Webpack with ts-loader
- webpack-dev-server for development

## Troubleshooting

### Build Failures

**Issue:** TypeScript compilation errors
- **Solution:** Check `tsconfig.json` settings and ensure all TypeScript files have proper type annotations

**Issue:** Webpack build fails
- **Solution:** Verify `webpack.config.js` is correct and all loaders are installed

**Issue:** Dependencies not found
- **Solution:** Run `npm install` in the appropriate directory (root for app, `src/lib` for library)

### Development Server Issues

**Issue:** Port 3000 already in use
- **Solution:** Either stop the process using port 3000 or change the port in `webpack.config.js` devServer configuration

**Issue:** Hot reload not working
- **Solution:** Check that webpack-dev-server is running and files are being saved in the `src/app/` directory

### Library Testing Issues

**Issue:** Changes to library not reflected in app
- **Solution:** 
  1. Rebuild the library: `cd src/lib && npm run build`
  2. Restart the app development server
  3. Consider using watch mode for continuous builds

## Best Practices

1. **Always build both packages** when making changes that affect both library and app
2. **Test in a browser** since this is a visual component library
3. **Verify the generated SVGs** look correct and have proper gradient colors
4. **Check console for errors** when testing in the browser
5. **Use TypeScript strictly** - don't use `any` types unless absolutely necessary
6. **Keep the library and app separate** - library should have no React dependencies

## Git Workflow

- Build artifacts in `dist/` directories are ignored via `.gitignore`
- `node_modules/` are ignored
- Only commit source files in `src/` directories
- The library's test HTML file (`src/lib/test/index.html`) is committed for manual testing

## When Modifying This Project

1. **Understand the scope**: Is it a library change, app change, or both?
2. **Install dependencies** if not already done
3. **Make minimal changes** to achieve the goal
4. **Build and test** both library and app if both are affected
5. **Verify in browser** that everything works correctly
6. **Do not add test infrastructure** unless explicitly requested (keep changes minimal)
