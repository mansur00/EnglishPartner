import type { GrammarDetailedLesson, GrammarQuizQuestion } from "../learning-path";

function padQuiz(base: GrammarQuizQuestion[]): GrammarQuizQuestion[] {
  if (base.length >= 10) return base.slice(0, 10);
  const out = [...base];
  let idx = 0;
  while (out.length < 10) {
    const src = base[idx % base.length];
    out.push({
      question: `[Review ${out.length + 1}] ${src.question}`,
      options: src.options,
      correctIndex: src.correctIndex,
      explanation: src.explanation,
    });
    idx++;
  }
  return out;
}

export const STAGE_5_TO_8_LESSONS: GrammarDetailedLesson[] = [
  // ================= STAGE 5: MODIFIERS =================
  {
    id: "degrees-of-comparison",
    stageNumber: 5,
    title: "1. Degrees of Comparison",
    formula: "Positive: as...as | Comparative: -er/more...than | Superlative: the -est/the most...",
    overviewRule: {
      bn: "Adjective ও Adverb-এর তুলনার ৩টি স্তর: Positive (সমান তুলনা: as tall as), Comparative (দুজনের মধ্যে তুলনা: taller than / more useful than), এবং Superlative (সবার চেয়ে সেরা: the tallest / the most useful)।",
      hi: "तुलना के 3 स्तर: Positive (as...as), Comparative (-er/more...than), और Superlative (the -est/the most...)।",
      en: "Comparison has 3 degrees: Positive (as...as), Comparative (-er / more...than), and Superlative (the -est / the most...).",
    },
    subTypes: [
      {
        name: "1. Positive ↔ Comparative ↔ Superlative Rules",
        rule: {
          bn: "এক সিলেবল শব্দে -er/-est (tall → taller → tallest), বড় শব্দে more/most (beautiful → more beautiful → most beautiful)। 'prefer'-এর সাথে 'than' নয়, 'to' বসে।",
          hi: "छोटे शब्दों में -er/-est और बड़े शब्दों में more/most लगता है। 'prefer' के साथ 'to' आता है।",
          en: "Short words take -er/-est; longer words take more/most. Irregular: good-better-best, bad-worse-worst.",
        },
        words: ["tall", "taller", "tallest", "more interesting", "the most important", "better", "best", "worse"],
        sentences: ["Dhaka is larger than Chattogram.", "Iron is more useful than any other metal."],
      },
    ],
    wordBank: ["as...as", "so...as", "taller", "faster", "more beautiful", "most important", "better", "best", "worse", "worst", "than", "the"],
    sentenceExamples: [
      "Positive: He is as brave as a lion.",
      "Comparative: Gold is more precious than silver.",
      "Superlative: She is one of the brightest students in the class.",
      "Double Comparative: The more you practice, the better you speak.",
    ],
    sentencePrompts: [
      "Write a Positive degree sentence using 'as ... as'.",
      "Write a Comparative sentence using '-er than' or 'more ... than'.",
      "Write a Superlative sentence using 'the -est' or 'the most ...'.",
      "Write a sentence using 'one of the + superlative + plural noun'.",
      "Write a sentence using 'prefer ... to ...'.",
    ],
    rightWordQuestions: [
      { prompt: "This book is ___ interesting than that one.", options: ["much", "more", "most", "very"], correctIndex: 1, explanation: { bn: "তুলনা ('than') থাকায় Comparative 'more' বসবে।", hi: "'than' होने के कारण 'more' आएगा।", en: "Comparative with 'than' uses 'more'." } },
      { prompt: "He is the ___ runner in our school.", options: ["fast", "faster", "fastest", "more fast"], correctIndex: 2, explanation: { bn: "'the'-এর পরে Superlative 'fastest' বসে।", hi: "'the' के बाद Superlative 'fastest' आता है।", en: "'the' pairs with superlative 'fastest'." } },
      { prompt: "Health is ___ than wealth.", options: ["good", "better", "best", "more good"], correctIndex: 1, explanation: { bn: "'good'-এর Comparative হলো 'better' ('more good' ভুল)।", hi: "'good' का Comparative 'better' है।", en: "Comparative of 'good' is 'better'." } },
      { prompt: "She is as ___ as her sister.", options: ["clever", "cleverer", "cleverest", "more clever"], correctIndex: 0, explanation: { bn: "'as...as'-এর মাঝে Positive degree ('clever') বসে।", hi: "'as...as' के बीच Positive degree आती है।", en: "'as...as' takes positive degree." } },
      { prompt: "I prefer coffee ___ tea.", options: ["than", "from", "to", "over"], correctIndex: 2, explanation: { bn: "'prefer'-এর পরে 'to' বসে।", hi: "'prefer' के साथ 'to' लगता है।", en: "'prefer' takes 'to'." } },
    ],
    quizQuestions: padQuiz([
      { question: "What is the superlative of 'bad'?", options: ["badder", "worse", "worst", "most bad"], correctIndex: 2, explanation: { bn: "bad → worse → worst।", hi: "bad का Superlative 'worst' है।", en: "bad → worse → worst." } },
      { question: "Never use 'more' with:", options: ["beautiful", "important", "taller", "expensive"], correctIndex: 2, explanation: { bn: "'more taller' ডাবল কম্পারেটিভ — এটি ভুল।", hi: "'more taller' गलत है।", en: "Never combine 'more' with '-er'." } },
      { question: "'One of the ___ cities'", options: ["big", "bigger", "biggest", "most big"], correctIndex: 2, explanation: { bn: "'One of the'-এর পর Superlative ('biggest') + Plural Noun বসে।", hi: "'One of the' के बाद Superlative आता है।", en: "'One of the' takes superlative + plural noun." } },
      { question: "In 'as...as', use:", options: ["Positive", "Comparative", "Superlative", "Adverb only"], correctIndex: 0, explanation: { bn: "Positive degree বসে।", hi: "Positive degree आती है।", en: "Positive degree goes inside 'as...as'." } },
      { question: "Latin comparatives like 'senior, junior, superior' take:", options: ["than", "to", "from", "with"], correctIndex: 1, explanation: { bn: "senior/junior/superior-এর পরে 'to' বসে।", hi: "इनके साथ 'to' लगता है।", en: "Latin comparatives take 'to'." } },
    ]),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "adjective-adverb-order",
    stageNumber: 5,
    title: "2. Adjective & Adverb Order",
    formula: "Adj: OSASCOMP (Opinion-Size-Age-Shape-Color-Origin-Material) | Adv: MPT (Manner-Place-Time)",
    overviewRule: {
      bn: "একই Noun-এর আগে একাধিক Adjective বসলে ক্রম হবে: Opinion → Size → Age → Shape → Color → Origin → Material (OSASCOMP)। আর বাক্যের শেষে একাধিক Adverb বসলে ক্রম হবে: Manner → Place → Time (MPT)।",
      hi: "Adjective क्रम: Opinion → Size → Age → Shape → Color → Origin → Material। Adverb क्रम: Manner → Place → Time।",
      en: "Multiple adjectives before a noun follow OSASCOMP; trailing adverbs follow MPT (Manner, Place, Time).",
    },
    subTypes: [
      {
        name: "1. OSASCOMP & MPT in Practice",
        rule: {
          bn: "যেমন: 'a lovely (Opinion) small (Size) old (Age) red (Color) wooden (Material) box'। এবং 'She sang sweetly (Manner) on stage (Place) last night (Time)'।",
          hi: "उदाहरण: 'a lovely small old red wooden box' और 'sang sweetly on stage last night'।",
          en: "Put opinion before size/color/material; put how before where and when.",
        },
        words: ["lovely", "small", "ancient", "round", "black", "Italian", "leather", "calmly", "here", "yesterday"],
        sentences: ["He bought a sleek new black Japanese car.", "They worked quietly in the library all day."],
      },
    ],
    wordBank: ["lovely", "big", "small", "old", "new", "round", "red", "blue", "wooden", "silk", "calmly", "well", "here", "there", "yesterday"],
    sentenceExamples: [
      "She wore a beautiful long red silk dress.",
      "We stayed in a cozy little old cottage.",
      "He spoke clearly at the conference this morning.",
    ],
    sentencePrompts: [
      "Write a sentence describing a noun with 2 or 3 adjectives in OSASCOMP order.",
      "Write a sentence with Manner + Time adverbs at the end.",
      "Write a sentence with Manner + Place + Time adverbs at the end.",
      "Write a sentence placing a frequency adverb (always/often) before the main verb.",
      "Write a sentence describing an object using Size + Color + Material.",
    ],
    rightWordQuestions: [
      { prompt: "She bought a ___ bag.", options: ["leather black small", "small black leather", "black small leather", "leather small black"], correctIndex: 1, explanation: { bn: "Size (small) → Color (black) → Material (leather) সঠিক ক্রম।", hi: "Size → Color → Material सही क्रम है।", en: "Size → Color → Material." } },
      { prompt: "He played ___.", options: ["yesterday well here", "well here yesterday", "here yesterday well", "yesterday here well"], correctIndex: 1, explanation: { bn: "Manner (well) → Place (here) → Time (yesterday) সঠিক।", hi: "Manner → Place → Time सही है।", en: "Manner → Place → Time." } },
      { prompt: "It is a ___ table.", options: ["wooden round", "round wooden", "brown wooden round", "wooden brown"], correctIndex: 1, explanation: { bn: "Shape (round) → Material (wooden)।", hi: "Shape → Material सही है।", en: "Shape precedes Material." } },
      { prompt: "She ___ comes late.", options: ["never", "yesterday", "here", "politely"], correctIndex: 0, explanation: { bn: "Frequency adverb ('never') মূল verb-এর আগে বসে।", hi: "Frequency adverb क्रिया से पहले आता है।", en: "Frequency adverb goes before main verb." } },
      { prompt: "They live in a ___ house.", options: ["brick big old", "big old brick", "old brick big", "brick old big"], correctIndex: 1, explanation: { bn: "Size (big) → Age (old) → Material (brick)।", hi: "Size → Age → Material सही है।", en: "Size → Age → Material." } },
    ],
    quizQuestions: padQuiz([
      { question: "In OSASCOMP, which comes first?", options: ["Color", "Material", "Opinion", "Origin"], correctIndex: 2, explanation: { bn: "Opinion (যেমন nice, lovely) সবার আগে আসে।", hi: "Opinion सबसे पहले आता है।", en: "Opinion comes first." } },
      { question: "Which comes last before the noun in OSASCOMP?", options: ["Opinion", "Size", "Material/Purpose", "Age"], correctIndex: 2, explanation: { bn: "Material (wooden, silk) Noun-এর সবচেয়ে কাছে বসে।", hi: "Material संज्ञा के सबसे पास आता है।", en: "Material sits closest to the noun." } },
      { question: "What does MPT stand for in adverb order?", options: ["Manner-Place-Time", "Material-Place-Tense", "Modal-Past-Time", "Mean-Part-Type"], correctIndex: 0, explanation: { bn: "Manner → Place → Time।", hi: "Manner → Place → Time।", en: "Manner, Place, Time." } },
      { question: "Choose the correct phrase:", options: ["a red big ball", "a big red ball", "a ball big red", "red a big ball"], correctIndex: 1, explanation: { bn: "Size (big) → Color (red)।", hi: "Size → Color सही है।", en: "Size before Color." } },
      { question: "Where do 'always, often, never' go with 'am/is/are'?", options: ["Before 'am/is/are'", "After 'am/is/are'", "At the end", "Nowhere"], correctIndex: 1, explanation: { bn: "be verb-এর পরে Frequency adverb বসে (She is always happy)।", hi: "be verb के बाद आता है।", en: "After 'be' verbs." } },
    ]),
    levels: ["admission", "ielts"],
  },

  {
    id: "appropriate-prepositions",
    stageNumber: 5,
    title: "3. Appropriate Prepositions",
    formula: "Verb / Adjective + Fixed Preposition (depend on, good at, interested in, afraid of)",
    overviewRule: {
      bn: "ইংরেজিতে নির্দিষ্ট কিছু Verb ও Adjective-এর সাথে সবসময় নির্দিষ্ট Preposition বসে — এগুলো পরিবর্তন করলে অর্থ বদলে যায় বা ভুল হয়। Admission ও চাকরির পরীক্ষায় এগুলো সবচেয়ে বেশি আসে।",
      hi: "कई Verbs और Adjectives के साथ निश्चित Preposition लगते हैं, जिन्हें Appropriate Prepositions कहते हैं।",
      en: "Many verbs and adjectives pair with fixed prepositions (collocations). Memorizing and practicing them prevents common errors.",
    },
    subTypes: [
      {
        name: "1. Essential Verb & Adjective Collocations",
        rule: {
          bn: "good at (দক্ষ), interested in (আগ্রহী), afraid of (ভীত), proud of (গর্বিত), depend on (নির্ভর করা), consist of (গঠিত), apologize for (ক্ষমা চাওয়া), suffer from (ভোগা), listen to (শোনা), look after (দেখাশোনা)।",
          hi: "good at, interested in, afraid of, proud of, depend on, consist of, suffer from, listen to।",
          en: "Key pairs: good at, interested in, afraid of, proud of, depend on, consist of, suffer from, apologize for.",
        },
        words: ["good at", "interested in", "afraid of", "proud of", "depend on", "consist of", "suffer from", "apologize for", "belong to", "fond of"],
        sentences: ["Success depends on hard work.", "Water consists of hydrogen and oxygen."],
      },
    ],
    wordBank: ["good at", "bad at", "interested in", "afraid of", "proud of", "fond of", "famous for", "depend on", "rely on", "consist of", "suffer from", "apologize for", "belong to", "agree with", "look after"],
    sentenceExamples: [
      "He is suffering from a high fever.",
      "I completely agree with your opinion.",
      "This book belongs to my sister.",
      "Cox's Bazar is famous for its long sea beach.",
    ],
    sentencePrompts: [
      "Write a sentence using 'good at' or 'interested in'.",
      "Write a sentence using 'depend on' or 'consist of'.",
      "Write a sentence using 'afraid of' or 'proud of'.",
      "Write a sentence using 'apologize for' or 'suffer from'.",
      "Write a sentence using 'agree with' or 'belong to'.",
    ],
    rightWordQuestions: [
      { prompt: "Our success depends ___ our effort.", options: ["in", "at", "on", "of"], correctIndex: 2, explanation: { bn: "'depend'-এর সাথে 'on' বসে।", hi: "'depend' के साथ 'on' लगता है।", en: "'depend on'." } },
      { prompt: "She is very fond ___ classical music.", options: ["in", "of", "at", "with"], correctIndex: 1, explanation: { bn: "'fond'-এর সাথে 'of' বসে।", hi: "'fond' के साथ 'of' आता है।", en: "'fond of'." } },
      { prompt: "The committee consists ___ five members.", options: ["with", "in", "of", "by"], correctIndex: 2, explanation: { bn: "'consist of' মানে গঠিত হওয়া।", hi: "'consist of' का अर्थ से बना होना है।", en: "'consist of'." } },
      { prompt: "He apologized ___ his rude behavior.", options: ["to", "for", "at", "with"], correctIndex: 1, explanation: { bn: "কোনো কাজের জন্য ক্ষমা চাইতে 'apologize for' বসে।", hi: "किसी बात के लिए माफी में 'apologize for' आता है।", en: "'apologize for something'." } },
      { prompt: "I am not afraid ___ failure.", options: ["from", "of", "with", "at"], correctIndex: 1, explanation: { bn: "'afraid of' সঠিক জোড়া।", hi: "'afraid of' सही है।", en: "'afraid of'." } },
    ],
    quizQuestions: padQuiz([
      { question: "Complete: 'He is senior ___ me.'", options: ["than", "to", "from", "of"], correctIndex: 1, explanation: { bn: "'senior to' বসে।", hi: "'senior to' सही है।", en: "'senior to'." } },
      { question: "Complete: 'She is suffering ___ fever.'", options: ["of", "by", "from", "with"], correctIndex: 2, explanation: { bn: "'suffer from' বসে।", hi: "'suffer from' आता है।", en: "'suffer from'." } },
      { question: "Complete: 'Bangladesh is rich ___ natural gas.'", options: ["in", "on", "at", "with"], correctIndex: 0, explanation: { bn: "'rich in' বসে।", hi: "'rich in' सही है।", en: "'rich in'." } },
      { question: "Complete: 'Don't laugh ___ the poor.'", options: ["on", "at", "to", "with"], correctIndex: 1, explanation: { bn: "'laugh at' মানে উপহাস করা।", hi: "'laugh at' आता है।", en: "'laugh at'." } },
      { question: "Complete: 'This pen belongs ___ me.'", options: ["for", "with", "to", "at"], correctIndex: 2, explanation: { bn: "'belong to' বসে।", hi: "'belong to' आता है।", en: "'belong to'." } },
    ]),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "relative-pronouns",
    stageNumber: 5,
    title: "4. Relative Pronouns (who, which, that, whose)",
    formula: "Antecedent (Noun) + who/whom/whose/which/that + Clause",
    overviewRule: {
      bn: "Relative Pronoun (who, whom, whose, which, that) দুটি বাক্যকে যুক্ত করে এবং আগের Noun-টির পরিচয় দেয়। ব্যক্তি বোঝাতে who/whom, বস্তু/প্রাণীতে which, উভয়ে that, এবং মালিকানায় whose বসে। Verb সবসময় Relative Pronoun-এর ঠিক আগের Noun অনুযায়ী হয়।",
      hi: "Relative Pronouns (who, which, that, whose) दो वाक्यों को जोड़ते हैं। व्यक्ति के लिए who, वस्तु के लिए which, और अधिकार के लिए whose आता है।",
      en: "Relative pronouns connect clauses to a preceding noun (antecedent): who/whom (people), which (things), that (either), whose (possession).",
    },
    subTypes: [
      {
        name: "1. Defining vs Non-defining Clauses",
        rule: {
          bn: "Defining clause-এ কমা বসে না এবং 'that' ব্যবহার করা যায়। Non-defining (অতিরিক্ত তথ্য) clause-এর দুপাশে কমা বসে এবং সেখানে 'that' ব্যবহার করা যায় না (শুধু who/which বসে)।",
          hi: "Non-defining clause में अल्पविराम (,) लगता है और उसमें 'that' का प्रयोग नहीं होता।",
          en: "Non-defining clauses use commas and never use 'that' (use 'who' or 'which').",
        },
        words: ["who", "whom", "whose", "which", "that", "where", "when"],
        sentences: ["The girl who won the prize is my cousin.", "Dhaka, which is our capital, is very lively."],
      },
    ],
    wordBank: ["who", "whom", "whose", "which", "that", "where", "when", "why"],
    sentenceExamples: [
      "Subject: I met a writer who lives in London.",
      "Object: The man whom you called is my uncle.",
      "Possession: I know a boy whose mother is a judge.",
      "Thing: The phone which I bought works fast.",
    ],
    sentencePrompts: [
      "Write a sentence combining two ideas using 'who'.",
      "Write a sentence using 'which' or 'that' for a thing.",
      "Write a sentence using 'whose' to show possession.",
      "Write a sentence using 'where' for a place.",
      "Write a non-defining relative clause with commas using 'which' or 'who'.",
    ],
    rightWordQuestions: [
      { prompt: "The girl ___ father is a doctor is my friend.", options: ["who", "whom", "whose", "which"], correctIndex: 2, explanation: { bn: "মালিকানা/সম্পর্ক ('যার বাবা') বোঝাতে 'whose' বসে।", hi: "अधिकार/संबंध के लिए 'whose' आता है।", en: "'whose' shows possession." } },
      { prompt: "This is the house ___ I was born.", options: ["which", "where", "who", "whose"], correctIndex: 1, explanation: { bn: "স্থান ('যেখানে') বোঝাতে 'where' বসে।", hi: "स्थान के लिए 'where' आता है।", en: "'where' refers to a place." } },
      { prompt: "The books ___ are on the table are mine.", options: ["who", "whom", "which", "whose"], correctIndex: 2, explanation: { bn: "বস্তু ('books') বোঝাতে 'which' বসে।", hi: "वस्तु के लिए 'which' आता है।", en: "Things take 'which' or 'that'." } },
      { prompt: "It is I who ___ to blame.", options: ["is", "are", "am", "were"], correctIndex: 2, explanation: { bn: "'who'-এর আগের Antecedent 'I' অনুযায়ী 'am' বসবে!", hi: "'who' से पहले 'I' होने के कारण 'am' आएगा।", en: "Verb agrees with antecedent 'I' -> 'am'." } },
      { prompt: "My brother, ___ lives in Sylhet, is visiting us.", options: ["that", "who", "which", "whom"], correctIndex: 1, explanation: { bn: "কমা যুক্ত Non-defining clause-এ 'that' নয়, 'who' বসে।", hi: "कॉमा वाले वाक्य में 'that' नहीं, 'who' आता है।", en: "Non-defining clauses do not use 'that'." } },
    ],
    quizQuestions: padQuiz([
      { question: "Which relative pronoun shows possession?", options: ["who", "whom", "whose", "which"], correctIndex: 2, explanation: { bn: "'whose' মালিকানা বোঝায়।", hi: "'whose' अधिकार दिखाता है।", en: "'whose' shows possession." } },
      { question: "Which cannot be used inside a comma-separated non-defining clause?", options: ["who", "which", "that", "whose"], correctIndex: 2, explanation: { bn: "Non-defining clause-এ 'that' বসে না।", hi: "Non-defining में 'that' नहीं लगता।", en: "'that' is barred in non-defining clauses." } },
      { question: "'who' is used for:", options: ["Things", "People", "Places", "Time"], correctIndex: 1, explanation: { bn: "ব্যক্তির জন্য 'who' বসে।", hi: "व्यक्तियों के लिए 'who' आता है।", en: "'who' refers to people." } },
      { question: "In 'One of the boys who ___ here', choose:", options: ["live", "lives", "living", "is live"], correctIndex: 0, explanation: { bn: "'who'-এর আগের শব্দ 'boys' Plural হওয়ায় 'live' হবে।", hi: "'boys' बहुवचन होने के कारण 'live' आएगा।", en: "Antecedent 'boys' is plural -> 'live'." } },
      { question: "'The day ___ we met was sunny.'", options: ["who", "when", "which", "whose"], correctIndex: 1, explanation: { bn: "সময় বোঝাতে 'when' বসে।", hi: "समय के लिए 'when' आता है।", en: "Time takes 'when'." } },
    ]),
    levels: ["admission", "ielts"],
  },

  // ================= STAGE 6: TRANSFORMATION =================
  {
    id: "active-passive-voice",
    stageNumber: 6,
    title: "1. Active & Passive Voice",
    formula: "Active: Sub + V + Obj → Passive: Obj + be (tense) + V3 + by + Sub",
    overviewRule: {
      bn: "Active-এ Subject কাজ করে, Passive-এ Object-কে সামনে এনে তার ওপর কাজটি ঘটে বোঝানো হয়। Passive-এর মূল সূত্র: Object-কে Subject করা + Tense অনুযায়ী 'be' verb + মূল Verb-এর V3 + by + Subject-এর Object রূপ।",
      hi: "Passive Voice का मूल नियम: Object को Subject बनाना + Tense के अनुसार 'be' क्रिया + हमेशा V3 + by + Subject।",
      en: "Passive voice highlights the receiver: move Object to Subject, insert the tense-matched 'be' auxiliary, use V3, and optionally add 'by + agent'.",
    },
    subTypes: [
      {
        name: "1. Tense-wise Passive & Imperative Passive",
        rule: {
          bn: "Present Simple → am/is/are+V3; Continuous → am/is/are+being+V3; Perfect → have/has+been+V3; Modal → modal+be+V3; Imperative → Let + Object + be + V3।",
          hi: "Continuous में being+V3, Perfect में been+V3, Modal में be+V3, और Imperative में 'Let + Obj + be + V3' लगता है।",
          en: "Continuous adds 'being', Perfect adds 'been', Modals add 'be', and Imperatives use 'Let + object + be + V3'.",
        },
        words: ["is written", "was built", "is being cleaned", "has been done", "must be followed", "Let it be done"],
        sentences: ["English is spoken worldwide.", "Let the door be closed."],
      },
    ],
    wordBank: ["is made", "was built", "are grown", "were invited", "is being repaired", "has been completed", "will be announced", "must be obeyed", "Let...be"],
    sentenceExamples: [
      "Simple: Rice is grown in Bangladesh.",
      "Past: The telephone was invented by Alexander Graham Bell.",
      "Continuous: The road is being repaired right now.",
      "Modal: This rule must be followed by everyone.",
    ],
    sentencePrompts: [
      "Write a Present Simple Passive sentence ('am/is/are + V3').",
      "Write a Past Simple Passive sentence ('was/were + V3').",
      "Write a Passive sentence with a Modal verb ('should/must/can + be + V3').",
      "Write a Continuous Passive sentence ('is/are being + V3').",
      "Write an Imperative Passive sentence starting with 'Let...'.",
    ],
    rightWordQuestions: [
      { prompt: "The letter ___ by Rahim yesterday.", options: ["wrote", "is written", "was written", "was writing"], correctIndex: 2, explanation: { bn: "'yesterday' ও 'by Rahim' থাকায় Past Passive 'was written' হবে।", hi: "'yesterday' और 'by' के कारण 'was written' सही है।", en: "Past passive uses 'was written'." } },
      { prompt: "The room is ___ cleaned right now.", options: ["been", "being", "be", "to be"], correctIndex: 1, explanation: { bn: "Continuous Passive-এ 'being + V3' বসে।", hi: "Continuous Passive में 'being' आता है।", en: "Continuous passive uses 'being'." } },
      { prompt: "This work must ___ today.", options: ["finish", "finished", "be finished", "been finished"], correctIndex: 2, explanation: { bn: "Modal-এর Passive-এ 'be + V3' বসে।", hi: "Modal Passive में 'be + V3' आता है।", en: "Modal passive = modal + be + V3." } },
      { prompt: "Passive of 'Open the door':", options: ["The door is opened.", "Let the door be opened.", "Let open the door.", "You open the door."], correctIndex: 1, explanation: { bn: "Imperative Passive-এর সূত্র: Let + Obj + be + V3।", hi: "Imperative Passive: Let + Obj + be + V3।", en: "'Let + object + be + V3'." } },
      { prompt: "In Passive Voice, the main verb is ALWAYS in:", options: ["V1", "V2", "V3", "V-ing"], correctIndex: 2, explanation: { bn: "Passive-এ মূল verb সবসময় V3 হয়।", hi: "Passive में हमेशा V3 आता है।", en: "Passive always uses V3." } },
    ],
    quizQuestions: padQuiz([
      { question: "Passive of 'She writes a poem':", options: ["A poem is wrote by her.", "A poem is written by her.", "A poem was written by her.", "A poem writes her."], correctIndex: 1, explanation: { bn: "Present Simple Passive = is + V3 ('written')।", hi: "'A poem is written by her.' सही है।", en: "is + written." } },
      { question: "Passive of 'Who broke the glass?':", options: ["By whom was the glass broken?", "Who was broken the glass?", "By who the glass broken?", "Whom broke the glass?"], correctIndex: 0, explanation: { bn: "'Who' Passive-এ 'By whom' হয়।", hi: "'Who' का Passive 'By whom' होता है।", en: "'Who' becomes 'By whom'." } },
      { question: "Which auxiliary is added in Present Perfect Passive?", options: ["being", "been", "be", "was"], correctIndex: 1, explanation: { bn: "have/has + been + V3।", hi: "been जुड़ता है।", en: "'been' is added." } },
      { question: "Passive of 'I know him':", options: ["He is known by me.", "He is known to me.", "He was known to me.", "He is knowing me."], correctIndex: 1, explanation: { bn: "'know'-এর পর Passive-এ 'by' নয়, 'to' বসে।", hi: "'known' के साथ 'to' लगता है।", en: "'known to', not 'known by'." } },
      { question: "Can Intransitive verbs (like 'sleep') be made passive?", options: ["Yes", "No, they have no object", "Only in future", "Always"], correctIndex: 1, explanation: { bn: "Object না থাকায় Intransitive verb-এর Passive হয় না।", hi: "Object न होने से Passive नहीं बनता।", en: "Intransitive verbs have no object to promote." } },
    ]),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "direct-indirect-speech",
    stageNumber: 6,
    title: "2. Direct & Indirect Speech (Narration)",
    formula: "Reporting Verb (Past) → Tense Backshift + Pronoun + Time/Place Changes",
    overviewRule: {
      bn: "বক্তার কথা হুবহু বললে Direct Speech, আর নিজের ভাষায় বললে Indirect Speech। Reporting verb Past (said) হলে ভেতরের Tense এক ধাপ অতীতে যায়, Pronoun ও সময়বাচক শব্দ বদলায় (today → that day, tomorrow → the next day)। চিরন্তন সত্যে Tense বদলায় না।",
      hi: "Direct से Indirect में यदि Reporting verb भूतकाल (said) में हो तो Tense एक कदम पीछे जाता है और समय शब्द बदलते हैं।",
      en: "Indirect speech reports words without quotes. When the reporting verb is past (said/told), shift tenses back and update pronouns and time words.",
    },
    subTypes: [
      {
        name: "1. Assertive, Interrogative & Imperative Narration",
        rule: {
          bn: "Assertive: said that; Interrogative: asked + if/whether (Yes/No) বা Wh-word + Subject + Verb (প্রশ্নবোধক চিহ্ন উঠে যায়!); Imperative: ordered/requested/advised + to + V1।",
          hi: "Assertive में 'that', Interrogative में 'asked + if/Wh + Sub + V', Imperative में 'to + V1' लगता है।",
          en: "Statements use 'that'; Yes/No questions use 'asked if/whether + S + V'; Imperatives use 'told/asked + object + to + V1'.",
        },
        words: ["said that", "told me", "asked if", "requested to", "ordered to", "that day", "the next day", "the previous day"],
        sentences: ["He asked me where I lived.", "She requested me to wait."],
      },
    ],
    wordBank: ["said that", "told", "asked", "if", "whether", "ordered", "requested", "advised", "that day", "the next day", "the previous day", "then", "there"],
    sentenceExamples: [
      "Statement: He said, \"I am happy.\" → He said that he was happy.",
      "Question: She asked, \"Are you ready?\" → She asked if I was ready.",
      "Truth: The teacher said, \"The earth is round.\" → The teacher said that the earth is round.",
    ],
    sentencePrompts: [
      "Write an Indirect statement starting with 'He said that...'.",
      "Write an Indirect Yes/No question using 'She asked me if...'.",
      "Write an Indirect Wh-question using 'He asked me where/what...'.",
      "Write an Indirect request using 'She requested me to...'.",
      "Write an Indirect universal truth where the tense stays Present.",
    ],
    rightWordQuestions: [
      { prompt: "He said that he ___ busy then.", options: ["is", "was", "will be", "am"], correctIndex: 1, explanation: { bn: "Reporting verb 'said' Past হওয়ায় 'is' বদলে 'was' হবে।", hi: "'said' भूतकाल होने से 'was' होगा।", en: "Backshift 'is' -> 'was'." } },
      { prompt: "She asked me ___ I liked coffee.", options: ["that", "if", "what", "to"], correctIndex: 1, explanation: { bn: "Yes/No প্রশ্নে 'if' বা 'whether' বসে।", hi: "Yes/No प्रश्न में 'if' आता है।", en: "Yes/No questions take 'if' or 'whether'." } },
      { prompt: "In Indirect Speech, 'tomorrow' becomes:", options: ["yesterday", "the next day", "that day", "today"], correctIndex: 1, explanation: { bn: "'tomorrow' বদলে 'the next day' হয়।", hi: "'tomorrow' का 'the next day' होता है।", en: "'tomorrow' -> 'the next day'." } },
      { prompt: "He requested me ___ him.", options: ["help", "helping", "to help", "helped"], correctIndex: 2, explanation: { bn: "Imperative narration-এ 'to + V1' বসে।", hi: "Imperative में 'to + V1' आता है।", en: "Imperative reporting uses 'to + V1'." } },
      { prompt: "She asked me where ___.", options: ["did I live", "I lived", "do I live", "lived I"], correctIndex: 1, explanation: { bn: "Indirect প্রশ্নে Wh-word-এর পর Subject + Verb ('I lived') বসে।", hi: "Indirect प्रश्न में Subject + Verb क्रम होता है।", en: "Indirect questions use statement order: 'where I lived'." } },
    ],
    quizQuestions: padQuiz([
      { question: "'today' changes in Indirect Speech to:", options: ["yesterday", "that day", "next day", "this day"], correctIndex: 1, explanation: { bn: "today → that day।", hi: "today → that day।", en: "today becomes that day." } },
      { question: "When does the tense NOT backshift?", options: ["Always backshifts", "For universal truths", "In questions", "In imperatives"], correctIndex: 1, explanation: { bn: "চিরন্তন সত্যে Tense বদলায় না।", hi: "सार्वभौमिक सत्य में Tense नहीं बदलता।", en: "Universal truths keep present tense." } },
      { question: "'will' changes to ___ after 'said'.", options: ["shall", "would", "can", "may"], correctIndex: 1, explanation: { bn: "will → would।", hi: "will → would।", en: "will shifts to would." } },
      { question: "'told' is always followed by:", options: ["that directly", "an object (me/him)", "if", "to"], correctIndex: 1, explanation: { bn: "'told'-এর পরে অবশ্যই Object বসে (told me), 'said'-এর পরে 'to' ছাড়া নয়।", hi: "'told' के बाद Object अनिवार्य है।", en: "'told' requires an indirect object." } },
      { question: "What punctuation ends an Indirect Question?", options: ["?", "!", ".", ":"], correctIndex: 2, explanation: { bn: "Indirect question শেষে Full stop (.) বসে।", hi: "अंत में पूर्ण विराम (.) लगता है।", en: "Ends with a period." } },
    ]),
    levels: ["school", "admission"],
  },

  {
    id: "sentence-transformation",
    stageNumber: 6,
    title: "3. Sentence Transformation",
    formula: "Only → None but | Too...to → so...that | Every → There is no...but",
    overviewRule: {
      bn: "অর্থ পরিবর্তন না করে বাক্যের গঠন বদলানোকে Transformation বলে। যেমন: Only (ব্যক্তি) → None but, Only (বস্তু) → Nothing but, Too...to → so...that + cannot/could not, Must → cannot but + V1।",
      hi: "अर्थ बदले बिना वाक्य का रूप बदलना Transformation है (Only → None but, Too...to → so...that)।",
      en: "Transformation alters grammatical structure while keeping meaning intact (Affirmative ↔ Negative, Assertive ↔ Interrogative/Exclamatory).",
    },
    subTypes: [
      {
        name: "1. Top Exam Transformation Pairs",
        rule: {
          bn: "Always → Never (+ opposite word); Everybody → Nobody (+ opposite) বা Who does not...?; As soon as → No sooner had ... than।",
          hi: "Always → Never (+ विलोम); As soon as → No sooner had ... than।",
          en: "Key pairs: always ↔ never + antonym, too...to ↔ so...that, as soon as ↔ no sooner had...than.",
        },
        words: ["None but", "Nothing but", "cannot but", "so...that", "No sooner had...than", "There is no...but"],
        sentences: ["Only he can do it. → None but he can do it.", "He is too weak to walk. → He is so weak that he cannot walk."],
      },
    ],
    wordBank: ["None but", "Nothing but", "not more than", "cannot but", "cannot help", "so...that", "No sooner had", "Who does not", "What a"],
    sentenceExamples: [
      "Must: We must obey our parents. → We cannot but obey our parents.",
      "Every: Every mother loves her child. → There is no mother but loves her child.",
      "Always: I will always remember you. → I will never forget you.",
    ],
    sentencePrompts: [
      "Write a Negative sentence using 'None but...' or 'Nothing but...'.",
      "Write a sentence using 'so ... that ... cannot/could not'.",
      "Write a sentence using 'cannot but + V1'.",
      "Write a sentence using 'There is no ... but ...'.",
      "Write a rhetorical Interrogative starting with 'Who does not...'.",
    ],
    rightWordQuestions: [
      { prompt: "Negative of 'Only Rahim can solve it': ___ Rahim can solve it.", options: ["Nothing but", "None but", "No more", "Never"], correctIndex: 1, explanation: { bn: "ব্যক্তির ক্ষেত্রে 'Only' বদলে 'None but' হয়।", hi: "व्यक्ति के लिए 'None but' आता है।", en: "People take 'None but'." } },
      { prompt: "He is so tired ___ he cannot walk.", options: ["to", "that", "than", "as"], correctIndex: 1, explanation: { bn: "'so...that' সঠিক জোড়া।", hi: "'so...that' सही जोड़ी है।", en: "'so ... that' is the pair." } },
      { prompt: "We cannot ___ respect our elders.", options: ["but", "help", "to", "so"], correctIndex: 0, explanation: { bn: "'cannot but + V1' বসে (আর 'cannot help + V-ing')।", hi: "'cannot but + V1' आता है।", en: "'cannot but' takes V1." } },
      { prompt: "As soon as he saw me, he ran away → No sooner ___ he seen me than he ran away.", options: ["did", "had", "was", "has"], correctIndex: 1, explanation: { bn: "'No sooner had + Sub + V3 ... than'।", hi: "'No sooner had' आता है।", en: "'No sooner had ... than'." } },
      { prompt: "Negative of 'He has only ten taka': He has ___ ten taka.", options: ["none but", "not more than", "nothing but", "never"], correctIndex: 1, explanation: { bn: "সংখ্যার আগে 'only' থাকলে 'not more than / not less than' হয়।", hi: "संख्या के लिए 'not more than' आता है।", en: "Numbers use 'not more than'." } },
    ],
    quizQuestions: padQuiz([
      { question: "'Only' before a thing becomes:", options: ["None but", "Nothing but", "Not more than", "Never"], correctIndex: 1, explanation: { bn: "বস্তুর ক্ষেত্রে 'Nothing but' বসে।", hi: "वस्तु के लिए 'Nothing but' आता है।", en: "Things take 'Nothing but'." } },
      { question: "'cannot help' is followed by:", options: ["V1", "to+V1", "V-ing", "V2"], correctIndex: 2, explanation: { bn: "'cannot help + V-ing' হয়।", hi: "'cannot help' के बाद V-ing आता है।", en: "'cannot help' takes V-ing." } },
      { question: "Interrogative of 'Everybody hates a liar':", options: ["Who hates a liar?", "Who does not hate a liar?", "Does everybody hate?", "Nobody hates a liar."], correctIndex: 1, explanation: { bn: "Everybody → Who does not...?", hi: "'Who does not...?' सही है।", en: "Everybody -> Who does not...?" } },
      { question: "Assertive of 'How sweet the mango is!':", options: ["The mango is very sweet.", "Is the mango sweet?", "What a sweet mango!", "Mango is sweet."], correctIndex: 0, explanation: { bn: "'How' বদলে 'very' বসে।", hi: "'How' के स्थान पर 'very' आता है।", en: "'How' becomes 'very'." } },
      { question: "'Too...to' in Past Tense becomes:", options: ["so...that + cannot", "so...that + could not", "very...to", "such...that"], correctIndex: 1, explanation: { bn: "Past-এ 'could not' বসে।", hi: "Past में 'could not' आता है।", en: "Past tense uses 'could not'." } },
    ]),
    levels: ["school", "admission"],
  },

  {
    id: "question-tags",
    stageNumber: 6,
    title: "4. Question Tags",
    formula: "Positive, negative tag? | Negative, positive tag?",
    overviewRule: {
      bn: "কথার শেষে শ্রোতার সম্মতি চাইতে ছোট প্রশ্ন জুড়ে দেওয়াকে Question Tag বলে। বাক্য Positive হলে Tag Negative, আর বাক্য Negative হলে Tag Positive হয়। ব্যতিক্রম: 'I am' → 'aren't I?', 'Let's' → 'shall we?', Imperative → 'will you?'।",
      hi: "सहमति लेने के लिए वाक्य के अंत में छोटा प्रश्न (Tag) लगता है। I am → aren't I?, Let's → shall we?।",
      en: "Question tags confirm information: positive statements take negative tags; negative statements take positive tags.",
    },
    subTypes: [
      {
        name: "1. Special Tag Rules",
        rule: {
          bn: "hardly, seldom, scarcely, never, nobody, nothing থাকলে বাক্যটি Negative ধরা হয়—তাই Tag Positive হয়! Nobody/Everybody থাকলে Tag-এর Pronoun হয় 'they'।",
          hi: "hardly, seldom, never, nobody होने पर वाक्य नकारात्मक माना जाता है, इसलिए Tag सकारात्मक होगा।",
          en: "Words like hardly/seldom/never/nobody make the statement negative (so use a positive tag). Nobody/everyone -> pronoun 'they'.",
        },
        words: ["isn't it?", "don't you?", "didn't he?", "aren't I?", "shall we?", "will you?", "do they?"],
        sentences: ["Nobody called, did they?", "He seldom goes out, does he?"],
      },
    ],
    wordBank: ["isn't he?", "aren't you?", "aren't I?", "don't they?", "didn't she?", "won't we?", "shall we?", "will you?", "can't you?", "hasn't he?"],
    sentenceExamples: [
      "You speak English, don't you?",
      "I am on time, aren't I?",
      "Let's take a break, shall we?",
      "She has never been to Paris, has she?",
    ],
    sentencePrompts: [
      "Write a positive statement with a negative tag.",
      "Write a negative statement with a positive tag.",
      "Write a sentence starting with 'I am...' and its tag.",
      "Write a sentence starting with 'Let's...' and its tag.",
      "Write a sentence using 'never' or 'seldom' with a positive tag.",
    ],
    rightWordQuestions: [
      { prompt: "I am your friend, ___?", options: ["amn't I", "aren't I", "isn't I", "don't I"], correctIndex: 1, explanation: { bn: "'I am'-এর Tag সবসময় 'aren't I?' হয়।", hi: "'I am' का Tag 'aren't I?' होता है।", en: "'I am' takes 'aren't I?'." } },
      { prompt: "Let's start the lesson, ___?", options: ["will we", "shall we", "don't we", "aren't we"], correctIndex: 1, explanation: { bn: "'Let's' থাকলে Tag 'shall we?' হয়।", hi: "'Let's' का Tag 'shall we?' होता है।", en: "'Let's' takes 'shall we?'." } },
      { prompt: "Everyone is happy, ___?", options: ["isn't he", "aren't they", "isn't it", "don't they"], correctIndex: 1, explanation: { bn: "'Everyone'-এর Pronoun 'they' হয়, তাই 'aren't they?'।", hi: "'Everyone' के लिए 'they' आता है।", en: "'Everyone' maps to 'they' -> 'aren't they?'." } },
      { prompt: "He hardly visits us, ___?", options: ["doesn't he", "does he", "didn't he", "is he"], correctIndex: 1, explanation: { bn: "'hardly' নেতিবাচক অর্থ দেয়, তাই Positive tag 'does he?' হবে।", hi: "'hardly' नकारात्मक है, इसलिए 'does he?' आएगा।", en: "'hardly' is negative, so use positive 'does he?'." } },
      { prompt: "Open the window, ___?", options: ["shall we", "will you", "aren't you", "do we"], correctIndex: 1, explanation: { bn: "Imperative বাক্যের Tag 'will you?' হয়।", hi: "Imperative का Tag 'will you?' होता है।", en: "Imperatives take 'will you?'." } },
    ],
    quizQuestions: padQuiz([
      { question: "Tag for 'I am right':", options: ["amn't I?", "aren't I?", "isn't I?", "don't I?"], correctIndex: 1, explanation: { bn: "aren't I?।", hi: "aren't I?।", en: "aren't I?" } },
      { question: "Tag for 'Let's go':", options: ["will you?", "shall we?", "don't we?", "can we?"], correctIndex: 1, explanation: { bn: "shall we?।", hi: "shall we?।", en: "shall we?" } },
      { question: "Tag for 'Nothing is impossible':", options: ["isn't it?", "is it?", "are they?", "aren't they?"], correctIndex: 1, explanation: { bn: "'Nothing' নেতিবাচক এবং বস্তুবাচক ('it'), তাই 'is it?'।", hi: "'Nothing' के लिए 'is it?' आता है।", en: "'Nothing' is negative singular -> 'is it?'." } },
      { question: "Tag for 'She went home':", options: ["doesn't she?", "didn't she?", "wasn't she?", "did she?"], correctIndex: 1, explanation: { bn: "Past Simple 'went' হওয়ায় 'didn't she?'।", hi: "V2 के कारण 'didn't she?'।", en: "Past simple uses 'didn't she?'." } },
      { question: "Tag for 'He has a car':", options: ["hasn't he?", "doesn't he?", "Both A & B", "isn't he?"], correctIndex: 2, explanation: { bn: "আধুনিক ইংরেজিতে 'doesn't he?' ও ব্রিটিশ রীতিতে 'hasn't he?' উভয়ই সঠিক।", hi: "दोनों सही हैं।", en: "Both 'doesn't he?' and 'hasn't he?' are accepted." } },
    ]),
    levels: ["school", "admission"],
  },

  {
    id: "causative-verbs",
    stageNumber: 6,
    title: "5. Causative Verbs (have, get, make, let)",
    formula: "make/let/have + person + V1 | get + person + to V1 | have/get + thing + V3",
    overviewRule: {
      bn: "নিজে না করে অন্যকে দিয়ে কাজ করানো বোঝাতে Causative Verb বসে। বাধ্য করতে 'make', অনুমতিতে 'let', দায়িত্ব দিতে 'have' (ব্যক্তি + V1) বা 'get' (ব্যক্তি + to V1), এবং কোনো বস্তুর ওপর কাজ হলে 'have/get + বস্তু + V3' বসে।",
      hi: "दूसरों से काम करवाने के लिए Causative Verbs लगते हैं: make/let/have + व्यक्ति + V1, get + व्यक्ति + to+V1, have/get + वस्तु + V3।",
      en: "Causatives show someone causes another to do something: make/let/have + person + V1, get + person + to V1, and have/get + thing + V3.",
    },
    subTypes: [
      {
        name: "1. Active Causative vs Passive Causative",
        rule: {
          bn: "ব্যক্তি কাজটি করলে Active Causative (I had the mechanic fix my car / I got the mechanic to fix my car)। আর বস্তু হলে Passive Causative (I had/got my car fixed)।",
          hi: "व्यक्ति होने पर Active (V1 या to+V1), और वस्तु होने पर Passive (V3) लगता है।",
          en: "Person = V1 (have/make/let) or to+V1 (get); Thing = V3 (have/get).",
        },
        words: ["make", "let", "have", "get", "fix", "to fix", "fixed", "cut", "cleaned"],
        sentences: ["She made me laugh.", "I got my phone repaired yesterday."],
      },
    ],
    wordBank: ["make", "made", "let", "have", "had", "get", "got", "help", "repaired", "washed", "checked"],
    sentenceExamples: [
      "Make: The coach made the players run five laps.",
      "Let: My parents let me choose my career.",
      "Get + person: I got my friend to help me.",
      "Have/Get + thing: We had the house painted last month.",
    ],
    sentencePrompts: [
      "Write a sentence using 'make + person + V1'.",
      "Write a sentence using 'let + person + V1'.",
      "Write a sentence using 'have + person + V1'.",
      "Write a sentence using 'get + person + to + V1'.",
      "Write a sentence using 'have/get + thing + V3' (e.g., hair cut, car repaired).",
    ],
    rightWordQuestions: [
      { prompt: "The teacher made the students ___ the essay.", options: ["rewrite", "to rewrite", "rewrote", "rewriting"], correctIndex: 0, explanation: { bn: "'make + ব্যক্তি'-এর পরে সরাসরি V1 ('rewrite') বসে।", hi: "'make + व्यक्ति' के बाद V1 आता है।", en: "'make + person' takes bare V1." } },
      { prompt: "I got my brother ___ my laptop.", options: ["fix", "to fix", "fixed", "fixing"], correctIndex: 1, explanation: { bn: "'get + ব্যক্তি'-এর পরে 'to + V1' বসে।", hi: "'get + व्यक्ति' के बाद 'to + V1' आता है।", en: "'get + person' takes 'to + V1'." } },
      { prompt: "She had her hair ___ yesterday.", options: ["cut", "to cut", "cutting", "cuts"], correctIndex: 0, explanation: { bn: "'her hair' বস্তু হওয়ায় 'have + বস্তু + V3' ('cut') হবে।", hi: "वस्तु के लिए V3 'cut' आता है।", en: "Thing takes V3 ('cut')." } },
      { prompt: "Please let me ___ what happened.", options: ["to explain", "explain", "explained", "explaining"], correctIndex: 1, explanation: { bn: "'let + ব্যক্তি'-এর পরে V1 ('explain') বসে।", hi: "'let' के बाद V1 आता है।", en: "'let' takes base V1." } },
      { prompt: "We need to get the roof ___ before monsoon.", options: ["repair", "to repair", "repaired", "repairing"], correctIndex: 2, explanation: { bn: "'the roof' বস্তু হওয়ায় V3 ('repaired') হবে।", hi: "वस्तु के लिए V3 'repaired' आता है।", en: "Passive causative with thing takes V3." } },
    ],
    quizQuestions: padQuiz([
      { question: "Which causative takes 'to + V1' for a person?", options: ["make", "let", "have", "get"], correctIndex: 3, explanation: { bn: "'get + person + to + V1' হয়।", hi: "'get' के साथ 'to + V1' आता है।", en: "'get + person + to V1'." } },
      { question: "In 'I had my car washed', 'washed' is:", options: ["V1", "V2", "V3", "V-ing"], correctIndex: 2, explanation: { bn: "বস্তুর পরে V3 বসে।", hi: "वस्तु के बाद V3 लगता है।", en: "Past participle V3." } },
      { question: "'let' means:", options: ["force", "allow/permit", "pay", "refuse"], correctIndex: 1, explanation: { bn: "'let' মানে অনুমতি দেওয়া।", hi: "'let' का अर्थ अनुमति देना है।", en: "'let' means permit." } },
      { question: "Choose the correct sentence:", options: ["She made me to cry.", "She made me cry.", "She let me to go.", "I had my room clean."], correctIndex: 1, explanation: { bn: "'make + me + cry' সঠিক।", hi: "'She made me cry.' सही है।", en: "'make' takes bare infinitive." } },
      { question: "'Help' can be followed by:", options: ["V1 or to+V1", "Only V-ing", "Only V3", "Only V2"], correctIndex: 0, explanation: { bn: "'help' দুটোই নেয়।", hi: "दोनों सही हैं।", en: "'help' accepts both V1 and to+V1." } },
    ]),
    levels: ["admission"],
  },

  // ================= STAGE 7: ACCURACY & STYLE =================
  {
    id: "punctuation-capitalization",
    stageNumber: 7,
    title: "1. Punctuation & Capitalization",
    formula: "Capital: Start, 'I', Proper Nouns | Marks: . , ? ! ' : ; \" \"",
    overviewRule: {
      bn: "সঠিক বিরামচিহ্ন ও বড় হাতের অক্ষর (Capitalization) লেখার অর্থ স্পষ্ট করে। বাক্যের শুরু, 'I', এবং Proper Noun সবসময় Capital হয়। Apostrophe (') মালিকানা (Rahim's) বা সংক্ষিপ্ত রূপে (don't, it's) বসে।",
      hi: "सही विराम चिह्न और Capitalization लेखन को स्पष्ट बनाते हैं। वाक्य की शुरुआत, 'I', और Proper Noun हमेशा Capital होते हैं।",
      en: "Proper punctuation and capitalization clarify meaning. Capitalize sentence starts, 'I', and proper nouns; use apostrophes for possession and contractions.",
    },
    subTypes: [
      {
        name: "1. It's vs Its & Comma Rules",
        rule: {
          bn: "'It's' = It is / It has; কিন্তু 'Its' = এটির (মালিকানা, এখানে apostrophe নেই!)। তালিকায় ৩টির বেশি জিনিস থাকলে কমা বসে।",
          hi: "'It's' = It is; 'Its' = इसका (बिना apostrophe)।",
          en: "'It's' means 'It is/has'; 'Its' is possessive (no apostrophe).",
        },
        words: ["It's", "Its", "Rahim's", "students'", "don't", "however,"],
        sentences: ["It's a nice day, isn't it?", "The dog wagged its tail."],
      },
    ],
    wordBank: ["Period (.)", "Comma (,)", "Question Mark (?)", "Exclamation (!)", "Apostrophe (')", "Semicolon (;)", "Colon (:)", "Quotation Marks (\" \")"],
    sentenceExamples: [
      "On Friday, Tariq and I visited Dhaka.",
      "We need pens, notebooks, and a ruler.",
      "\"Where are you going?\" asked Sara.",
    ],
    sentencePrompts: [
      "Write a sentence with proper capitalization for a day, a person, and a city.",
      "Write a sentence listing 3 or more items separated by commas.",
      "Write a sentence using an apostrophe for possession (e.g., Rahim's).",
      "Write a sentence using both 'It's' and 'its' (or one of them accurately).",
      "Write a direct quote using quotation marks (\"...\").",
    ],
    rightWordQuestions: [
      { prompt: "The cat licked ___ paws.", options: ["it's", "its", "its'", "it"], correctIndex: 1, explanation: { bn: "মালিকানা বোঝাতে apostrophe ছাড়া 'its' বসে।", hi: "अधिकार के लिए 'its' आता है।", en: "Possessive 'its' has no apostrophe." } },
      { prompt: "___ raining heavily outside.", options: ["Its", "It's", "Its'", "Is"], correctIndex: 1, explanation: { bn: "'It is'-এর সংক্ষিপ্ত রূপ 'It's'।", hi: "'It is' का संक्षिप्त रूप 'It's' है।", en: "'It's' = It is." } },
      { prompt: "This is the ___ hostel (for many boys).", options: ["boy's", "boys'", "boys", "boy"], correctIndex: 1, explanation: { bn: "Plural 'boys'-এর শেষে শুধু apostrophe (') বসে।", hi: "बहुवचन में s के बाद apostrophe लगता है।", en: "Plural possessive: boys'." } },
      { prompt: "Which word MUST always be capitalized?", options: ["me", "I", "we", "you"], correctIndex: 1, explanation: { bn: "'I' সবসময় Capital হয়।", hi: "'I' हमेशा बड़ा होता है।", en: "Pronoun 'I' is always capitalized." } },
      { prompt: "Which punctuation joins two closely related independent clauses without a conjunction?", options: ["Comma (,)", "Semicolon (;)", "Question mark (?)", "Apostrophe (')"], correctIndex: 1, explanation: { bn: "Semicolon (;) দুটি ঘনিষ্ঠ স্বাধীন Clause যুক্ত করে।", hi: "Semicolon (;) दो स्वतंत्र उपवाक्यों को जोड़ता है।", en: "Semicolon joins closely linked clauses." } },
    ],
    quizQuestions: padQuiz([
      { question: "What is the difference between 'It's' and 'Its'?", options: ["None", "It's = It is; Its = possessive", "Its = It is", "It's is plural"], correctIndex: 1, explanation: { bn: "It's = It is; Its = মালিকানা।", hi: "It's = It is; Its = इसका।", en: "It's = It is; Its = possessive." } },
      { question: "Always capitalize:", options: ["Common nouns", "Proper nouns", "Adverbs", "Prepositions"], correctIndex: 1, explanation: { bn: "Proper Noun Capital হয়।", hi: "Proper Noun Capital होते हैं।", en: "Proper nouns are capitalized." } },
      { question: "Which mark ends an indirect question?", options: ["?", "!", ".", ";"], correctIndex: 2, explanation: { bn: "Period (.) বসে।", hi: "पूर्ण विराम (.) लगता है।", en: "Ends with a period." } },
      { question: "Plural possessive of 'children':", options: ["childrens'", "children's", "childs'", "children"], correctIndex: 1, explanation: { bn: "'children' শেষে 's' নেই, তাই 'children's'।", hi: "'children's' सही है।", en: "'children's'." } },
      { question: "Comma splice happens when:", options: ["Two sentences are joined only by a comma", "A period is used", "A question mark is used", "Quotes are used"], correctIndex: 0, explanation: { bn: "শুধু কমা দিয়ে দুটি পূর্ণ বাক্য জুড়ে দেওয়া ভুল (Comma splice)।", hi: "केवल कॉमा से दो पूर्ण वाक्य जोड़ना गलत है।", en: "Joining two independent clauses with only a comma." } },
    ]),
    levels: ["admission"],
  },

  {
    id: "common-errors",
    stageNumber: 7,
    title: "2. Common Grammar Errors",
    formula: "discuss (no about) · return (no back) · cope with (no up with) · advice/information (no -s)",
    overviewRule: {
      bn: "ইংরেজি বলার ও লেখার সময় আমরা কিছু প্রচলিত ভুল করি (যেমন: discuss about, return back, cope up with, informations, did + V2)। এগুলো এড়িয়ে চললে আপনার ইংরেজি তাৎক্ষণিকভাবে শুদ্ধ ও প্রফেশনাল শোনাবে।",
      hi: "आम गलतियों से बचें: discuss (about नहीं), return (back नहीं), cope with (up with नहीं), information (s नहीं)।",
      en: "Eliminate high-frequency errors: avoid redundant prepositions/adverbs (discuss about, return back) and pluralizing uncountables (advices, informations).",
    },
    subTypes: [
      {
        name: "1. Redundancy & Uncountable Traps",
        rule: {
          bn: "ভুল → সঠিক: discuss about → discuss; return back → return; repeat again → repeat; cope up with → cope with; informations/furnitures/sceneries → information/furniture/scenery।",
          hi: "discuss about → discuss; return back → return; cope up with → cope with; advices → advice।",
          en: "Say 'discuss X', 'return', 'repeat', 'cope with', and keep 'information, advice, furniture, luggage' singular.",
        },
        words: ["discuss", "return", "repeat", "cope with", "information", "advice", "furniture", "luggage", "machinery"],
        sentences: ["Please give me some advice. (Not: advices)", "We discussed the issue. (Not: discussed about)"],
      },
    ],
    wordBank: ["discuss", "return", "repeat", "cope with", "enter", "emphasize", "information", "advice", "furniture", "luggage", "scenery", "poetry"],
    sentenceExamples: [
      "Correct: She entered the room. (Not: entered into)",
      "Correct: I cannot cope with the pressure. (Not: cope up with)",
      "Correct: All the furniture is new. (Not: furnitures are)",
    ],
    sentencePrompts: [
      "Write a correct sentence using 'discuss' (without 'about').",
      "Write a correct sentence using 'return' (without 'back').",
      "Write a correct sentence using 'cope with' (without 'up').",
      "Write a correct sentence using 'information' or 'advice' as singular.",
      "Write a correct sentence using 'enter' (without 'into' for a room/building).",
    ],
    rightWordQuestions: [
      { prompt: "Let's ___ the problem together.", options: ["discuss about", "discuss", "discuss on", "discuss over"], correctIndex: 1, explanation: { bn: "'discuss'-এর পরে 'about' বসে না।", hi: "'discuss' के बाद 'about' नहीं लगता।", en: "'discuss' takes a direct object." } },
      { prompt: "He gave me some useful ___.", options: ["advices", "advice", "an advice", "many advice"], correctIndex: 1, explanation: { bn: "'advice' Uncountable, তাই 's' বা 'an' বসবে না।", hi: "'advice' Uncountable है।", en: "'advice' is uncountable." } },
      { prompt: "She ___ home at 5 PM.", options: ["returned back", "returned", "back returned", "return back"], correctIndex: 1, explanation: { bn: "'return' মানেই ফিরে আসা, তাই 'back' বাহুল্য।", hi: "'return' में 'back' नहीं लगता।", en: "'return' already means go back." } },
      { prompt: "We must learn to ___ stress.", options: ["cope up with", "cope with", "cope on", "cope at"], correctIndex: 1, explanation: { bn: "সঠিক phrase হলো 'cope with'।", hi: "सही रूप 'cope with' है।", en: "Correct idiom is 'cope with'." } },
      { prompt: "The ___ of this area is breathtaking.", options: ["sceneries", "scenery", "scenerys", "a scenery"], correctIndex: 1, explanation: { bn: "'scenery' সবসময় Singular Uncountable।", hi: "'scenery' हमेशा एकवचन है।", en: "'scenery' is uncountable." } },
    ],
    quizQuestions: padQuiz([
      { question: "Which sentence is 100% correct?", options: ["He returned back.", "Let's discuss about it.", "I need some information.", "She is my cousin sister."], correctIndex: 2, explanation: { bn: "'I need some information.' সঠিক ('cousin sister' ও ভুল—শুধু 'cousin')।", hi: "'I need some information.' सही है।", en: "'I need some information.' is correct." } },
      { question: "Avoid 'into' after 'enter' when:", options: ["Entering a physical place", "Entering an agreement", "Always", "Never"], correctIndex: 0, explanation: { bn: "কক্ষে প্রবেশে শুধু 'enter the room' হয়।", hi: "कमरे में प्रवेश के लिए 'enter' बिना 'into' के आता है।", en: "Physical entry: 'enter the room'." } },
      { question: "Which is uncountable?", options: ["table", "chair", "furniture", "pen"], correctIndex: 2, explanation: { bn: "'furniture' Uncountable।", hi: "'furniture' Uncountable है।", en: "'furniture' is uncountable." } },
      { question: "Correct form of 'One of my friend':", options: ["One of my friend", "One of my friends", "One of mine friend", "Ones of my friends"], correctIndex: 1, explanation: { bn: "'One of the/my + Plural Noun' হয়।", hi: "'One of my friends' सही है।", en: "'One of + plural noun'." } },
      { question: "Say '___' instead of 'cousin brother/sister':", options: ["cousin", "relative brother", "uncle son", "step cousin"], correctIndex: 0, explanation: { bn: "শুধু 'cousin' বলতে হয়।", hi: "केवल 'cousin' बोलें।", en: "Just say 'cousin'." } },
    ]),
    levels: ["admission"],
  },

  {
    id: "idioms-phrasal-verbs",
    stageNumber: 7,
    title: "3. Idioms, Phrases & Phrasal Verbs",
    formula: "Phrasal Verb = Verb + Particle | Idiom = Figurative Fixed Expression",
    overviewRule: {
      bn: "Verb-এর সাথে Preposition/Adverb মিলে নতুন অর্থ তৈরি করলে তা Phrasal Verb (যেমন: give up, put off, look into)। আর Idioms হলো বাগধারা যার আক্ষরিক অর্থের চেয়ে রূপক অর্থ আলাদা (যেমন: a piece of cake = খুব সহজ)।",
      hi: "Phrasal Verb (Verb + Preposition) नया अर्थ देता है (give up, put off)। Idioms मुहावरे होते हैं जिनका विशेष अर्थ होता है।",
      en: "Phrasal verbs pair a verb with a particle for a new meaning; idioms are figurative expressions whose meaning isn't literal.",
    },
    subTypes: [
      {
        name: "1. High-Value Phrasal Verbs & Idioms",
        rule: {
          bn: "give up (হাল ছাড়া), look after (দেখাশোনা), find out (খুঁজে বের করা), put off (স্থগিত করা), call off (বাতিল করা), get along with (মিলেমিশে থাকা)। Idioms: once in a blue moon (কদাচিৎ), break a leg (শুভকামনা)।",
          hi: "give up (हार मानना), look after (देखभाल), put off (टालना), call off (रद्द करना)।",
          en: "give up (quit), look after (care for), put off (postpone), call off (cancel), once in a blue moon (rarely).",
        },
        words: ["give up", "look after", "put off", "call off", "find out", "carry on", "piece of cake", "blue moon"],
        sentences: ["Never give up on your goals.", "We only meet once in a blue moon."],
      },
    ],
    wordBank: ["give up", "look after", "look for", "look into", "put off", "put on", "call off", "find out", "carry on", "run out of", "get over", "piece of cake", "break the ice", "burn the midnight oil"],
    sentenceExamples: [
      "The meeting was called off due to bad weather.",
      "Please carry on with your presentation.",
      "She burned the midnight oil to prepare for IELTS.",
    ],
    sentencePrompts: [
      "Write a sentence using 'give up' or 'carry on'.",
      "Write a sentence using 'look after' or 'find out'.",
      "Write a sentence using 'put off' or 'call off'.",
      "Write a sentence using 'run out of' or 'get over'.",
      "Write a sentence using an idiom like 'a piece of cake' or 'once in a blue moon'.",
    ],
    rightWordQuestions: [
      { prompt: "The match was ___ because of heavy rain.", options: ["put on", "called off", "given up", "looked after"], correctIndex: 1, explanation: { bn: "'call off' মানে বাতিল করা।", hi: "'call off' का अर्थ रद्द करना है।", en: "'call off' = cancel." } },
      { prompt: "She ___ her younger sister while parents are at work.", options: ["looks after", "gives up", "puts off", "runs out"], correctIndex: 0, explanation: { bn: "'look after' মানে দেখাশোনা করা।", hi: "'look after' का अर्थ देखभाल करना है।", en: "'look after' = take care of." } },
      { prompt: "Don't ___! Keep trying.", options: ["give up", "put off", "call off", "find out"], correctIndex: 0, explanation: { bn: "'give up' মানে হাল ছেড়ে দেওয়া।", hi: "'give up' का अर्थ हार मानना है।", en: "'give up' = quit." } },
      { prompt: "'A piece of cake' means:", options: ["Very tasty", "Very easy", "Very hard", "Expensive"], correctIndex: 1, explanation: { bn: "খুব সহজ কাজ।", hi: "बहुत आसान।", en: "Very easy." } },
      { prompt: "We have ___ sugar; let's buy some.", options: ["run out of", "called off", "carried on", "looked into"], correctIndex: 0, explanation: { bn: "'run out of' মানে শেষ হয়ে যাওয়া।", hi: "'run out of' का अर्थ समाप्त होना है।", en: "'run out of' = have none left." } },
    ],
    quizQuestions: padQuiz([
      { question: "'Put off' means:", options: ["Wear", "Postpone", "Cancel", "Extinguish"], correctIndex: 1, explanation: { bn: "স্থগিত করা (Postpone)।", hi: "टालना (Postpone)।", en: "Postpone." } },
      { question: "'Once in a blue moon' means:", options: ["Every night", "Very rarely", "Always", "Never"], correctIndex: 1, explanation: { bn: "খুব কদাচিৎ।", hi: "बहुत कम (ईद का चाँद)।", en: "Very rarely." } },
      { question: "'Look into' means:", options: ["Investigate", "Ignore", "Watch TV", "Care"], correctIndex: 0, explanation: { bn: "তদন্ত করা বা খতিয়ে দেখা।", hi: "जांच करना।", en: "Investigate." } },
      { question: "'Burn the midnight oil' means:", options: ["Waste fuel", "Study/work late at night", "Sleep early", "Cook dinner"], correctIndex: 1, explanation: { bn: "রাত জেগে পড়া বা কাজ করা।", hi: "रात भर जागकर पढ़ना/काम करना।", en: "Work/study late into the night." } },
      { question: "'Break the ice' means:", options: ["Freeze water", "Start a friendly conversation", "End a friendship", "Fall down"], correctIndex: 1, explanation: { bn: "জড়তা কাটিয়ে কথা শুরু করা।", hi: "बातचीत की झिझक तोड़ना।", en: "Ease tension and start conversation." } },
    ]),
    levels: ["admission"],
  },

  {
    id: "word-formation",
    stageNumber: 7,
    title: "4. Word Formation (Prefix, Suffix, Synonyms, Antonyms)",
    formula: "Prefix (meaning change) + Root + Suffix (Part of Speech change)",
    overviewRule: {
      bn: "একটি মূল শব্দ থেকে Prefix (শুরুতে বসে বিপরীত/নতুন অর্থ দেয়: un-, dis-, im-, re-) ও Suffix (শেষে বসে Parts of Speech বদলায়: -tion, -ness, -ment, -ly, -able, -ful) যোগ করে অসংখ্য নতুন শব্দ তৈরি করা যায়।",
      hi: "मूल शब्द के आगे Prefix और अंत में Suffix जोड़कर नए शब्द और अलग-अलग Parts of Speech बनाए जाते हैं।",
      en: "Prefixes (un-, dis-, re-) modify meaning; suffixes (-tion, -ness, -ly, -able) change the part of speech.",
    },
    subTypes: [
      {
        name: "1. Prefix & Suffix Patterns",
        rule: {
          bn: "Verb → Noun: educate → education, develop → development; Adj → Noun: happy → happiness; Noun → Adj: beauty → beautiful; Adj → Adv: quick → quickly।",
          hi: "-tion / -ment / -ness से Noun, -ful / -able से Adjective, और -ly से Adverb बनते हैं।",
          en: "Noun suffixes: -tion, -ment, -ness; Adjective: -ful, -less, -able; Adverb: -ly.",
        },
        words: ["unhappy", "impossible", "disagree", "rewrite", "education", "happiness", "beautiful", "careless", "comfortable", "quickly"],
        sentences: ["Education brings empowerment.", "Nothing is impossible with dedication."],
      },
    ],
    wordBank: ["un-", "dis-", "im-", "in-", "ir-", "re-", "mis-", "-tion", "-ment", "-ness", "-ity", "-ful", "-less", "-able", "-ly"],
    sentenceExamples: [
      "Synonym of 'essential': crucial, vital | Antonym: optional.",
      "Synonym of 'accurate': precise, exact | Antonym: inaccurate.",
      "Root 'create': creation (N), creative (Adj), creatively (Adv).",
    ],
    sentencePrompts: [
      "Write a sentence using a word with a negative prefix (un-, im-, dis-, or ir-).",
      "Write a sentence using 're-' prefix (rewrite, rebuild, review).",
      "Write a sentence using a Noun ending in '-tion' or '-ment'.",
      "Write a sentence using an Adjective ending in '-ful' or '-less'.",
      "Write a sentence using an Adjective ending in '-able'.",
    ],
    rightWordQuestions: [
      { prompt: "What is the opposite of 'possible'?", options: ["unpossible", "impossible", "dispossible", "inpossible"], correctIndex: 1, explanation: { bn: "'p' দিয়ে শুরু শব্দের আগে 'im-' বসে (impossible)।", hi: "'p' से पहले 'im-' लगता है।", en: "Prefix 'im-' before 'p'/'m'." } },
      { prompt: "Noun form of 'develop' is:", options: ["developing", "developed", "development", "developerly"], correctIndex: 2, explanation: { bn: "'-ment' যুক্ত হয়ে Noun 'development' হয়।", hi: "'development' संज्ञा है।", en: "'development' is the noun." } },
      { prompt: "Adjective form of 'comfort' is:", options: ["comfortness", "comfortable", "comfortly", "comfortion"], correctIndex: 1, explanation: { bn: "'-able' যুক্ত হয়ে 'comfortable' Adjective হয়।", hi: "'comfortable' विशेषण है।", en: "'comfortable' is the adjective." } },
      { prompt: "Which prefix means 'again'?", options: ["un-", "dis-", "re-", "mis-"], correctIndex: 2, explanation: { bn: "'re-' মানে পুনরায় (rewrite)।", hi: "'re-' का अर्थ फिर से है।", en: "'re-' means again." } },
      { prompt: "Opposite of 'regular':", options: ["unregular", "irregular", "disregular", "imregular"], correctIndex: 1, explanation: { bn: "'r' দিয়ে শুরু শব্দের আগে 'ir-' বসে (irregular)।", hi: "'r' से पहले 'ir-' आता है।", en: "Words starting with 'r' take 'ir-'." } },
    ],
    quizQuestions: padQuiz([
      { question: "Suffix '-ness' usually forms a:", options: ["Verb", "Adverb", "Noun", "Preposition"], correctIndex: 2, explanation: { bn: "'-ness' Abstract Noun তৈরি করে।", hi: "'-ness' Noun बनाता है।", en: "'-ness' forms nouns." } },
      { question: "Prefix 'mis-' means:", options: ["again", "wrongly", "before", "under"], correctIndex: 1, explanation: { bn: "'mis-' মানে ভুলভাবে (misunderstand)।", hi: "'mis-' का अर्थ गलत है।", en: "'mis-' means wrongly." } },
      { question: "Synonym of 'vital':", options: ["trivial", "crucial", "optional", "weak"], correctIndex: 1, explanation: { bn: "'vital' ও 'crucial' মানে অত্যন্ত জরুরি।", hi: "'crucial' समानार्थी है।", en: "'vital' = 'crucial'." } },
      { question: "Antonym of 'expand':", options: ["grow", "increase", "shrink", "extend"], correctIndex: 2, explanation: { bn: "'expand' (বাড়া) এর বিপরীত 'shrink' (সংকুচিত হওয়া)।", hi: "'shrink' विलोम है।", en: "'shrink' is the antonym." } },
      { question: "Adverb form of 'careful':", options: ["care", "careless", "carefully", "carefulness"], correctIndex: 2, explanation: { bn: "'carefully' Adverb।", hi: "'carefully' Adverb है।", en: "'carefully'." } },
    ]),
    levels: ["admission"],
  },

  // ================= STAGE 8: REAL USE =================
  {
    id: "spoken-english-patterns",
    stageNumber: 8,
    title: "1. Spoken English Patterns",
    formula: "Requests: Would you mind + V-ing? | Opinions: In my view... | Agreeing: I couldn't agree more",
    overviewRule: {
      bn: "কথোপকথনে সাবলীল ও ভদ্র হতে কিছু রেডিমেড Spoken Pattern জানা খুব জরুরি। অনুরোধে 'Could you possibly / Would you mind + V-ing', মতামতে 'In my opinion / Personally, I think', এবং ভদ্রভাবে দ্বিমতে 'I see your point, but...' ব্যবহার করুন।",
      hi: "बोलचाल में सहज और विनम्र होने के लिए Spoken Patterns का उपयोग करें: Would you mind+V-ing?, In my opinion..., I see your point, but...।",
      en: "Natural spoken English relies on polite functional frames for requests, opinions, agreeing, and polite disagreement.",
    },
    subTypes: [
      {
        name: "1. Requests, Opinions & Polite Disagreement",
        rule: {
          bn: "সরাসরি 'No, you are wrong' না বলে বলুন: 'I see your point, however I think...'। অনুরোধে 'Would you mind + V-ing?' সবচেয়ে ভদ্র রূপ।",
          hi: "सीधे गलत कहने के बजाय 'I see your point, however...' कहें।",
          en: "Soften disagreement with 'I see your point, however...'; make polite requests with 'Would you mind + V-ing?'.",
        },
        words: ["Would you mind", "Could you possibly", "In my opinion", "From my perspective", "I couldn't agree more", "I see your point"],
        sentences: ["Would you mind speaking a bit slower?", "I see your point, but let's check the budget first."],
      },
    ],
    wordBank: ["Would you mind", "Could you please", "In my opinion", "Personally", "To be honest", "I couldn't agree more", "That makes sense", "I see your point", "How about", "Why don't we"],
    sentenceExamples: [
      "Greeting: How have you been lately?",
      "Request: Could you possibly send me the file today?",
      "Opinion: From my perspective, consistency matters most.",
      "Suggestion: Why don't we practice together for ten minutes?",
    ],
    sentencePrompts: [
      "Write a polite request using 'Would you mind + V-ing?'.",
      "Write your opinion on learning English using 'In my opinion...'.",
      "Write a strong agreement using 'I couldn't agree more...'.",
      "Write a polite disagreement using 'I see your point, but...'.",
      "Write a friendly suggestion using 'How about + V-ing?' or 'Why don't we...?'.",
    ],
    rightWordQuestions: [
      { prompt: "Would you mind ___ the door?", options: ["close", "to close", "closing", "closed"], correctIndex: 2, explanation: { bn: "'Would you mind'-এর পরে V-ing বসে।", hi: "'Would you mind' के बाद V-ing आता है।", en: "'Would you mind + V-ing'." } },
      { prompt: "___ my opinion, daily practice is essential.", options: ["On", "In", "At", "By"], correctIndex: 1, explanation: { bn: "সঠিক phrase হলো 'In my opinion'।", hi: "'In my opinion' सही है।", en: "'In my opinion'." } },
      { prompt: "'I couldn't agree more' means:", options: ["I totally disagree", "I completely agree", "I don't know", "Maybe"], correctIndex: 1, explanation: { bn: "এটি পূর্ণ সম্মতি (100% agree) বোঝায়।", hi: "इसका अर्थ पूर्ण सहमति है।", en: "Means 100% agreement." } },
      { prompt: "How about ___ a coffee after class?", options: ["grab", "to grab", "grabbing", "grabbed"], correctIndex: 2, explanation: { bn: "'How about'-এর পরে V-ing বসে।", hi: "'How about' के बाद V-ing आता है।", en: "'How about + V-ing'." } },
      { prompt: "Why don't we ___ a short break?", options: ["take", "taking", "to take", "took"], correctIndex: 0, explanation: { bn: "'Why don't we'-এর পরে V1 বসে।", hi: "'Why don't we' के बाद V1 आता है।", en: "'Why don't we + V1'." } },
    ],
    quizQuestions: padQuiz([
      { question: "Which is the most polite request?", options: ["Give me water.", "Would you mind passing the water?", "Pass water now.", "You must pass water."], correctIndex: 1, explanation: { bn: "'Would you mind...' অত্যন্ত ভদ্র।", hi: "'Would you mind...' सबसे विनम्र है।", en: "'Would you mind...' is very polite." } },
      { question: "'I didn't quite catch that' means:", options: ["I caught the ball", "I didn't hear/understand clearly", "I am angry", "Goodbye"], correctIndex: 1, explanation: { bn: "কথাটি ভালোভাবে শুনতে/বুঝতে না পারা।", hi: "ठीक से सुन/समझ न पाना।", en: "Means I didn't hear clearly." } },
      { question: "Which phrase introduces an opinion?", options: ["From my perspective", "Once upon a time", "Shut up", "Look out"], correctIndex: 0, explanation: { bn: "'From my perspective' মতামত জানায়।", hi: "'From my perspective' राय देता है।", en: "Introduces an opinion." } },
      { question: "After 'How about', use:", options: ["V1", "V-ing", "V2", "V3"], correctIndex: 1, explanation: { bn: "V-ing বসে।", hi: "V-ing आता है।", en: "Use V-ing." } },
      { question: "'Let's call it a day' means:", options: ["Wake up", "Stop working for today", "Start a new job", "Make a phone call"], correctIndex: 1, explanation: { bn: "আজকের মতো কাজ শেষ করা।", hi: "आज का काम समाप्त करना।", en: "Finish work for the day." } },
    ]),
    levels: ["ielts", "spoken"],
  },

  {
    id: "ielts-grammar",
    stageNumber: 8,
    title: "2. IELTS Grammar (Band 7+ Structures)",
    formula: "Complex Clauses · Passive Voice · Conditionals · Hedging (tend to, may) · Cleft Sentences",
    overviewRule: {
      bn: "IELTS Writing ও Speaking-এ Band 7+ পেতে হলে বৈচিত্র্যময় বাক্য গঠন জরুরি: Complex sentences (Although/Whereas), Passive voice, Conditionals, Relative clauses এবং Hedging (tend to, is likely to — চরম দাবি এড়াতে)।",
      hi: "IELTS में Band 7+ के लिए Complex sentences, Passive, Conditionals और Hedging (tend to, may) का सटीक उपयोग करें।",
      en: "IELTS rewards grammatical range and accuracy: mix complex subordination, passive voice, conditionals, relative clauses, and hedging.",
    },
    subTypes: [
      {
        name: "1. Hedging & Cleft Emphasis",
        rule: {
          bn: "Hedging: 'Technology solves all problems' না লিখে লিখুন 'Technology tends to improve efficiency'। Cleft sentence: 'What matters most is...' বা 'It is education that...'।",
          hi: "Hedging (tend to, is likely to) से संतुलित बात कहें, और 'What matters most is...' से जोर दें।",
          en: "Use hedging (tends to, is likely to) to avoid overgeneralization, and clefts ('What matters most is...') for emphasis.",
        },
        words: ["whereas", "although", "tends to", "is likely to", "What matters most is", "should be invested"],
        sentences: ["Whereas urban areas offer more jobs, rural areas offer cleaner air.", "What governments need to prioritize is public transport."],
      },
    ],
    wordBank: ["whereas", "although", "despite", "consequently", "tends to", "is likely to", "may result in", "What matters most", "It is...that", "provided that"],
    sentenceExamples: [
      "Complex: Although remote work saves commute time, it can reduce team bonding.",
      "Passive: Renewable energy should be subsidized by governments.",
      "Conditional: Were cities to expand cycling lanes, traffic congestion would drop.",
    ],
    sentencePrompts: [
      "Write a contrasting IELTS sentence using 'Whereas...' or 'Although...'.",
      "Write a formal Passive sentence using 'should be + V3'.",
      "Write a balanced claim using hedging ('tends to' or 'is likely to').",
      "Write an emphatic Cleft sentence starting with 'What matters most is...'.",
      "Write a Second Conditional sentence about education or environment.",
    ],
    rightWordQuestions: [
      { prompt: "Excessive screen time ___ lead to eye strain.", options: ["always must", "tends to", "never", "is"], correctIndex: 1, explanation: { bn: "একাডেমিক লেখায় পরিমিত দাবি করতে 'tends to' (Hedging) ব্যবহার হয়।", hi: "संतुलित कथन के लिए 'tends to' आता है।", en: "Hedging 'tends to' avoids absolute claims." } },
      { prompt: "___ city life is fast-paced, village life is calm.", options: ["Whereas", "Therefore", "Moreover", "Despite"], correctIndex: 0, explanation: { bn: "দুটি বিপরীত বিষয় পাশাপাশি তুলনা করতে 'Whereas' বসে।", hi: "तुलना के लिए 'Whereas' आता है।", en: "'Whereas' contrasts two clauses." } },
      { prompt: "What ___ most is consistent effort.", options: ["matter", "matters", "mattering", "mattered to"], correctIndex: 1, explanation: { bn: "'What' Singular Subject হওয়ায় 'matters' হবে।", hi: "'What' एकवचन है, इसलिए 'matters' आएगा।", en: "Cleft subject 'What' takes singular 'matters'." } },
      { prompt: "Public parks should ___ in every neighborhood.", options: ["create", "be created", "created", "creating"], correctIndex: 1, explanation: { bn: "Modal Passive 'should be created'।", hi: "Modal Passive 'be created' सही है।", en: "Passive 'should be created'." } },
      { prompt: "If governments ___ more in education, literacy would rise.", options: ["invest", "invested", "will invest", "had invest"], correctIndex: 1, explanation: { bn: "2nd Conditional-এ 'would rise'-এর সাথে V2 ('invested') বসে।", hi: "2nd Conditional में 'invested' आता है।", en: "2nd conditional pairs 'invested' with 'would rise'." } },
    ],
    quizQuestions: padQuiz([
      { question: "What is 'Hedging' in IELTS?", options: ["Using slang", "Softening claims (may, tends to, likely)", "Writing fragments", "Using contractions"], correctIndex: 1, explanation: { bn: "চরম দাবি এড়িয়ে ভারসাম্যপূর্ণ ভাষা ব্যবহার করা।", hi: "संतुलित भाषा का प्रयोग।", en: "Using cautious, balanced academic language." } },
      { question: "Which is a Cleft sentence?", options: ["I like music.", "What I like most is music.", "Music is nice.", "Listen to music."], correctIndex: 1, explanation: { bn: "'What I like most is...' জোর দেওয়ার জন্য Cleft sentence।", hi: "'What I like most is...' Cleft sentence है।", en: "'What ... is ...' is a cleft structure." } },
      { question: "In IELTS Task 2, avoid:", options: ["Complex sentences", "Informal contractions like 'gonna/wanna'", "Linking words", "Examples"], correctIndex: 1, explanation: { bn: "একাডেমিক লেখায় 'gonna/wanna' ব্যবহার করা উচিত নয়।", hi: "औपचारिक लेखन में स्लैंग से बचें।", en: "Avoid informal slang in academic writing." } },
      { question: "'Whereas' is used for:", options: ["Addition", "Direct contrast between two clauses", "Time", "Result"], correctIndex: 1, explanation: { bn: "দুটি clause-এর মধ্যে সরাসরি তুলনা/বৈপরীত্য।", hi: "दो वाक्यों में तुलना/विरोध।", en: "Direct contrast." } },
      { question: "Which shows grammatical range?", options: ["Only short simple sentences", "A natural mix of simple, compound, and complex sentences", "No punctuation", "Repeating 'and'"], correctIndex: 1, explanation: { bn: "বিভিন্ন ধরনের বাক্যের সুষম ব্যবহার।", hi: "विभिन्न वाक्य संरचनाओं का संतुलित मिश्रण।", en: "Balanced variety of sentence structures." } },
    ]),
    levels: ["ielts"],
  },

  {
    id: "paragraph-essay-structure",
    stageNumber: 8,
    title: "3. Paragraph & Essay Structure",
    formula: "Paragraph (PEEL): Point (Topic Sentence) → Explanation → Example → Link/Conclusion",
    overviewRule: {
      bn: "একটি শক্তিশালী Paragraph বা Essay বডি প্যারাগ্রাফে ৪টি ধাপ থাকে (PEEL): (১) Topic Sentence — মূল কথা, (২) Explanation — কেন/কীভাবে তা ব্যাখ্যা, (৩) Example — বাস্তব উদাহরণ ('For instance...'), (৪) Concluding/Linking Sentence। আর Essay-তে থাকে Introduction → Body 1 → Body 2 → Conclusion।",
      hi: "एक मजबूत Paragraph के 4 भाग (PEEL): Topic Sentence → Explanation → Example → Link/Conclusion।",
      en: "Strong paragraphs follow PEEL: Point (Topic Sentence), Explanation, Example ('For instance...'), and Link/Conclusion. Essays follow Intro → Body Paragraphs → Conclusion.",
    },
    subTypes: [
      {
        name: "1. Essay Blueprint (Intro → Body → Conclusion)",
        rule: {
          bn: "Introduction: Hook + Paraphrase + Thesis Statement। Body Paragraphs: প্রতিটি প্যারায় মাত্র ১টি মূল আইডিয়া (PEEL)। Conclusion: নতুন আইডিয়া নয়, বরং মূল বক্তব্যের সারসংক্ষেপ।",
          hi: "Intro (Thesis), Body (1 मुख्य विचार प्रति पैराग्राफ), Conclusion (सारांश, कोई नया बिंदु नहीं)।",
          en: "Intro introduces the thesis; each Body paragraph develops one clear idea via PEEL; Conclusion summarizes without adding new arguments.",
        },
        words: ["Topic Sentence", "Thesis Statement", "For instance", "To illustrate", "In conclusion", "To summarize"],
        sentences: ["Topic: Daily reading expands vocabulary rapidly.", "Example: For instance, reading one article daily teaches 10 new words."],
      },
    ],
    wordBank: ["Firstly", "Furthermore", "For instance", "For example", "Specifically", "In other words", "Consequently", "Therefore", "In conclusion", "To summarize"],
    sentenceExamples: [
      "Topic Sentence: Public libraries play a vital role in community education.",
      "Example: For instance, they provide free internet and books to students.",
      "Conclusion: In conclusion, investing in libraries benefits society as a whole.",
    ],
    sentencePrompts: [
      "Write a clear Topic Sentence about the benefits of learning English.",
      "Write an Explanation sentence supporting why daily practice works.",
      "Write an Example sentence starting with 'For instance,' or 'For example,'.",
      "Write a Concluding sentence starting with 'Therefore,' or 'In conclusion,'.",
      "Write a Thesis Statement for an essay on technology in education.",
    ],
    rightWordQuestions: [
      { prompt: "What is the first sentence of a body paragraph called?", options: ["Conclusion", "Topic Sentence", "Example", "Footnote"], correctIndex: 1, explanation: { bn: "মূল আইডিয়া জানানো প্রথম বাক্যটি হলো Topic Sentence।", hi: "पहला वाक्य Topic Sentence कहलाता है।", en: "The Topic Sentence states the paragraph's main point." } },
      { prompt: "___, reading news daily improves comprehension.", options: ["For instance", "In conclusion", "However", "Firstly"], correctIndex: 0, explanation: { bn: "উদাহরণ দিতে 'For instance' বসে।", hi: "उदाहरण के लिए 'For instance' आता है।", en: "'For instance' introduces an example." } },
      { prompt: "How many main ideas should one body paragraph have?", options: ["One clear main idea", "Five unrelated ideas", "Zero", "Ten"], correctIndex: 0, explanation: { bn: "প্রতিটি বডি প্যারাগ্রাফে ১টি স্পষ্ট মূল আইডিয়া থাকা উচিত।", hi: "एक पैराग्राफ में एक मुख्य विचार होना चाहिए।", en: "One clear main idea per body paragraph." } },
      { prompt: "Should you add brand-new arguments in the Conclusion?", options: ["Yes, always", "No, summarize existing points", "Only statistics", "Yes, two new points"], correctIndex: 1, explanation: { bn: "Conclusion-এ নতুন যুক্তি যোগ করা হয় না।", hi: "निष्कर्ष में नए तर्क नहीं जोड़ने चाहिए।", en: "Conclusions summarize without introducing new arguments." } },
      { prompt: "In PEEL, 'E' stands for:", options: ["End & Exit", "Explanation & Example", "Error & Edit", "Essay & Exam"], correctIndex: 1, explanation: { bn: "Point → Explanation → Example → Link।", hi: "Explanation और Example।", en: "Explanation and Example." } },
    ],
    quizQuestions: padQuiz([
      { question: "What does a Thesis Statement do?", options: ["Lists references", "States the main argument/position of an essay", "Gives an example", "Ends the essay"], correctIndex: 1, explanation: { bn: "পুরো Essay-র মূল অবস্থান জানায়।", hi: "निबंध का मुख्य दृष्टिकोण बताता है।", en: "States the essay's central argument." } },
      { question: "Which phrase introduces a conclusion?", options: ["For example", "To summarize", "Moreover", "First of all"], correctIndex: 1, explanation: { bn: "'To summarize' বা 'In conclusion' উপসংহার শুরু করে।", hi: "'To summarize' निष्कर्ष शुरू करता है।", en: "'To summarize' signals conclusion." } },
      { question: "What follows a Topic Sentence?", options: ["Unrelated joke", "Explanation and supporting example", "Title", "Blank line"], correctIndex: 1, explanation: { bn: "ব্যাখ্যা ও উদাহরণ।", hi: "व्याख्या और उदाहरण।", en: "Explanation and supporting evidence." } },
      { question: "Which is a strong Topic Sentence?", options: ["I will write about phones.", "Smartphones have transformed how students access information.", "Phones are things.", "Hello everyone."], correctIndex: 1, explanation: { bn: "নির্দিষ্ট ও স্পষ্ট মূল বক্তব্য।", hi: "स्पष्ट और सटीक मुख्य विचार।", en: "Specific, clear, and arguable main point." } },
      { question: "Coherence in writing means:", options: ["Long difficult words", "Logical flow and clear connection between ideas", "No paragraphs", "Using all caps"], correctIndex: 1, explanation: { bn: "যুক্তিপূর্ণ ধারাবাহিকতা ও সংযোগ।", hi: "विचारों का तार्किक प्रवाह।", en: "Logical flow and clear connections." } },
    ]),
    levels: ["ielts", "school", "admission"],
  },
];
