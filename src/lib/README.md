# Wavery

Generate smooth wavy SVG backgrounds with customizable colors, layers, and variance.

## Installation

```bash
npm install wavery
```

## Usage

### ES Module / TypeScript

```typescript
import { createWavery, createWaveryDataURL, WaveryOptions } from "wavery";

const options: WaveryOptions = {
  width: 800,
  height: 600,
  segmentCount: 20,
  layerCount: 10,
  variance: 0.75,
  strokeWidth: 0,
  strokeColor: "none",
  gradientColors: [
    { colorValue: "#ffff00", position: 0 },
    { colorValue: "#ff0000", position: 0.5 },
    { colorValue: "#000080", position: 1 },
  ],
};

// Get raw SVG markup
const svgString = createWavery(options);

// Get a data URL (useful for CSS backgrounds or <img> src)
const dataURL = createWaveryDataURL(options);
```

### Browser (UMD)

Include the script from a CDN or local build, then use the global `Wavery` object:

```html
<script src="https://unpkg.com/wavery/lib/wavery.js"></script>
<script>
  const svg = Wavery.createWavery({
    width: 800,
    height: 600,
    segmentCount: 20,
    layerCount: 10,
    variance: 0.75,
    strokeWidth: 0,
    strokeColor: "none",
    gradientColors: [
      { colorValue: "yellow", position: 0 },
      { colorValue: "green", position: 0.5 },
      { colorValue: "navy", position: 1 },
    ],
  });

  document.body.innerHTML = svg;
</script>
```

### As a CSS Background

```typescript
const dataURL = Wavery.createWaveryDataURL(options);
document.body.style.backgroundImage = `url("${dataURL}")`;
```

## API

### `createWavery(options: WaveryOptions): string`

Returns an SVG string containing the wavy background.

### `createWaveryDataURL(options: WaveryOptions): string`

Returns a `data:image/svg+xml` data URL of the generated SVG—handy for setting `background-image` in CSS or the `src` attribute of an `<img>` element.

### `defaultOptions`

A `WaveryOptions` object with sensible defaults you can spread and override:

```typescript
import { defaultOptions, createWavery } from "wavery";

const svg = createWavery({
  ...defaultOptions,
  layerCount: 5,
  gradientColors: [
    { colorValue: "#0077b6", position: 0 },
    { colorValue: "#90e0ef", position: 1 },
  ],
});
```

## Options

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | `800` | Width of the SVG in pixels. |
| `height` | `number` | `600` | Height of the SVG in pixels. |
| `segmentCount` | `number` | `20` | Number of wave segments per layer. Higher values produce smoother waves. |
| `layerCount` | `number` | `10` | Number of wave layers stacked from top to bottom. |
| `variance` | `number` | `0.75` | How much each wave point can deviate from its grid position (0–1). |
| `strokeWidth` | `number` | `0` | Stroke width for wave paths. |
| `strokeColor` | `string` | `"#000000"` | Stroke color for wave paths. |
| `gradientColors` | `WaveryColorInfo[]` | *(yellow → red → navy)* | Array of color stops that define the gradient across layers. |

### `WaveryColorInfo`

| Property | Type | Description |
| --- | --- | --- |
| `colorValue` | `string` | Any valid CSS color string (hex, named, rgb, etc.). |
| `position` | `number` | Position in the gradient from `0` (top) to `1` (bottom). |

## License

[MIT](./LICENSE)
