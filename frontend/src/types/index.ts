export interface UrbanExpansionData {
  id: string;
  filename: string;
  uploadedAt: string;
  year?: number;
  region?: string;
}

export interface ClimateData {
  id: string;
  filename: string;
  type: 'temperature' | 'precipitation';
  uploadedAt: string;
  year?: number;
}

export interface HistoricalYieldData {
  id: string;
  filename: string;
  uploadedAt: string;
  years: number[];
}

export interface PredictionRequest {
  urbanDataId: string;
  temperatureDataId: string;
  precipitationDataId: string;
  historicalYieldDataId?: string;
  year: number;
  region?: Region;
}

export interface PredictionResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  predictionMap?: string; // Base64 encoded image or data URL
  metrics?: {
    mae: number;
    rmse: number;
    mse: number;
  };
  confidence?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  urbanData: UrbanExpansionData;
  climateData: {
    temperature: ClimateData;
    precipitation: ClimateData;
  };
  historicalYields?: HistoricalYieldData;
  predictions?: PredictionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id?: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  code?: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'urban' | 'crop_yield' | 'temperature' | 'precipitation';
  visible: boolean;
  opacity: number;
  data?: any;
}

export interface PolicySimulation {
  id: string;
  name: string;
  urbanGrowthBoundaries?: GeoJSON.FeatureCollection;
  zoningRegulations?: Record<string, any>;
  prediction?: PredictionResponse;
  impactMetrics?: {
    yieldLossPercentage: number;
    affectedArea: number;
    priorityAreas: string[];
  };
}

export interface AnalyticsData {
  regionId: string;
  timeSeries: {
    year: number;
    yield: number;
    urbanExtent: number;
  }[];
  regionalStats: {
    averageYield: number;
    totalUrbanExtent: number;
    yieldTrend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  mse: number;
  accuracy?: number;
}

