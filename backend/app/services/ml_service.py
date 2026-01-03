import os
import httpx
from typing import Dict, Any, Optional
from fastapi import HTTPException
from app.models.schemas import PredictionResponse, PredictionStatus, ModelMetrics


class MLService:
    """Service to communicate with URBAN ML model service."""
    
    def __init__(self):
        self.model_service_url = os.getenv(
            "URBAN_MODEL_SERVICE_URL",
            "http://localhost:8001"
        )
        self.timeout = 300.0  # 5 minutes for model inference
    
    async def predict(
        self,
        model_input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send prediction request to URBAN ML model service.
        
        This assumes the ML model service has an endpoint that accepts
        the processed geospatial data and returns predictions.
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.model_service_url}/predict",
                    json=model_input,
                )
                response.raise_for_status()
                return response.json()
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="Model prediction request timed out"
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Model service error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error calling model service: {str(e)}"
            )
    
    async def get_prediction_status(self, prediction_id: str) -> Dict[str, Any]:
        """Get status of an async prediction."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.model_service_url}/predictions/{prediction_id}/status"
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error getting prediction status: {str(e)}"
            )
    
    def format_prediction_response(
        self,
        model_output: Dict[str, Any],
        prediction_id: str
    ) -> PredictionResponse:
        """Format model output into PredictionResponse schema."""
        return PredictionResponse(
            id=prediction_id,
            status=PredictionStatus.completed,
            predictionMap=model_output.get("prediction_map"),  # Base64 or URL
            metrics=ModelMetrics(
                mae=model_output.get("mae", 0.0),
                rmse=model_output.get("rmse", 0.0),
                mse=model_output.get("mse", 0.0),
                accuracy=model_output.get("accuracy"),
            ) if model_output.get("metrics") else None,
            confidence=model_output.get("confidence"),
            createdAt=model_output.get("created_at", ""),
            completedAt=model_output.get("completed_at"),
        )

