# URBAN API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, the API does not require authentication. In production, JWT tokens should be used.

## Endpoints

### Health Check

#### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "healthy"
}
```

### Upload Endpoints

#### POST /api/upload/urban
Upload urban expansion map (TIFF format).

**Request:**
- `file` (multipart/form-data): TIFF file
- `year` (optional, form data): Year of the data
- `region` (optional, form data): Region identifier

**Response:**
```json
{
  "id": "uuid",
  "filename": "urban_map.tiff",
  "uploadedAt": "2024-01-01T00:00:00",
  "year": 2020,
  "region": "region-1"
}
```

#### POST /api/upload/climate
Upload climate data (NetCDF format).

**Request:**
- `file` (multipart/form-data): NetCDF file
- `type` (form data): "temperature" or "precipitation"
- `year` (optional, form data): Year of the data

**Response:**
```json
{
  "id": "uuid",
  "filename": "temperature.nc",
  "type": "temperature",
  "uploadedAt": "2024-01-01T00:00:00",
  "year": 2020
}
```

#### POST /api/upload/historical-yields
Upload historical crop yield data (NetCDF format).

**Request:**
- `file` (multipart/form-data): NetCDF file

**Response:**
```json
{
  "id": "uuid",
  "filename": "yields.nc",
  "uploadedAt": "2024-01-01T00:00:00",
  "years": [1992, 1993, 1994]
}
```

### Prediction Endpoints

#### POST /api/predictions
Create a new crop yield prediction request.

**Request:**
```json
{
  "urbanDataId": "uuid",
  "temperatureDataId": "uuid",
  "precipitationDataId": "uuid",
  "historicalYieldDataId": "uuid (optional)",
  "year": 2020,
  "region": {
    "name": "Region Name",
    "bounds": {
      "north": 50.0,
      "south": 40.0,
      "east": 10.0,
      "west": 0.0
    }
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00"
}
```

#### GET /api/predictions/{id}
Get prediction by ID.

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "predictionMap": "base64_encoded_or_url",
  "metrics": {
    "mae": 0.3689,
    "rmse": 0.6887,
    "mse": 0.4743
  },
  "confidence": 0.95,
  "createdAt": "2024-01-01T00:00:00",
  "completedAt": "2024-01-01T00:05:00"
}
```

#### GET /api/predictions
List all predictions.

**Response:**
```json
[
  {
    "id": "uuid",
    "status": "completed",
    ...
  }
]
```

### Scenario Endpoints

#### POST /api/scenarios
Create a new scenario.

**Request:**
```json
{
  "name": "Scenario Name",
  "description": "Scenario description",
  "urbanData": {
    "id": "uuid",
    "filename": "urban.tiff",
    "uploadedAt": "2024-01-01T00:00:00"
  },
  "climateData": {
    "temperature": {
      "id": "uuid",
      "filename": "temp.nc",
      "type": "temperature",
      "uploadedAt": "2024-01-01T00:00:00"
    },
    "precipitation": {
      "id": "uuid",
      "filename": "prec.nc",
      "type": "precipitation",
      "uploadedAt": "2024-01-01T00:00:00"
    }
  }
}
```

#### GET /api/scenarios/{id}
Get scenario by ID.

#### GET /api/scenarios
List all scenarios.

#### PATCH /api/scenarios/{id}
Update scenario.

#### DELETE /api/scenarios/{id}
Delete scenario.

#### POST /api/scenarios/compare
Compare multiple scenarios.

**Request:**
```json
{
  "scenarioIds": ["uuid1", "uuid2"]
}
```

### Policy Simulation Endpoints

#### POST /api/policy/simulate
Simulate policy impact.

**Request:**
```json
{
  "name": "Policy Simulation",
  "urbanGrowthBoundaries": {
    "type": "FeatureCollection",
    "features": [...]
  },
  "zoningRegulations": {}
}
```

#### GET /api/policy/{id}
Get policy simulation by ID.

### Analytics Endpoints

#### GET /api/analytics/region/{region_id}
Get regional analytics.

**Response:**
```json
{
  "regionId": "region-1",
  "timeSeries": [
    {
      "year": 1992,
      "yield": 3.5,
      "urbanExtent": 0.1
    }
  ],
  "regionalStats": {
    "averageYield": 3.075,
    "totalUrbanExtent": 0.2,
    "yieldTrend": "decreasing"
  }
}
```

#### GET /api/analytics/metrics
Get model performance metrics.

**Response:**
```json
{
  "mae": 0.3689,
  "rmse": 0.6887,
  "mse": 0.4743
}
```

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message"
}
```

Common HTTP status codes:
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
- `504`: Gateway Timeout (model service timeout)

