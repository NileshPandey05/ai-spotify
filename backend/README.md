# AI Music Mashup Backend

This is the backend service for the AI Music Mashup application. It uses FastAPI and Demucs to process audio files and create mashups.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create required directories:
```bash
mkdir uploads processed mashups
```

## Running the Server

Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`

## API Endpoints

1. **Upload Files**
   - POST `/upload`
   - Accepts two audio files (file1 and file2)
   - Returns file names for processing

2. **Process Files**
   - POST `/process`
   - Takes file names from upload
   - Separates vocals and instrumentals using Demucs
   - Returns processed file names

3. **Create Mashup**
   - POST `/mashup`
   - Takes processed vocals and instrumentals files
   - Creates a mashup
   - Returns mashup ID

4. **Get Mashup**
   - GET `/mashup/{mashup_id}`
   - Returns the generated mashup file

## Requirements

- Python 3.8+
- CUDA-capable GPU (recommended for faster processing)
- 8GB+ RAM
- 10GB+ free disk space

## Notes

- The first run will download the Demucs model (~1GB)
- Processing time depends on your hardware
- Audio files should be in a common format (MP3, WAV, etc.) 