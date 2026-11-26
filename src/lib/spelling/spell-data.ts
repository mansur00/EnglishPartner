export type SpellRuleCategory =
  | "common-traps"
  | "i-before-e"
  | "silent-letter"
  | "double-consonant"
  | "suffix-rules";

export interface SpellWord {
  id: string;
  word: string;
  syllables: string[];
  phonetic: string;
  meaningBn: string;
  ruleCategory: SpellRuleCategory;
  commonMistake: string;
  mnemonicBn: string;
  mnemonicEn: string;
  exampleSentence: string;
  difficulty: "easy" | "medium" | "hard";
  isCustom?: boolean;
}

export interface SpellingRule {
  id: SpellRuleCategory;
  title: string;
  titleBn: string;
  formula: string;
  explanationEn: string;
  explanationBn: string;
  examples: { word: string; note: string }[];
  exceptionNote: string;
}

export interface WeakWordRecord {
  wordId: string;
  word: string;
  ruleCategory: SpellRuleCategory;
  mistakes: number;
  correctStreak: number;
  lastWrongAttempt: string;
  nextReviewAt: number;
}

export interface SpellProgressState {
  xp: number;
  streak: number;
  bestStreak: number;
  score: number;
  masteredIds: string[];
  weakWords: Record<string, WeakWordRecord>;
  mistakePatterns: Record<SpellRuleCategory, number>;
  customWords: SpellWord[];
}

export const SPELL_STORAGE_KEY = "ecp_spell_master_v1";

export const DEFAULT_SPELL_PROGRESS: SpellProgressState = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  score: 0,
  masteredIds: [],
  weakWords: {},
  mistakePatterns: {
    "common-traps": 0,
    "i-before-e": 0,
    "silent-letter": 0,
    "double-consonant": 0,
    "suffix-rules": 0,
  },
  customWords: [],
};

export const SPELL_BADGES = [
  {
    id: "first-5",
    title: "First 5 Words",
    titleBn: "প্রথম ৫টি শব্দ",
    description: "Master 5 spelling words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 5,
  },
  {
    id: "streak-5",
    title: "5x Streak",
    titleBn: "টানা ৫ সঠিক",
    description: "Get 5 spellings right in a row",
    check: (s: SpellProgressState) => s.bestStreak >= 5,
  },
  {
    id: "trap-buster",
    title: "Trap Buster",
    titleBn: "ভুল ফাঁদ জয়ী",
    description: "Master 15 tricky words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 15,
  },
  {
    id: "level-3",
    title: "Rising Speller",
    titleBn: "লেভেল ৩ অর্জন",
    description: "Reach Level 3 (200+ XP)",
    check: (s: SpellProgressState) => s.xp >= 200,
  },
  {
    id: "ai-collector",
    title: "Word Explorer",
    titleBn: "নতুন শব্দ সংগ্রাহক",
    description: "Add a custom word with AI",
    check: (s: SpellProgressState) => s.customWords.length >= 1,
  },
  {
    id: "spell-master",
    title: "Spell Champion",
    titleBn: "বানান চ্যাম্পিয়ন",
    description: "Master 30+ words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 30,
  },
];

export const SPELLING_RULES: SpellingRule[] = [
  {
    id: "i-before-e",
    title: '"I" Before "E" Except After "C"',
    titleBn: '"C" ছাড়া সাধারণত "I" আগে, "E" পরে',
    formula: "ie (believe, achieve) | c + ei (receive, ceiling)",
    explanationEn:
      'Usually write "i" before "e" (believe, friend), EXCEPT right after the letter "c" (receive, deceive, ceiling) or when it sounds like "ay" (neighbor, weigh).',
    explanationBn:
      'সাধারণত i আগে ও e পরে বসে (believe), তবে c-এর ঠিক পরে বসলে e আগে ও i পরে হয় (receive, ceiling)।',
    examples: [
      { word: "receive", note: "after c -> ei" },
      { word: "believe", note: "no c -> ie" },
      { word: "ceiling", note: "after c -> ei" },
      { word: "neighbor", note: "sounds like 'ay' -> ei" },
    ],
    exceptionNote: "Common exceptions: weird, seize, leisure, protein.",
  },
  {
    id: "silent-letter",
    title: "Silent Letters in English",
    titleBn: "নীরব অক্ষর (Silent Letter) চেনার নিয়ম",
    formula: "kn- (knight) | -bt (debt) | ps- (psychology) | -st- (listen)",
    explanationEn:
      'Many English words keep historical letters that are not pronounced aloud: silent "k" before "n", silent "b" before "t", silent "p" before "s", and silent "t" in "-sten/-stle".',
    explanationBn:
      'ইংরেজি অনেক শব্দে কিছু অক্ষর উচ্চারিত হয় না কিন্তু বানানে লিখতে হয়—যেমন n-এর আগে k (knight), t-এর আগে b (debt), s-এর আগে p (psychology)।',
    examples: [
      { word: "knight", note: "silent k" },
      { word: "debt", note: "silent b" },
      { word: "psychology", note: "silent p" },
      { word: "Wednesday", note: "silent d" },
    ],
    exceptionNote: "Always break the word into visual chunks when memorizing.",
  },
  {
    id: "double-consonant",
    title: "Doubling the Final Consonant",
    titleBn: "শেষের Consonant ডাবল করার নিয়ম",
    formula: "1 Vowel + 1 Consonant (CVC) + Suffix -> Double Consonant",
    explanationEn:
      "When a short 1-syllable word (or stressed final syllable) ends in 1 vowel + 1 consonant (CVC), double the last consonant before adding -ing, -ed, or -er.",
    explanationBn:
      "শব্দের শেষে ১টি vowel + ১টি consonant থাকলে -ing বা -ed যোগ করার আগে শেষের consonant-টি ডাবল হয় (run -> running, stop -> stopped)।",
    examples: [
      { word: "running", note: "run + n + ing" },
      { word: "stopped", note: "stop + p + ed" },
      { word: "beginning", note: "begin + n + ing" },
      { word: "occurred", note: "occur + r + ed" },
    ],
    exceptionNote: "Do not double w, x, or y (playing, fixed, snowed).",
  },
  {
    id: "suffix-rules",
    title: "Adding -ing, -ed, -ly & Dropping -e",
    titleBn: "-ing, -ed, -ly যোগ ও শেষের -e বাদ দেওয়ার নিয়ম",
    formula: "make -> making | happy -> happily | careful -> carefully",
    explanationEn:
      'Drop silent final "-e" before adding vowel suffixes (-ing, -ed, -able), keep "-e" before consonant suffixes (-ly, -ful), and change consonant + "y" to "i" before -ly or -ed.',
    explanationBn:
      'শেষে নীরব e থাকলে -ing যোগের আগে e বাদ যায় (write -> writing), আর consonant + y থাকলে -ly/-ed-এর আগে y বদলে i হয় (happy -> happily)।',
    examples: [
      { word: "writing", note: "drop final e" },
      { word: "happily", note: "y -> i + ly" },
      { word: "carefully", note: "careful + ly (double l)" },
      { word: "truly", note: "exception: drop e before ly" },
    ],
    exceptionNote: "Exceptions: truly, duly, argument (drop e).",
  },
  {
    id: "common-traps",
    title: "Most Misspelled Everyday Traps",
    titleBn: "সবচেয়ে বেশি ভুল হওয়া শব্দগুলো",
    formula: "sep-A-rate | def-i-nite-ly | ac-COM-mo-date | ne-CES-sary",
    explanationEn:
      "Words with unstressed vowels or double-letter pairs cause most everyday and IELTS writing errors. Use visual memory tricks to lock them in.",
    explanationBn:
      "অনেক শব্দে ডাবল অক্ষর বা মাঝের ভাওয়েল (a/e/i) নিয়ে বিভ্রান্তি হয়। ছোট ছন্দ বা মেমরি ট্রিক দিয়ে এগুলো সহজে মনে রাখা যায়।",
    examples: [
      { word: "separate", note: "sep-A-rate (not e)" },
      { word: "definitely", note: "finite inside de-finite-ly" },
      { word: "necessary", note: "1 collar (c), 2 sleeves (ss)" },
      { word: "accommodate", note: "double c, double m" },
    ],
    exceptionNote: "Practice these 5 minutes daily until they become automatic.",
  },
];

function w(
  id: string,
  word: string,
  syllables: string[],
  phonetic: string,
  meaningBn: string,
  ruleCategory: SpellRuleCategory,
  commonMistake: string,
  mnemonicBn: string,
  mnemonicEn: string,
  exampleSentence: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): SpellWord {
  return {
    id,
    word,
    syllables,
    phonetic,
    meaningBn,
    ruleCategory,
    commonMistake,
    mnemonicBn,
    mnemonicEn,
    exampleSentence,
    difficulty,
  };
}

export const CURATED_SPELL_WORDS: SpellWord[] = [
  // Common Traps (16)
  w("sp-01", "separate", ["sep", "a", "rate"], "/ˈsep.ər.ət/", "আলাদা করা / পৃথক", "common-traps", "seperate", "মাঝে 'a rat' আছে মনে রাখুন: sep-A-RAT-e।", "There is 'a rat' in sep-A-RAT-e.", "Please keep the wet and dry clothes separate.", "medium"),
  w("sp-02", "definitely", ["def", "i", "nite", "ly"], "/ˈdef.ɪ.nət.li/", "নিশ্চিতভাবে", "common-traps", "definately", "ভেতরে 'finite' শব্দটি আছে: de-FINITE-ly (a নয়)।", "Think of 'finite' inside de-FINITE-ly (no 'a').", "I will definitely call you tonight.", "medium"),
  w("sp-03", "accommodate", ["ac", "com", "mo", "date"], "/əˈkɒm.ə.deɪt/", "জায়গা দেওয়া / খাপ খাওয়ানো", "common-traps", "acommodate", "২টি 'c' এবং ২টি 'm' — দুজনকেই জায়গা দিন!", "Two c's and two m's — enough room to accommodate both!", "The hotel can accommodate 200 guests.", "hard"),
  w("sp-04", "necessary", ["nec", "es", "sa", "ry"], "/ˈnes.ə.sər.i/", "প্রয়োজনীয়", "common-traps", "neccessary", "একটি শার্টের ১টি কলার (c) ও ২টি হাতা (ss) থাকে।", "A shirt has 1 Collar (c) and 2 Sleeves (ss).", "Water is necessary for all living things.", "medium"),
  w("sp-05", "embarrass", ["em", "bar", "rass"], "/ɪmˈbær.əs/", "লজ্জিত বা বিব্রত করা", "common-traps", "embarass", "এতে ২টি 'r' এবং ২টি 's' — 'r' ও 's' দুটোই ডাবল!", "Double 'r' and double 's' — really silly!", "I did not mean to embarrass you in front of everyone.", "hard"),
  w("sp-06", "occurrence", ["oc", "cur", "rence"], "/əˈkʌr.əns/", "ঘটনা", "common-traps", "occurence", "২টি 'c', ২টি 'r' এবং শেষে '-ence' (ance নয়)।", "Double 'c', double 'r', and ends in '-ence'.", "Rain in November is a rare occurrence here.", "hard"),
  w("sp-07", "recommend", ["rec", "om", "mend"], "/ˌrek.əˈmend/", "সুপারিশ করা", "common-traps", "reccommend", "১টি 'c' আর ২টি 'm' — 're + commend' মনে রাখুন।", "1 'c' and 2 'm's: re + commend.", "Can you recommend a good English book?", "medium"),
  w("sp-08", "tomorrow", ["to", "mor", "row"], "/təˈmɒr.əʊ/", "আগামীকাল", "common-traps", "tommorow", "১টি 'm', ২টি 'r' — 'to + mor + row'!", "1 'm' and 2 'r's: to-mor-row.", "We have an important meeting tomorrow morning.", "easy"),
  w("sp-09", "calendar", ["cal", "en", "dar"], "/ˈkæl.ɪn.dər/", "ক্যালেন্ডার / পঞ্জিকা", "common-traps", "calender", "শেষে '-dar' আছে ('der' নয়)।", "Ends in '-dar' (like a date), not '-der'.", "Mark the exam date on your calendar.", "medium"),
  w("sp-10", "library", ["li", "brar", "y"], "/ˈlaɪ.brər.i/", "গ্রন্থাগার / লাইব্রেরি", "common-traps", "libary", "মাঝের 'r' বাদ দেবেন না: li-BRAR-y।", "Don't drop the first 'r': li-BRAR-y.", "She studies at the university library every afternoon.", "easy"),
  w("sp-11", "February", ["Feb", "ru", "ar", "y"], "/ˈfeb.ru.ər.i/", "ফেব্রুয়ারি মাস", "common-traps", "Febuary", "শুরুতে 'Feb-RU-ary' — 'r' অক্ষরটি ভুলবেন না।", "Remember the silent-ish 'r': Feb-RU-ary.", "International Mother Language Day is on 21 February.", "medium"),
  w("sp-12", "grammar", ["gram", "mar"], "/ˈɡræm.ər/", "ব্যাকরণ", "common-traps", "grammer", "শেষে '-ar' হবে, '-er' নয়!", "Ends with '-ar', never '-er'!", "Good grammar makes your writing clear.", "easy"),
  w("sp-13", "pronunciation", ["pro", "nun", "ci", "a", "tion"], "/prəˌnʌn.siˈeɪ.ʃən/", "উচ্চারণ", "common-traps", "pronounciation", "'pronounce'-এ 'ou' থাকলেও 'pronunciation'-এ শুধু 'u' বসে।", "Notice 'nun', NOT 'noun', in pro-NUN-ci-a-tion.", "Practice daily to improve your pronunciation.", "hard"),
  w("sp-14", "restaurant", ["res", "tau", "rant"], "/ˈres.tər.ɒnt/", "রেস্তোরাঁ", "common-traps", "resturant", "মাঝে 'au' আছে: res-TAU-rant।", "Think of 'AU' (gold) in the middle: res-TAU-rant.", "We had dinner at a quiet restaurant.", "medium"),
  w("sp-15", "environment", ["en", "vi", "ron", "ment"], "/ɪnˈvaɪ.rən.mənt/", "পরিবেশ", "common-traps", "enviroment", "মাঝে 'iron' আছে: env-IRON-ment।", "There is 'iron' inside env-IRON-ment.", "We must protect our natural environment.", "medium"),
  w("sp-16", "government", ["gov", "ern", "ment"], "/ˈɡʌv.ən.mənt/", "সরকার", "common-traps", "goverment", "'govern + ment' — মাঝের 'n' বাদ দেবেন না।", "It is 'govern' + 'ment' (keep the 'n').", "The government announced a new education plan.", "medium"),

  // I Before E (10)
  w("sp-17", "receive", ["re", "ceive"], "/rɪˈsiːv/", "গ্রহণ করা / পাওয়া", "i-before-e", "recieve", "'c'-এর পরে 'e' আগে, 'i' পরে বসে।", "'c' is followed by 'ei': re-c-EI-ve.", "Did you receive my email yesterday?", "easy"),
  w("sp-18", "achieve", ["a", "chieve"], "/əˈtʃiːv/", "অর্জন করা", "i-before-e", "acheive", "'c' সরাসরি 'ie'-এর আগে নেই (h আছে), তাই 'ie' বসবে।", "No 'c' right before it, so 'i' before 'e': a-ch-IE-ve.", "Hard work helps you achieve your goals.", "easy"),
  w("sp-19", "believe", ["be", "lieve"], "/bɪˈliːv/", "বিশ্বাস করা", "i-before-e", "beleive", "ভেতরে 'lie' আছে: be-LIE-ve।", "There is a 'lie' in be-LIE-ve ('ie').", "I believe you can speak English fluently.", "easy"),
  w("sp-20", "ceiling", ["ceil", "ing"], "/ˈsiː.lɪŋ/", "ছাদ (ভেতরের)", "i-before-e", "cieling", "'c'-এর পরে তাই 'ei': c-EI-ling।", "After 'c', write 'ei': c-EI-ling.", "The fan hangs from the ceiling.", "medium"),
  w("sp-21", "deceive", ["de", "ceive"], "/dɪˈsiːv/", "প্রতারণা করা", "i-before-e", "decieve", "'c'-এর ঠিক পরে তাই 'ei' বসবে।", "Right after 'c', use 'ei': de-c-EI-ve.", "Appearances can sometimes deceive us.", "medium"),
  w("sp-22", "perceive", ["per", "ceive"], "/pəˈsiːv/", "উপলব্ধি করা", "i-before-e", "percieve", "'c'-এর পরে 'ei': per-c-EI-ve।", "After 'c', use 'ei': per-c-EI-ve.", "How do customers perceive this product?", "hard"),
  w("sp-23", "weird", ["weird"], "/wɪəd/", "অদ্ভুত", "i-before-e", "wierd", "এটি নিয়মের ব্যতিক্রম — 'WE' are weird ('we' আগে)! ", "Exception: 'WE' are weird ('e' before 'i').", "That was a very weird dream.", "medium"),
  w("sp-24", "neighbor", ["neigh", "bor"], "/ˈneɪ.bər/", "প্রতিবেশী", "i-before-e", "nieghbor", "'ay' উচ্চারণ হলে 'ei' বসে: n-EI-ghbor।", "Sounds like 'ay', so use 'ei': n-EI-ghbor.", "My neighbor is very friendly and helpful.", "medium"),
  w("sp-25", "piece", ["piece"], "/piːs/", "টুকরো", "i-before-e", "peice", "মনে রাখুন: a PIEce of PIE ('ie')।", "Think of a 'PIE' in 'PIE-ce'.", "Would you like a piece of cake?", "easy"),
  w("sp-26", "friend", ["friend"], "/frend/", "বন্ধু", "i-before-e", "freind", "বন্ধু 'END' পর্যন্ত থাকে: fri-END।", "A fri-END stays until the END ('ie').", "She is my closest friend from college.", "easy"),

  // Silent Letters (12)
  w("sp-27", "knight", ["knight"], "/naɪt/", "বীর যোদ্ধা", "silent-letter", "night", "শুরুতে নীরব 'k' আছে: K-night।", "Silent 'k' before 'n': K-night.", "The knight rode across the bridge.", "easy"),
  w("sp-28", "psychology", ["psy", "chol", "o", "gy"], "/saɪˈkɒl.ə.dʒi/", "মনোবিজ্ঞান", "silent-letter", "sycology", "শুরুতে নীরব 'p' আছে: P-sychology।", "Starts with silent 'p' before 's': P-sychology.", "She is studying psychology at university.", "hard"),
  w("sp-29", "honest", ["hon", "est"], "/ˈɒn.ɪst/", "সৎ", "silent-letter", "onest", "শুরুতে নীরব 'h' আছে: H-onest।", "Starts with silent 'h': H-onest.", "Thank you for being honest with me.", "easy"),
  w("sp-30", "island", ["is", "land"], "/ˈaɪ.lənd/", "দ্বীপ", "silent-letter", "iland", "মাঝে নীরব 's' আছে: 'IS' + 'land'।", "An IS-land 'IS' land surrounded by water (silent 's').", "They visited a small island last summer.", "easy"),
  w("sp-31", "Wednesday", ["Wednes", "day"], "/ˈwenz.deɪ/", "বুধবার", "silent-letter", "Wensday", "মনে রাখুন: 'Wed + nes + day' (নীরব d)।", "Think 'Wed-nes-day' to keep the silent 'd'.", "The class meets every Wednesday evening.", "medium"),
  w("sp-32", "receipt", ["re", "ceipt"], "/rɪˈsiːt/", "রসিদ", "silent-letter", "reciept", "'c'-এর পর 'ei' এবং শেষে নীরব 'p' আছে।", "After 'c' use 'ei', plus silent 'p' before 't'.", "Please keep your receipt for returns.", "hard"),
  w("sp-33", "debt", ["debt"], "/det/", "ঋণ", "silent-letter", "det", "মাঝে নীরব 'b' আছে: de-B-t।", "Silent 'b' before 't': de-B-t.", "He worked hard to pay off his debt.", "easy"),
  w("sp-34", "listen", ["lis", "ten"], "/ˈlɪs.ən/", "মনোযোগ দিয়ে শোনা", "silent-letter", "lissen", "মাঝে নীরব 't' আছে: lis-T-en।", "Silent 't' in '-sten': lis-T-en.", "Listen carefully to the dialogue.", "easy"),
  w("sp-35", "castle", ["cas", "tle"], "/ˈkɑː.səl/", "দুর্গ", "silent-letter", "casle", "মাঝে নীরব 't' আছে: cas-T-le।", "Silent 't' in '-stle': cas-T-le.", "The old castle stands on top of the hill.", "easy"),
  w("sp-36", "knowledge", ["knowl", "edge"], "/ˈnɒl.ɪdʒ/", "জ্ঞান", "silent-letter", "noledge", "শুরুতে নীরব 'k' এবং শেষে 'edge' আছে।", "Silent 'k' + 'now' + 'ledge'.", "Reading books expands your knowledge.", "medium"),
  w("sp-37", "subtle", ["sub", "tle"], "/ˈsʌt.əl/", "সূক্ষ্ম", "silent-letter", "suttle", "মাঝে নীরব 'b' আছে: su-B-tle।", "Silent 'b' before 't': su-B-tle.", "There is a subtle difference between the two words.", "hard"),
  w("sp-38", "rhythm", ["rhythm"], "/ˈrɪð.əm/", "ছন্দ / তাল", "silent-letter", "rythm", "দুটি 'h' আছে, কোনো vowel নেই (শুধু y)।", "Two 'h's and no regular vowel: R-H-Y-T-H-M.", "Speak with natural stress and rhythm.", "hard"),

  // Double Consonant (11)
  w("sp-39", "running", ["run", "ning"], "/ˈrʌn.ɪŋ/", "দৌড়ানো", "double-consonant", "runing", "run-এর শেষে u+n থাকায় 'n' ডাবল হয়।", "CVC (r-u-n) -> double 'n' before -ing.", "She goes running every morning.", "easy"),
  w("sp-40", "stopped", ["stopped"], "/stɒpt/", "থেমে গিয়েছিল", "double-consonant", "stoped", "stop-এর শেষে o+p থাকায় 'p' ডাবল হয়।", "CVC (st-o-p) -> double 'p' before -ed.", "The bus stopped right in front of the gate.", "easy"),
  w("sp-41", "beginning", ["be", "gin", "ning"], "/bɪˈɡɪn.ɪŋ/", "শুরু / সূচনা", "double-consonant", "begining", "be-GIN অংশে জোর থাকায় শেষের 'n' ডাবল হয়।", "Stress on '-GIN' -> double 'n' before -ing.", "The beginning of the story is very exciting.", "medium"),
  w("sp-42", "occurring", ["oc", "cur", "ring"], "/əˈkɜː.rɪŋ/", "ঘটছে এমন", "double-consonant", "occuring", "২টি 'c' এবং -ing-এর আগে ২টি 'r' বসে।", "Double 'c' and double 'r': oc-cur-ring.", "Errors are occurring less frequently now.", "hard"),
  w("sp-43", "committed", ["com", "mit", "ted"], "/kəˈmɪt.ɪd/", "প্রতিশ্রুতিবদ্ধ", "double-consonant", "commited", "com-MIT-এ জোর থাকায় 't' ডাবল হয়: mm + tt।", "Double 'm' and double 't': com-mit-ted.", "She is committed to learning daily.", "hard"),
  w("sp-44", "preferred", ["pre", "ferred"], "/prɪˈfɜːd/", "বেশি পছন্দ করেছিল", "double-consonant", "prefered", "pre-FER-এ জোর থাকায় 'r' ডাবল হয়।", "Stress on '-FER' -> double 'r' before -ed.", "He preferred tea over coffee.", "medium"),
  w("sp-45", "planning", ["plan", "ning"], "/ˈplæn.ɪŋ/", "পরিকল্পনা করছে", "double-consonant", "planing", "plan (CVC) -> 'n' ডাবল হয়ে planning হয়।", "CVC (pl-a-n) -> double 'n' before -ing.", "We are planning a trip next month.", "easy"),
  w("sp-46", "dropped", ["dropped"], "/drɒpt/", "ফেলে দিয়েছিল", "double-consonant", "droped", "drop (CVC) -> 'p' ডাবল হয়ে dropped হয়।", "CVC (dr-o-p) -> double 'p' before -ed.", "He accidentally dropped his phone.", "easy"),
  w("sp-47", "sitting", ["sit", "ting"], "/ˈsɪt.ɪŋ/", "বসে থাকা", "double-consonant", "siting", "sit (CVC) -> 't' ডাবল হয়ে sitting হয়।", "CVC (s-i-t) -> double 't' before -ing.", "They are sitting near the window.", "easy"),
  w("sp-48", "referred", ["re", "ferred"], "/rɪˈfɜːd/", "উল্লেখ করেছিল", "double-consonant", "refered", "re-FER-এ জোর থাকায় 'r' ডাবল হয়।", "Stress on '-FER' -> double 'r' before -ed.", "The teacher referred to page ten.", "medium"),
  w("sp-49", "regretted", ["re", "gret", "ted"], "/rɪˈɡret.ɪd/", "অনুতপ্ত হয়েছিল", "double-consonant", "regreted", "re-GRET-এ জোর থাকায় 't' ডাবল হয়।", "Stress on '-GRET' -> double 't' before -ed.", "She regretted missing the morning train.", "medium"),

  // Suffix Rules (11)
  w("sp-50", "writing", ["writ", "ing"], "/ˈraɪ.tɪŋ/", "লেখা", "suffix-rules", "writting", "write-এর শেষের 'e' বাদ যায় এবং ১টি 't' থাকে।", "Drop final 'e' from 'write', keep single 't'.", "I am writing a short email to my manager.", "easy"),
  w("sp-51", "making", ["mak", "ing"], "/ˈmeɪ.kɪŋ/", "তৈরি করা", "suffix-rules", "makeing", "make-এর শেষের 'e' বাদ দিয়ে -ing যোগ করুন।", "Drop silent 'e' before -ing: make -> making.", "He is making coffee in the kitchen.", "easy"),
  w("sp-52", "hoping", ["hop", "ing"], "/ˈhəʊ.pɪŋ/", "আশা করা", "suffix-rules", "hopeing", "hope-এর 'e' বাদ দিলে hoping হয় (hopping নয়!)।", "Drop 'e' from 'hope' (1 'p' = hoping; 2 'p's = hopping).", "We are hoping for good weather tomorrow.", "medium"),
  w("sp-53", "happily", ["hap", "pi", "ly"], "/ˈhæp.ɪ.li/", "আনন্দের সাথে", "suffix-rules", "happyly", "happy-এর শেষের 'y' বদলে 'i' হয়ে -ly যোগ হয়।", "Change 'y' to 'i' before -ly: happy -> happily.", "They lived happily in the village.", "easy"),
  w("sp-54", "easily", ["eas", "i", "ly"], "/ˈiː.zɪ.li/", "সহজে", "suffix-rules", "easyly", "easy-এর 'y' বদলে 'i' + ly বসবে।", "Change 'y' to 'i' before -ly: easy -> easily.", "You can easily learn five words a day.", "easy"),
  w("sp-55", "carefully", ["care", "ful", "ly"], "/ˈkeə.fəl.i/", "সতর্কতার সাথে", "suffix-rules", "carefuly", "'careful' + 'ly' — শেষে ২টি 'l' থাকবে!", "'careful' ends in 'l' + 'ly' = double 'l'.", "Read every question carefully.", "medium"),
  w("sp-56", "finally", ["fi", "nal", "ly"], "/ˈfaɪ.nəl.i/", "অবশেষে", "suffix-rules", "finaly", "'final' + 'ly' — দুটি 'l' একসাথে হবে।", "'final' + 'ly' = double 'l'.", "We finally finished the project on time.", "easy"),
  w("sp-57", "truly", ["tru", "ly"], "/ˈtruː.li/", "সত্যিকার অর্থে", "suffix-rules", "truely", "ব্যতিক্রম: 'true'-এর 'e' বাদ দিয়ে 'truly' হয়।", "Exception: drop the 'e' in 'true' -> truly.", "I am truly grateful for your help.", "medium"),
  w("sp-58", "argument", ["ar", "gu", "ment"], "/ˈɑːɡ.jə.mənt/", "যুক্তি / তর্ক", "suffix-rules", "arguement", "ব্যতিক্রম: 'argue'-এর 'e' বাদ দিয়ে 'argument' হয়।", "Exception: drop the 'e' in 'argue' -> argument.", "She made a strong argument during the debate.", "medium"),
  w("sp-59", "beautiful", ["beau", "ti", "ful"], "/ˈbjuː.tɪ.fəl/", "সুন্দর", "suffix-rules", "beatiful", "'beauty'-এর 'y' বদলে 'i' + 'ful' (১টি l)।", "Change 'y' to 'i', add '-ful' (single 'l').", "What a beautiful morning!", "easy"),
  w("sp-60", "studied", ["stud", "ied"], "/ˈstʌd.id/", "পড়াশোনা করেছিল", "suffix-rules", "studyed", "study-এর 'y' বদলে 'i' + 'ed' বসবে।", "Consonant + 'y' changes to 'i' before -ed.", "He studied English for an hour yesterday.", "easy"),
];

export function getLevelFromXp(xp: number): {
  level: number;
  title: string;
  titleBn: string;
  currentXpInLevel: number;
  xpForNextLevel: number;
} {
  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const titles = [
    { en: "Word Starter", bn: "শব্দ শিক্ষার্থী" },
    { en: "Syllable Explorer", bn: "সিলেবল অন্বেষক" },
    { en: "Rule Builder", bn: "নিয়ম দক্ষ" },
    { en: "Trap Buster", bn: "ভুল ফাঁদ জয়ী" },
    { en: "Spell Master", bn: "বানান মাস্টার" },
  ];
  const idx = Math.min(titles.length - 1, level - 1);
  return {
    level,
    title: titles[idx].en,
    titleBn: titles[idx].bn,
    currentXpInLevel: xp % xpPerLevel,
    xpForNextLevel: xpPerLevel,
  };
}
