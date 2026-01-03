import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException
from typing import Optional
import aiofiles

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


class FileHandler:
    @staticmethod
    async def save_upload_file(file: UploadFile, subdirectory: str = "") -> tuple[str, str]:
        """Save uploaded file and return file path and generated ID."""
        file_id = str(uuid.uuid4())
        file_ext = Path(file.filename or "").suffix
        filename = f"{file_id}{file_ext}"
        
        save_dir = UPLOAD_DIR / subdirectory
        save_dir.mkdir(exist_ok=True, parents=True)
        
        file_path = save_dir / filename
        
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            return str(file_path), file_id
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    @staticmethod
    def get_file_path(file_id: str, subdirectory: str = "") -> Optional[Path]:
        """Get file path from file ID."""
        save_dir = UPLOAD_DIR / subdirectory
        for file_path in save_dir.glob(f"{file_id}.*"):
            return file_path
        return None
    
    @staticmethod
    def delete_file(file_id: str, subdirectory: str = "") -> bool:
        """Delete file by ID."""
        file_path = FileHandler.get_file_path(file_id, subdirectory)
        if file_path and file_path.exists():
            file_path.unlink()
            return True
        return False
    
    @staticmethod
    def cleanup_old_files(max_age_days: int = 7):
        """Clean up files older than max_age_days."""
        # This would be called by a background task
        pass

