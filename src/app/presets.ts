import { WaveryColorInfo } from '../lib/src/wavery';

export interface ColorPreset {
  name: string;
  colors: WaveryColorInfo[];
}

export const colorPresets: ColorPreset[] = [
  {
    name: 'Sunset Blaze',
    colors: [
      { colorValue: '#ff6b35', position: 0 },
      { colorValue: '#f7931e', position: 0.5 },
      { colorValue: '#fdc500', position: 1 }
    ]
  },
  {
    name: 'Ocean Depths',
    colors: [
      { colorValue: '#0077be', position: 0 },
      { colorValue: '#00a8e8', position: 0.5 },
      { colorValue: '#00d4ff', position: 1 }
    ]
  },
  {
    name: 'Purple Dream',
    colors: [
      { colorValue: '#6a0572', position: 0 },
      { colorValue: '#a91079', position: 0.5 },
      { colorValue: '#e91e63', position: 1 }
    ]
  },
  {
    name: 'Forest Green',
    colors: [
      { colorValue: '#1b5e20', position: 0 },
      { colorValue: '#388e3c', position: 0.5 },
      { colorValue: '#66bb6a', position: 1 }
    ]
  },
  {
    name: 'Warm Grayscale',
    colors: [
      { colorValue: '#212121', position: 0 },
      { colorValue: '#616161', position: 0.5 },
      { colorValue: '#9e9e9e', position: 1 }
    ]
  },
  {
    name: 'Fire & Ice',
    colors: [
      { colorValue: '#ff5722', position: 0 },
      { colorValue: '#9c27b0', position: 0.5 },
      { colorValue: '#2196f3', position: 1 }
    ]
  }
];
