export interface VocabularyEntry {
  word: string;
  lemma: string;
  ipa: string;
  partOfSpeech: "verb" | "noun" | "adjective" | "adverb" | "phrase" | "preposition";
  contextualMeaningBn: string;
  generalMeaningBn: string;
  contextualMeaningEn?: string;
  generalMeaningEn?: string;
  exampleSentence: string;
  wordForms?: {
    past?: string;
    pastParticiple?: string;
    plural?: string;
    adverbForm?: string;
  };
  synonyms?: string[];
}

export interface SentenceGrammarEntry {
  lineId: string;
  sentenceText: string;
  structure: {
    subject: string;
    verb: string;
    objectOrComplement: string;
    tenseName: string;
    tensePattern: string;
    whyUsedBn: string;
  };
  politeAlternatives: string[];
  commonMistakes: {
    mistake: string;
    correction: string;
    explanationBn: string;
  }[];
}

export const SEED_VOCABULARY: Record<string, VocabularyEntry> = {
  // Shopping words
  excuse: {
    word: "Excuse me",
    lemma: "excuse me",
    ipa: "/ɪkˈskjuːz miː/",
    partOfSpeech: "phrase",
    contextualMeaningBn: "কাউকে সম্মান প্রদর্শনপূর্বক দৃষ্টি আকর্ষণ করার মার্জিত ভঙ্গি (মাফ করবেন)।",
    generalMeaningBn: "ক্ষমা চাওয়া বা দৃষ্টি আকর্ষণ করা।",
    contextualMeaningEn: "Used as a polite way of attracting someone's attention or apologizing.",
    generalMeaningEn: "To forgive, overlook, or seek polite attention.",
    exampleSentence: "Excuse me, where is the customer care desk?",
    synonyms: ["Pardon me", "Sorry to bother you"],
  },
  cost: {
    word: "Costs",
    lemma: "cost",
    ipa: "/kɒsts/",
    partOfSpeech: "verb",
    contextualMeaningBn: "কোনো পণ্যের মূল্য নির্ধারিত থাকা।",
    generalMeaningBn: "দাম বা খরচ হওয়া।",
    contextualMeaningEn: "To have a specified price or expense.",
    generalMeaningEn: "The amount of money needed to buy something.",
    exampleSentence: "How much does this winter coat cost?",
    wordForms: {
      past: "cost",
      pastParticiple: "cost",
    },
    synonyms: ["prices at", "sells for"],
  },
  jacket: {
    word: "Jacket",
    lemma: "jacket",
    ipa: "/ˈdʒæk.ɪt/",
    partOfSpeech: "noun",
    contextualMeaningBn: "শরীরের উপরিভাগে পরার কোট বা হালকা শীতবস্ত্র।",
    generalMeaningBn: "জ্যাকেট বা কোট।",
    contextualMeaningEn: "An outer garment extending either to the waist or hips, worn for warmth or style.",
    generalMeaningEn: "A short coat or outerwear.",
    exampleSentence: "I bought a waterproof jacket for my trip.",
    wordForms: {
      plural: "jackets",
    },
  },
  certainly: {
    word: "Certainly",
    lemma: "certainly",
    ipa: "/ˈsɜː.tən.li/",
    partOfSpeech: "adverb",
    contextualMeaningBn: "বিনম্র ও আন্তরিকভাবে কারো অনুরোধ বা প্রশ্নের সম্মতি জ্ঞাপন করা (অবশ্যই)।",
    generalMeaningBn: "নিঃসন্দেহে বা নিশ্চিতভাবে।",
    contextualMeaningEn: "Used to express complete agreement or polite consent ('of course').",
    generalMeaningEn: "Without doubt; definitely or surely.",
    exampleSentence: "Certainly, I will prepare your invoice right away.",
    synonyms: ["Definitely", "Of course", "Absolutely"],
  },
  discount: {
    word: "Discount",
    lemma: "discount",
    ipa: "/ˈdɪs.kaʊnt/",
    partOfSpeech: "noun",
    contextualMeaningBn: "নির্ধারিত বিক্রয়মূল্য থেকে টাকার হ্রাস বা ছাড়।",
    generalMeaningBn: "ছাড় বা মূল্যহ্রাস।",
    contextualMeaningEn: "A reduction in the usual price of an item or service.",
    generalMeaningEn: "A price reduction or rebate.",
    exampleSentence: "Students receive a 15% discount at this bookstore.",
    wordForms: {
      plural: "discounts",
    },
    synonyms: ["rebate", "price cut", "concession"],
  },
  percent: {
    word: "Percent",
    lemma: "percent",
    ipa: "/pəˈsent/",
    partOfSpeech: "noun",
    contextualMeaningBn: "শতকরা বা প্রতি শতে হিসাব (যেমন ১০%)।",
    generalMeaningBn: "শতাংশ।",
    contextualMeaningEn: "One part in every hundred (e.g., 10%).",
    generalMeaningEn: "Percentage or rate per hundred.",
    exampleSentence: "Inflation decreased by two percent this quarter.",
  },
  medium: {
    word: "Medium",
    lemma: "medium",
    ipa: "/ˈmiː.di.əm/",
    partOfSpeech: "adjective",
    contextualMeaningBn: "পোশাকের মাঝারি মাপ (Small ও Large এর মাঝামাঝি)।",
    generalMeaningBn: "মাঝারি বা মধ্যম।",
    contextualMeaningEn: "A middle size for clothing, between small and large.",
    generalMeaningEn: "Intermediate in quantity, size, or quality.",
    exampleSentence: "This shirt fits best in medium size.",
  },
  fitting: {
    word: "Fitting rooms",
    lemma: "fitting room",
    ipa: "/ˈfɪt.ɪŋ ruːmz/",
    partOfSpeech: "noun",
    contextualMeaningBn: "দোকানে পোশাক গায়ে দিয়ে ফিটিং যাচাই করার নির্ধারিত স্থান (ট্রায়াল রুম)।",
    generalMeaningBn: "ট্রায়াল রুম।",
    contextualMeaningEn: "A designated room in a retail store for trying on clothes before purchasing.",
    generalMeaningEn: "Fitting room or changing room.",
    exampleSentence: "The fitting rooms are located near the cashier.",
    synonyms: ["dressing room", "changing room"],
  },

  // Airport words
  passport: {
    word: "Passport",
    lemma: "passport",
    ipa: "/ˈpɑːs.pɔːt/",
    partOfSpeech: "noun",
    contextualMeaningBn: "আন্তর্জাতিক ভ্রমণের জন্য সরকারি ভ্রমণ পরিচয়পত্র।",
    generalMeaningBn: "পাসপোর্ট।",
    contextualMeaningEn: "An official government travel document certifying citizenship for international journeys.",
    generalMeaningEn: "Official international travel ID.",
    exampleSentence: "Keep your passport in your carry-on bag.",
    wordForms: { plural: "passports" },
  },
  flight: {
    word: "Flight",
    lemma: "flight",
    ipa: "/flaɪt/",
    partOfSpeech: "noun",
    contextualMeaningBn: "বিমানে এক শহর বা দেশ থেকে অন্য স্থানে যাত্রা।",
    generalMeaningBn: "বিমানযাত্রা।",
    contextualMeaningEn: "A scheduled journey in an aircraft between two destinations.",
    generalMeaningEn: "An airline journey.",
    exampleSentence: "Our flight departs at seven in the evening.",
    wordForms: { plural: "flights" },
  },
  baggage: {
    word: "Checked bag",
    lemma: "checked bag",
    ipa: "/tʃɛkt bæɡ/",
    partOfSpeech: "noun",
    contextualMeaningBn: "যাত্রীর যে বড় লাগেজটি বিমানের কার্গো হোলে দেওয়া হয় (কেবিনে নেওয়া হয় না)।",
    generalMeaningBn: "বড় ভ্রমণ লাগেজ।",
    contextualMeaningEn: "Luggage delivered to the airline to be stored in the cargo hold during a flight.",
    generalMeaningEn: "Checked luggage.",
    exampleSentence: "You are allowed one checked bag weighing up to 23 kilograms.",
  },

  // Professional words
  wireframes: {
    word: "Wireframes",
    lemma: "wireframe",
    ipa: "/ˈwaɪə.freɪmz/",
    partOfSpeech: "noun",
    contextualMeaningBn: "অ্যাপ বা ওয়েবসাইটের বেসিক গঠন ও লেআউটের ব্লুপ্রিন্ট স্কেচ।",
    generalMeaningBn: "স্কেচ বা কাঠামো নকশা।",
    contextualMeaningEn: "A visual blueprint schematic showing the structure and layout of a webpage or screen.",
    generalMeaningEn: "Basic structural screen blueprint.",
    exampleSentence: "We review wireframes before choosing final brand colors.",
    wordForms: { plural: "wireframes" },
  },
  clarify: {
    word: "Clarify",
    lemma: "clarify",
    ipa: "/ˈklær.ɪ.faɪ/",
    partOfSpeech: "verb",
    contextualMeaningBn: "কোনো জটিল বিষয়কে প্রশ্ন করে সুস্পষ্ট ও দ্বিধাহীন করা।",
    generalMeaningBn: "স্পষ্ট করা বা পরিষ্কার করা।",
    contextualMeaningEn: "To make an idea, requirement, or situation clearer and easier to understand.",
    generalMeaningEn: "To explain or make distinct.",
    exampleSentence: "Could you clarify the delivery timeline for this feature?",
    wordForms: { past: "clarified", pastParticiple: "clarified" },
    synonyms: ["explain", "make clear", "elucidate"],
  },
  prioritize: {
    word: "Prioritize",
    lemma: "prioritize",
    ipa: "/praɪˈɒr.ɪ.taɪz/",
    partOfSpeech: "verb",
    contextualMeaningBn: "সব কাজের মধ্যে সবচেয়ে গুরুত্বপূর্ণ বিষয়টিকে প্রথমে রাখা।",
    generalMeaningBn: "অগ্রাধিকার দেওয়া।",
    contextualMeaningEn: "To treat a task or feature as more important than others.",
    generalMeaningEn: "To arrange in order of priority.",
    exampleSentence: "We must prioritize mobile performance for our app.",
    wordForms: { past: "prioritized", pastParticiple: "prioritized" },
  },
};

export const SEED_GRAMMAR_EXPLANATIONS: Record<string, SentenceGrammarEntry> = {
  // line-01 (Excuse me, could you tell me how much this blue jacket costs?)
  "line-01": {
    lineId: "line-01",
    sentenceText: "Excuse me, could you tell me how much this blue jacket costs?",
    structure: {
      subject: "you (modal subject) / this blue jacket (embedded subject)",
      verb: "could tell (modal auxiliary + base verb) / costs (embedded main verb)",
      objectOrComplement: "me (indirect object) + embedded question clause ('how much this blue jacket costs')",
      tenseName: "Polite Modal Question with Embedded Noun Clause",
      tensePattern: "Modal (Could) + Subject (you) + Verb (tell) + Object (me) + Wh-word + Subject + Verb",
      whyUsedBn: "দোকানে সরাসরি 'What is the price?' না বলে 'Could you tell me...' ব্যবহার করলে বাক্যটি অনেক বেশি মার্জিত ও বিনম্র শোনায়।",
    },
    politeAlternatives: [
      "May I know the price of this blue jacket, please?",
      "How much is this blue jacket, if you don't mind me asking?",
    ],
    commonMistakes: [
      {
        mistake: "Could you tell me how much does this blue jacket cost?",
        correction: "Could you tell me how much this blue jacket costs?",
        explanationBn: "এমবেডেড বা পরোক্ষ প্রশ্নে 'does' ব্যবহার করা ভুল। মূল প্রশ্ন ইতোমধ্যে 'Could you' দিয়ে হয়ে গেছে, তাই পরবর্তী অংশটি সাধারণ বাক্যের মতো Subject + Verb হবে।",
      },
    ],
  },

  // line-02 (Certainly! It is forty-five dollars, and today we have a ten percent discount on it.)
  "line-02": {
    lineId: "line-02",
    sentenceText: "Certainly! It is forty-five dollars, and today we have a ten percent discount on it.",
    structure: {
      subject: "It (Clause 1) / we (Clause 2)",
      verb: "is (linking verb) / have (main verb)",
      objectOrComplement: "forty-five dollars (predicate noun) / a ten percent discount on it (direct object)",
      tenseName: "Simple Present Tense (Compound Sentence)",
      tensePattern: "Subject + Verb (Present) + Complement + Coordinator (and) + Subject + Verb + Object",
      whyUsedBn: "বর্তমান বাস্তব অবস্থা বা স্থির তথ্য প্রকাশ করতে Simple Present Tense ব্যবহার করা হয়েছে।",
    },
    politeAlternatives: [
      "It costs forty-five dollars, and we are offering a ten percent discount today.",
    ],
    commonMistakes: [
      {
        mistake: "It is costing forty-five dollars.",
        correction: "It costs forty-five dollars (or It is forty-five dollars).",
        explanationBn: "'Cost' একটি Stative verb, তাই সাধারণ মূল্যের বর্ণনায় Continuous tense (-ing) ব্যবহৃত হয় না।",
      },
    ],
  },

  // line-air-01 (Good morning. I would like to check in for flight EK-582 to London.)
  "line-air-01": {
    lineId: "line-air-01",
    sentenceText: "Good morning. I would like to check in for flight EK-582 to London.",
    structure: {
      subject: "I",
      verb: "would like (conditional modal expressing polite desire)",
      objectOrComplement: "to check in (infinitive phrase functioning as object)",
      tenseName: "Polite Request with 'Would like'",
      tensePattern: "Subject + would like + to-infinitive + Prepositional phrase",
      whyUsedBn: "'I want to check in' কর্কশ শোনাতে পারে। ফর্মাল সেটিংসে 'I would like to...' বিনম্র অভিপ্রায় প্রকাশ করে।",
    },
    politeAlternatives: [
      "I am here to check in for the London flight, please.",
    ],
    commonMistakes: [
      {
        mistake: "I would like checking in.",
        correction: "I would like to check in.",
        explanationBn: "'Would like'-এর পরে সবসময় 'to + verb' (infinitive) বসে, gerund (-ing) নয়।",
      },
    ],
  },
};

