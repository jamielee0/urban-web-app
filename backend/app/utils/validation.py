import os
from typing import Tuple
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
from fastapi import UploadFile, HTTPException


ALLOWED_TIFF_EXTENSIONS = {'.tif', '.tiff'}
ALLOWED_NETCDF_EXTENSIONS = {'.nc', '.netcdf'}


def validate_tiff_file(file: UploadFile) -> Tuple[bool, str]:
    """Validate that uploaded file is a valid TIFF file."""
    filename = file.filename or ''
    ext = os.path.splitext(filename.lower())[1]
    
    if ext not in ALLOWED_TIFF_EXTENSIONS:
        return False, f"File must be a TIFF file. Allowed extensions: {', '.join(ALLOWED_TIFF_EXTENSIONS)}"
    
    return True, ""


def validate_netcdf_file(file: UploadFile) -> Tuple[bool, str]:
    """Validate that uploaded file is a valid NetCDF file."""
    filename = file.filename or ''
    ext = os.path.splitext(filename.lower())[1]
    
    if ext not in ALLOWED_NETCDF_EXTENSIONS:
        return False, f"File must be a NetCDF file. Allowed extensions: {', '.join(ALLOWED_NETCDF_EXTENSIONS)}"
    
    return True, ""


async def read_tiff_metadata(file_path: str) -> dict:
    """Read metadata from a TIFF file."""
    if not HAS_RASTERIO:
        # Return basic metadata without rasterio
        return {
            'width': 0,
            'height': 0,
            'crs': 'Unknown',
            'bounds': [0, 0, 0, 0],
            'count': 1,
            'dtype': 'Unknown',
            'note': 'rasterio not installed - limited metadata available'
        }
    try:
        with rasterio.open(file_path) as src:
            return {
                'width': src.width,
                'height': src.height,
                'crs': str(src.crs),
                'bounds': list(src.bounds),
                'count': src.count,
                'dtype': str(src.dtypes[0]),
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading TIFF file: {str(e)}")


async def read_netcdf_metadata(file_path: str) -> dict:
    """Read metadata from a NetCDF file."""
    if not HAS_XARRAY:
        return {
            'dimensions': {},
            'variables': [],
            'attrs': {},
            'note': 'xarray not installed - limited metadata available'
        }
    try:
        ds = xr.open_dataset(file_path)
        metadata = {
            'dimensions': dict(ds.dims),
            'variables': list(ds.variables.keys()),
            'attrs': dict(ds.attrs),
        }
        ds.close()
        return metadata
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading NetCDF file: {str(e)}")

