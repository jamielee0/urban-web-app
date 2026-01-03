from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime
from app.models.schemas import (
    Scenario,
    ScenarioComparisonRequest,
    UrbanExpansionData,
    ClimateData,
)

router = APIRouter()

# In-memory storage for scenarios (in production, use a database)
scenarios_store: dict[str, Scenario] = {}


@router.post("", response_model=Scenario)
async def create_scenario(scenario_data: dict):
    """Create a new scenario."""
    try:
        scenario_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        # Validate required fields
        if "name" not in scenario_data:
            raise HTTPException(status_code=400, detail="Scenario name is required")
        if "urbanData" not in scenario_data:
            raise HTTPException(status_code=400, detail="Urban data is required")
        if "climateData" not in scenario_data:
            raise HTTPException(status_code=400, detail="Climate data is required")
        
        scenario = Scenario(
            id=scenario_id,
            name=scenario_data["name"],
            description=scenario_data.get("description"),
            urbanData=UrbanExpansionData(**scenario_data["urbanData"]),
            climateData={
                "temperature": ClimateData(**scenario_data["climateData"]["temperature"]),
                "precipitation": ClimateData(**scenario_data["climateData"]["precipitation"]),
            },
            historicalYields=None,  # Can be added later
            predictions=[],
            createdAt=now,
            updatedAt=now,
        )
        
        scenarios_store[scenario_id] = scenario
        return scenario
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating scenario: {str(e)}")


@router.get("/{scenario_id}", response_model=Scenario)
async def get_scenario(scenario_id: str):
    """Get scenario by ID."""
    if scenario_id not in scenarios_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    return scenarios_store[scenario_id]


@router.get("", response_model=List[Scenario])
async def list_scenarios():
    """List all scenarios."""
    return list(scenarios_store.values())


@router.patch("/{scenario_id}", response_model=Scenario)
async def update_scenario(scenario_id: str, updates: dict):
    """Update scenario."""
    if scenario_id not in scenarios_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    scenario = scenarios_store[scenario_id]
    
    # Update fields
    if "name" in updates:
        scenario.name = updates["name"]
    if "description" in updates:
        scenario.description = updates.get("description")
    
    scenario.updatedAt = datetime.utcnow().isoformat()
    
    return scenario


@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str):
    """Delete scenario."""
    if scenario_id not in scenarios_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    del scenarios_store[scenario_id]
    return {"message": "Scenario deleted"}


@router.post("/compare")
async def compare_scenarios(request: ScenarioComparisonRequest):
    """Compare multiple scenarios."""
    scenarios = []
    for scenario_id in request.scenarioIds:
        if scenario_id not in scenarios_store:
            raise HTTPException(
                status_code=404,
                detail=f"Scenario {scenario_id} not found"
            )
        scenarios.append(scenarios_store[scenario_id])
    
    # Calculate differences (simplified)
    differences = {
        "scenario_count": len(scenarios),
        "comparison_metrics": {
            # This would contain actual comparison logic
            "yield_differences": {},
            "urban_extent_differences": {},
        },
    }
    
    return {
        "scenarios": scenarios,
        "differences": differences,
    }

