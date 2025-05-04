import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import soundfile as sf
from pathlib import Path
import numpy as np
from enum import Enum

class MusicGenModel(str, Enum):
    SMALL = "facebook/musicgen-small"
    MEDIUM = "facebook/musicgen-medium"
    LARGE = "facebook/musicgen-large"
    MELODY = "facebook/musicgen-melody"

class MusicGenerator:
    def __init__(self):
        self.processor = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.current_model = None

    async def load_model(self, model_name: MusicGenModel = MusicGenModel.SMALL):
        if self.current_model != model_name:
            self.processor = AutoProcessor.from_pretrained(model_name)
            self.model = MusicgenForConditionalGeneration.from_pretrained(model_name)
            self.model.to(self.device)
            self.current_model = model_name

    async def generate_music(
        self,
        prompt: str,
        output_path: Path,
        duration: int = 10,
        model: MusicGenModel = MusicGenModel.SMALL,
        temperature: float = 1.0,
        top_k: int = 250,
        top_p: float = 0.0,
        guidance_scale: float = 3.0,
        num_beams: int = 1
    ) -> Path:
        """
        Generate music based on a text prompt
        Args:
            prompt: Text description of the music to generate
            output_path: Path to save the generated audio
            duration: Duration in seconds
            model: MusicGen model to use
            temperature: Sampling temperature (higher = more random)
            top_k: Number of highest probability tokens to keep
            top_p: Cumulative probability for top-p sampling
            guidance_scale: Guidance scale for classifier-free guidance
            num_beams: Number of beams for beam search
        """
        await self.load_model(model)

        # Generate audio
        inputs = self.processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        ).to(self.device)

        # Generate audio with enhanced parameters
        audio_values = self.model.generate(
            **inputs,
            do_sample=True,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            guidance_scale=guidance_scale,
            num_beams=num_beams,
            max_new_tokens=256,
            duration=duration
        )

        # Convert to numpy array
        audio = audio_values[0].cpu().numpy()

        # Save the audio
        sf.write(output_path, audio, self.processor.sampling_rate)

        return output_path

    async def generate_mashup(
        self,
        vocals_path: Path,
        prompt: str,
        output_path: Path,
        model: MusicGenModel = MusicGenModel.MELODY,
        temperature: float = 1.0,
        guidance_scale: float = 3.0
    ) -> Path:
        """
        Generate instrumental music based on vocals and a prompt
        """
        await self.load_model(model)

        # Load vocals
        vocals, sr = sf.read(vocals_path)

        # Generate matching instrumental
        inputs = self.processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        ).to(self.device)

        # Generate audio with enhanced parameters
        audio_values = self.model.generate(
            **inputs,
            do_sample=True,
            temperature=temperature,
            guidance_scale=guidance_scale,
            max_new_tokens=256,
            duration=len(vocals) / sr
        )

        # Convert to numpy array
        instrumentals = audio_values[0].cpu().numpy()

        # Mix vocals and instrumentals with improved mixing
        mixed = vocals + instrumentals
        mixed = mixed / np.max(np.abs(mixed))  # Normalize

        # Apply subtle compression
        threshold = 0.7
        ratio = 0.8
        mixed = np.where(np.abs(mixed) > threshold,
                        threshold + (np.abs(mixed) - threshold) * ratio,
                        mixed) * np.sign(mixed)

        # Save the mashup
        sf.write(output_path, mixed, sr)

        return output_path