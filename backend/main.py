from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import shutil
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime

from utils.audio_processor import process_audio_files, create_mashup
from utils.music_gen import MusicGenerator, MusicGenModel

app = FastAPI(title="AI Music Mashup API")

# Initialize MusicGen
music_generator = MusicGenerator()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
MASHUP_DIR = Path("mashups")
GENERATED_DIR = Path("generated")

for directory in [UPLOAD_DIR, PROCESSED_DIR, MASHUP_DIR, GENERATED_DIR]:
    directory.mkdir(exist_ok=True)

@app.post("/upload")
async def upload_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        # Generate unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file1_name = f"{timestamp}_{file1.filename}"
        file2_name = f"{timestamp}_{file2.filename}"
        
        # Save files
        file1_path = UPLOAD_DIR / file1_name
        file2_path = UPLOAD_DIR / file2_name
        
        with open(file1_path, "wb") as buffer:
            shutil.copyfileobj(file1.file, buffer)
        with open(file2_path, "wb") as buffer:
            shutil.copyfileobj(file2.file, buffer)
            
        return {
            "message": "Files uploaded successfully",
            "files": {
                "file1": file1_name,
                "file2": file2_name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
async def process_files(file1: str, file2: str):
    try:
        file1_path = UPLOAD_DIR / file1
        file2_path = UPLOAD_DIR / file2
        
        if not file1_path.exists() or not file2_path.exists():
            raise HTTPException(status_code=404, detail="One or both files not found")
            
        # Process files using Demucs
        processed_files = await process_audio_files(file1_path, file2_path)
        
        return {
            "message": "Files processed successfully",
            "processed_files": processed_files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mashup")
async def create_mashup_endpoint(vocals_file: str, instrumentals_file: str):
    try:
        vocals_path = PROCESSED_DIR / vocals_file
        instrumentals_path = PROCESSED_DIR / instrumentals_file
        
        if not vocals_path.exists() or not instrumentals_path.exists():
            raise HTTPException(status_code=404, detail="One or both processed files not found")
            
        # Create mashup
        mashup_id = str(uuid.uuid4())
        mashup_path = MASHUP_DIR / f"mashup_{mashup_id}.mp3"
        
        await create_mashup(vocals_path, instrumentals_path, mashup_path)
        
        return {
            "message": "Mashup created successfully",
            "mashup_id": mashup_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/mashup/{mashup_id}")
async def get_mashup(mashup_id: str):
    try:
        mashup_path = MASHUP_DIR / f"mashup_{mashup_id}.mp3"
        
        if not mashup_path.exists():
            raise HTTPException(status_code=404, detail="Mashup not found")
            
        return FileResponse(
            mashup_path,
            media_type="audio/mpeg",
            filename=f"mashup_{mashup_id}.mp3"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_available_models():
    """Get list of available MusicGen models"""
    return {
        "models": [
            {"id": "small", "name": "Small", "description": "Fast generation, good quality"},
            {"id": "medium", "name": "Medium", "description": "Balanced speed and quality"},
            {"id": "large", "name": "Large", "description": "Highest quality, slower generation"},
            {"id": "melody", "name": "Melody", "description": "Optimized for melody generation"}
        ]
    }

@app.post("/generate")
async def generate_music(
    prompt: str,
    duration: int = Query(10, ge=1, le=30),
    model: MusicGenModel = MusicGenModel.SMALL,
    temperature: float = Query(1.0, ge=0.1, le=2.0),
    top_k: int = Query(250, ge=1, le=500),
    top_p: float = Query(0.0, ge=0.0, le=1.0),
    guidance_scale: float = Query(3.0, ge=1.0, le=10.0),
    num_beams: int = Query(1, ge=1, le=5)
):
    try:
        output_path = GENERATED_DIR / f"generated_{uuid.uuid4()}.wav"
        await music_generator.generate_music(
            prompt=prompt,
            output_path=output_path,
            duration=duration,
            model=model,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            guidance_scale=guidance_scale,
            num_beams=num_beams
        )
        
        return {
            "message": "Music generated successfully",
            "file_path": str(output_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-mashup")
async def generate_mashup(
    vocals_file: UploadFile = File(...),
    prompt: Optional[str] = None,
    model: MusicGenModel = MusicGenModel.MELODY,
    temperature: float = Query(1.0, ge=0.1, le=2.0),
    guidance_scale: float = Query(3.0, ge=1.0, le=10.0)
):
    try:
        # Save vocals file
        vocals_path = UPLOAD_DIR / f"vocals_{uuid.uuid4()}.wav"
        with open(vocals_path, "wb") as buffer:
            shutil.copyfileobj(vocals_file.file, buffer)
        
        # Generate mashup
        output_path = MASHUP_DIR / f"mashup_{uuid.uuid4()}.wav"
        await music_generator.generate_mashup(
            vocals_path=vocals_path,
            prompt=prompt or "Generate matching instrumental music",
            output_path=output_path,
            model=model,
            temperature=temperature,
            guidance_scale=guidance_scale
        )
        
        return {
            "message": "Mashup generated successfully",
            "file_path": str(output_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 