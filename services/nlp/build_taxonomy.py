#!/usr/bin/env python3
"""
Generates the complete grammar taxonomy, label catalogs (EN/BN), rule cards,
and author lists per EnglishPartner_Grammar_ColorCoding_Spec.md section 5 & 8.
"""
import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC_GRAMMAR = os.path.join(BASE_DIR, "src", "content", "grammar")
DATA_LISTS = os.path.join(BASE_DIR, "data", "grammar", "lists")

os.makedirs(SRC_GRAMMAR, exist_ok=True)
os.makedirs(DATA_LISTS, exist_ok=True)

# 1. TAXONOMY CATALOG
TAXONOMY = {
  "version": 1,
  "layers": {
    "pos": { "id": "pos", "name": "Parts of Speech", "channel": "color", "order": 1 },
    "role": { "id": "role", "name": "Sentence Roles", "channel": "tint+underline", "order": 2 },
    "tense": { "id": "tense", "name": "Verbs and Tenses", "channel": "bar", "order": 3 },
    "phrase": { "id": "phrase", "name": "Phrases and Clauses", "channel": "bracket", "order": 4 },
    "pattern": { "id": "pattern", "name": "Patterns and Special Rules", "channel": "overline+chip", "order": 5 }
  },
  "categories": {
    # 5.1 Parts of Speech (pos)
    "noun": { "layer": "pos", "level": "basic", "subtypes": ["common", "proper", "countable", "uncountable", "collective", "abstract", "concrete", "singular", "plural", "possessive"] },
    "pronoun": { "layer": "pos", "level": "basic", "subtypes": ["personal-subject", "personal-object", "possessive", "reflexive", "demonstrative", "relative", "interrogative", "indefinite", "reciprocal"] },
    "verb": { "layer": "pos", "level": "basic", "subtypes": ["main", "auxiliary", "modal", "linking", "phrasal"] },
    "adjective": { "layer": "pos", "level": "basic", "subtypes": ["attributive", "predicative", "comparative", "superlative", "participial"] },
    "adverb": { "layer": "pos", "level": "basic", "subtypes": ["manner", "time", "place", "frequency", "degree", "sentence", "interrogative", "relative"] },
    "preposition": { "layer": "pos", "level": "basic", "subtypes": ["place", "time", "direction", "agent", "dependent"] },
    "conjunction": { "layer": "pos", "level": "basic", "subtypes": ["coordinating", "subordinating", "correlative"] },
    "determiner": { "layer": "pos", "level": "basic", "subtypes": ["article-definite", "article-indefinite", "demonstrative", "possessive", "quantifier", "numeral", "distributive", "interrogative"] },
    "interjection": { "layer": "pos", "level": "basic", "subtypes": ["greeting", "surprise", "emotion", "pause"] },
    "particle": { "layer": "pos", "level": "basic", "subtypes": ["infinitive-to", "negation", "phrasal-particle"] },
    "numeral": { "layer": "pos", "level": "advanced", "parent": "determiner", "subtypes": ["cardinal", "ordinal"] },

    # 5.2 Sentence Roles (role)
    "subject": { "layer": "role", "level": "basic", "underline": "solid" },
    "verb-phrase": { "layer": "role", "level": "basic", "underline": "double" },
    "direct-object": { "layer": "role", "level": "basic", "underline": "dotted" },
    "indirect-object": { "layer": "role", "level": "advanced", "underline": "dashed" },
    "subject-complement": { "layer": "role", "level": "advanced", "underline": "wavy" },
    "object-complement": { "layer": "role", "level": "advanced", "underline": "wavy" },
    "adverbial": { "layer": "role", "level": "advanced", "underline": "dotted", "subtypes": ["time", "place", "manner", "reason", "condition", "concession", "purpose", "frequency", "degree"] },
    "prepositional-object": { "layer": "role", "level": "advanced", "underline": "dashed" },
    "agent": { "layer": "role", "level": "advanced", "underline": "solid" },
    "expletive": { "layer": "role", "level": "advanced", "underline": "dotted" },
    "vocative": { "layer": "role", "level": "advanced", "underline": "dashed" },
    "appositive": { "layer": "role", "level": "advanced", "underline": "double" },

    # 5.3 Verbs and Tenses (12 tenses + related)
    "present-simple": { "layer": "tense", "level": "basic", "time": "present", "aspect": "simple", "formula": "V1 / V-s" },
    "present-continuous": { "layer": "tense", "level": "basic", "time": "present", "aspect": "continuous", "formula": "am/is/are + V-ing" },
    "present-perfect": { "layer": "tense", "level": "basic", "time": "present", "aspect": "perfect", "formula": "have/has + V3" },
    "present-perfect-continuous": { "layer": "tense", "level": "basic", "time": "present", "aspect": "perfect-continuous", "formula": "have/has been + V-ing" },
    "past-simple": { "layer": "tense", "level": "basic", "time": "past", "aspect": "simple", "formula": "V2" },
    "past-continuous": { "layer": "tense", "level": "basic", "time": "past", "aspect": "continuous", "formula": "was/were + V-ing" },
    "past-perfect": { "layer": "tense", "level": "basic", "time": "past", "aspect": "perfect", "formula": "had + V3" },
    "past-perfect-continuous": { "layer": "tense", "level": "basic", "time": "past", "aspect": "perfect-continuous", "formula": "had been + V-ing" },
    "future-simple": { "layer": "tense", "level": "basic", "time": "future", "aspect": "simple", "formula": "will/shall + V1" },
    "future-continuous": { "layer": "tense", "level": "basic", "time": "future", "aspect": "continuous", "formula": "will be + V-ing" },
    "future-perfect": { "layer": "tense", "level": "basic", "time": "future", "aspect": "perfect", "formula": "will have + V3" },
    "future-perfect-continuous": { "layer": "tense", "level": "basic", "time": "future", "aspect": "perfect-continuous", "formula": "will have been + V-ing" },

    # Other verb forms
    "future-going-to": { "layer": "tense", "level": "basic", "time": "future", "formula": "am/is/are going to + V1" },
    "future-present-continuous": { "layer": "tense", "level": "advanced", "time": "future", "formula": "am/is/are + V-ing (arrangement)" },
    "future-present-simple": { "layer": "tense", "level": "advanced", "time": "future", "formula": "V1/V-s (timetable)" },
    "future-in-the-past": { "layer": "tense", "level": "advanced", "time": "past", "formula": "would + V1" },
    "used-to": { "layer": "tense", "level": "basic", "time": "past", "formula": "used to + V1" },
    "would-habitual": { "layer": "tense", "level": "advanced", "time": "past", "formula": "would + V1 (past habit)" },
    "voice-active": { "layer": "tense", "level": "basic" },
    "voice-passive": { "layer": "tense", "level": "basic", "formula": "be + V3" },
    "mood-indicative": { "layer": "tense", "level": "advanced" },
    "mood-imperative": { "layer": "tense", "level": "basic", "formula": "Base verb (no subject)" },
    "mood-subjunctive": { "layer": "tense", "level": "advanced" },

    # Modality
    "modal-ability": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["can", "could"] },
    "modal-permission": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["may", "can", "could"] },
    "modal-obligation": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["must", "have to", "should"] },
    "modal-advice": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["should", "ought to"] },
    "modal-possibility": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["may", "might", "could"] },
    "modal-prediction": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["will", "would"] },
    "modal-request": { "layer": "tense", "level": "basic", "family": "modal", "modals": ["could", "would", "can"] },
    "modal-perfect": { "layer": "tense", "level": "advanced", "family": "modal", "formula": "modal + have + V3" },

    # Non-finite forms
    "infinitive-to": { "layer": "tense", "level": "basic", "formula": "to + V1" },
    "infinitive-bare": { "layer": "tense", "level": "advanced", "formula": "V1 without to" },
    "gerund": { "layer": "tense", "level": "basic", "formula": "V-ing (as noun)" },
    "participle-present": { "layer": "tense", "level": "advanced", "formula": "V-ing (as adjective/adverbial)" },
    "participle-past": { "layer": "tense", "level": "advanced", "formula": "V3 (as adjective)" },

    # Verb type flags & polarity
    "irregular-verb": { "layer": "tense", "level": "basic" },
    "phrasal-verb": { "layer": "tense", "level": "basic" },
    "prepositional-verb": { "layer": "tense", "level": "advanced" },
    "linking-verb": { "layer": "tense", "level": "advanced" },
    "negation": { "layer": "tense", "level": "basic", "formula": "not / n't" },
    "do-support": { "layer": "tense", "level": "basic", "formula": "do/does/did + not / inversion" },
    "emphatic-do": { "layer": "tense", "level": "advanced", "formula": "do/does/did + V1 (emphasis)" },

    # 5.4 Phrases and Clauses (phrase, clause, sentence)
    "noun-phrase": { "layer": "phrase", "level": "advanced" },
    "verb-phrase-structure": { "layer": "phrase", "level": "advanced" },
    "adjective-phrase": { "layer": "phrase", "level": "advanced" },
    "adverb-phrase": { "layer": "phrase", "level": "advanced" },
    "prepositional-phrase": { "layer": "phrase", "level": "advanced" },
    "infinitive-phrase": { "layer": "phrase", "level": "advanced" },
    "gerund-phrase": { "layer": "phrase", "level": "advanced" },
    "participial-phrase": { "layer": "phrase", "level": "advanced" },
    "absolute-phrase": { "layer": "phrase", "level": "advanced" },
    "independent-clause": { "layer": "phrase", "level": "advanced" },
    "dependent-clause": { "layer": "phrase", "level": "advanced" },
    "noun-clause": { "layer": "phrase", "level": "advanced" },
    "relative-clause": { "layer": "phrase", "level": "advanced" },
    "adverbial-clause": { "layer": "phrase", "level": "advanced" },
    "sentence-simple": { "layer": "phrase", "level": "basic" },
    "sentence-compound": { "layer": "phrase", "level": "basic" },
    "sentence-complex": { "layer": "phrase", "level": "basic" },
    "sentence-compound-complex": { "layer": "phrase", "level": "advanced" },
    "function-declarative": { "layer": "phrase", "level": "basic" },
    "function-interrogative": { "layer": "phrase", "level": "basic" },
    "function-imperative": { "layer": "phrase", "level": "basic" },
    "function-exclamatory": { "layer": "phrase", "level": "basic" },

    # 5.5 Patterns and Special Rules (pattern)
    "conditional-zero": { "layer": "pattern", "level": "basic", "family": "conditional" },
    "conditional-first": { "layer": "pattern", "level": "basic", "family": "conditional" },
    "conditional-second": { "layer": "pattern", "level": "basic", "family": "conditional" },
    "conditional-third": { "layer": "pattern", "level": "advanced", "family": "conditional" },
    "conditional-mixed": { "layer": "pattern", "level": "advanced", "family": "conditional" },
    "wish-if-only": { "layer": "pattern", "level": "advanced", "family": "conditional" },
    "passive-voice": { "layer": "pattern", "level": "basic", "family": "voice" },
    "causative-have-get": { "layer": "pattern", "level": "advanced", "family": "voice" },
    "reported-statement": { "layer": "pattern", "level": "advanced", "family": "reported" },
    "reported-question": { "layer": "pattern", "level": "advanced", "family": "reported" },
    "reported-command": { "layer": "pattern", "level": "advanced", "family": "reported" },
    "question-yes-no": { "layer": "pattern", "level": "basic", "family": "question" },
    "question-wh": { "layer": "pattern", "level": "basic", "family": "question" },
    "question-tag": { "layer": "pattern", "level": "basic", "family": "question" },
    "question-indirect": { "layer": "pattern", "level": "advanced", "family": "question" },
    "comparative": { "layer": "pattern", "level": "basic", "family": "comparison" },
    "superlative": { "layer": "pattern", "level": "basic", "family": "comparison" },
    "equal-comparison": { "layer": "pattern", "level": "basic", "family": "comparison" },
    "too-enough": { "layer": "pattern", "level": "basic", "family": "comparison" },
    "the-more-the-more": { "layer": "pattern", "level": "advanced", "family": "comparison" },
    "there-is-are": { "layer": "pattern", "level": "basic", "family": "existential" },
    "it-cleft": { "layer": "pattern", "level": "advanced", "family": "existential" },
    "inversion": { "layer": "pattern", "level": "advanced", "family": "existential" },
    "phrasal-verb-pattern": { "layer": "pattern", "level": "basic", "family": "verb" },
    "verb-pattern-gerund-or-infinitive": { "layer": "pattern", "level": "advanced", "family": "verb" },
    "dependent-preposition": { "layer": "pattern", "level": "advanced", "family": "verb" },
    "article-a-an": { "layer": "pattern", "level": "basic", "family": "article" },
    "article-the": { "layer": "pattern", "level": "basic", "family": "article" },
    "article-zero": { "layer": "pattern", "level": "advanced", "family": "article" },
    "countable-quantifier": { "layer": "pattern", "level": "basic", "family": "article" },
    "uncountable-quantifier": { "layer": "pattern", "level": "basic", "family": "article" },
    "possessive-s": { "layer": "pattern", "level": "basic", "family": "article" },
    "subject-verb-agreement": { "layer": "pattern", "level": "basic", "family": "agreement" },
    "there-agreement": { "layer": "pattern", "level": "advanced", "family": "agreement" },
    "linking-word": { "layer": "pattern", "level": "basic", "family": "discourse" },
    "discourse-marker": { "layer": "pattern", "level": "advanced", "family": "discourse" },
    "polite-request": { "layer": "pattern", "level": "basic", "family": "discourse" },
    "suggestion": { "layer": "pattern", "level": "basic", "family": "discourse" },
    "idiom-fixed-expression": { "layer": "pattern", "level": "advanced", "family": "lexical" },
    "collocation": { "layer": "pattern", "level": "advanced", "family": "lexical" },
    "contraction": { "layer": "pattern", "level": "basic", "family": "formation" },
    "word-formation": { "layer": "pattern", "level": "advanced", "family": "formation" }
  }
}

with open(os.path.join(SRC_GRAMMAR, "taxonomy.json"), "w", encoding="utf-8") as f:
    json.dump(TAXONOMY, f, indent=2, ensure_ascii=False)

print(f"Taxonomy written with {len(TAXONOMY['categories'])} categories.")
