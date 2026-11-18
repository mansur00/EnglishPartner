"""
Gemini TTS Provider (Audio Spec A-11)
Offline audio generation provider only. Never imported or called in product code.
Approved model: gemini-3.8-flash-tts
"""

import base64
import os

PIPELINE_VERSION = 1

class GeminiProvider:
    name = "gemini"

    def __init__(self, model: str = "gemini-3.8-flash-tts"):
        # Approved model per amendment A-11 and voices.json
        if model != "gemini-3.8-flash-tts" and model != "gemini-3.8-flash-lite-tts":
            raise ValueError(f"Unapproved model '{model}'. Approved models: 'gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'")
        self.model = model

    def synthesize(self, text: str, voice_id: str, style: str = "neutral and polite") -> bytes:
        """Return audio bytes for verbatim scripted text."""
        # Dynamic import inside offline script method only
        from google import genai
        client = genai.Client()
        
        interaction = client.interactions.create(
            model=self.model,
            input=[{
                "type": "user_input",
                "content": [{
                    "type": "text",
                    "text": text,
                    "annotations": [{"type": "speech_metadata", "style": style}],
                }],
            }],
            response_modalities=["AUDIO"],
            voice_config={"voice_id": voice_id},
        )
        for part in interaction.output[0].content:
            if part.type == "audio":
                return base64.b64decode(part.data)
        raise RuntimeError("Gemini TTS response contained no audio payload")
