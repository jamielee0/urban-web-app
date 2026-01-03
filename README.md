# URBAN Web Application

A full-stack web application for analyzing the impact of urban expansion on crop yields using deep learning predictions.

## Overview

This application provides policymakers with an interactive platform to:
- Upload geospatial data (urban expansion maps, climate data)
- Visualize crop yield predictions on interactive maps
- Compare different urban expansion scenarios
- Simulate policy impacts
- Analyze historical trends and regional statistics

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: FastAPI (Python)
- **ML Model**: External URBAN model service (Bi-LSTM + U-Net architecture)

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)

## Setup

### Backend Setup

```bash
cd backend
python -m venv venv
```

**Activate the virtual environment:**

On Windows (Command Prompt):
```cmd
venv\Scripts\activate.bat
```

On Windows (PowerShell - if you get execution policy error, use Command Prompt instead):
```powershell
.\venv\Scripts\Activate.ps1
```

On Mac/Linux:
```bash
source venv/bin/activate
```

**Install dependencies:**

On Windows, `rasterio` and `netcdf4` require system libraries that can be complex to install. You have options:

**Option A: Install minimal dependencies (Recommended for Windows - always works):**
```bash
pip install -r requirements-minimal.txt
```
This installs everything needed to run the API server. Geospatial libraries can be added later.

**Option B: Install everything (may fail on Windows):**
```bash
pip install -r requirements.txt
```

**Option C: Use Conda (Easiest - Recommended, avoids compilation issues):**
If you have Anaconda/Miniconda (see `backend/INSTALL_WITH_CONDA.md` for full conda setup guide):

**Quick install:**
```bash
# Install packages that need compilation via conda (pydantic, geospatial libraries)
conda install -c conda-forge pydantic fastapi uvicorn rasterio netcdf4 xarray pillow

# Then install the rest via pip
pip install python-multipart pydantic-settings python-jose[cryptography] passlib[bcrypt] aiofiles python-dotenv pydantic-extra-types numpy
```

**Or use the installation script:**
```bash
# In Anaconda Prompt, after activating your environment
install-with-conda-easy.bat
```

**📖 For complete conda installation instructions, see: `backend/INSTALL_WITH_CONDA.md`**

**Note:** See `backend/WINDOWS_SETUP.md` for detailed Windows installation instructions. The app can run with minimal dependencies; image and geospatial file processing requires additional libraries that can be installed later via conda or pre-built wheels.

Create a `.env` file:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
URBAN_MODEL_SERVICE_URL=http://localhost:8001
```

Run the backend:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker Setup (Optional)

```bash
docker-compose up
```

## Project Structure

```
UrbanWebApp/
├── frontend/          # React TypeScript frontend
├── backend/           # FastAPI backend
├── docker-compose.yml # Docker configuration
└── README.md
```

## API Endpoints

### Upload
- `POST /api/upload/urban` - Upload urban expansion map (TIFF)
- `POST /api/upload/climate` - Upload climate data (NetCDF)
- `POST /api/upload/historical-yields` - Upload historical yield data (NetCDF)

### Predictions
- `POST /api/predictions` - Create prediction request
- `GET /api/predictions/{id}` - Get prediction results
- `GET /api/predictions` - List all predictions

### Scenarios
- `POST /api/scenarios` - Create scenario
- `GET /api/scenarios/{id}` - Get scenario
- `GET /api/scenarios` - List scenarios
- `POST /api/scenarios/compare` - Compare scenarios

### Policy Simulation
- `POST /api/policy/simulate` - Simulate policy impact

### Analytics
- `GET /api/analytics/region/{id}` - Get regional analytics
- `GET /api/analytics/metrics` - Get model metrics

## Data Formats

- **Urban Expansion**: TIFF files (.tif, .tiff)
- **Climate Data**: NetCDF files (.nc, .netcdf)
- **Historical Yields**: NetCDF files (.nc, .netcdf)

## Development

The application is structured to integrate with an external URBAN ML model service. The backend communicates with this service via HTTP REST API.

## License

MIT

