import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scenarioApi, predictionApi } from '../../services/api';
import type { Scenario, PredictionRequest } from '../../types';
import ScenarioComparison from './ScenarioComparison';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

export default function ScenarioManager() {
  const queryClient = useQueryClient();
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: () => scenarioApi.list(),
  });

  const deleteScenario = useMutation({
    mutationFn: (id: string) => scenarioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  const handleCompare = () => {
    if (selectedScenarioIds.length >= 2) {
      setShowComparison(true);
    }
  };

  const handleCreatePrediction = async (scenario: Scenario) => {
    const request: PredictionRequest = {
      urbanDataId: scenario.urbanData.id,
      temperatureDataId: scenario.climateData.temperature.id,
      precipitationDataId: scenario.climateData.precipitation.id,
      historicalYieldDataId: scenario.historicalYields?.id,
      year: new Date().getFullYear(),
    };

    await predictionApi.create(request);
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
  };

  if (showComparison && selectedScenarioIds.length >= 2) {
    return (
      <ScenarioComparison
        scenarioIds={selectedScenarioIds}
        onBack={() => setShowComparison(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[14px] tracking-[.02em]">Scenarios</h2>
        <div className="flex space-x-2">
          {selectedScenarioIds.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 rounded-[14px] font-semibold cursor-pointer"
              style={{
                border: '1px solid rgba(255,255,255,.14)',
                background: 'linear-gradient(180deg, rgba(127,224,255,.15), rgba(156,255,134,.12))',
                color: 'var(--text)',
                boxShadow: '0 10px 28px rgba(0,0,0,.35)'
              }}
            >
              Compare Selected
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : scenarios && scenarios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="card rounded-[26px] overflow-hidden p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
                border: '1px solid rgba(255,255,255,.10)',
                boxShadow: '0 18px 60px rgba(0,0,0,.55)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedScenarioIds.includes(scenario.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScenarioIds([...selectedScenarioIds, scenario.id]);
                        } else {
                          setSelectedScenarioIds(
                            selectedScenarioIds.filter((id) => id !== scenario.id)
                          );
                        }
                      }}
                      className="rounded border-white/20"
                      style={{ accentColor: '#7fe0ff' }}
                    />
                    <h3 className="text-[14px] tracking-[.02em]" style={{ color: 'var(--text)' }}>{scenario.name}</h3>
                  </div>
                  {scenario.description && (
                    <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,.66)' }}>{scenario.description}</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>Urban Data:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{scenario.urbanData.filename}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>Temperature:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {scenario.climateData.temperature.filename}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>Precipitation:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {scenario.climateData.precipitation.filename}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,.66)' }}>Created:</span>{' '}
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        {new Date(scenario.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleCreatePrediction(scenario)}
                    className="px-3 py-2 text-sm rounded-[14px] font-semibold"
                    style={{
                      background: 'linear-gradient(180deg, rgba(119,242,193,.20), rgba(119,242,193,.12))',
                      border: '1px solid rgba(119,242,193,.30)',
                      color: 'var(--text)'
                    }}
                  >
                    Predict
                  </button>
                  <button
                    onClick={() => deleteScenario.mutate(scenario.id)}
                    className="px-3 py-2 text-sm rounded-[14px] font-semibold"
                    style={{
                      background: 'rgba(255,122,138,.15)',
                      border: '1px solid rgba(255,122,138,.30)',
                      color: '#ff7a8a'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No scenarios yet"
          message="Create a scenario to get started."
        />
      )}
    </div>
  );
}
