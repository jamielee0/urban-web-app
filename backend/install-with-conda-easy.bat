@echo off
REM Easy installation script for Windows using Conda
REM Make sure you're in the Anaconda Prompt and have activated your conda environment first!

echo ========================================
echo URBAN App - Conda Installation Script
echo ========================================
echo.
echo This script will install all dependencies using conda where possible
echo to avoid compilation issues on Windows.
echo.
echo Make sure you:
echo   1. Are in Anaconda Prompt (not regular Command Prompt)
echo   2. Have activated your conda environment: conda activate urban-app
echo.
pause

echo.
echo Step 1: Installing core packages via conda (avoids compilation issues)...
conda install -c conda-forge -y pydantic fastapi uvicorn httpx

echo.
echo Step 2: Installing geospatial libraries via conda...
conda install -c conda-forge -y rasterio netcdf4 xarray pillow

echo.
echo Step 3: Installing remaining packages via pip...
pip install python-multipart pydantic-settings python-jose[cryptography] passlib[bcrypt] aiofiles python-dotenv pydantic-extra-types numpy

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo To verify installation, run:
echo   python -c "import fastapi; import pydantic; import rasterio; import xarray; print('All packages installed successfully!')"
echo.
pause

