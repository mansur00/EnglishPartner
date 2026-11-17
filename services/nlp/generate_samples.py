#!/usr/bin/env python3
"""
Extracts dialogue lines from dialogues.ts, annotates 3 real conversations,
writes data/grammar/<slug>.json, and prints a human-readable dump of 10 sentences.
"""

import os
import sys
import re
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from annotate import annotate_source, analyze_sentence

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_GRAMMAR = os.path.join(BASE_DIR, "data", "grammar")
os.makedirs(DATA_GRAMMAR, exist_ok=True)

DIALOGUES_FILE = os.path.join(BASE_DIR, "src", "content", "seed", "dialogues.ts")

def parse_dialogue_lines():
    with open(DIALOGUES_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    slugs = ["asking-price-product-details", "airport-checkin-baggage-drop", "designer-client-kickoff-questions"]
    conversations = {}

    for slug in slugs:
        lines = []
        # Find where this slug starts
        pos = content.find(f'"{slug}":')
        if pos != -1:
            # Find the end of this conversation block or next slug
            end_pos = len(content)
            for other_slug in slugs:
                if other_slug != slug:
                    p = content.find(f'"{other_slug}":', pos + 1)
                    if p != -1 and p < end_pos:
                        end_pos = p
            block = content[pos:end_pos]
            line_matches = re.findall(r'id:\s*"(line-[^"]+)",[\s\S]*?englishText:\s*"([^"]+)"', block)
            for lid, text in line_matches:
                lines.append({"lineId": lid, "text": text})
        conversations[slug] = lines

    return conversations

def main():
    conversations = parse_dialogue_lines()
    all_sample_sentences = []

    for slug, lines in conversations.items():
        if not lines:
            continue
        print(f"Annotating conversation: {slug} ({len(lines)} lines)...")
        ann = annotate_source(f"conversations/{slug}", lines)
        out_path = os.path.join(DATA_GRAMMAR, f"{slug}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(ann, f, indent=2, ensure_ascii=False)
        print(f"  ✓ Saved to {out_path}")

        for l in lines:
            if len(all_sample_sentences) < 10:
                all_sample_sentences.append(l["text"])

    print("\n" + "="*70)
    print("      HUMAN-READABLE DUMP OF 10 ANNOTATED SENTENCES")
    print("="*70 + "\n")

    for i, s in enumerate(all_sample_sentences, 1):
        res = analyze_sentence(s)
        print(f"[{i}] \"{s}\"")
        print(f"    Sentence Type: {res['sentence']['function'].upper()}, Structure: {res['sentence']['structure'].upper()}")

        # Print Tokens with POS and Roles
        tok_strs = []
        for t in res["tokens"]:
            if t["pos"] != "punctuation":
                role_info = f" (role: {t['role']})" if t['role'] else ""
                tok_strs.append(f"{t['text']}[{t['pos']}{role_info}]")
        print(f"    Tokens: {' '.join(tok_strs)}")

        # Print Verb Groups & Tenses
        vgs = [g for g in res["groups"] if g["type"] == "verb-group"]
        if vgs:
            for vg in vgs:
                words = [res["tokens"][idx]["text"] for idx in vg["tokens"]]
                keys = ", ".join(vg["keys"])
                print(f"    Verb Group: '{' '.join(words)}' -> Tense/Voice: [{keys}], Time: {vg['time']}, Aspect: {vg['aspect']}")

        # Print Patterns
        pats = [g for g in res["groups"] if g["type"] == "pattern"]
        if pats:
            for p in pats:
                print(f"    Pattern: {p['key']} (family: {p['family']})")
        print("-" * 70)

if __name__ == "__main__":
    main()
