# Wavery

Generate smooth wavy SVG backgrounds with customizable colors and patterns.

## Project Structure

This monorepo contains two packages:

```
src/
├── lib/         # Core library for generating wavy SVG backgrounds
│   ├── src/     # Library source code
│   ├── test/    # Test HTML page
│   └── dist/    # Library build output
└── app/         # React app with MUI
└── dist/        # React app build output
```

## Packages

### Wavery Library (`src/lib`)

The core library that provides functions to generate wavy SVG backgrounds programmatically.

### Wavery App (`src/app`)

A React web application built with Material-UI (MUI) that provides a visual interface for generating wavy backgrounds. Features include:

- **Interactive Canvas** - Live preview of generated wave backgrounds
- **Control Panel** - Adjust dimensions, wave settings, stroke, and gradient colors
- **Export Options** - Download as SVG or PNG
- **Real-time Updates** - See changes instantly as you adjust settings

#### Running the App

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Wavery Library

### Installation

```bash
npm install wavery
```

### Usage

#### Browser (UMD)

```html
<div id="svg"></div>
<script src="node_modules/wavery/dist/wavery.js"></script>
<script>
  // Create SVG element
  var svg = Wavery.createWavery({
    width: 800,
    height: 600,
    segmentCount: 30,
    layerCount: 10,
    variance: 0.75,
    strokeWidth: 0,
    strokeColor: "none",
    gradientColors: [
      { colorValue: "yellow", position: 0 },
      { colorValue: "green", position: 0.5 },
      { colorValue: "navy", position: 1 }
    ]
  });
  document.getElementById("svg").appendChild(svg);

  // Or create a base64 data URL
  var dataUrl = Wavery.createWaveryDataURL({
    width: 800,
    height: 600,
    segmentCount: 30,
    layerCount: 10,
    gradientColors: [
      { colorValue: "pink", position: 0 },
      { colorValue: "red", position: 0.5 },
      { colorValue: "yellow", position: 1 }
    ]
  });
  var img = document.createElement("img");
  img.src = dataUrl;
  document.body.appendChild(img);
</script>
```

### ES Modules

```javascript
import { createWavery, createWaveryDataURL } from 'wavery';

// Create SVG element
const svg = createWavery({
  width: 800,
  height: 600,
  segmentCount: 30,
  layerCount: 10,
  variance: 0.75,
  gradientColors: [
    { colorValue: "yellow", position: 0 },
    { colorValue: "green", position: 0.5 },
    { colorValue: "navy", position: 1 }
  ]
});
document.body.appendChild(svg);

// Or create a base64 data URL for use in CSS or img tags
const dataUrl = createWaveryDataURL({
  width: 800,
  height: 600,
  layerCount: 10,
  gradientColors: [
    { colorValue: "pink", position: 0 },
    { colorValue: "red", position: 0.5 },
    { colorValue: "yellow", position: 1 }
  ]
});
document.body.style.backgroundImage = `url(${dataUrl})`;
```

## API

### `createWavery(options?)`

Creates and returns an SVG element with wavy background.

#### Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | `800` | Width of the SVG |
| `height` | `number` | `600` | Height of the SVG |
| `segmentCount` | `number` | `20` | Number of horizontal segments |
| `layerCount` | `number` | `10` | Number of wave layers |
| `variance` | `number` | `0.75` | Randomness of wave points (0-1) |
| `strokeWidth` | `number` | `0` | Stroke width of wave paths |
| `strokeColor` | `string` | `"none"` | Stroke color of wave paths |
| `gradientColors` | `GradientColor[]` | See below | Array of gradient color stops |

#### Returns

`SVGElement` - The generated SVG element

---

### `createWaveryDataURL(options?)`

Creates a wavy SVG and returns it as a base64-encoded data URL. Useful for CSS backgrounds or `<img>` elements.

#### Parameters

Same options as `createWavery()`.

#### Returns

`string` - A base64 data URL (e.g., `data:image/svg+xml;base64,...`)

---

### Default Gradient Colors

```javascript
[
  { colorValue: "yellow", position: 0 },
  { colorValue: "red", position: 0.5 },
  { colorValue: "navy", position: 1 }
]
```

### GradientColor Type

```typescript
interface GradientColor {
  colorValue: string;  // Any valid CSS color
  position: number;    // Position in gradient (0-1)
}
```

## Examples

### Sunset Theme

```javascript
const svg = createWavery({
  width: 1200,
  height: 400,
  layerCount: 8,
  gradientColors: [
    { colorValue: "#ff7e5f", position: 0 },
    { colorValue: "#feb47b", position: 0.5 },
    { colorValue: "#86a8e7", position: 1 }
  ]
});
```

### Ocean Theme

```javascript
const svg = createWavery({
  width: 1200,
  height: 400,
  layerCount: 12,
  variance: 0.5,
  gradientColors: [
    { colorValue: "#667db6", position: 0 },
    { colorValue: "#0082c8", position: 0.5 },
    { colorValue: "#0082c8", position: 0.7 },
    { colorValue: "#005aa7", position: 1 }
  ]
});
```

### CSS Background

```javascript
const dataUrl = createWaveryDataURL({
  width: 1920,
  height: 1080,
  layerCount: 15,
  gradientColors: [
    { colorValue: "#ee9ca7", position: 0 },
    { colorValue: "#ffdde1", position: 1 }
  ]
});

document.body.style.backgroundImage = `url(${dataUrl})`;
document.body.style.backgroundSize = 'cover';
```

## Development

### Building the Library

```bash
cd src/lib
npm install
npm run build
```

### Building the App

```bash
npm install
npm run build
```

### Development Mode (App)

```bash
npm start
```

## Showcase
<img width="1345" height="768" alt="image" src="https://github.com/user-attachments/assets/327f9be1-977d-4f40-8f0b-b84a22c55f84" />


## Acknowledgements
This project is inspired by and built upon the work of others:

- **[Trianglify](https://github.com/qrohlf/trianglify)** - A library for generating colorful triangle meshes that served as inspiration for this project's approach to generative backgrounds.
- **[Bezier Splines](http://www.particleincell.com/2012/bezier-splines)** - The algorithm for computing smooth bezier curve control points used to create the wave paths.
