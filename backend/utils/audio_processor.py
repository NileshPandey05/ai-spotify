import torch
import torchaudio
from pathlib import Path
import soundfile as sf
from pydub import AudioSegment
import numpy as np
import asyncio
from typing import Dict, Tuple

# Initialize Demucs model
model = None

async def load_model():
    global model
    if model is None:
        # Load the pre-trained Demucs model
        model = torch.hub.load("facebookresearch/demucs", "demucs")
        model.eval()
        if torch.cuda.is_available():
            model.cuda()

async def process_audio_files(file1_path: Path, file2_path: Path) -> Dict[str, str]:
    """
    Process two audio files using Demucs to separate vocals and instrumentals
    """
    await load_model()
    
    # Process first file for vocals
    vocals_path = await separate_track(file1_path, "vocals")
    
    # Process second file for instrumentals
    instrumentals_path = await separate_track(file2_path, "no_vocals")
    
    return {
        "vocals": vocals_path.name,
        "instrumentals": instrumentals_path.name
    }

async def separate_track(file_path: Path, target: str) -> Path:
    """
    Separate a single track into vocals or instrumentals using Demucs
    """
    # Load audio file
    audio, sr = torchaudio.load(file_path)
    
    # Convert to mono if stereo
    if audio.shape[0] > 1:
        audio = audio.mean(dim=0, keepdim=True)
    
    # Process with Demucs
    with torch.no_grad():
        if torch.cuda.is_available():
            audio = audio.cuda()
        separated = model(audio)
        
        # Get the appropriate track (vocals or no_vocals)
        if target == "vocals":
            track = separated[0]  # Vocals track
        else:
            track = separated[1]  # No vocals track
    
    # Convert back to CPU and numpy
    track = track.cpu().numpy()
    
    # Save the separated track
    output_path = Path("processed") / f"{file_path.stem}_{target}.wav"
    sf.write(output_path, track[0], sr)
    
    return output_path

async def create_mashup(vocals_path: Path, instrumentals_path: Path, output_path: Path):
    """
    Create a mashup by combining vocals from one track with instrumentals from another
    """
    # Load audio files
    vocals = AudioSegment.from_wav(vocals_path)
    instrumentals = AudioSegment.from_wav(instrumentals_path)
    
    # Normalize volumes
    vocals = vocals.normalize()
    instrumentals = instrumentals.normalize()
    
    # Overlay the tracks
    mashup = instrumentals.overlay(vocals)
    
    # Export the mashup
    mashup.export(output_path, format="mp3")
    
    return output_path 