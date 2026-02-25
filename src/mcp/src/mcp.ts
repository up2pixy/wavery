#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import sharp from "sharp";
import {
  createWavery,
  defaultOptions,
  WaveryOptions,
  WaveryColorInfo,
} from "wavery";

const MAX_WIDTH = 1280;
const MAX_HEIGHT = 1024;

/**
 * Build a WaveryOptions object from tool input parameters.
 */
const buildWaveryOptions = (params: {
  colors?: string[];
  width?: number;
  height?: number;
  layerCount?: number;
  segmentCount?: number;
  variance?: number;
}): WaveryOptions => {
  const width = Math.min(params.width ?? defaultOptions.width, MAX_WIDTH);
  const height = Math.min(params.height ?? defaultOptions.height, MAX_HEIGHT);
  const layerCount = params.layerCount ?? defaultOptions.layerCount;
  const segmentCount = params.segmentCount ?? defaultOptions.segmentCount;
  const variance = params.variance ?? defaultOptions.variance;

  let gradientColors: WaveryColorInfo[];
  if (params.colors && params.colors.length > 0) {
    gradientColors = params.colors.map((color, index) => ({
      colorValue: color,
      position: params.colors!.length === 1 ? 0 : index / (params.colors!.length - 1),
    }));
  } else {
    gradientColors = defaultOptions.gradientColors;
  }

  return {
    width,
    height,
    segmentCount,
    layerCount,
    variance,
    strokeWidth: 0,
    strokeColor: "none",
    gradientColors,
  };
}

const colorParamDescription =
  "Array of CSS color strings for the gradient (e.g. [\"#ff0000\", \"#00ff00\", \"blue\"]). Colors are evenly distributed from top to bottom.";

const sharedParams = {
  colors: z.array(z.string()).optional().describe(colorParamDescription),
  width: z
    .number()
    .int()
    .min(1)
    .max(MAX_WIDTH)
    .optional()
    .describe(`Width of the image in pixels (1–${MAX_WIDTH}, default: ${defaultOptions.width})`),
  height: z
    .number()
    .int()
    .min(1)
    .max(MAX_HEIGHT)
    .optional()
    .describe(`Height of the image in pixels (1–${MAX_HEIGHT}, default: ${defaultOptions.height})`),
  layerCount: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe("Number of wave layers (default: 10)"),
  segmentCount: z
    .number()
    .int()
    .min(2)
    .max(100)
    .optional()
    .describe("Number of wave segments per layer — higher means smoother (default: 25)"),
  variance: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("How much each point can deviate from its grid position, 0–1 (default: 0.75)"),
};

export const getMcpServer = () => {
  
  // ── Server setup ──────────────────────────────────────────────────────────────

  const server = new McpServer({
    name: "wavery-mcp-server",
    version: "1.0.0",
  });

  // ── Tool: generate_wavery_svg ─────────────────────────────────────────────────

  server.registerTool(
    "generate_wavery_svg",
    {
      description: "Generate a wavy background and return it as an SVG markup string",
      inputSchema: sharedParams,
    },
    async (params) => {
      const options = buildWaveryOptions(params);
      const svg = createWavery(options);
      return {
        content: [{ type: "text", text: svg }],
      };
    }
  );

  // ── Tool: generate_wavery_png ─────────────────────────────────────────────────

  server.registerTool(
    "generate_wavery_png",
    {
      description: "Generate a wavy background and return it as a base64-encoded PNG image",
      inputSchema: sharedParams,
    },
    async (params) => {
      const options = buildWaveryOptions(params);
      const svg = createWavery(options);
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
      const base64 = pngBuffer.toString("base64");
      return {
        content: [
          {
            type: "image",
            data: base64,
            mimeType: "image/png",
          },
        ],
      };
    }
  );

  return server;
};

