import type { MapLayer } from '../../types';

interface MapLegendsProps {
  layers: MapLayer[];
}

export default function MapLegends({ layers }: MapLegendsProps) {
  const visibleLayers = layers.filter((layer) => layer.visible);

  const getColorScale = (type: MapLayer['type']) => {
    switch (type) {
      case 'urban':
        return ['rgba(156,255,134,.40)', 'rgba(255,213,106,.50)', 'rgba(255,122,138,.60)'];
      case 'crop_yield':
        return ['rgba(255,122,138,.60)', 'rgba(255,213,106,.50)', 'rgba(156,255,134,.60)'];
      case 'temperature':
        return ['rgba(127,224,255,.40)', 'rgba(127,224,255,.60)', 'rgba(127,224,255,.80)'];
      case 'precipitation':
        return ['rgba(127,224,255,.40)', 'rgba(127,224,255,.60)', 'rgba(127,224,255,.80)'];
      default:
        return ['rgba(255,255,255,.20)', 'rgba(255,255,255,.40)', 'rgba(255,255,255,.60)'];
    }
  };

  const getLabels = (type: MapLayer['type']) => {
    switch (type) {
      case 'urban':
        return { min: 'Low', max: 'High' };
      case 'crop_yield':
        return { min: 'Low Yield', max: 'High Yield' };
      case 'temperature':
        return { min: 'Cool', max: 'Warm' };
      case 'precipitation':
        return { min: 'Dry', max: 'Wet' };
      default:
        return { min: 'Low', max: 'High' };
    }
  };

  return (
    <div className="space-y-3">
      {visibleLayers.map((layer) => {
        const colors = getColorScale(layer.type);
        const labels = getLabels(layer.type);
        return (
          <div
            key={layer.id}
            className="rounded-2xl p-3"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
              border: '1px solid rgba(255,255,255,.10)',
              boxShadow: '0 18px 60px rgba(0,0,0,.55)'
            }}
          >
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              {layer.name || layer.type}
            </h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex h-4 rounded overflow-hidden">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="flex-1"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs" style={{ color: 'rgba(255,255,255,.66)' }}>
              <span>{labels.min}</span>
              <span>{labels.max}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
