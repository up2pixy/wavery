import { computeControlPoints } from "./bezier-spline.js";
import chroma from "chroma-js";

function generatePoints(width, height, segmentCount, layerCount, variance) {
  const cell_width = width / segmentCount;
  const cell_height = height / layerCount;
  const moveLimit_x = cell_width * variance * 0.5;
  const moveLimit_y = cell_height * variance;

  var points = [];
  for (let y = cell_height; y < height; y += cell_height) {
    points.push({ x: 0, y: Math.floor(y) });
    for (let x = cell_width; x < width; x += cell_width) {
      let varietalY = y - moveLimit_y / 2 + Math.random() * moveLimit_y;
      let varietalX = x - moveLimit_x / 2 + Math.random() * moveLimit_x;
      points.push({ x: Math.floor(varietalX), y: Math.floor(varietalY) });
    }
    points.push({ x: Math.floor(width), y: Math.floor(y) });
  }
  return points;
}

function generate_closed_path(
  curvePoints,
  leftCornerPoint,
  rightCornerPoint,
  color
) {
  let xPoints = curvePoints.map(p => p.x);
  let yPoints = curvePoints.map(p => p.y);
  let xControlPoints = computeControlPoints(xPoints);
  let yControlPoints = computeControlPoints(yPoints);

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

  let svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttributeNS(null, "fill", color);
  svgPath.setAttributeNS(null, "stroke", "none");
  svgPath.setAttributeNS(null, "stroke-width", 2);
  svgPath.setAttributeNS(null, "d", path);

  return svgPath;
}

export default class Wavery {
  constructor(width, height, segmentCount, layerCount, variance) {
    this.width = width;
    this.height = height;
    this.segmentCount = segmentCount;
    this.layerCount = layerCount;
    this.variance = variance;
  }
  generate() {
    let points = generatePoints(
      this.width,
      this.height,
      this.segmentCount,
      this.layerCount,
      this.variance
    );
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.width);
    svg.setAttribute("height", this.height);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    let f = chroma.scale(["yellow", "red", "navy"]).domain([0, points.length]);
    for (let i = 0, j = points.length; i < j; i += this.segmentCount + 1) {
      let pointsPerLayer = points.slice(i, i + this.segmentCount + 1);
      svg.appendChild(
        generate_closed_path(
          pointsPerLayer,
          { x: 0, y: this.height },
          { x: this.width, y: this.height },
          f(i)
        )
      );
    }
    return svg;
  }
}
