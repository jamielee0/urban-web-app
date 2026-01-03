# Windows Setup Instructions

This guide helps you install geospatial libraries (`rasterio` and `netcdf4`) on Windows, which have complex dependencies.

## Quick Start - Install Core Dependencies First

Start by installing the core dependencies (this will work without issues):

```cmd
pip install -r requirements-minimal.txt
```

This installs everything needed to run the API server. The geospatial libraries (`rasterio`, `netcdf4`, `xarray`) can be installed later when needed.

## Installing Geospatial Libraries on Windows

### Recommended: Use Conda (Easiest Method)

If you have Anaconda or Miniconda installed, this is by far the easiest:

```cmd
conda install -c conda-forge rasterio netcdf4 xarray
```

This automatically handles all the complex dependencies (GDAL, HDF5, NetCDF C libraries).

### Installing rasterio (if not using conda)

`rasterio` requires GDAL, which is complex to install on Windows. Here are your options:

### Option 1: Install GDAL using OSGeo4W (Recommended for full functionality)

1. Download and install OSGeo4W from: https://trac.osgeo.org/osgeo4w/
2. During installation, select "Advanced Install" and install GDAL
3. Add GDAL to your PATH environment variable:
   - Add `C:\OSGeo4W64\bin` to your system PATH
   - Or `C:\OSGeo4W\bin` if you installed 32-bit version
4. Then install rasterio:
   ```cmd
   pip install rasterio==1.3.9
   ```

### Option 2: Use Conda (Easiest method)

If you have Anaconda or Miniconda installed:

```cmd
conda install -c conda-forge rasterio
```

This automatically handles GDAL dependencies.

### Option 3: Install pre-built wheel (Quickest, but may have issues)

1. Download the appropriate wheel file for your Python version from:
   https://www.lfd.uci.edu/~gohlke/pythonlibs/#rasterio
2. Install it:
   ```cmd
   pip install rasterio‑1.3.9‑cp311‑cp311‑win_amd64.whl
   ```
   (Adjust the filename based on your Python version)

### Option 4: Skip rasterio for now (For development/testing)

If you don't need TIFF file processing immediately, you can skip installing rasterio and install it later when needed. The app will work without it, but file upload validation for TIFF files may not work fully.

### Installing netcdf4 and xarray (if not using conda)

`netcdf4` requires HDF5 and NetCDF C libraries, which are also complex on Windows.

**Option 1: Use pre-built wheels (if available for your Python version)**
Check: https://www.lfd.uci.edu/~gohlke/pythonlibs/#netcdf4

**Option 2: Use conda (strongly recommended)**
```cmd
conda install -c conda-forge netcdf4 xarray
```

**Option 3: Install minimal dependencies first**
The app can run with just the minimal requirements for API functionality:
```cmd
pip install -r requirements-minimal.txt
```

Then install geospatial libraries later when needed using conda or the methods above.

## Summary

1. **Start here (always works):**
   ```cmd
   pip install -r requirements-minimal.txt
   ```

2. **When you need geospatial file processing, use conda:**
   ```cmd
   conda install -c conda-forge rasterio netcdf4 xarray
   ```

3. **Or install from requirements-base.txt (may fail without conda):**
   ```cmd
   pip install -r requirements-base.txt
   ```

