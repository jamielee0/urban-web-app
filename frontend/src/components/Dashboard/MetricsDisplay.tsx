import type { ModelMetrics } from '../../types';

interface MetricsDisplayProps {
  metrics: ModelMetrics;
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Mean Absolute Error</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{metrics.mae.toFixed(4)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900">Root Mean Squared Error</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{metrics.rmse.toFixed(4)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-900">Mean Squared Error</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{metrics.mse.toFixed(4)}</p>
        </div>
        {metrics.accuracy !== undefined && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-900">Accuracy</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {(metrics.accuracy * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

