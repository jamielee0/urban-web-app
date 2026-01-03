import axios from 'axios';
import type {
  PredictionRequest,
  PredictionResponse,
  Scenario,
  UrbanExpansionData,
  ClimateData,
  HistoricalYieldData,
  AnalyticsData,
  ModelMetrics,
  PolicySimulation,
} from '../types';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = handleApiError(error);
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

// File Upload APIs
export const uploadApi = {
  uploadUrban: async (file: File): Promise<UrbanExpansionData> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<UrbanExpansionData>('/upload/urban', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadClimate: async (file: File, type: 'temperature' | 'precipitation'): Promise<ClimateData> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await apiClient.post<ClimateData>('/upload/climate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadHistoricalYields: async (file: File): Promise<HistoricalYieldData> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<HistoricalYieldData>('/upload/historical-yields', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Prediction APIs
export const predictionApi = {
  create: async (request: PredictionRequest): Promise<PredictionResponse> => {
    const response = await apiClient.post<PredictionResponse>('/predictions', request);
    return response.data;
  },

  get: async (id: string): Promise<PredictionResponse> => {
    const response = await apiClient.get<PredictionResponse>(`/predictions/${id}`);
    return response.data;
  },

  list: async (): Promise<PredictionResponse[]> => {
    const response = await apiClient.get<PredictionResponse[]>('/predictions');
    return response.data;
  },
};

// Scenario APIs
export const scenarioApi = {
  create: async (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>('/scenarios', scenario);
    return response.data;
  },

  get: async (id: string): Promise<Scenario> => {
    const response = await apiClient.get<Scenario>(`/scenarios/${id}`);
    return response.data;
  },

  list: async (): Promise<Scenario[]> => {
    const response = await apiClient.get<Scenario[]>('/scenarios');
    return response.data;
  },

  update: async (id: string, updates: Partial<Scenario>): Promise<Scenario> => {
    const response = await apiClient.patch<Scenario>(`/scenarios/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/scenarios/${id}`);
  },

  compare: async (scenarioIds: string[]): Promise<{
    scenarios: Scenario[];
    differences: Record<string, any>;
  }> => {
    const response = await apiClient.post<{
      scenarios: Scenario[];
      differences: Record<string, any>;
    }>('/scenarios/compare', { scenarioIds });
    return response.data;
  },
};

// Policy Simulation APIs
export const policyApi = {
  simulate: async (simulation: Omit<PolicySimulation, 'id'>): Promise<PolicySimulation> => {
    const response = await apiClient.post<PolicySimulation>('/policy/simulate', simulation);
    return response.data;
  },

  get: async (id: string): Promise<PolicySimulation> => {
    const response = await apiClient.get<PolicySimulation>(`/policy/${id}`);
    return response.data;
  },
};

// Analytics APIs
export const analyticsApi = {
  getRegionAnalytics: async (regionId: string): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>(`/analytics/region/${regionId}`);
    return response.data;
  },

  getMetrics: async (): Promise<ModelMetrics> => {
    const response = await apiClient.get<ModelMetrics>('/analytics/metrics');
    return response.data;
  },
};

export default apiClient;

