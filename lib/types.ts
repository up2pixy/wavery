export interface Point {
  x: number;
  y: number;
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
