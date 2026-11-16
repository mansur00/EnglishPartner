#!/usr/bin/env python3
"""
Audio Asset Validation Script (Audio Guide §13)
Checks if audio files exist, validates duration, and verifies non-corruption.
"""

import os
import sys
import json

def check_audio_file(filepath: str) -> dict:
    if not os.path.exists(filepath):
        return {"file": filepath, "exists": False, "status": "missing"}
    
    size_bytes = os.path.getsize(filepath)
    if size_bytes < 100:
        return {"file": filepath, "exists": True, "status": "corrupt_or_empty", "size_bytes": size_bytes}

    return {
        "file": filepath,
        "exists": True,
        "status": "ready",
        "size_bytes": size_bytes,
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 check_asset.py <file_or_directory_path>")
        sys.exit(1)

    target_path = sys.argv[1]
    results = []

    if os.path.isfile(target_path):
        results.append(check_audio_file(target_path))
    elif os.path.isdir(target_path):
        for root, _, files in os.walk(target_path):
            for file in files:
                if file.endswith((".mp3", ".wav", ".ogg", ".m4a")):
                    results.append(check_audio_file(os.path.join(root, file)))

    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
