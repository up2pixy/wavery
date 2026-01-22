import chroma from "chroma-js";
// @ts-ignore
import { computeControlPoints } from "./bezier-spline";
import { Point, WaveryOptions } from "./types";

const svgns = "http://www.w3.org/2000/svg";

export const defaultOptions: WaveryOptions = {
  width: 800,
  height: 600,
  segmentCount: 20,
  layerCount: 10,
  variance: 0.75,
  strokeWidth: 0,
  strokeColor: "#000000",
  gradientColors: [
    {
      colorValue: "#ffff00",
      position: 0
    },
    {
      colorValue: "#ff0000",
      position: 0.5
    },
    {
      colorValue: "#000080",
      position: 1
    }
  ]
};

const generatePoints = (
  width: number,
  height: number,
  segmentCount: number,
  layerCount: number,
  variance: number
): Point[][] =>{
  const cellWidth = width / segmentCount;
  const cellHeight = height / layerCount;
  const moveLimitX = cellWidth * variance * 0.5;
  const moveLimitY = cellHeight * variance;

  const points: Point[][] = [];
  for (let y = cellHeight; y < height; y += cellHeight) {
    const pointsPerLayer: Point[] = [];
    pointsPerLayer.push({ x: 0, y: Math.floor(y) });
    for (let x = cellWidth; x < width; x += cellWidth) {
      const varietalY = y - moveLimitY / 2 + Math.random() * moveLimitY;
      const varietalX = x - moveLimitX / 2 + Math.random() * moveLimitX;
      pointsPerLayer.push({ x: Math.floor(varietalX), y: Math.floor(varietalY) });
    }
    pointsPerLayer.push({ x: width, y: Math.floor(y) });
    points.push(pointsPerLayer);
  }
  return points; 
}

const generateClosedPath = (
  curvePoints: Point[],
  leftCornerPoint: Point,
  rightCornerPoint: Point,
  filleColor: string,
  strokeColor: string,
  strokeWidth: number
): SVGElement => {
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

  const svgPath = document.createElementNS(svgns, "path");
  svgPath.setAttributeNS(null, "fill", filleColor);
  svgPath.setAttributeNS(null, "stroke", strokeColor);
  svgPath.setAttributeNS(null, "stroke-width", strokeWidth.toString());
  svgPath.setAttributeNS(null, "d", path);

  return svgPath;
}

export const createWavery = (options: WaveryOptions): SVGElement => {
  const optionsWithDefaults = { ...defaultOptions, ...options };
  const points = generatePoints(
    optionsWithDefaults.width,
    optionsWithDefaults.height,
    optionsWithDefaults.segmentCount,
    optionsWithDefaults.layerCount,
    optionsWithDefaults.variance
  );

  const svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("width", optionsWithDefaults.width.toString());
  svg.setAttribute("height", optionsWithDefaults.height.toString());
  svg.setAttribute("xmlns", svgns);
  const colorScale = chroma
    .scale(optionsWithDefaults.gradientColors.map(c => c.colorValue))
    .domain(optionsWithDefaults.gradientColors.map(c => c.position * points.length));

  // Fill the background first
  const rect = document.createElementNS(svgns, "rect");
  rect.setAttributeNS(null, "x", "0");
  rect.setAttributeNS(null, "y", "0");
  rect.setAttributeNS(null, "height", optionsWithDefaults.height.toString());
  rect.setAttributeNS(null, "width", optionsWithDefaults.width.toString());
  rect.setAttributeNS(null, "fill", colorScale(0).hex());
  rect.setAttributeNS(null, "stroke", optionsWithDefaults.strokeColor);
  rect.setAttributeNS(null, "stroke-width", optionsWithDefaults.strokeWidth.toString());
  svg.appendChild(rect);

  // Append each layer of wave
  for (let i = 0; i < points.length; i++) {
    svg.appendChild(
      generateClosedPath(
        points[i],
        { x: 0, y: optionsWithDefaults.height },
        { x: optionsWithDefaults.width, y: optionsWithDefaults.height },
        colorScale(i + 1).hex(),
        optionsWithDefaults.strokeColor,
        optionsWithDefaults.strokeWidth
      )
    );
  }
  return svg;
}

export const createWaveryDataURL = (options: WaveryOptions): string => {
  const svgElement = createWavery(options);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const encodedData = encodeURIComponent(svgString);
  const dataURL = `data:image/svg+xml;charset=utf-8,${encodedData}`;
  return dataURL;
}