# Wavery MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that exposes the [Wavery](https://www.npmjs.com/package/wavery) library as two tools, allowing AI assistants to generate smooth wavy SVG/PNG backgrounds on demand.

Built with TypeScript and `@modelcontextprotocol/sdk`. Communicates over **stdio**.

## Tools

### `generate_wavery_svg`

Returns a wavy background as an **SVG markup string**.

### `generate_wavery_png`

Returns a wavy background as a **base64-encoded PNG image**.

## Shared Parameters

All parameters are optional — sensible defaults are applied when omitted.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `colors` | `string[]` | `["#ffff00","#ff0000","#000080"]` | CSS color strings for the gradient, distributed evenly from top to bottom. |
| `width` | `number` | `800` | Image width in pixels (max 1280). |
| `height` | `number` | `600` | Image height in pixels (max 1024). |
| `layerCount` | `number` | `10` | Number of wave layers. |
| `segmentCount` | `number` | `25` | Segments per layer — higher values produce smoother waves. |
| `variance` | `number` | `0.75` | How much each point deviates from its grid position (0–1). |

## Getting Started

### 1. Install dependencies

```bash
cd src/mcp
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Run

```bash
npm start
# or
node dist/index.js
```

The server communicates over **stdio** and is ready for any MCP-compatible client.

## Configuration

### VS Code (GitHub Copilot / Copilot Chat)

Add the following to your **VS Code** `settings.json` (user or workspace):

```jsonc
{
  "mcp": {
    "servers": {
      "wavery": {
        "type": "stdio",
        "command": "node",
        "args": ["<absolute-path-to>/src/mcp/dist/index.js"]
      }
    }
  }
}
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```jsonc
{
  "mcpServers": {
    "wavery": {
      "command": "node",
      "args": ["<absolute-path-to>/src/mcp/dist/index.js"]
    }
  }
}
```

## Example Prompts

Once connected, you can ask your AI assistant things like:

- *"Generate a wavy background with ocean colors (blue to teal) at 1024×768"*
- *"Create a sunset-themed SVG wave with colors orange, pink, and purple"*
- *"Give me a PNG wavy background with 20 layers and high variance"*

## License

[MIT](../lib/LICENSE)