#!/usr/bin/env python3
"""
EnglishPartner Offline Grammar Annotator (spaCy + Deterministic Rule Engine)
Performs tokenization, POS tagging, verb-group tense/voice detection, role mapping,
pattern recognition, and sentence classification.
Outputs JSON conforming to EnglishPartner_Grammar_ColorCoding_Spec.md section 7.2.
"""

import sys
import os
import re
import json
import hashlib
from typing import List, Dict, Any, Optional, Tuple, Set

try:
    import spacy
    _NLP = spacy.load("en_core_web_sm")
except Exception:
    _NLP = None

TAXONOMY_VERSION = 1
TAGGER_VERSION = "spacy-en_core_web_sm+rules-1.0"

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
LISTS_DIR = os.path.join(BASE_DIR, "data", "grammar", "lists")
OVERRIDES_DIR = os.path.join(BASE_DIR, "data", "grammar", "overrides")

def load_json_list(filename: str) -> list:
    path = os.path.join(LISTS_DIR, filename)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

PHRASAL_VERBS = load_json_list("phrasal-verbs.json")
LINKING_WORDS = load_json_list("linking-words.json")
IDIOMS = load_json_list("idioms.json")

POS_MAP = {
    "NOUN": "noun",
    "PROPN": "noun",
    "PRON": "pronoun",
    "VERB": "verb",
    "AUX": "verb",
    "ADJ": "adjective",
    "ADV": "adverb",
    "ADP": "preposition",
    "CCONJ": "conjunction",
    "SCONJ": "conjunction",
    "DET": "determiner",
    "INTJ": "interjection",
    "PART": "particle",
    "NUM": "determiner",
    "PUNCT": "punctuation",
    "SYM": "symbol",
    "X": "particle"
}

DEP_ROLE_MAP = {
    "nsubj": "subject",
    "nsubjpass": "subject",
    "csubj": "subject",
    "dobj": "direct-object",
    "obj": "direct-object",
    "iobj": "indirect-object",
    "dative": "indirect-object",
    "attr": "subject-complement",
    "acomp": "subject-complement",
    "oprd": "object-complement",
    "agent": "agent",
    "expl": "expletive",
    "npadvmod": "adverbial",
    "advmod": "adverbial",
    "pobj": "prepositional-object",
    "appos": "appositive"
}


def compute_text_hash(text: str) -> str:
    payload = f"{text}|{TAXONOMY_VERSION}|{TAGGER_VERSION}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def collect_verb_group_tokens(head_token, doc) -> List[int]:
    """Recursively collects all auxiliary and particle tokens belonging to a main verb."""
    collected = {head_token.i}
    to_visit = [head_token]

    while to_visit:
        curr = to_visit.pop()
        for child in curr.children:
            if child.dep_ in {"aux", "auxpass", "neg", "prt"}:
                if child.i not in collected:
                    collected.add(child.i)
                    to_visit.append(child)
            # Handle "going to + V" or "used to + V"
            if child.dep_ == "xcomp" and child.pos_ in {"VERB", "AUX"}:
                if curr.lemma_.lower() in {"go", "use"}:
                    collected.add(child.i)
                    to_visit.append(child)

    return sorted(list(collected))


def analyze_sentence(text: str, nlp_model=None) -> Dict[str, Any]:
    model = nlp_model or _NLP
    if model is None:
        raise RuntimeError("spaCy model is not loaded. Run services/nlp/.venv/bin/python.")

    doc = model(text)
    tokens_out = []

    # 1. TOKEN ANALYSIS
    for i, token in enumerate(doc):
        pos_key = POS_MAP.get(token.pos_, "particle")
        sub_type = None

        if token.pos_ == "NOUN":
            sub_type = "proper" if token.tag_ in {"NNP", "NNPS"} else "common"
        elif token.pos_ == "PRON":
            sub_type = "personal-subject" if token.tag_ == "PRP" and token.dep_ == "nsubj" else "personal-object"
        elif token.pos_ == "NUM":
            sub_type = "numeral"
        elif token.tag_ == "MD":
            sub_type = "modal"
        elif token.lemma_ in {"be", "have", "do"}:
            sub_type = "auxiliary"

        role = DEP_ROLE_MAP.get(token.dep_)
        if token.pos_ in {"VERB", "AUX"}:
            role = "verb-phrase"

        tokens_out.append({
            "i": i,
            "text": token.text,
            "start": token.idx,
            "end": token.idx + len(token.text),
            "lemma": token.lemma_.lower(),
            "pos": pos_key,
            "sub": sub_type,
            "tag": token.tag_,
            "dep": token.dep_,
            "role": role,
            "head": token.head.i,
            "confidence": 0.95
        })

    # 2. VERB GROUP ANALYZER
    groups = []
    vg_counter = 1

    candidate_heads = []
    for token in doc:
        if token.pos_ in {"VERB", "AUX"} or token.tag_ == "MD":
            if token.dep_ not in {"aux", "auxpass"}:
                candidate_heads.append(token)

    if not candidate_heads:
        candidate_heads = [t for t in doc if t.pos_ in {"VERB", "AUX"}]

    processed_tokens: Set[int] = set()

    for head in candidate_heads:
        if head.i in processed_tokens:
            continue

        group_tokens = collect_verb_group_tokens(head, doc)
        processed_tokens.update(group_tokens)

        words = [doc[i].text.lower() for i in group_tokens]
        lemmas = [doc[i].lemma_.lower() for i in group_tokens]
        tags = [doc[i].tag_ for i in group_tokens]

        tense_key = None
        time_ref = None
        aspect_ref = "simple"
        voice_ref = "voice-active"
        modal_family = None

        has_will = any(w in {"will", "shall", "'ll"} for w in words)
        has_would = any(w in {"would", "'d"} for w in words)
        has_have = any(w in {"have", "has", "'ve"} for w in words)
        has_had = "had" in words
        has_be_pres = any(w in {"am", "is", "are", "'m", "'s", "'re"} for w in words)
        has_be_past = any(w in {"was", "were"} for w in words)
        has_be_any = any(w in {"be", "been", "being", "am", "is", "are", "was", "were", "'m", "'s", "'re"} for w in words)
        has_been = "been" in words
        has_being = "being" in words
        has_ving = any(t == "VBG" for t in tags)
        has_v3 = any(t == "VBN" for t in tags)
        lexical_v3 = any(t == "VBN" and doc[i].lemma_.lower() != "be" for i, t in zip(group_tokens, tags))
        has_auxpass = any(doc[i].dep_ == "auxpass" for i in group_tokens)

        # Check Passive: be + V3 of main lexical verb
        if (has_auxpass or (has_be_any and lexical_v3)) and not has_ving:
            voice_ref = "voice-passive"
        elif has_being and lexical_v3:
            voice_ref = "voice-passive"
        else:
            voice_ref = "voice-active"

        # Check Modals
        if any(w in {"could", "would"} for w in words) and any(d.text.lower() == "you" for d in doc):
            modal_family = "modal-request"
        elif "can" in words or "could" in words:
            modal_family = "modal-ability"
        elif "must" in words or "should" in words or "ought" in words:
            modal_family = "modal-obligation"
        elif "may" in words or "might" in words:
            modal_family = "modal-possibility"

        # Check Future Going To & Used To
        if "going" in words and "to" in words and has_be_pres:
            tense_key = "future-going-to"
            time_ref = "future"
        elif "used" in words and "to" in words:
            tense_key = "used-to"
            time_ref = "past"
        # 12 Tenses
        elif has_will:
            time_ref = "future"
            if has_have and has_been and has_ving:
                tense_key = "future-perfect-continuous"
                aspect_ref = "perfect-continuous"
            elif has_have and has_v3:
                tense_key = "future-perfect"
                aspect_ref = "perfect"
            elif ("be" in words or has_been) and has_ving:
                tense_key = "future-continuous"
                aspect_ref = "continuous"
            else:
                tense_key = "future-simple"
                aspect_ref = "simple"
        elif has_have and has_been and has_ving:
            tense_key = "present-perfect-continuous"
            time_ref = "present"
            aspect_ref = "perfect-continuous"
        elif has_have and has_v3 and (not has_been or voice_ref == "voice-passive" or not has_ving):
            tense_key = "present-perfect"
            time_ref = "present"
            aspect_ref = "perfect"
        elif has_had and has_been and has_ving:
            tense_key = "past-perfect-continuous"
            time_ref = "past"
            aspect_ref = "perfect-continuous"
        elif has_had and has_v3 and (not has_been or voice_ref == "voice-passive" or not has_ving):
            tense_key = "past-perfect"
            time_ref = "past"
            aspect_ref = "perfect"
        elif has_be_pres and has_ving and not has_been:
            tense_key = "present-continuous"
            time_ref = "present"
            aspect_ref = "continuous"
        elif has_be_past and has_ving and not has_been:
            tense_key = "past-continuous"
            time_ref = "past"
            aspect_ref = "continuous"
        elif has_be_past or any(t == "VBD" for t in tags) or "did" in words:
            tense_key = "past-simple"
            time_ref = "past"
            aspect_ref = "simple"
        elif has_be_pres or any(t in {"VBP", "VBZ"} for t in tags) or "do" in words or "does" in words:
            tense_key = "present-simple"
            time_ref = "present"
            aspect_ref = "simple"
        elif tags == ["VB"] and group_tokens[0] == 0:
            tense_key = "mood-imperative"
            time_ref = "present"

        keys = []
        if tense_key:
            keys.append(tense_key)
        if voice_ref:
            keys.append(voice_ref)
        if modal_family:
            keys.append(modal_family)

        groups.append({
            "id": f"vg-{vg_counter}",
            "type": "verb-group",
            "tokens": group_tokens,
            "keys": keys,
            "time": time_ref,
            "aspect": aspect_ref,
            "voice": voice_ref,
            "confidence": 0.95
        })
        vg_counter += 1

    # 3. PATTERNS
    lower_text = text.lower()
    pattern_counter = 1

    if lower_text.startswith("if ") or " if " in lower_text:
        cond_key = "conditional-first"
        if "had" in lower_text and ("would have" in lower_text or "could have" in lower_text):
            cond_key = "conditional-third"
        elif ("would" in lower_text or "could" in lower_text) and not ("would have" in lower_text):
            cond_key = "conditional-second"
        elif "will" not in lower_text and "would" not in lower_text:
            cond_key = "conditional-zero"
        groups.append({
            "id": f"pat-{pattern_counter}",
            "type": "pattern",
            "key": cond_key,
            "family": "conditional",
            "tokens": list(range(len(doc))),
            "confidence": 0.92
        })
        pattern_counter += 1

    if re.search(r"\b(could you|would you|would you mind|may i)\b", lower_text):
        groups.append({
            "id": f"pat-{pattern_counter}",
            "type": "pattern",
            "key": "polite-request",
            "family": "discourse",
            "tokens": list(range(min(6, len(doc)))),
            "confidence": 0.94
        })
        pattern_counter += 1

    if re.search(r"\bthere (is|are|was|were|has been|will be)\b", lower_text):
        groups.append({
            "id": f"pat-{pattern_counter}",
            "type": "pattern",
            "key": "there-is-are",
            "family": "existential",
            "tokens": [i for i, t in enumerate(doc) if t.text.lower() in {"there", "is", "are", "was", "were"}],
            "confidence": 0.96
        })
        pattern_counter += 1

    if re.search(r"\b(more|less|better|worse|faster|cheaper|taller|larger)\b", lower_text) or " than " in lower_text:
        groups.append({
            "id": f"pat-{pattern_counter}",
            "type": "pattern",
            "key": "comparative",
            "family": "comparison",
            "tokens": [i for i, t in enumerate(doc) if t.tag_ in {"JJR", "RBR"} or t.text.lower() in {"more", "than"}],
            "confidence": 0.92
        })
        pattern_counter += 1

    for pv in PHRASAL_VERBS:
        v_parts = pv["verb"].split()
        if len(v_parts) == 2:
            verb_stem, particle = v_parts
            for i in range(len(doc) - 1):
                if doc[i].lemma_.lower() == verb_stem and doc[i+1].text.lower() == particle:
                    groups.append({
                        "id": f"pat-{pattern_counter}",
                        "type": "pattern",
                        "key": "phrasal-verb-pattern",
                        "family": "verb",
                        "tokens": [i, i+1],
                        "confidence": 0.95
                    })
                    pattern_counter += 1

    # 4. SENTENCE METADATA
    func = "declarative"
    if text.strip().endswith("?"):
        func = "interrogative"
    elif text.strip().endswith("!"):
        func = "exclamatory"
    elif len(doc) > 0 and doc[0].tag_ == "VB" and doc[0].dep_ == "ROOT":
        func = "imperative"

    struct = "simple"
    subord_count = sum(1 for t in doc if t.dep_ in {"advcl", "ccomp", "relcl", "mark"})
    coord_count = sum(1 for t in doc if t.dep_ == "cc")
    if subord_count > 0 and coord_count > 0:
        struct = "compound-complex"
    elif subord_count > 0:
        struct = "complex"
    elif coord_count > 0:
        struct = "compound"

    return {
        "text": text,
        "textHash": compute_text_hash(text),
        "tokens": tokens_out,
        "groups": groups,
        "sentence": {
            "function": func,
            "structure": struct
        }
    }


def annotate_source(source_id: str, lines: List[Dict[str, Any]]) -> Dict[str, Any]:
    annotated_lines = []
    for line in lines:
        line_id = line["lineId"]
        raw_text = line["text"]
        result = analyze_sentence(raw_text)
        annotated_lines.append({
            "lineId": line_id,
            "text": raw_text,
            "textHash": result["textHash"],
            "override": False,
            "tokens": result["tokens"],
            "groups": result["groups"],
            "sentence": result["sentence"]
        })

    return {
        "taxonomyVersion": TAXONOMY_VERSION,
        "taggerVersion": TAGGER_VERSION,
        "sourceId": source_id,
        "lines": annotated_lines
    }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="EnglishPartner Grammar Annotator CLI")
    parser.add_argument("--text", type=str, help="Single sentence to analyze")
    parser.add_argument("--json", action="store_true", help="Output formatted JSON")
    parser.add_argument("--file", type=str, help="Input JSON file with lines to annotate")
    parser.add_argument("--out", type=str, help="Output JSON file path")
    args = parser.parse_args()

    if args.text:
        res = analyze_sentence(args.text)
        print(json.dumps(res, indent=2))
    elif args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            in_data = json.load(f)
        src_id = in_data.get("sourceId", "unknown")
        lines = in_data.get("lines", [])
        out_data = annotate_source(src_id, lines)
        if args.out:
            with open(args.out, "w", encoding="utf-8") as f:
                json.dump(out_data, f, indent=2)
            print(f"Annotated {len(lines)} lines -> {args.out}")
        else:
            print(json.dumps(out_data, indent=2))
    else:
        print("EnglishPartner Grammar Annotator CLI: provide --text or --file")

