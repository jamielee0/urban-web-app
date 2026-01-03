import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { policyApi } from '../../services/api';
import InteractiveMap from '../Map/InteractiveMap';
import AreaHighlighter from './AreaHighlighter';
import type { PolicySimulation, MapLayer } from '../../types';

export default function PolicySimulator() {
  const [simulationName, setSimulationName] = useState('');
  const [urbanGrowthBoundaries, setUrbanGrowthBoundaries] = useState<any>(null);
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [simulationResult, setSimulationResult] = useState<PolicySimulation | null>(null);

  const simulateMutation = useMutation({
    mutationFn: (simulation: Omit<PolicySimulation, 'id'>) => policyApi.simulate(simulation),
    onSuccess: (data) => {
      setSimulationResult(data);
      if (data.prediction?.predictionMap) {
        setLayers([
          {
            id: 'policy-prediction',
            name: 'Policy Impact Prediction',
            type: 'crop_yield',
            visible: true,
            opacity: 0.7,
            data: data.prediction.predictionMap,
          },
        ]);
      }
    },
  });

  const handleSimulate = () => {
    simulateMutation.mutate({
      name: simulationName || 'Policy Simulation',
      urbanGrowthBoundaries,
      impactMetrics: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="card rounded-[26px] overflow-hidden p-6"
           style={{
             background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
             border: '1px solid rgba(255,255,255,.10)',
             boxShadow: '0 18px 60px rgba(0,0,0,.55)'
           }}>
        <h2 className="text-[14px] tracking-[.02em] mb-4">Policy Simulation</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,.92)' }}>
              Simulation Name
            </label>
            <input
              type="text"
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
              placeholder="Enter simulation name"
              className="w-full px-3 py-2 rounded-[14px]"
              style={{
                background: 'rgba(0,0,0,.20)',
                border: '1px solid rgba(255,255,255,.12)',
                color: 'var(--text)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,.92)' }}>
              Urban Growth Boundaries
            </label>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,.66)' }}>
              Draw boundaries on the map to define urban growth limits
            </p>
            <AreaHighlighter
              onBoundariesChange={setUrbanGrowthBoundaries}
              boundaries={urbanGrowthBoundaries}
            />
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulateMutation.isPending}
            className="w-full px-4 py-2 rounded-[14px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: '1px solid rgba(255,255,255,.14)',
              background: 'linear-gradient(180deg, rgba(127,224,255,.15), rgba(156,255,134,.12))',
              color: 'var(--text)',
              boxShadow: '0 10px 28px rgba(0,0,0,.35)'
            }}
          >
            {simulateMutation.isPending ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {simulationResult && (
        <div className="space-y-4">
          <div className="card rounded-[26px] overflow-hidden p-6"
               style={{
                 background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
                 border: '1px solid rgba(255,255,255,.10)',
                 boxShadow: '0 18px 60px rgba(0,0,0,.55)'
               }}>
            <h3 className="text-[14px] tracking-[.02em] mb-4">Simulation Results</h3>
            {simulationResult.impactMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat p-4 rounded-2xl"
                     style={{
                       border: '1px solid rgba(255,122,138,.30)',
                       background: 'rgba(255,122,138,.08)'
                     }}>
                  <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Yield Loss</p>
                  <p className="text-[18px] font-bold tracking-[-.02em] mt-[10px]" style={{ color: '#ff7a8a' }}>
                    {simulationResult.impactMetrics.yieldLossPercentage?.toFixed(2) || 0}%
                  </p>
                </div>
                <div className="stat p-4 rounded-2xl"
                     style={{
                       border: '1px solid rgba(127,224,255,.30)',
                       background: 'rgba(127,224,255,.08)'
                     }}>
                  <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Affected Area</p>
                  <p className="text-[18px] font-bold tracking-[-.02em] mt-[10px]" style={{ color: '#7fe0ff' }}>
                    {simulationResult.impactMetrics.affectedArea?.toFixed(2) || 0}
                  </p>
                </div>
                <div className="stat p-4 rounded-2xl"
                     style={{
                       border: '1px solid rgba(255,213,106,.30)',
                       background: 'rgba(255,213,106,.08)'
                     }}>
                  <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Priority Areas</p>
                  <p className="text-[18px] font-bold tracking-[-.02em] mt-[10px]" style={{ color: '#ffd56a' }}>
                    {simulationResult.impactMetrics.priorityAreas?.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          {layers.length > 0 && (
            <div className="card rounded-[26px] overflow-hidden p-6"
                 style={{
                   background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
                   border: '1px solid rgba(255,255,255,.10)',
                   boxShadow: '0 18px 60px rgba(0,0,0,.55)'
                 }}>
              <h3 className="text-[14px] tracking-[.02em] mb-4">Prediction Map</h3>
              <InteractiveMap layers={layers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
