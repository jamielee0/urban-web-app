from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ClimateDataType(str, Enum):
    temperature = "temperature"
    precipitation = "precipitation"


class PredictionStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class UrbanExpansionData(BaseModel):
    id: str
    filename: str
    uploadedAt: str
    year: Optional[int] = None
    region: Optional[str] = None


class ClimateData(BaseModel):
    id: str
    filename: str
    type: ClimateDataType
    uploadedAt: str
    year: Optional[int] = None


class HistoricalYieldData(BaseModel):
    id: str
    filename: str
    uploadedAt: str
    years: List[int] = []


class RegionBounds(BaseModel):
    north: float
    south: float
    east: float
    west: float


class Region(BaseModel):
    id: Optional[str] = None
    name: str
    bounds: RegionBounds
    code: Optional[str] = None


class PredictionRequest(BaseModel):
    urbanDataId: str
    temperatureDataId: str
    precipitationDataId: str
    historicalYieldDataId: Optional[str] = None
    year: int
    region: Optional[Region] = None


class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    mse: float
    accuracy: Optional[float] = None


class PredictionResponse(BaseModel):
    id: str
    status: PredictionStatus
    predictionMap: Optional[str] = None  # Base64 encoded or URL
    metrics: Optional[ModelMetrics] = None
    confidence: Optional[float] = None
    createdAt: str
    completedAt: Optional[str] = None
    error: Optional[str] = None


class Scenario(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    urbanData: UrbanExpansionData
    climateData: Dict[str, ClimateData]  # temperature and precipitation
    historicalYields: Optional[HistoricalYieldData] = None
    predictions: Optional[List[PredictionResponse]] = []
    createdAt: str
    updatedAt: str


class ScenarioComparisonRequest(BaseModel):
    scenarioIds: List[str]


class PolicySimulation(BaseModel):
    id: str
    name: str
    urbanGrowthBoundaries: Optional[Dict[str, Any]] = None  # GeoJSON
    zoningRegulations: Optional[Dict[str, Any]] = None
    prediction: Optional[PredictionResponse] = None
    impactMetrics: Optional[Dict[str, Any]] = None


class ImpactMetrics(BaseModel):
    yieldLossPercentage: float
    affectedArea: float
    priorityAreas: List[str]


class TimeSeriesDataPoint(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    year: int
    crop_yield: float = Field(alias="yield")
    urbanExtent: float


class RegionalStats(BaseModel):
    averageYield: float
    totalUrbanExtent: float
    yieldTrend: str  # 'increasing' | 'decreasing' | 'stable'


class AnalyticsData(BaseModel):
    regionId: str
    timeSeries: List[TimeSeriesDataPoint]
    regionalStats: RegionalStats

