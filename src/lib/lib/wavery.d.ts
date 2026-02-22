export interface Point {
    x: number;
    y: number;
}
export interface WaveryOptions {
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
export declare const defaultOptions: WaveryOptions;
export declare const createWavery: (options: WaveryOptions) => string;
export declare const createWaveryDataURL: (options: WaveryOptions) => string;
