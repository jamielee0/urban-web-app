import numpy as np
from typing import Dict, Any, Optional
try:
    import rasterio
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False
try:
    import xarray as xr
    HAS_XARRAY = True
except ImportError:
    HAS_XARRAY = False
from pathlib import Path


class DataProcessor:
    """Process geospatial data for model input."""
    
    @staticmethod
    async def process_urban_data(file_path: str) -> Dict[str, Any]:
        """Process urban expansion TIFF file."""
        if not HAS_RASTERIO:
            raise Exception("rasterio is required for processing TIFF files. Please install it following instructions in WINDOWS_SETUP.md")
        try:
            with rasterio.open(file_path) as src:
                data = src.read(1)  # Read first band
                transform = src.transform
                crs = src.crs
                
                # Normalize data to 0-1 range if needed
                if data.max() > 1.0:
                    data = data / data.max()
                
                return {
                    'data': data.tolist(),
                    'shape': data.shape,
                    'transform': list(transform),
                    'crs': str(crs),
                    'bounds': list(src.bounds),
                }
        except Exception as e:
            raise Exception(f"Error processing urban data: {str(e)}")
    
    @staticmethod
    async def process_climate_data(file_path: str, variable: str) -> Dict[str, Any]:
        """Process climate NetCDF file."""
        if not HAS_XARRAY:
            raise Exception("xarray is required for processing NetCDF files. Please install it.")
        try:
            ds = xr.open_dataset(file_path)
            
            # Try to find the variable (common names: temp, temperature, prec, precipitation, etc.)
            var_name = None
            for v in ds.variables:
                if variable.lower() in v.lower() or v.lower() in variable.lower():
                    var_name = v
                    break
            
            if not var_name:
                var_name = list(ds.data_vars)[0] if ds.data_vars else None
            
            if not var_name:
                raise Exception("Could not find climate variable in NetCDF file")
            
            data_array = ds[var_name]
            
            # Convert to numpy and get first time slice if 3D
            if len(data_array.dims) > 2:
                data = data_array.isel({data_array.dims[0]: 0}).values
            else:
                data = data_array.values
            
            ds.close()
            
            return {
                'data': data.tolist() if isinstance(data, np.ndarray) else data,
                'shape': data.shape if hasattr(data, 'shape') else None,
                'variable': var_name,
            }
        except Exception as e:
            raise Exception(f"Error processing climate data: {str(e)}")
    
    @staticmethod
    def prepare_model_input(
        urban_data: Dict[str, Any],
        temperature_data: Dict[str, Any],
        precipitation_data: Dict[str, Any],
        historical_yield_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Prepare input data for URBAN model."""
        return {
            'urban_expansion': urban_data,
            'temperature': temperature_data,
            'precipitation': precipitation_data,
            'historical_yields': historical_yield_data,
        }
    
    @staticmethod
    def segment_global_data(data: np.ndarray, segment_size: int = 32) -> list:
        """Segment global data into smaller chunks (as described in paper)."""
        segments = []
        height, width = data.shape
        
        for y in range(0, height, segment_size):
            for x in range(0, width, segment_size):
                segment = data[y:y+segment_size, x:x+segment_size]
                if segment.size > 0:
                    segments.append({
                        'data': segment.tolist(),
                        'position': (x, y),
                        'shape': segment.shape,
                    })
        
        return segments

