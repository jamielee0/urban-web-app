from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import UrbanExpansionData, ClimateData, HistoricalYieldData, ClimateDataType
from app.services.file_handler import FileHandler
from app.utils.validation import validate_tiff_file, validate_netcdf_file, read_tiff_metadata, read_netcdf_metadata
from datetime import datetime

router = APIRouter()
file_handler = FileHandler()


@router.post("/urban", response_model=UrbanExpansionData)
async def upload_urban_expansion(
    file: UploadFile = File(...),
    year: Optional[int] = Form(None),
    region: Optional[str] = Form(None),
):
    """Upload urban expansion map (TIFF format)."""
    # Validate file
    is_valid, error_msg = validate_tiff_file(file)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Save file
    file_path, file_id = await file_handler.save_upload_file(file, "urban")
    
    # Read metadata
    metadata = await read_tiff_metadata(file_path)
    
    return UrbanExpansionData(
        id=file_id,
        filename=file.filename or "unknown.tiff",
        uploadedAt=datetime.utcnow().isoformat(),
        year=year,
        region=region,
    )


@router.post("/climate", response_model=ClimateData)
async def upload_climate_data(
    file: UploadFile = File(...),
    type: str = Form(...),
    year: Optional[int] = Form(None),
):
    """Upload climate data (NetCDF format) - temperature or precipitation."""
    # Validate type
    try:
        climate_type = ClimateDataType(type)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Type must be either 'temperature' or 'precipitation'"
        )
    
    # Validate file
    is_valid, error_msg = validate_netcdf_file(file)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Save file
    file_path, file_id = await file_handler.save_upload_file(file, "climate")
    
    # Read metadata (optional)
    # metadata = await read_netcdf_metadata(file_path)
    
    return ClimateData(
        id=file_id,
        filename=file.filename or "unknown.nc",
        type=climate_type,
        uploadedAt=datetime.utcnow().isoformat(),
        year=year,
    )


@router.post("/historical-yields", response_model=HistoricalYieldData)
async def upload_historical_yields(
    file: UploadFile = File(...),
):
    """Upload historical crop yield data (NetCDF format)."""
    # Validate file
    is_valid, error_msg = validate_netcdf_file(file)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Save file
    file_path, file_id = await file_handler.save_upload_file(file, "historical-yields")
    
    # TODO: Extract years from NetCDF file
    years = []
    
    return HistoricalYieldData(
        id=file_id,
        filename=file.filename or "unknown.nc",
        uploadedAt=datetime.utcnow().isoformat(),
        years=years,
    )

