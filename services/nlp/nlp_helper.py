#!/usr/bin/env python3
"""
English Conversation Partner - Offline NLP Helper Service.

Provides:
- Tokenization
- Lemmatization
- Part-of-Speech (POS) tagging
- Target vocabulary candidate extraction for dialogue seed preparation

Uses spaCy (`en_core_web_sm`) when available, with a built-in rule-based fallback
so content developers can run this script without mandatory heavy installations.
"""

import sys
import re
import json
from typing import List, Dict, Any, Optional

try:
    import spacy
    _SPACY_AVAILABLE = True
    try:
        _nlp = spacy.load("en_core_web_sm")
    except Exception:
        _nlp = None
except ImportError:
    _SPACY_AVAILABLE = False
    _nlp = None


def analyze_sentence_spacy(sentence: str) -> List[Dict[str, Any]]:
    """Analyzes a sentence using spaCy model."""
    if not _nlp:
        raise RuntimeError("spaCy model en_core_web_sm is not loaded.")
    doc = _nlp(sentence)
    tokens_data = []
    for token in doc:
        if token.is_punct or token.is_space:
            continue
        tokens_data.append({
            "text": token.text,
            "lemma": token.lemma_.lower(),
            "pos": token.pos_.lower(),
            "tag": token.tag_,
            "dep": token.dep_,
            "is_stop": token.is_stop,
        })
    return tokens_data


def analyze_sentence_fallback(sentence: str) -> List[Dict[str, Any]]:
    """
    Lightweight rule-based fallback when spaCy is not installed.
    Extracts tokens, cleans punctuation, and applies basic POS heuristics.
    """
    words = re.findall(r"\b[A-Za-z]+(?:'[A-Za-z]+)?\b", sentence)
    stop_words = {
        "a", "an", "the", "in", "on", "at", "to", "for", "with", "is", "are",
        "was", "were", "it", "this", "that", "you", "i", "we", "they", "he", "she",
        "and", "but", "or", "so", "if", "of", "do", "does", "did"
    }

    results = []
    for word in words:
        lower = word.lower()
        is_stop = lower in stop_words

        # Basic lemmatization rules
        lemma = lower
        if lower.endswith("ing") and len(lower) > 5:
            lemma = lower[:-3]
        elif lower.endswith("ed") and len(lower) > 4:
            lemma = lower[:-2]
        elif lower.endswith("s") and not lower.endswith("ss") and len(lower) > 3:
            lemma = lower[:-1]

        # Heuristic POS guess
        if lower in {"cost", "costs", "tell", "speak", "check", "clarify", "prioritize"}:
            pos = "verb"
        elif lower in {"jacket", "passport", "flight", "wireframe", "wireframes", "discount", "room"}:
            pos = "noun"
        elif lower in {"blue", "certain", "good", "medium", "expensive"}:
            pos = "adjective"
        elif lower in {"certainly", "quickly", "loudly", "today", "now"}:
            pos = "adverb"
        else:
            pos = "noun" if not is_stop else "particle"

        results.append({
            "text": word,
            "lemma": lemma,
            "pos": pos,
            "tag": pos.upper(),
            "dep": "token",
            "is_stop": is_stop,
        })
    return results


def analyze_sentence(sentence: str) -> Dict[str, Any]:
    """
    Public API: Analyzes a sentence and extracts vocabulary candidates.
    """
    if _nlp is not None:
        tokens = analyze_sentence_spacy(sentence)
        engine = "spacy (en_core_web_sm)"
    else:
        tokens = analyze_sentence_fallback(sentence)
        engine = "rule-based-fallback"

    # Identify candidate target vocabulary (content words, non-stopwords)
    candidates = [
        t for t in tokens
        if not t["is_stop"] and len(t["lemma"]) > 2
    ]

    return {
        "engine": engine,
        "original_text": sentence,
        "token_count": len(tokens),
        "tokens": tokens,
        "target_vocabulary_candidates": candidates,
    }


def main():
    if len(sys.argv) > 1:
        sentence = " ".join(sys.argv[1:])
    else:
        sentence = "Excuse me, could you tell me how much this blue jacket costs?"

    print(f"=== Offline NLP Helper Analysis ===")
    analysis = analyze_sentence(sentence)
    print(json.dumps(analysis, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
