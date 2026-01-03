import { useState, useEffect } from 'react';
import InteractiveMap from '../Map/InteractiveMap';
import LayerControls from '../Map/LayerControls';
import MapLegends from '../Map/MapLegends';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';
import type { PredictionResponse, MapLayer } from '../../types';

interface PredictionDashboardProps {
  predictions: PredictionResponse[];
  loading: boolean;
  selectedPredictionId: string | null;
  onSelectPrediction: (id: string | null) => void;
}

export default function PredictionDashboard({
  predictions,
  loading,
  selectedPredictionId,
  onSelectPrediction,
}: PredictionDashboardProps) {
  const [layers, setLayers] = useState<MapLayer[]>([]);

  const selectedPrediction = predictions.find((p) => p.id === selectedPredictionId);

  useEffect(() => {
    if (selectedPrediction?.predictionMap) {
      setLayers([
        {
          id: 'prediction-crop-yield',
          name: 'Predicted Crop Yield',
          type: 'crop_yield',
          visible: true,
          opacity: 0.7,
          data: selectedPrediction.predictionMap,
        },
      ]);
    }
  }, [selectedPrediction]);

  return (
    <div className="map-wrap grid gap-[14px]">
      {/* Map */}
      <div className="map h-[360px] rounded-[22px] border relative overflow-hidden"
           style={{
             border: '1px solid rgba(255,255,255,.12)',
             background: `
               radial-gradient(220px 180px at 22% 46%, rgba(255,122,138,.22), transparent 60%),
               radial-gradient(260px 220px at 55% 56%, rgba(255,213,106,.22), transparent 60%),
               radial-gradient(240px 200px at 75% 35%, rgba(156,255,134,.18), transparent 62%),
               radial-gradient(420px 320px at 35% 30%, rgba(127,224,255,.16), transparent 55%),
               linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.12))
             `
           }}>
        {selectedPrediction ? (
          <InteractiveMap layers={layers} height="100%" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'rgba(255,255,255,.66)' }}>
            Select a prediction to view map
          </div>
        )}
        <div className="map-ui absolute inset-[14px] flex flex-col justify-between gap-3 pointer-events-none">
          <div className="map-top flex items-start justify-between gap-3">
            <div className="badge inline-flex items-center gap-2 px-[8px_10px] rounded-full"
                 style={{
                   border: '1px solid rgba(255,255,255,.14)',
                   background: 'rgba(0,0,0,.22)',
                   color: 'var(--text)',
                   fontSize: '12px',
                   boxShadow: '0 8px 22px rgba(0,0,0,.35)'
                 }}>
              <span className="dot w-2 h-2 rounded-full" style={{ background: '#9cff86' }}></span>
              Urban intensity
            </div>
            <div className="badge inline-flex items-center gap-2 px-[8px_10px] rounded-full"
                 style={{
                   border: '1px solid rgba(255,255,255,.14)',
                   background: 'rgba(0,0,0,.22)',
                   color: 'var(--text)',
                   fontSize: '12px',
                   boxShadow: '0 8px 22px rgba(0,0,0,.35)'
                 }}>
              <span className="dot w-2 h-2 rounded-full" style={{ background: '#ffd56a' }}></span>
              Yield sensitivity
            </div>
          </div>
          <div className="flex justify-end">
            <div className="legend grid gap-[10px] w-[320px] max-w-full p-3 rounded-2xl"
                 style={{
                   border: '1px solid rgba(255,255,255,.12)',
                   background: 'rgba(0,0,0,.24)',
                   boxShadow: '0 10px 26px rgba(0,0,0,.40)'
                 }}>
              <div className="row flex items-center justify-between gap-[10px]">
                <small style={{ color: 'rgba(255,255,255,.66)' }}>Low</small>
                <small style={{ color: 'rgba(255,255,255,.66)' }}>High</small>
              </div>
              <div className="bar h-[10px] rounded-full border"
                   style={{
                     border: '1px solid rgba(255,255,255,.12)',
                     background: 'linear-gradient(90deg, rgba(156,255,134,.80), rgba(255,213,106,.78), rgba(255,122,138,.78))'
                   }}></div>
              <div className="row flex items-center justify-between gap-[10px]">
                <small style={{ color: 'rgba(255,255,255,.66)' }}>Urban expansion →</small>
                <small style={{ color: 'rgba(255,255,255,.66)' }}>Yield risk</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      {predictions.length > 0 && (
        <div className="two-col grid grid-cols-2 gap-3">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              onClick={() => onSelectPrediction(prediction.id)}
              className="compare rounded-2xl border p-3 cursor-pointer transition-all"
              style={{
                border: selectedPredictionId === prediction.id 
                  ? '1px solid rgba(127,224,255,.30)' 
                  : '1px solid rgba(255,255,255,.10)',
                background: selectedPredictionId === prediction.id
                  ? 'rgba(127,224,255,.08)'
                  : 'rgba(0,0,0,.14)'
              }}
            >
              <header className="flex items-center justify-between gap-[10px]">
                <strong className="text-[13px]">Prediction {prediction.id.slice(0, 8)}</strong>
                <span className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,.45)' }}>
                  {prediction.status}
                </span>
              </header>
              {prediction.metrics && (
                <div className="delta mt-[10px] flex items-baseline justify-between gap-[10px]">
                  <b className="text-[20px] tracking-[-.02em]" style={{ color: '#7fe0ff' }}>
                    MAE: {prediction.metrics.mae.toFixed(4)}
                  </b>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && <LoadingSpinner className="py-8" />}
      {!loading && predictions.length === 0 && (
        <EmptyState
          title="No predictions"
          message="Create a prediction to see results here."
        />
      )}
    </div>
  );
}
