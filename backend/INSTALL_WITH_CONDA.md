# Complete Installation Guide Using Conda (Recommended for Windows)

This guide will help you install all dependencies including geospatial libraries using Conda, which handles complex dependencies automatically.

## Step 1: Install Miniconda or Anaconda

### Option A: Miniconda (Recommended - Smaller, Faster)

1. Download Miniconda for Windows:
   - Go to: https://docs.conda.io/en/latest/miniconda.html
   - Download the Windows 64-bit installer (Python 3.11 or newer)
   - File will be something like: `Miniconda3-latest-Windows-x86_64.exe`

2. Run the installer:
   - Click "Next" through the setup
   - Choose "Just Me" (recommended)
   - Choose an installation location (default is fine: `C:\Users\YourName\miniconda3`)
   - **Installation Options:**
     - ✅ Check "Create shortcuts (supported packages only)"
     - ❌ Leave "Add installation to my PATH environment variable" **UNCHECKED** (installer recommends this to avoid conflicts)
     - ✅ Check "Register Anaconda3 as my default Python" (helps IDEs detect it)
     - ✅ Check "Clear the package cache upon completion" (saves disk space)
   - Click "Install"
   
   **Note:** Since you're NOT adding to PATH, you'll use "Anaconda Prompt" from the Start Menu instead of regular Command Prompt (see Step 3).

3. Verify installation:
   - Open "Anaconda Prompt" from the Windows Start Menu (search for "Anaconda Prompt")
   - Type: `conda --version`
   - You should see something like: `conda 23.x.x`
   
   **Important:** Always use "Anaconda Prompt" or "Anaconda PowerShell Prompt" (from Start Menu) instead of regular Command Prompt, since we didn't add conda to PATH.

### Option B: Anaconda (Full Package Manager - Larger)

1. Download Anaconda:
   - Go to: https://www.anaconda.com/products/distribution
   - Download the Windows 64-bit installer

2. Run the installer and follow the prompts (similar to Miniconda)

## Step 2: Set Up Your Project Environment

1. Navigate to your project directory:
   ```cmd
   cd C:\Users\pingp\Documents\ml\UrbanWebApp\backend
   ```

2. Create a new conda environment with Python 3.11:
   ```cmd
   conda create -n urban-app python=3.11
   ```

3. Activate the environment:
   ```cmd
   conda activate urban-app
   ```
   You should see `(urban-app)` at the start of your prompt.

4. Install pip in the conda environment (usually included, but just to be sure):
   ```cmd
   conda install pip
   ```

## Step 3: Install All Dependencies

### Option A: Install Everything Using Conda (Easiest - Recommended)

Install as many packages as possible via conda (avoids compilation issues):

```cmd
conda install -c conda-forge rasterio netcdf4 xarray pillow pydantic fastapi uvicorn httpx aiofiles python-dotenv
```

Then install any remaining packages via pip:

```cmd
pip install python-multipart pydantic-settings python-jose[cryptography] passlib[bcrypt] pydantic-extra-types
```

### Option B: Install Core Packages via Conda, Rest via Pip (Best Balance)

1. Install packages that often have compilation issues via conda:
   ```cmd
   conda install -c conda-forge pydantic fastapi uvicorn httpx rasterio netcdf4 xarray pillow
   ```

2. Then install the rest via pip:
   ```cmd
   pip install python-multipart pydantic-settings python-jose[cryptography] passlib[bcrypt] aiofiles python-dotenv pydantic-extra-types numpy
   ```

### Option C: Install Geospatial Libraries via Conda, Rest via Pip

If you only want to use conda for the problematic geospatial libraries:

1. Install geospatial libraries via conda:
   ```cmd
   conda install -c conda-forge rasterio netcdf4 xarray pillow
   ```

2. Install pydantic via conda (avoids Rust compilation):
   ```cmd
   conda install -c conda-forge pydantic
   ```

3. Then install the rest via pip:
   ```cmd
   pip install fastapi uvicorn[standard] python-multipart pydantic-settings python-jose[cryptography] passlib[bcrypt] aiofiles python-dotenv httpx pydantic-extra-types numpy
   ```

## Step 4: Verify Installation

Test that everything is installed correctly:

```cmd
python -c "import fastapi; import pydantic; import rasterio; import xarray; import PIL; print('All packages installed successfully!')"
```

If you see "All packages installed successfully!" then you're good to go!

**Quick Installation Script:**

For an easier installation experience, you can use the provided batch script (run in Anaconda Prompt after activating your environment):

```cmd
conda activate urban-app
cd C:\Users\pingp\Documents\ml\UrbanWebApp\backend
install-with-conda-easy.bat
```

This script automates the conda + pip installation process.

## Step 5: Create .env File

Create a `.env` file in the `backend` directory:

```cmd
notepad .env
```

Add these lines:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
URBAN_MODEL_SERVICE_URL=http://localhost:8001
```

Save and close.

## Step 6: Run the Backend Server

With your conda environment activated:

```cmd
uvicorn app.main:app --reload
```

You should see the server start on `http://127.0.0.1:8000`

## Daily Usage

Every time you want to work on the project:

1. Open "Anaconda Prompt" from the Windows Start Menu (or "Anaconda PowerShell Prompt")
2. Activate your conda environment:
   ```cmd
   conda activate urban-app
   ```
3. Navigate to the backend folder:
   ```cmd
   cd C:\Users\pingp\Documents\ml\UrbanWebApp\backend
   ```
4. Run your server:
   ```cmd
   uvicorn app.main:app --reload
   ```

## Troubleshooting

### Conda command not found
- **Always use "Anaconda Prompt" from the Windows Start Menu** (not regular Command Prompt)
- Since we didn't add conda to PATH, regular Command Prompt won't have conda
- Search for "Anaconda Prompt" in the Start Menu and use that instead

### Packages still failing to install
- Make sure you're in the conda environment: `conda activate urban-app`
- Try updating conda: `conda update conda`
- Try using conda-forge channel explicitly: `conda install -c conda-forge package-name`

### Want to remove the environment and start over?
```cmd
conda deactivate
conda env remove -n urban-app
```
Then start from Step 2 again.

