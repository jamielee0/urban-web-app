from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from app.api.routes import predictions, upload, scenarios, analytics, policy

load_dotenv()

app = FastAPI(
    title="URBAN API",
    description="API for Urban Expansion and Crop Yield Analysis",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["scenarios"])
app.include_router(policy.router, prefix="/api/policy", tags=["policy"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])


@app.get("/")
async def root():
    return {"message": "URBAN API", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )

