import * as L from 'leaflet';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const createMapIcon = (color: string = 'blue') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [14, 14],
  });
};

export const boundsToLatLngBounds = (bounds: MapBounds): L.LatLngBounds => {
  return L.latLngBounds(
    [bounds.south, bounds.west],
    [bounds.north, bounds.east]
  );
};

export const generateColorScale = (min: number, max: number, steps: number = 10): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const hue = (1 - ratio) * 240; // Blue to red
    colors.push(`hsl(${hue}, 100%, 50%)`);
  }
  return colors;
};

export const getValueColor = (value: number, min: number, max: number, colorScale: string[]): string => {
  if (value <= min) return colorScale[0];
  if (value >= max) return colorScale[colorScale.length - 1];
  const ratio = (value - min) / (max - min);
  const index = Math.floor(ratio * (colorScale.length - 1));
  return colorScale[index];
};

