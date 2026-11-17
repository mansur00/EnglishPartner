#!/usr/bin/env python3
"""
Builds labels (EN/BN), rule cards (EN/BN), and author-editable lists.
"""
import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC_GRAMMAR = os.path.join(BASE_DIR, "src", "content", "grammar")
DATA_LISTS = os.path.join(BASE_DIR, "data", "grammar", "lists")

with open(os.path.join(SRC_GRAMMAR, "taxonomy.json"), "r", encoding="utf-8") as f:
    taxonomy = json.load(f)

categories = taxonomy["categories"]

# 1. LABELS (EN & BN)
labels_en = {}
labels_bn = {}

GLOSSARY_BN = {
    "noun": ("বিশেষ্য (Noun)", "ব্যক্তি, বস্তু, স্থান বা ধারণার নাম নির্দেশ করে।", True),
    "pronoun": ("সর্বনাম (Pronoun)", "বিশেষ্যের পরিবর্তে ব্যবহৃত শব্দ (যেমন he, she, it)।", True),
    "verb": ("ক্রিয়া (Verb)", "কাজ, অবস্থা বা ঘটনা প্রকাশ করে।", True),
    "adjective": ("বিশেষণ (Adjective)", "বিশেষ্য বা সর্বনামের দোষ, গুণ বা অবস্থা প্রকাশ করে।", True),
    "adverb": ("ক্রিয়াবিশেষণ (Adverb)", "ক্রিয়া, বিশেষণ বা অন্য ক্রিয়াবিশেষণকে বিশেষায়িত করে।", True),
    "preposition": ("পদান্বয়ী অব্যয় (Preposition)", "স্থান, সময় বা দিক নির্দেশ করে বিশেষ্যের আগে বসে।", True),
    "conjunction": ("সংযোজক অব্যয় (Conjunction)", "শব্দ বা বাক্যকে যুক্ত করে (and, but, because)।", True),
    "determiner": ("নির্ধারক (Determiner)", "বিশেষ্যকে নির্দিষ্ট বা অনির্দিষ্টভাবে চিহ্নিত করে (the, a, this)।", True),
    "interjection": ("আবেগসূচক অব্যয় (Interjection)", "আকস্মিক আবেগ বা অনুভূতি প্রকাশ করে (oh, wow, hey)।", True),
    "particle": ("অনুসর্গ / কণা (Particle)", "ক্রিয়ার সাথে যুক্ত হয়ে অর্থ তৈরি করে (to, not, up)।", True),
    "numeral": ("সংখ্যাবাচক শব্দ (Numeral)", "সংখ্যা বা ক্রম নির্দেশ করে (one, first, 20)।", True),

    "subject": ("কর্তা (Subject)", "যে বা যা বাক্যের কাজটি সম্পাদন করে।", True),
    "verb-phrase": ("ক্রিয়া পদগুচ্ছ (Verb Phrase)", "বাক্যের মূল ক্রিয়াপদ ও সাহায্যকারী ক্রিয়ার সমষ্টি।", True),
    "direct-object": ("মুখ্য কর্ম (Direct Object)", "ক্রিয়া যাকে সরাসরি আশ্রয় করে সংঘটিত হয়।", True),
    "indirect-object": ("গৌণ কর্ম (Indirect Object)", "যাকে উদ্দেশ্য করে বা যার জন্য কাজটি করা হয়।", False),
    "subject-complement": ("কর্তা পরিপূরক (Subject Complement)", "লিংকিং ভার্বের পর বসে কর্তাকে ব্যাখ্যা করে।", False),
    "object-complement": ("কর্ম পরিপূরক (Object Complement)", "কর্মের অবস্থা বা পরিচয় প্রকাশ করে।", False),
    "adverbial": ("ভাবসম্প্রসারক (Adverbial)", "কখন, কোথায়, কীভাবে কাজটি ঘটেছে তা প্রকাশ করে।", False),
    "prepositional-object": ("অব্যয়বদ্ধ কর্ম (Prepositional Object)", "পদান্বয়ী অব্যয়ের পর বসা বিশেষ্য পদ।", False),
    "agent": ("প্রকৃত কর্তা (Agent)", "কর্মবাচ্যে 'by' এর পর উল্লেখিত মূল কর্তা।", False),
    "expletive": ("অর্থহীন প্রারম্ভিক শব্দ (Expletive)", "there/it যা ব্যাকরণগতভাবে কর্তা হিসেবে শুরু হয়।", False),
    "vocative": ("সম্বোধন পদ (Vocative)", "কাউকে সরাসরি সম্বোধন করে বলা শব্দ।", False),
    "appositive": ("পুনঃনামকরণ পদ (Appositive)", "পাশাপাশি বসে পূর্ববর্তী বিশেষ্যের পরিচয় স্পষ্ট করে।", False),

    "present-simple": ("সাধারণ বর্তমান (Present Simple)", "চিরন্তন সত্য ও নিয়মিত অভ্যাস বোঝাতে ব্যবহৃত হয়।", True),
    "present-continuous": ("ঘটমান বর্তমান (Present Continuous)", "বর্তমানে যা ঘটছে বা চলমান রয়েছে।", True),
    "present-perfect": ("পুরাঘটিত বর্তমান (Present Perfect)", "কাজটি শেষ হয়েছে কিন্তু তার ফলাফল এখনও বিদ্যমান।", True),
    "present-perfect-continuous": ("পুরাঘটিত ঘটমান বর্তমান (Present Perfect Continuous)", "অতীতে শুরু হয়ে এখনও চলছে এমন কাজ।", True),
    "past-simple": ("সাধারণ অতীত (Past Simple)", "অতীতে নির্দিষ্ট সময়ে সম্পন্ন হওয়া কাজ।", True),
    "past-continuous": ("ঘটমান অতীত (Past Continuous)", "অতীতে কিছু সময় ধরে চলছিল এমন কাজ।", True),
    "past-perfect": ("পুরাঘটিত অতীত (Past Perfect)", "অতীতের দুটি কাজের মধ্যে পূর্বে ঘটা কাজটি।", True),
    "past-perfect-continuous": ("পুরাঘটিত ঘটমান অতীত (Past Perfect Continuous)", "অতীতে একটি কাজের পূর্বে দীর্ঘ সময় চলছিল।", True),
    "future-simple": ("সাধারণ ভবিষ্যৎ (Future Simple)", "ভবিষ্যতে কোনো কাজ ঘটবে বোঝাতে।", True),
    "future-continuous": ("ঘটমান ভবিষ্যৎ (Future Continuous)", "ভবিষ্যতে কোনো কাজ চলতে থাকবে বোঝাতে।", True),
    "future-perfect": ("পুরাঘটিত ভবিষ্যৎ (Future Perfect)", "ভবিষ্যতে নির্দিষ্ট সময়ের পূর্বে শেষ হবে।", True),
    "future-perfect-continuous": ("পুরাঘটিত ঘটমান ভবিষ্যৎ (Future Perfect Continuous)", "ভবিষ্যতের একটি নির্দিষ্ট সময় পর্যন্ত চলতে থাকবে।", True),

    "voice-active": ("কর্তৃবাচ্য (Active Voice)", "যেখানে কর্তা সরাসরি কাজটি সম্পাদন করে।", True),
    "voice-passive": ("কর্মবাচ্য (Passive Voice)", "যেখানে কর্মের ওপর গুরুত্ব দেওয়া হয়।", True),
    "conditional-zero": ("জিরো কন্ডিশনাল (Zero Conditional)", "সাধারণ বৈজ্ঞানিক বা শাশ্বত সত্যের শর্ত।", True),
    "conditional-first": ("ফার্স্ট কন্ডিশনাল (First Conditional)", "ভবিষ্যতে ঘটতে পারে এমন বাস্তব শর্ত।", True),
    "conditional-second": ("সেকেন্ড কন্ডিশনাল (Second Conditional)", "বর্তমান বা ভবিষ্যতের কাল্পনিক / অসম্ভব শর্ত।", True),
    "conditional-third": ("থার্ড কন্ডিশনাল (Third Conditional)", "অতীতের কোনো ঘটনা যা আর পরিবর্তন সম্ভব নয়।", True),
    "conditional-mixed": ("মিক্সড কন্ডিশনাল (Mixed Conditional)", "অতীতের শর্ত এবং বর্তমানে তার ফলাফল।", False),
    "wish-if-only": ("আকাঙ্ক্ষাবোধক শর্ত (Wish / If only)", "কোনো অপূর্ণ ইচ্ছা বা আকাঙ্ক্ষা প্রকাশ।", False),
    "polite-request": ("বিনম্র অনুরোধ (Polite Request)", "বিনয়ী ভঙ্গিতে কিছু চাওয়া বা জিজ্ঞাসা করা।", True),
    "question-yes-no": ("হ্যাঁ/না প্রশ্ন (Yes/No Question)", "যে প্রশ্নের উত্তর Yes বা No দিয়ে দেওয়া যায়।", True),
    "question-wh": ("Wh-প্রশ্ন (Wh-Question)", "তথ্য জানতে চাওয়া প্রশ্ন (What, Where, Why ইত্যাদি)।", True),
    "question-tag": ("ট্যাগ প্রশ্ন (Question Tag)", "বাক্যের শেষে সম্মতি যাচাইয়ের ছোট প্রশ্ন।", True),
}

for key, meta in categories.items():
    # English label
    words = key.split("-")
    title_en = " ".join(w.capitalize() for w in words)
    labels_en[key] = {
        "name": title_en,
        "description": f"Grammar category representing {title_en.lower()}.",
        "layer": meta.get("layer"),
        "level": meta.get("level")
    }

    # Bangla label
    if key in GLOSSARY_BN:
        name_bn, desc_bn, reviewed = GLOSSARY_BN[key]
    else:
        name_bn = f"{title_en} (বাংলা)"
        desc_bn = f"{title_en} সম্পর্কিত ব্যাকরণগত ধারণা।"
        reviewed = False

    labels_bn[key] = {
        "name": name_bn,
        "description": desc_bn,
        "layer": meta.get("layer"),
        "level": meta.get("level"),
        "reviewed": reviewed
    }

with open(os.path.join(SRC_GRAMMAR, "labels.en.json"), "w", encoding="utf-8") as f:
    json.dump(labels_en, f, indent=2, ensure_ascii=False)

with open(os.path.join(SRC_GRAMMAR, "labels.bn.json"), "w", encoding="utf-8") as f:
    json.dump(labels_bn, f, indent=2, ensure_ascii=False)

# 2. RULE CARDS (EN & BN)
RULES_DATA = {
    "present-simple": {
        "title_en": "Present Simple Tense",
        "title_bn": "সাধারণ বর্তমান কাল (Present Simple)",
        "formula": "Subject + Base Verb (V1) (+ s/es for he/she/it)",
        "explanation_en": "Used to describe habitual actions, universal truths, unchanging situations, and scheduled events.",
        "explanation_bn": "নিয়মিত অভ্যাস, সাধারণ বা চিরন্তন সত্য এবং সময়সূচি অনুযায়ী ঘটা কাজ বোঝাতে ব্যবহৃত হয়।",
        "usage_en": ["Habits and routines", "Universal facts", "Fixed schedules"],
        "usage_bn": ["দৈনন্দিন অভ্যাস", "চিরন্তন সত্য", "নির্দিষ্ট সময়সূচি"],
        "examples": [
            { "text": "I work in London.", "note_en": "General fact", "note_bn": "সাধারণ তথ্য" },
            { "text": "The sun rises in the east.", "note_en": "Universal truth", "note_bn": "চিরন্তন সত্য" },
            { "text": "The train leaves at 6 PM.", "note_en": "Scheduled event", "note_bn": "পূর্বনির্ধারিত সময়সূচি" }
        ],
        "commonMistakes_en": ["Forgetting -s/-es with third-person singular (e.g. 'He go' instead of 'He goes')."],
        "commonMistakes_bn": ["He/She/It এর সাথে মূল ক্রিয়ায় s/es যোগ করতে ভুলে যাওয়া (যেমন 'He work' এর পরিবর্তে 'He works')।"],
        "related": ["present-continuous", "past-simple"],
        "reviewed": True
    },
    "present-continuous": {
        "title_en": "Present Continuous Tense",
        "title_bn": "ঘটমান বর্তমান কাল (Present Continuous)",
        "formula": "Subject + am/is/are + V-ing",
        "explanation_en": "Used for actions happening right now at the moment of speaking or temporary situations.",
        "explanation_bn": "কথা বলার মুহূর্তে যা ঘটছে বা সাময়িকভাবে চলমান কোনো কাজ বোঝাতে ব্যবহৃত হয়।",
        "usage_en": ["Happening now", "Temporary actions", "Definite future plans"],
        "usage_bn": ["বর্তমানে চলমান কাজ", "সাময়িক অবস্থা", "ভবিষ্যতের নিশ্চিত পরিকল্পনা"],
        "examples": [
            { "text": "She is reading a book.", "note_en": "Action in progress", "note_bn": "কাজটি এখন চলছে" },
            { "text": "I am staying with my friend this week.", "note_en": "Temporary state", "note_bn": "সাময়িক অবস্থান" }
        ],
        "commonMistakes_en": ["Using continuous tense with stative verbs like 'know', 'like', 'want' (e.g. 'I am knowing')."],
        "commonMistakes_bn": ["Stative verb (like, know, want) ইত্যাদিতে continuous ব্যবহার করা।"],
        "related": ["present-simple", "past-continuous"],
        "reviewed": True
    },
    "present-perfect": {
        "title_en": "Present Perfect Tense",
        "title_bn": "পুরাঘটিত বর্তমান কাল (Present Perfect)",
        "formula": "Subject + have/has + Past Participle (V3)",
        "explanation_en": "Connects the past with the present: past actions with present consequences, life experiences, or unfinished time.",
        "explanation_bn": "অতীত ও বর্তমানের সংযোগকারী: অতীতে সংঘটিত কাজের ফল এখনও বিদ্যমান এমন বোঝাতে।",
        "usage_en": ["Life experience", "Recent event with present effect", "Unfinished time period"],
        "usage_bn": ["জীবনের অভিজ্ঞতা", "বর্তমানে ফলাফল বিদ্যমান", "অসমাপ্ত সময়কাল"],
        "examples": [
            { "text": "I have lost my passport.", "note_en": "Present result: I don't have it now", "note_bn": "বর্তমান ফল: পাসপোর্টটি এখনও খুঁজে পাইনি" },
            { "text": "She has visited Paris twice.", "note_en": "Life experience", "note_bn": "জীবনের অভিজ্ঞতা" }
        ],
        "commonMistakes_en": ["Using specific past time expressions like 'yesterday' or 'in 2020' with present perfect."],
        "commonMistakes_bn": ["নির্দিষ্ট অতীত সময় (yesterday, last year) উল্লেখ থাকলে present perfect ব্যবহার করা ভুল।"],
        "related": ["past-simple", "present-perfect-continuous"],
        "reviewed": True
    },
    "present-perfect-continuous": {
        "title_en": "Present Perfect Continuous",
        "title_bn": "পুরাঘটিত ঘটমান বর্তমান (Present Perfect Continuous)",
        "formula": "Subject + have/has been + V-ing",
        "explanation_en": "Emphasizes the duration of an activity that began in the past and is still continuing now.",
        "explanation_bn": "অতীতে শুরু হয়ে বর্তমান পর্যন্ত একটানা চলছে এমন কাজের স্থিতিকাল বোঝাতে।",
        "usage_en": ["Duration from past to present", "Recent action explaining current state"],
        "usage_bn": ["অতীতে শুরু হয়ে বর্তমান পর্যন্ত চলমান", "সাম্প্রতিক কর্মকাণ্ডের প্রত্যক্ষ ফলাফল"],
        "examples": [
            { "text": "I have been waiting for two hours.", "note_en": "Ongoing duration", "note_bn": "দুই ঘণ্টা ধরে অপেক্ষা চলছে" }
        ],
        "commonMistakes_en": ["Confusing 'for' (duration) and 'since' (starting point)."],
        "commonMistakes_bn": ["for (সময়কাল) এবং since (শুরুর নির্দিষ্ট সময়) এর ব্যবহারে বিভ্রান্তি।"],
        "related": ["present-perfect", "past-perfect-continuous"],
        "reviewed": True
    },
    "past-simple": {
        "title_en": "Past Simple Tense",
        "title_bn": "সাধারণ অতীত কাল (Past Simple)",
        "formula": "Subject + Past Form (V2)",
        "explanation_en": "Used for completed actions at a specific time in the past.",
        "explanation_bn": "অতীতে নির্দিষ্ট সময়ে সম্পন্ন হয়ে যাওয়া কাজ বোঝাতে ব্যবহৃত হয়।",
        "usage_en": ["Finished actions in the past", "Past habits", "Historical events"],
        "usage_bn": ["অতীতে সমাপ্ত কাজ", "অতীতের অভ্যাস", "ঐতিহাসিক ঘটনা"],
        "examples": [
            { "text": "We bought a new jacket yesterday.", "note_en": "Finished past action", "note_bn": "গতকাল সম্পন্ন কাজ" }
        ],
        "commonMistakes_en": ["Using did + V2 in negatives or questions (e.g. 'did went' instead of 'did go')."],
        "commonMistakes_bn": ["did এর সাথে আবার V2 বসানো (যেমন 'did bought' এর বদলে 'did buy' হবে)।"],
        "related": ["present-perfect", "past-continuous"],
        "reviewed": True
    },
    "past-continuous": {
        "title_en": "Past Continuous Tense",
        "title_bn": "ঘটমান অতীত কাল (Past Continuous)",
        "formula": "Subject + was/were + V-ing",
        "explanation_en": "Describes actions that were in progress at a specific time in the past.",
        "explanation_bn": "অতীতে কোনো নির্দিষ্ট সময়ে কোনো কাজ চলছিল বোঝাতে ব্যবহৃত হয়।",
        "usage_en": ["Action in progress in the past", "Background scene setting", "Interrupted actions"],
        "usage_bn": ["অতীতে চলমান কাজ", "অন্য একটি কাজের কারণে ব্যাহত হওয়া কাজ"],
        "examples": [
            { "text": "I was cooking when the phone rang.", "note_en": "Interrupted action", "note_bn": "রান্না চলছিল যখন ফোন বেজে উঠল" }
        ],
        "commonMistakes_en": ["Using 'were' with singular subjects (e.g. 'he were')."],
        "commonMistakes_bn": ["একবচনে was এর স্থলে were ব্যবহার করা।"],
        "related": ["past-simple", "present-continuous"],
        "reviewed": True
    },
    "past-perfect": {
        "title_en": "Past Perfect Tense",
        "title_bn": "পুরাঘটিত অতীত কাল (Past Perfect)",
        "formula": "Subject + had + Past Participle (V3)",
        "explanation_en": "Shows that an action happened before another action in the past ('the past of the past').",
        "explanation_bn": "অতীতে দুটি কাজের মধ্যে যে কাজটি আগে সম্পন্ন হয়েছিল তা বোঝাতে had + V3 বসে।",
        "usage_en": ["Earlier of two past events", "Reported speech backshift"],
        "usage_bn": ["অতীতের দুটি ঘটনার মধ্যে পূর্ববর্তী ঘটনা", "পরোক্ষ উক্তিতে কাল পরিবর্তন"],
        "examples": [
            { "text": "The train had left before I reached the station.", "note_en": "Train left first", "note_bn": "ট্রেনটি আগেই চলে গিয়েছিল" }
        ],
        "commonMistakes_en": ["Overusing past perfect when a simple past sequence with 'then' is sufficient."],
        "commonMistakes_bn": ["অপ্রয়োজনীয় স্থানে past perfect ব্যবহার করা।"],
        "related": ["past-simple", "present-perfect"],
        "reviewed": True
    },
    "past-perfect-continuous": {
        "title_en": "Past Perfect Continuous",
        "title_bn": "পুরাঘটিত ঘটমান অতীত (Past Perfect Continuous)",
        "formula": "Subject + had been + V-ing",
        "explanation_en": "Highlights the duration of an action up to a certain point in the past.",
        "explanation_bn": "অতীতে কোনো নির্দিষ্ট ঘটনার পূর্ব পর্যন্ত একটানা চলছিল এমন কাজের মেয়াদ বোঝাতে।",
        "usage_en": ["Duration before a past point in time"],
        "usage_bn": ["অতীতের ঘটনার পূর্ববর্তী অব্যাহত মেয়াদ"],
        "examples": [
            { "text": "She had been studying for 3 hours before she took a break.", "note_en": "Studied continuously", "note_bn": "বিশ্রামের পূর্বে ৩ ঘণ্টা ধরে পড়ছিল" }
        ],
        "commonMistakes_en": ["Confusing with past continuous when duration is key."],
        "commonMistakes_bn": ["সময়কালের উল্লেখ থাকা সত্ত্বেও past continuous ব্যবহার করা।"],
        "related": ["past-perfect", "present-perfect-continuous"],
        "reviewed": True
    },
    "future-simple": {
        "title_en": "Future Simple Tense",
        "title_bn": "সাধারণ ভবিষ্যৎ কাল (Future Simple)",
        "formula": "Subject + will/shall + Base Verb (V1)",
        "explanation_en": "Used for spontaneous decisions, predictions without present evidence, and promises.",
        "explanation_bn": "তাৎক্ষণিক সিদ্ধান্ত, ভবিষ্যদ্বাণী বা প্রতিজ্ঞা বোঝাতে will + V1 ব্যবহৃত হয়।",
        "usage_en": ["Instant decisions", "Predictions", "Promises and offers"],
        "usage_bn": ["তাৎক্ষণিক সিদ্ধান্ত", "ভবিষ্যদ্বাণী", "প্রতিশ্রুতি"],
        "examples": [
            { "text": "I will call you tomorrow.", "note_en": "Promise / intention", "note_bn": "প্রতিশ্রুতি" }
        ],
        "commonMistakes_en": ["Using 'will' for already planned arrangements instead of present continuous or going to."],
        "commonMistakes_bn": ["আগে থেকে পরিকল্পিত সিদ্ধান্তের ক্ষেত্রে going to এর বদলে will ব্যবহার করা।"],
        "related": ["future-going-to", "future-continuous"],
        "reviewed": True
    },
    "future-continuous": {
        "title_en": "Future Continuous Tense",
        "title_bn": "ঘটমান ভবিষ্যৎ কাল (Future Continuous)",
        "formula": "Subject + will be + V-ing",
        "explanation_en": "Used for actions that will be in progress at a specific moment in the future.",
        "explanation_bn": "ভবিষ্যতে কোনো নির্দিষ্ট সময়ে কোনো কাজ চলতে থাকবে বোঝাতে।",
        "usage_en": ["In progress at a future time", "Polite inquiries about plans"],
        "usage_bn": ["ভবিষ্যতে চলমান কাজ", "কারো পরিকল্পনা জানতে বিনম্র প্রশ্ন"],
        "examples": [
            { "text": "This time tomorrow I will be flying to London.", "note_en": "In progress future action", "note_bn": "কাল এই সময়ে বিমানে থাকব" }
        ],
        "commonMistakes_en": ["Forgetting 'be' (e.g. 'will flying')."],
        "commonMistakes_bn": ["will এর পর be দিতে ভুলে যাওয়া।"],
        "related": ["future-simple", "future-perfect"],
        "reviewed": True
    },
    "future-perfect": {
        "title_en": "Future Perfect Tense",
        "title_bn": "পুরাঘটিত ভবিষ্যৎ কাল (Future Perfect)",
        "formula": "Subject + will have + Past Participle (V3)",
        "explanation_en": "Describes an action that will be completed before a specific point in the future.",
        "explanation_bn": "ভবিষ্যতে কোনো নির্দিষ্ট সময়ের পূর্বে একটি কাজ সম্পন্ন হয়ে যাবে বোঝাতে।",
        "usage_en": ["Action completed before a future deadline"],
        "usage_bn": ["ভবিষ্যতের নির্দিষ্ট সময়ের আগেই সম্পন্ন হওয়া"],
        "examples": [
            { "text": "By next month, I will have finished my degree.", "note_en": "Completed before deadline", "note_bn": "আগামী মাসের আগেই শেষ হবে" }
        ],
        "commonMistakes_en": ["Using 'has' with will (e.g. 'will has completed' is always wrong; must be 'will have')."],
        "commonMistakes_bn": ["will এর পর has ব্যবহার করা (সবসময় 'will have' হবে)।"],
        "related": ["future-simple", "future-perfect-continuous"],
        "reviewed": True
    },
    "future-perfect-continuous": {
        "title_en": "Future Perfect Continuous",
        "title_bn": "পুরাঘটিত ঘটমান ভবিষ্যৎ (Future Perfect Continuous)",
        "formula": "Subject + will have been + V-ing",
        "explanation_en": "Emphasizes the duration of an activity up to a specific time in the future.",
        "explanation_bn": "ভবিষ্যতে কোনো নির্দিষ্ট সময় পর্যন্ত কোনো কাজ একটানা কতক্ষণ চলবে তা প্রকাশ করতে।",
        "usage_en": ["Duration up to a future point"],
        "usage_bn": ["ভবিষ্যতের কোনো বিন্দু পর্যন্ত অবিচ্ছিন্ন স্থায়িত্বকাল"],
        "examples": [
            { "text": "By 2027, she will have been teaching here for 10 years.", "note_en": "10-year duration", "note_bn": "১০ বছর পূর্ণ হবে" }
        ],
        "commonMistakes_en": ["Extremely complex form; ensure 'will have been + ing' structure is preserved."],
        "commonMistakes_bn": ["will have been বাদ দিয়ে সংক্ষেপে লিখতে গিয়ে ভুল গঠন তৈরি করা।"],
        "related": ["future-perfect"],
        "reviewed": True
    },
    "voice-passive": {
        "title_en": "Passive Voice",
        "title_bn": "কর্মবাচ্য (Passive Voice)",
        "formula": "Subject (Recipient) + be + Past Participle (V3) (+ by Agent)",
        "explanation_en": "Used when the focus is on the action or the receiver of the action rather than who performed it.",
        "explanation_bn": "যখন কাজটি কে করেছে তার চেয়ে কাজটির ফলাফল বা কর্মের গুরুত্ব বেশি থাকে তখন কর্মবাচ্য হয়।",
        "usage_en": ["Unknown or unimportant agent", "Formal and scientific writing", "Emphasizing the result"],
        "usage_bn": ["কর্তা অজ্ঞাত বা কম গুরুত্বপূর্ণ হলে", "অফিসিয়াল ও বৈজ্ঞানিক লেখায়", "ফলাফলকে প্রাধান্য দিতে"],
        "examples": [
            { "text": "English is spoken worldwide.", "note_en": "Agent unstated (by people)", "note_bn": "কর্তা উহ্য" },
            { "text": "The bill was paid by my father.", "note_en": "With agent", "note_bn": "কর্তা সহ" }
        ],
        "commonMistakes_en": ["Using base verb instead of V3 (e.g. 'was write' instead of 'was written')."],
        "commonMistakes_bn": ["be এর পর V3 না বসিয়ে V1 বসানো।"],
        "related": ["voice-active", "causative-have-get"],
        "reviewed": True
    },
    "conditional-zero": {
        "title_en": "Zero Conditional",
        "title_bn": "জিরো কন্ডিশনাল (Zero Conditional)",
        "formula": "If/When + Present Simple, Present Simple",
        "explanation_en": "Expresses general truths, scientific facts, and automatic results.",
        "explanation_bn": "সাধারণ সত্য, বৈজ্ঞানিক বাস্তবতা বা স্বাভাবিক ফলাফল প্রকাশ করতে ব্যবহৃত হয়।",
        "usage_en": ["Scientific laws", "Certain automatic outcomes"],
        "usage_bn": ["প্রাকৃতিক নিয়ম", "নিশ্চিত ফলাফল"],
        "examples": [
            { "text": "If you heat water to 100 degrees, it boils.", "note_en": "Scientific fact", "note_bn": "বৈজ্ঞানিক সত্য" }
        ],
        "commonMistakes_en": ["Using 'will' in the result clause when expressing universal facts."],
        "commonMistakes_bn": ["চিরন্তন তথ্যে will ব্যবহার করা।"],
        "related": ["conditional-first"],
        "reviewed": True
    },
    "conditional-first": {
        "title_en": "First Conditional",
        "title_bn": "ফার্স্ট কন্ডিশনাল (First Conditional)",
        "formula": "If + Present Simple, will/can/may/should + Base Verb (V1)",
        "explanation_en": "Expresses a real, likely condition in the present or future with a probable outcome.",
        "explanation_bn": "ভবিষ্যতে ঘটতে পারে এমন বাস্তব শর্ত ও তার সম্ভাব্য ফলাফল প্রকাশ করে।",
        "usage_en": ["Real future possibilities", "Warnings and promises"],
        "usage_bn": ["ভবিষ্যতের বাস্তব সম্ভাবনা", "সতর্কবার্তা ও প্রতিশ্রুতি"],
        "examples": [
            { "text": "If it rains tomorrow, we will stay at home.", "note_en": "Likely condition", "note_bn": "সম্ভাব্য বাস্তব শর্ত" }
        ],
        "commonMistakes_en": ["Using 'will' in the if-clause (e.g. 'If it will rain' is incorrect)."],
        "commonMistakes_bn": ["If যুক্ত অংশে will বসানো (যেমন 'If it will rain' ভুল; 'If it rains' হবে)।"],
        "related": ["conditional-zero", "conditional-second"],
        "reviewed": True
    },
    "conditional-second": {
        "title_en": "Second Conditional",
        "title_bn": "সেকেন্ড কন্ডিশনাল (Second Conditional)",
        "formula": "If + Past Simple (were for be), would/could/might + Base Verb",
        "explanation_en": "Expresses an unreal, hypothetical, or improbable situation in the present or future.",
        "explanation_bn": "বর্তমান বা ভবিষ্যতের কাল্পনিক, অবাস্তব বা অসম্ভাব্য শর্ত প্রকাশ করে।",
        "usage_en": ["Hypothetical situations", "Giving advice ('If I were you...')"],
        "usage_bn": ["কাল্পনিক পরিস্থিতি", "পরামর্শ দেওয়া ('আমি যদি তুমি হতাম...')"],
        "examples": [
            { "text": "If I won the lottery, I would travel the world.", "note_en": "Unreal daydream", "note_bn": "কাল্পনিক কল্পনা" },
            { "text": "If I were you, I would take that offer.", "note_en": "Advice", "note_bn": "পরামর্শ" }
        ],
        "commonMistakes_en": ["Using 'would' in both clauses (e.g. 'If I would have money, I would buy')."],
        "commonMistakes_bn": ["উভয় অংশে would ব্যবহার করা।"],
        "related": ["conditional-first", "conditional-third"],
        "reviewed": True
    },
    "conditional-third": {
        "title_en": "Third Conditional",
        "title_bn": "থার্ড কন্ডিশনাল (Third Conditional)",
        "formula": "If + Past Perfect (had + V3), would/could/might have + Past Participle (V3)",
        "explanation_en": "Refers to an impossible condition in the past and its imaginary past result (regret or relief).",
        "explanation_bn": "অতীতে কোনো ঘটনা না ঘটার আক্ষেপ বা কাল্পনিক অতীতের ফলাফল বোঝাতে।",
        "usage_en": ["Regrets about the past", "Missed opportunities"],
        "usage_bn": ["অতীতের আক্ষেপ", "হাতছাড়া হওয়া সুযোগ"],
        "examples": [
            { "text": "If you had told me earlier, I would have helped you.", "note_en": "Past regret", "note_bn": "অতীতের আক্ষেপ (তুমি বলোনি তাই সাহায্য করতে পারিনি)" }
        ],
        "commonMistakes_en": ["Using 'would have' in the if-clause."],
        "commonMistakes_bn": ["If ক্লজে 'would have' ব্যবহার করা ভুল (সেখানে had + V3 হবে)।"],
        "related": ["conditional-second", "conditional-mixed"],
        "reviewed": True
    },
    "polite-request": {
        "title_en": "Polite Request Pattern",
        "title_bn": "বিনম্র অনুরোধের নিয়ম (Polite Request)",
        "formula": "Could you / Would you (mind) + Verb ...",
        "explanation_en": "Used to ask for help, information, or permission respectfully.",
        "explanation_bn": "সম্মানজনক ও বিনয়ীভাবে কারো কাছ থেকে তথ্য বা সাহায্য চাওয়ার প্রচলিত নিয়ম।",
        "usage_en": ["Customer service", "Formal interactions", "Polite everyday inquiries"],
        "usage_bn": ["দোকানে বা অফিসে কথা বলা", "ভদ্রভাবে প্রশ্ন করা"],
        "examples": [
            { "text": "Could you tell me how much this costs?", "note_en": "Polite question", "note_bn": "বিনয়ী প্রশ্ন" }
        ],
        "commonMistakes_en": ["Using 'Would you mind' followed by base verb instead of gerund (must be 'Would you mind helping')."],
        "commonMistakes_bn": ["Would you mind এর পর V1 বসানো (V-ing বসবে)।"],
        "related": ["modal-request", "question-indirect"],
        "reviewed": True
    }
}

rules_en = {}
rules_bn = {}

for key, r in RULES_DATA.items():
    rules_en[key] = {
        "key": key,
        "title": r["title_en"],
        "formula": r["formula"],
        "explanation": r["explanation_en"],
        "usage": r["usage_en"],
        "examples": [{ "text": ex["text"], "note": ex["note_en"] } for ex in r["examples"]],
        "commonMistakes": r["commonMistakes_en"],
        "related": r["related"]
    }
    rules_bn[key] = {
        "key": key,
        "title": r["title_bn"],
        "formula": r["formula"],
        "explanation": r["explanation_bn"],
        "usage": r["usage_bn"],
        "examples": [{ "text": ex["text"], "note": ex["note_bn"] } for ex in r["examples"]],
        "commonMistakes": r["commonMistakes_bn"],
        "related": r["related"],
        "reviewed": r.get("reviewed", False)
    }

with open(os.path.join(SRC_GRAMMAR, "rules.en.json"), "w", encoding="utf-8") as f:
    json.dump(rules_en, f, indent=2, ensure_ascii=False)

with open(os.path.join(SRC_GRAMMAR, "rules.bn.json"), "w", encoding="utf-8") as f:
    json.dump(rules_bn, f, indent=2, ensure_ascii=False)

# 3. AUTHOR-EDITABLE LISTS
PHRASAL_VERBS = [
    { "verb": "look for", "meaning_en": "search for", "meaning_bn": "খোঁজা", "particle": "for" },
    { "verb": "try on", "meaning_en": "put on clothes to see if they fit", "meaning_bn": "মাপ ঠিক আছে কিনা পরে দেখা", "particle": "on" },
    { "verb": "check out", "meaning_en": "pay and leave a shop or hotel", "meaning_bn": "মূল্য পরিশোধ করে প্রস্থান", "particle": "out" },
    { "verb": "give up", "meaning_en": "stop trying", "meaning_bn": "হাল ছেড়ে দেওয়া", "particle": "up" },
    { "verb": "look forward to", "meaning_en": "await eagerly", "meaning_bn": "আগ্রহভরে অপেক্ষা করা", "particle": "to" },
    { "verb": "carry on", "meaning_en": "continue", "meaning_bn": "চালিয়ে যাওয়া", "particle": "on" },
    { "verb": "pick up", "meaning_en": "lift or collect", "meaning_bn": "তুলে নেওয়া বা সংগ্রহ করা", "particle": "up" },
    { "verb": "run out of", "meaning_en": "have none left", "meaning_bn": "ফুরিয়ে যাওয়া", "particle": "of" }
]

LINKING_WORDS = [
    { "word": "however", "type": "concession", "meaning_en": "despite this", "meaning_bn": "তবে / যাই হোক" },
    { "word": "therefore", "type": "result", "meaning_en": "as a result", "meaning_bn": "অতএব / সুতরাং" },
    { "word": "in addition", "type": "addition", "meaning_en": "furthermore", "meaning_bn": "এছাড়াও" },
    { "word": "furthermore", "type": "addition", "meaning_en": "moreover", "meaning_bn": "অধিকন্তু" },
    { "word": "meanwhile", "type": "time", "meaning_en": "at the same time", "meaning_bn": "ইতিমধ্যে" },
    { "word": "on the other hand", "type": "contrast", "meaning_en": "conversely", "meaning_bn": "অন্যদিকে" }
]

IDIOMS = [
    { "phrase": "piece of cake", "meaning_en": "very easy", "meaning_bn": "খুবই সহজ কাজ" },
    { "phrase": "break a leg", "meaning_en": "good luck", "meaning_bn": "শুভকামনা" },
    { "phrase": "cost an arm and a leg", "meaning_en": "very expensive", "meaning_bn": "অত্যধিক ব্যয়বহুল" },
    { "phrase": "under the weather", "meaning_en": "feeling unwell", "meaning_bn": "অসুস্থ বোধ করা" }
]

COLLOCATIONS = [
    { "phrase": "make a decision", "category": "verb+noun", "meaning_bn": "সিদ্ধান্ত নেওয়া" },
    { "phrase": "take a break", "category": "verb+noun", "meaning_bn": "বিরতি নেওয়া" },
    { "phrase": "heavy rain", "category": "adjective+noun", "meaning_bn": "ভারী বৃষ্টিপাত" },
    { "phrase": "deeply concerned", "category": "adverb+adjective", "meaning_bn": "গভীরভাবে উদ্বিগ্ন" }
]

with open(os.path.join(DATA_LISTS, "phrasal-verbs.json"), "w", encoding="utf-8") as f:
    json.dump(PHRASAL_VERBS, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_LISTS, "linking-words.json"), "w", encoding="utf-8") as f:
    json.dump(LINKING_WORDS, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_LISTS, "idioms.json"), "w", encoding="utf-8") as f:
    json.dump(IDIOMS, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_LISTS, "collocations.json"), "w", encoding="utf-8") as f:
    json.dump(COLLOCATIONS, f, indent=2, ensure_ascii=False)

print("Generated labels (EN/BN), rule cards (EN/BN), and author lists successfully.")
