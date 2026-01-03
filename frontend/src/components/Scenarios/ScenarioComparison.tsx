import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { scenarioApi } from '../../services/api';
import InteractiveMap from '../Map/InteractiveMap';
import LoadingSpinner from '../LoadingSpinner';
import type { Scenario, MapLayer } from '../../types';

interface ScenarioComparisonProps {
  scenarioIds: string[];
  onBack: () => void;
}

export default function ScenarioComparison({ scenarioIds, onBack }: ScenarioComparisonProps) {
  const [layers, setLayers] = useState<MapLayer[]>([]);

  const { data: comparison, isLoading } = useQuery({
    queryKey: ['scenarios', 'compare', scenarioIds],
    queryFn: () => scenarioApi.compare(scenarioIds),
  });

  useEffect(() => {
    if (comparison?.scenarios) {
      const newLayers: MapLayer[] = comparison.scenarios.map((scenario, index) => ({
        id: `scenario-${scenario.id}`,
        name: scenario.name,
        type: 'crop_yield',
        visible: true,
        opacity: 0.5,
        data: scenario.predictions?.[0]?.predictionMap,
      }));
      setLayers(newLayers);
    }
  }, [comparison]);

  if (isLoading || !comparison) {
    return <LoadingSpinner className="py-12" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-[14px] font-semibold"
          style={{
            background: 'rgba(0,0,0,.20)',
            border: '1px solid rgba(255,255,255,.12)',
            color: 'rgba(255,255,255,.66)'
          }}
        >
          ← Back
        </button>
        <h2 className="text-[14px] tracking-[.02em]" style={{ color: 'var(--text)' }}>Scenario Comparison</h2>
        <div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {comparison.scenarios.map((scenario) => (
          <div key={scenario.id} className="card rounded-[26px] overflow-hidden p-6"
               style={{
                 background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
                 border: '1px solid rgba(255,255,255,.10)',
                 boxShadow: '0 18px 60px rgba(0,0,0,.55)'
               }}>
            <h3 className="text-[14px] tracking-[.02em] mb-4" style={{ color: 'var(--text)' }}>{scenario.name}</h3>
            {scenario.predictions && scenario.predictions.length > 0 && (
              <div className="space-y-2">
                {scenario.predictions[0].metrics && (
                  <div className="grid grid-cols-3 gap-4 text-[12px]">
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>MAE:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {scenario.predictions[0].metrics.mae.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>RMSE:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {scenario.predictions[0].metrics.rmse.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>MSE:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {scenario.predictions[0].metrics.mse.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {comparison.differences && (
        <div className="card rounded-[26px] overflow-hidden p-6"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <h3 className="text-[14px] tracking-[.02em] mb-4" style={{ color: 'var(--text)' }}>Comparison Metrics</h3>
          <pre className="p-4 rounded text-sm overflow-auto font-mono"
               style={{
                 background: 'rgba(0,0,0,.20)',
                 border: '1px solid rgba(255,255,255,.12)',
                 color: 'rgba(255,255,255,.78)'
               }}>
            {JSON.stringify(comparison.differences, null, 2)}
          </pre>
        </div>
      )}

      <div className="card rounded-[26px] overflow-hidden p-6"
           style={{
             background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
             border: '1px solid rgba(255,255,255,.10)',
             boxShadow: '0 18px 60px rgba(0,0,0,.55)'
           }}>
        <h3 className="text-[14px] tracking-[.02em] mb-4" style={{ color: 'var(--text)' }}>Map View</h3>
        <InteractiveMap layers={layers} />
      </div>
    </div>
  );
}
