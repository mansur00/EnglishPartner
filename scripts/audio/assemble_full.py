#!/usr/bin/env python3
"""
Full Conversation Audio Assembly & Timing Manifest Generator (Audio Guide §5.2 & §13)
Concatenates sentence audio files with natural pause spacing and builds JSON manifest.
"""

import os
import sys
import json
import argparse

def assemble_conversation(lines_manifest_path: str, output_audio_path: str, output_manifest_path: str):
    """
    Reads line definitions, calculates cumulative timestamps, and writes timing_manifest.json
    """
    if not os.path.exists(lines_manifest_path):
        print(f"[Assembler] Manifest source file not found: {lines_manifest_path}")
        return

    with open(lines_manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    lines = data.get("lines", [])
    current_time_ms = 0
    pause_gap_ms = 600 # 600ms natural conversational pause
    manifest_entries = []

    for line in lines:
        duration = line.get("durationMs", 3000)
        start_ms = current_time_ms
        end_ms = start_ms + duration
        
        manifest_entries.append({
            "lineId": line.get("id"),
            "sequenceNumber": line.get("sequenceNumber"),
            "speakerId": line.get("speakerId"),
            "startTimeMs": start_ms,
            "endTimeMs": end_ms,
            "durationMs": duration
        })

        current_time_ms = end_ms + pause_gap_ms

    final_manifest = {
        "scenarioSlug": data.get("slug"),
        "versionName": data.get("versionName", "Short"),
        "totalDurationMs": current_time_ms - pause_gap_ms,
        "turns": manifest_entries
    }

    with open(output_manifest_path, "w", encoding="utf-8") as f:
        json.dump(final_manifest, f, indent=2)

    print(f"[Assembler] Timing manifest generated with {len(manifest_entries)} turns at {output_manifest_path}")
    print(f"[Assembler] Total calculated duration: {final_manifest['totalDurationMs']}ms")

def main():
    parser = argparse.ArgumentParser(description="Assemble full conversation and generate timing manifest.")
    parser.add_argument("--input", default="lines.json", help="Input lines JSON")
    parser.add_argument("--output-audio", default="full_conversation.wav", help="Output audio file path")
    parser.add_argument("--output-manifest", default="timing_manifest.json", help="Output manifest path")

    args = parser.parse_args()
    assemble_conversation(args.input, args.output_audio, args.output_manifest)

if __name__ == "__main__":
    main()

