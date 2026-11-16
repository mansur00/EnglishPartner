#!/usr/bin/env python3
"""
Sentence Audio Generation Script (Audio Guide §13)
Offline generator using Piper TTS (or standard TTS adapter interface).
Usage: python3 generate_line.py --text "Sentence to speak" --voice en_US-lessac --output path/to/output.wav
"""

import sys
import argparse
import subprocess
import shutil

def generate_sentence_audio(text: str, voice_model: str, output_path: str):
    print(f"[TTS Pipeline] Generating audio for: '{text}' (Voice: {voice_model})")
    
    # 1. Check if piper binary exists
    piper_bin = shutil.which("piper")
    if piper_bin:
        cmd = [
            piper_bin,
            "--model", voice_model,
            "--output_file", output_path
        ]
        proc = subprocess.run(cmd, input=text.encode("utf-8"), capture_output=True)
        if proc.returncode == 0:
            print(f"[TTS Pipeline] Successfully generated {output_path}")
            return True
        else:
            print(f"[TTS Pipeline] Piper execution error: {proc.stderr.decode('utf-8')}")
            return False
    else:
        print("[TTS Pipeline] Notice: 'piper' binary not found on local PATH.")
        print("[TTS Pipeline] For web client, native Web Speech Synthesis is currently utilized as active runtime player.")
        return False

def main():
    parser = argparse.ArgumentParser(description="Generate sentence audio using Piper TTS.")
    parser.add_argument("--text", required=True, help="English sentence string")
    parser.add_argument("--voice", default="en_US-lessac-medium", help="Piper voice model name")
    parser.add_argument("--output", default="output.wav", help="Output file path")

    args = parser.parse_args()
    generate_sentence_audio(args.text, args.voice, args.output)

if __name__ == "__main__":
    main()
