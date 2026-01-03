import { useState } from 'react';
import type { MapLayer } from '../../types';

interface LayerControlsProps {
  layers: MapLayer[];
  onLayersChange: (layers: MapLayer[]) => void;
}

export default function LayerControls({ layers, onLayersChange }: LayerControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayersChange(updatedLayers);
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    const updatedLayers = layers.map((layer) =>
      layer.id === layerId ? { ...layer, opacity } : layer
    );
    onLayersChange(updatedLayers);
  };

  const getLayerTypeLabel = (type: MapLayer['type']) => {
    const labels: Record<MapLayer['type'], string> = {
      urban: 'Urban Expansion',
      crop_yield: 'Crop Yield',
      temperature: 'Temperature',
      precipitation: 'Precipitation',
    };
    return labels[type];
  };

  return (
    <div className="rounded-2xl overflow-hidden"
         style={{
           background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
           border: '1px solid rgba(255,255,255,.10)',
           boxShadow: '0 18px 60px rgba(0,0,0,.55)'
         }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left font-semibold flex items-center justify-between transition-colors"
        style={{
          color: 'var(--text)',
          background: isOpen ? 'rgba(0,0,0,.12)' : 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,.06)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span>Layer Controls</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-white/8 p-4 space-y-4"
             style={{ background: 'rgba(0,0,0,.12)' }}>
          {layers.length === 0 ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,.66)' }}>No layers available</p>
          ) : (
            layers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayerVisibility(layer.id)}
                      className="rounded border-white/20"
                      style={{
                        accentColor: '#7fe0ff'
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {layer.name || getLayerTypeLabel(layer.type)}
                    </span>
                  </label>
                </div>
                {layer.visible && (
                  <div className="ml-6">
                    <label className="text-xs" style={{ color: 'rgba(255,255,255,.66)' }}>
                      Opacity: {Math.round(layer.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.opacity}
                      onChange={(e) =>
                        updateLayerOpacity(layer.id, parseFloat(e.target.value))
                      }
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,.20)',
                        accentColor: '#7fe0ff'
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
