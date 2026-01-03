from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
import uuid
from datetime import datetime
from app.models.schemas import (
    PredictionRequest,
    PredictionResponse,
    PredictionStatus,
    ModelMetrics,
)
from app.services.ml_service import MLService
from app.services.data_processor import DataProcessor
from app.services.file_handler import FileHandler

router = APIRouter()
ml_service = MLService()
data_processor = DataProcessor()
file_handler = FileHandler()

# In-memory storage for predictions (in production, use a database)
predictions_store: dict[str, PredictionResponse] = {}


async def process_prediction(prediction_id: str, request: PredictionRequest):
    """Background task to process prediction."""
    try:
        # Update status to processing
        predictions_store[prediction_id].status = PredictionStatus.processing
        
        # Load and process data files
        urban_file = file_handler.get_file_path(request.urbanDataId, "urban")
        temp_file = file_handler.get_file_path(request.temperatureDataId, "climate")
        prec_file = file_handler.get_file_path(request.precipitationDataId, "climate")
        
        if not all([urban_file, temp_file, prec_file]):
            raise Exception("One or more data files not found")
        
        # Process data
        urban_data = await data_processor.process_urban_data(str(urban_file))
        temp_data = await data_processor.process_climate_data(str(temp_file), "temperature")
        prec_data = await data_processor.process_climate_data(str(prec_file), "precipitation")
        
        historical_yield_data = None
        if request.historicalYieldDataId:
            hist_file = file_handler.get_file_path(request.historicalYieldDataId, "historical-yields")
            if hist_file:
                historical_yield_data = await data_processor.process_climate_data(str(hist_file), "yield")
        
        # Prepare model input
        model_input = data_processor.prepare_model_input(
            urban_data=urban_data,
            temperature_data=temp_data,
            precipitation_data=prec_data,
            historical_yield_data=historical_yield_data,
        )
        
        # Call ML model service
        model_output = await ml_service.predict(model_input)
        
        # Update prediction with results
        prediction = predictions_store[prediction_id]
        prediction.status = PredictionStatus.completed
        prediction.predictionMap = model_output.get("prediction_map")
        prediction.metrics = ModelMetrics(
            mae=model_output.get("mae", 0.0),
            rmse=model_output.get("rmse", 0.0),
            mse=model_output.get("mse", 0.0),
            accuracy=model_output.get("accuracy"),
        ) if model_output.get("metrics") else None
        prediction.confidence = model_output.get("confidence")
        prediction.completedAt = datetime.utcnow().isoformat()
        
    except Exception as e:
        prediction = predictions_store[prediction_id]
        prediction.status = PredictionStatus.failed
        prediction.error = str(e)
        prediction.completedAt = datetime.utcnow().isoformat()


@router.post("", response_model=PredictionResponse)
async def create_prediction(
    request: PredictionRequest,
    background_tasks: BackgroundTasks,
):
    """Create a new crop yield prediction request."""
    prediction_id = str(uuid.uuid4())
    
    # Create initial prediction response
    prediction = PredictionResponse(
        id=prediction_id,
        status=PredictionStatus.pending,
        createdAt=datetime.utcnow().isoformat(),
    )
    
    predictions_store[prediction_id] = prediction
    
    # Start background processing
    background_tasks.add_task(process_prediction, prediction_id, request)
    
    return prediction


@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(prediction_id: str):
    """Get prediction by ID."""
    if prediction_id not in predictions_store:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    return predictions_store[prediction_id]


@router.get("", response_model=List[PredictionResponse])
async def list_predictions():
    """List all predictions."""
    return list(predictions_store.values())

