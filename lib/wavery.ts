import { computeControlPoints } from "./bezier-spline.js";
import chroma from "chroma-js";

interface Point {
  x: number;
  y: number;
}

function generatePoints(
  width: number,
  height: number,
  segmentCount: number,
  layerCount: number,
  variance: number
): Point[] {
  const cellWidth = width / segmentCount;
  const cellHeight = height / layerCount;
  const moveLimitX = cellWidth * variance * 0.5;
  const moveLimitY = cellHeight * variance;

  const points: Point[] = [];
  for (let y = cellHeight; y < height; y += cellHeight) {
    points.push({ x: 0, y: Math.floor(y) });
    for (let x = cellWidth; x < width; x += cellWidth) {
      const varietalY = y - moveLimitY / 2 + Math.random() * moveLimitY;
      const varietalX = x - moveLimitX / 2 + Math.random() * moveLimitX;
      points.push({ x: Math.floor(varietalX), y: Math.floor(varietalY) });
    }
    points.push({ x: width, y: y });
  }
  return points;
}

function generateClosedPath(
  curvePoints: Point[],
  leftCornerPoint: Point,
  rightCornerPoint: Point,
  filleColor: string,
  strokeColor: string,
  strokeWidth: number
): SVGElement {
  const xPoints = curvePoints.map((p: Point): number => p.x);
  const yPoints = curvePoints.map((p: Point): number => p.y);
  const xControlPoints = computeControlPoints(xPoints);
  const yControlPoints = computeControlPoints(yPoints);

  let path =
    `M ${leftCornerPoint.x},${leftCornerPoint.y} ` +
    `C ${leftCornerPoint.x},${leftCornerPoint.y} ` +
    `${xPoints[0]},${yPoints[0]} ` +
    `${xPoints[0]},${yPoints[0]} `;

  for (let i = 0; i < xPoints.length - 1; i++) {
    path +=
      `C ${xControlPoints.p1[i]},${yControlPoints.p1[i]} ` +
      `${xControlPoints.p2[i]},${yControlPoints.p2[i]} ` +
      `${xPoints[i + 1]},${yPoints[i + 1]} `;
  }

  path +=
    `C ${xPoints[xPoints.length - 1]},${yPoints[xPoints.length - 1]} ` +
    `${rightCornerPoint.x},${rightCornerPoint.y} ` +
    `${rightCornerPoint.x},${rightCornerPoint.y} Z`;

  const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttributeNS(null, "fill", filleColor);
  svgPath.setAttributeNS(null, "stroke", strokeColor);
  svgPath.setAttributeNS(null, "stroke-width", strokeWidth);
  svgPath.setAttributeNS(null, "d", path);

  return svgPath;
}
export interface WaveryOption {
  width: number;
  height: number;
  segmentCount: number;
  layerCount: number;
  variance: number;
  strokeWidth: number;
  strokeColor: string;
  gradientColors: WaveryColorInfo[];
}

export interface WaveryColorInfo {
  colorValue: string;
  position: number;
}

const defaultOptions: WaveryOption = {
  width: 800,
  height: 600,
  segmentCount: 20,
  layerCount: 10,
  variance: 0.75,
  strokeWidth: 0,
  strokeColor: "none",
  gradientColors: [
    {
      colorValue: "yellow",
      position: 0
    },
    {
      colorValue: "red",
      position: 0.5
    },
    {
      colorValue: "navy",
      position: 1
    }
  ]
};

export default class Wavery {
  constructor(options: WaveryOption) {
    this.options = { ...defaultOptions, ...options };
    this.points = generatePoints(
      this.options.width,
      this.options.height,
      this.options.segmentCount,
      this.options.layerCount,
      this.options.variance
    );
  }

  generateSvg(): SVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.options.width);
    svg.setAttribute("height", this.options.height);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const colorScale = chroma
      .scale(this.options.gradientColors.map(c => c.colorValue))
      .domain(this.options.gradientColors.map(c => c.position * (this.points.length - this.options.segmentCount - 1)));
    for (let i = 0, j = this.points.length; i < j; i += this.options.segmentCount + 1) {
      const pointsPerLayer = this.points.slice(i, i + this.options.segmentCount + 1);
      svg.appendChild(
        generateClosedPath(
          pointsPerLayer,
          { x: 0, y: this.options.height },
          { x: this.options.width, y: this.options.height },
          colorScale(i),
          this.options.strokeColor,
          this.options.strokeWidth
        )
      );
    }
    return svg;
  }
}
