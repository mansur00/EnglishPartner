import type { SpellCategoryId } from "./spell-categories";

export type RuleReliability = "high" | "medium" | "low";

export type RulePartId =
  | "all"
  | "suffix"
  | "prefix"
  | "plural"
  | "patterns"
  | "silent"
  | "sound"
  | "origin"
  | "confusing"
  | "uk-us"
  | "compounds"
  | "strategies";

export interface SpellRuleItem {
  id: string;
  part: Exclude<RulePartId, "all">;
  title: string;
  titleBn: string;
  reliability: RuleReliability;
  summaryEn: string;
  summaryBn: string;
  examples: string[];
  exceptions: string[];
  categories: SpellCategoryId[];
  mnemonic: string | null;
}

export const RULE_PARTS: { id: RulePartId; label: string }[] = [
  { id: "all", label: "All Rules (55)" },
  { id: "suffix", label: "Suffix (R1–16)" },
  { id: "prefix", label: "Prefix (R17–20)" },
  { id: "plural", label: "Plural (R21–26)" },
  { id: "patterns", label: "Patterns (R27–40)" },
  { id: "silent", label: "Silent (R41)" },
  { id: "sound", label: "Sound (R42)" },
  { id: "origin", label: "Origin (R43–44)" },
  { id: "confusing", label: "Confusing (R45–47)" },
  { id: "uk-us", label: "UK/US (R48)" },
  { id: "compounds", label: "Compounds & Numbers (R49–53)" },
  { id: "strategies", label: "Strategies (R54–55)" },
];

type RawRule = [
  id: string,
  part: Exclude<RulePartId, "all">,
  title: string,
  titleBn: string,
  reliability: RuleReliability,
  summaryEn: string,
  summaryBn: string,
  examples: string[],
  exceptions: string[],
  categories: SpellCategoryId[],
  mnemonic?: string | null
];

const RAW_RULES: RawRule[] = [
  // Part 1: Suffix Rules (R1 - R16)
  ["R1", "suffix", "Drop the silent E before a vowel suffix", "Vowel suffix-এর আগে নীরব E বাদ যায়", "high", "Drop silent final -e before vowel suffixes (-ing, -ed, -er, -able, -ous, -y).", "শব্দের শেষে silent e থাকলে vowel দিয়ে শুরু হওয়া suffix যোগে e বাদ যায়।", ["hope → hoping", "make → making", "write → writing", "fame → famous"], ["noticeable, courageous (soft c/g)", "seeing, canoeing, dyeing (-ee/-oe/-ye)"], ["suffix-rules"]],
  ["R2", "suffix", "Keep the E before a consonant suffix", "Consonant suffix-এর আগে E থাকে", "high", "Keep silent final -e before consonant suffixes (-ful, -less, -ly, -ment, -ness, -ty).", "Consonant দিয়ে শুরু হওয়া suffix যোগ করলে শেষের e সাধারণত থেকে যায়।", ["care → careful", "love → lovely", "manage → management", "safe → safety"], ["truly (true+ly)", "duly (due+ly)", "wholly", "argument", "ninth", "awful", "judgment/judgement"], ["suffix-rules", "keep-the-e"]],
  ["R3", "suffix", "Keep the E after soft C and soft G", "Soft C ও Soft G-এর পর E রাখতে হয়", "high", "Keep -e after -ce or -ge before -able/-ous so c stays /s/ and g stays /j/.", "c বা g-এর উচ্চারণ soft রাখতে -able বা -ous-এর আগে e রেখে দিতে হয়।", ["notice → noticeable", "manage → manageable", "courage → courageous", "advantage → advantageous"], [], ["keep-the-e", "able-vs-ible", "ous-ious-eous"]],
  ["R4", "suffix", "-ee, -oe, -ye keep E; -ie changes to -y", "-ee, -oe, -ye থাকলে E থাকে; -ie হয় -y", "high", "Keep -e in -ee, -oe, -ye before -ing; change -ie to -y before -ing.", "-ee/-oe/-ye-তে e থাকে; আর die/lie/tie-তে -ing যোগে ie বদলে y হয়।", ["see → seeing", "agree → agreeing", "dye → dyeing", "die → dying", "lie → lying", "tie → tying"], [], ["suffix-rules"]],
  ["R5", "suffix", "Consonant + Y → change Y to I", "Consonant + Y থাকলে Y বদলে I হয়", "high", "Change final -y after a consonant to -i before suffixes (except -ing).", "শব্দের শেষে consonant + y থাকলে suffix যোগে y → i হয় (-ing বাদে)।", ["happy → happily", "easy → easily", "study → studied", "beauty → beautiful", "busy → business"], ["studying, carrying (-ing)", "play → played (vowel+y)", "shy → shyness", "pay → paid, say → said"], ["suffix-rules", "plural-rules"]],
  ["R6", "suffix", "The 1-1-1 Doubling Rule", "১-১-১ ডাবলিং নিয়ম", "high", "1 syllable + 1 vowel + 1 consonant: double the last consonant before a vowel suffix.", "১ সিলেবল, ১ vowel ও ১ consonant হলে vowel suffix-এর আগে শেষ consonant ডাবল হয়।", ["run → running", "stop → stopped", "big → bigger", "sit → sitting", "plan → planned"], ["help → helping (2 consonants)", "rain → raining (2 vowels)", "snow → snowing, fix → fixing (w/x/y)"], ["double-consonant", "suffix-rules"]],
  ["R7", "suffix", "Doubling in Longer Words (Stress Rule)", "বড় শব্দে জোর (Stress) অনুযায়ী ডাবল", "medium", "In 2+ syllable words, double the final consonant only when stress is on the last syllable.", "একাধিক সিলেবলের শব্দে শেষ সিলেবলে stress থাকলে শেষ consonant ডাবল হয়।", ["begin → beginning", "occur → occurred", "prefer → preferred", "admit → admitted"], ["visit → visiting, open → opening (stress earlier)", "prefer → preference (stress shifts)", "UK: travelled vs US: traveled", "panic → panicked (add k)"], ["double-consonant"]],
  ["R8", "suffix", "-ful has one L; all- becomes al-", "-ful-এ একটি L; all- হয় al-", "high", "Suffix -ful always has one l; all- drops one l at the start of compounds.", "-ful suffix-এ সবসময় একটি l বসে; শুরুতে all- হলে একটি l কমে al- হয়।", ["careful, beautiful, helpful", "already, almost, always, although", "welcome, welfare", "until"], ["UK: fulfil vs US: fulfill"], ["suffix-rules", "common-traps"]],
  ["R9", "suffix", "Adding -ly", "-ly যোগ করার নিয়ম", "high", "Add -ly directly; -l + -ly = -ll-; -le → -ly; -y → -ily; -ic → -ically.", "সাধারণত +ly; -l থাকলে ডাবল l; -le বাদ দিয়ে -ly; -y → -ily; -ic → -ically।", ["final → finally", "careful → carefully", "gentle → gently", "happy → happily", "basic → basically"], ["public → publicly", "true → truly, due → duly, whole → wholly", "shy → shyly"], ["suffix-rules"]],
  ["R10", "suffix", "-able vs -ible", "-able বনাম -ible", "medium", "Use -able when the root is a complete standalone word; -ible when the root is not standalone or after -ss.", "মূল অংশ নিজেই পূর্ণ শব্দ হলে সাধারণত -able, না হলে বা -ss-এর পর -ible বসে।", ["comfortable, acceptable, reliable", "possible, visible, responsible, flexible"], ["possible, terrible, horrible, incredible, eligible, feasible (memorize)"], ["able-vs-ible"]],
  ["R11", "suffix", "-ance/-ant vs -ence/-ent", "-ance/-ant বনাম -ence/-ent", "low", "Guideline only: hard c/g, -ur, or -ate verbs often take -ance/-ant; soft c/g, -id, -qu often take -ence/-ent.", "এটি শুধু একটি হিন্ট—অনেক ব্যতিক্রম আছে, তাই অডিও ও প্র্যাকটিস দিয়ে মুখস্থ করা সেরা।", ["importance, tolerance, significance", "difference, confidence, intelligence, frequent"], ["experience, patience, existence, appearance, resistance"], ["ance-vs-ence", "ant-vs-ent"]],
  ["R12", "suffix", "-tion, -sion, -ssion, -cian", "-tion, -sion, -ssion ও -cian", "medium", "Use -cian for professions; -tion is default; -sion after d/de/se/l/n/r; -ssion after -mit/-cess/-press.", "পেশা বোঝাতে -cian; সাধারণত -tion; d/de/se থাকলে -sion; -mit/-press থাকলে -ssion।", ["musician, electrician, politician", "education, action", "decide → decision", "admit → admission"], ["vision, television, conclusion"], ["tion-sion-cian"]],
  ["R13", "suffix", "The -ous Family (-ous, -ious, -eous, -uous)", "-ous, -ious, -eous, -uous পরিবার", "medium", "Drop -e (fame→famous), y→i (glory→glorious), -our→-or (humour→humorous), -ce→-cious.", "e বাদ যায়, y→i হয়, -our→-or হয়, তবে soft c/g-এর পর e থাকে (courageous)।", ["famous, dangerous", "curious, serious, mysterious", "gorgeous, courageous, simultaneous", "continuous"], ["courageous, outrageous (keep e)"], ["ous-ious-eous"]],
  ["R14", "suffix", "-cede, -ceed, -sede", "-cede, -ceed এবং -sede", "high", "Only 1 word ends in -sede (supersede), 3 end in -ceed (exceed, proceed, succeed); all others use -cede.", "সবচেয়ে সহজ নিয়ম: -sede শুধু ১টি, -ceed শুধু ৩টি, বাকি সব -cede।", ["supersede (-sede)", "exceed, proceed, succeed (-ceed)", "precede, concede, recede (-cede)"], ["procedure (only one e)"], ["common-traps"]],
  ["R15", "suffix", "-ary, -ery, -ory", "-ary, -ery এবং -ory", "low", "Guideline only: -ary is most common; -ery and -ory appear in specific nouns/places.", "এটি শুধু একটি গাইডলাইন—শব্দভেদে -ary/-ery/-ory মুখস্থ রাখতে হয়।", ["necessary, library, secretary, dictionary", "bakery, stationery, cemetery", "history, category, laboratory"], [], ["suffix-rules", "common-traps"]],
  ["R16", "suffix", "-er, -or, -ar endings", "-er, -or ও -ar সমাপ্তি", "low", "Guideline only: -er is default for English roots; -or for many Latin professions; -ar in a few words.", "সাধারণত -er, Latin পেশায় -or, আর অল্প কিছু শব্দে -ar বসে (মুখস্থ করা ভালো)।", ["teacher, writer", "actor, doctor, professor, visitor", "calendar, grammar, similar, regular"], [], ["suffix-rules", "common-traps"]],

  // Part 2: Prefix Rules (R17 - R20)
  ["R17", "prefix", "Prefixes do not change the root spelling", "Prefix মূল শব্দের বানান বদলায় না", "high", "Keep every letter of both the prefix and root word—double letters happen naturally.", "Prefix যোগ করলে মূল শব্দের বানান একদম অপরিবর্তিত থাকে।", ["un + necessary = unnecessary", "dis + satisfied = dissatisfied", "mis + spell = misspell"], ["dis + appear = disappear (1 s, 2 p)", "dis + appoint = disappoint"], ["prefix-rules", "double-consonant"]],
  ["R18", "prefix", "in- changes to im-, il-, ir-", "in- বদলে im-, il-, ir- হয়", "high", "Use im- before b/m/p, il- before l, ir- before r, and in- before other letters.", "b/m/p-এর আগে im-, l-এর আগে il-, r-এর আগে ir- এবং বাকিদের আগে in- বসে।", ["impossible, immature", "illegal, illegible, illiterate", "irregular, irresponsible", "inactive, invisible"], [], ["prefix-rules"]],
  ["R19", "prefix", "Latin Prefix Assimilation", "Latin Prefix-এর Assimilation", "medium", "Prefixes ad-, com-, sub-, ob- often match the first letter of the root, creating double consonants.", "Latin prefix-এর শেষ অক্ষর root-এর প্রথম অক্ষরের সাথে মিলে গিয়ে double letter তৈরি করে।", ["accommodate, accept, appear", "correct, committee", "success, support", "occur, opportunity, offer"], [], ["prefix-rules", "double-consonant"]],
  ["R20", "prefix", "Prefixes and Hyphens", "Prefix ও Hyphen ব্যবহারের নিয়ম", "medium", "Use hyphens before capitals/numbers, with self-/ex-/all-, or to avoid confusion/double vowels.", "বড় অক্ষর/সংখ্যা, self-/ex- এবং অর্থ স্পষ্ট করতে hyphen বসে; সাধারণ prefix-এ বসে না।", ["pre-1990, anti-American", "self-esteem, ex-wife", "re-sign vs resign", "unhappy, preview (no hyphen)"], [], ["prefix-rules", "compound-words"]],

  // Part 3: Plural Rules (R21 - R26)
  ["R21", "plural", "Regular Plurals", "সাধারণ বহুবচন নিয়ম", "high", "Add -s normally; -es after s/ss/x/z/ch/sh; consonant + y → -ies; vowel + y → +s.", "সাধারণত +s; s/x/z/ch/sh-এর পর +es; consonant+y হলে -ies।", ["books, cars", "buses, boxes, quizzes, watches", "cities, stories", "boys, days"], ["Proper names keep y: two Marys, the Kennedys"], ["plural-rules"]],
  ["R22", "plural", "Words ending in -O", "-O দিয়ে শেষ হওয়া শব্দের বহুবচন", "medium", "Most -o words take -s (especially short/music words); a few take -es.", "বেশিরভাগ -o শব্দে +s বসে; তবে hero, potato, tomato, echo, veto-তে +es বসে।", ["potatoes, tomatoes, heroes, echoes", "radios, photos, pianos, videos"], ["mosquito(e)s, volcano(e)s, zero(e)s (both valid)"], ["plural-rules"], "5 -es words: Hero, Potato, Tomato, Echo, Veto"],
  ["R23", "plural", "Words ending in -F / -FE", "-F / -FE দিয়ে শেষ হওয়া শব্দের বহুবচন", "medium", "Many -f/-fe nouns change to -ves in plural, while several common ones simply add -s.", "অনেক -f/-fe শব্দ বহুবচনে -ves হয়, তবে কিছু শব্দে শুধু +s বসে।", ["leaf → leaves, knife → knives, wife → wives, wolf → wolves"], ["roofs, chiefs, beliefs, cliffs, proofs, safes, chefs", "scarfs/scarves, dwarfs/dwarves"], ["plural-rules"]],
  ["R24", "plural", "Irregular Plurals", "অনিয়মিত (Irregular) বহুবচন", "high", "Some nouns change vowels, add -en, use a new word, or keep the exact same singular/plural form.", "কিছু শব্দের বহুবচন নিয়ম মেনে -s/-es নেয় না, আলাদা রূপ বা একই রূপ থাকে।", ["man → men, foot → feet, tooth → teeth, mouse → mice", "child → children", "person → people", "sheep, fish, deer, species (unchanged)"], [], ["plural-rules"]],
  ["R25", "plural", "Latin and Greek Plurals", "Latin ও Greek বহুবচন", "medium", "Academic plurals: -is → -es, -um → -a, -us → -i, -on → -a, -ix/-ex → -ices.", "একাডেমিক ও IELTS লেখায় ব্যবহৃত বিশেষ বহুবচন রূপ।", ["analysis → analyses, crisis → crises", "curriculum → curricula, bacterium → bacteria", "phenomenon → phenomena, criterion → criteria", "stimulus → stimuli"], ["curriculums, formulas, indexes (also accepted in general English)"], ["latin-greek-plurals", "ielts-academic"]],
  ["R26", "plural", "Compound Plurals & Verb -s", "Compound Plural ও Verb-এ -s", "medium", "Hyphenated compounds pluralize the main noun; 3rd-person singular verbs follow noun plural rules.", "Hyphenated compound-এ মূল noun-এ s বসে; verb+s এর নিয়ম noun plural-এর মতোই।", ["mothers-in-law, passers-by, runners-up", "toothbrushes, handfuls", "go → goes, study → studies, watch → watches"], [], ["plural-rules", "compound-words"]],

  // Part 4: Letter Pattern Rules (R27 - R40)
  ["R27", "patterns", "I before E except after C", "C ছাড়া I আগে, E পরে", "medium", "Write ie for /ee/ sound, except after c (ei) or when pronounced /ay/ (ei).", "সাধারণত ie বসে, তবে c-এর ঠিক পরে বা 'ay' উচ্চারণে ei বসে; অনেক ব্যতিক্রম আছে।", ["believe, achieve, friend, piece", "receive, ceiling, deceive, receipt", "neighbour, weigh"], ["seize, weird, either, neither, protein, leisure", "science, species, efficient", "height, foreign"], ["i-before-e"]],
  ["R28", "patterns", "Soft and Hard C & G", "Soft ও Hard C এবং G", "medium", "C and G are usually soft (/s/, /j/) before e, i, y and hard (/k/, /g/) before a, o, u.", "e, i, y-এর আগে c/g সাধারণত soft হয় এবং a, o, u-এর আগে hard হয়।", ["cent, city, cycle vs cat, car", "gem, giant, gym vs game, go"], ["G hard before e/i: get, give, girl, gift, begin, together"], ["tricky-patterns"]],
  ["R29", "patterns", "CK vs K", "CK বনাম K", "high", "Use -ck right after a short vowel; use -k after a long vowel, vowel team, or consonant.", "Short vowel-এর ঠিক পরে ck, আর long vowel বা consonant-এর পরে k বসে।", ["back, neck, sick, clock, duck", "cake, book, look, desk, milk, think"], [], ["tricky-patterns"]],
  ["R30", "patterns", "TCH vs CH", "TCH বনাম CH", "high", "Use -tch right after a short vowel; use -ch after a long vowel or consonant.", "Short vowel-এর ঠিক পরে tch, আর long vowel বা consonant-এর পরে ch বসে।", ["catch, match, kitchen, watch", "beach, teach, lunch, bench"], ["such, much, rich, which, sandwich, attach"], ["tricky-patterns"]],
  ["R31", "patterns", "DGE vs GE", "DGE বনাম GE", "high", "Use -dge right after a short vowel; use -ge after a long vowel or consonant.", "Short vowel-এর ঠিক পরে dge, আর long vowel বা consonant-এর পরে ge বসে।", ["badge, bridge, judge, edge", "page, huge, change, large"], [], ["tricky-patterns"]],
  ["R32", "patterns", "FLOSS Rule (ff, ll, ss, zz)", "FLOSS নিয়ম (ff, ll, ss, zz)", "medium", "One-syllable words with a short vowel ending in f, l, s, z usually double the final letter.", "১ সিলেবল ও short vowel হলে শেষে f, l, s, z ডাবল হয়।", ["staff, cliff", "bell, ball, skill", "pass, miss, class, glass", "buzz, jazz"], ["if, of, bus, yes, gas, plus, this, us, pal"], ["double-consonant", "tricky-patterns"]],
  ["R33", "patterns", "Q is followed by U", "Q-এর পরে U বসে", "high", "Q is almost always followed by u in English words (qu- or -que).", "ইংরেজি শব্দে q-এর পর প্রায় সবসময় u বসে।", ["queen, quick, quiet, question, quality", "unique, technique, bouquet"], ["Iraq, Qatar, qi (borrowed/transliteration)"], ["tricky-patterns"]],
  ["R34", "patterns", "No English word ends in V, J, or I", "ইংরেজি শব্দ V, J বা I দিয়ে শেষ হয় না", "high", "Add silent -e after v; use -ge/-dge for /j/ sound; use -y instead of -i at word ends.", "শেষে v হলে e যোগ হয়; j সাউন্ডে -ge/-dge; এবং i-এর বদলে y বসে।", ["love, have, give, live", "page, badge", "cry, happy, sky"], ["taxi, ski, hi, safari, spaghetti, kiwi (borrowed)"], ["tricky-patterns"]],
  ["R35", "patterns", "Y or I in the middle", "মাঝে Y নাকি I", "medium", "English uses y at the end and i in the middle; Greek loanwords often use y in the middle.", "শব্দের শেষে y ও মাঝে i বসে; তবে গ্রিক শব্দে মাঝেও y থাকে।", ["cry, happy vs ice, time", "Greek y: system, gym, mystery, symbol, rhythm"], [], ["tricky-patterns", "borrowed-words"]],
  ["R36", "patterns", "AY/EY/OY/UY at end vs AI/EI/OI/UI middle", "শেষে -ay/-ey/-oy বনাম মাঝে -ai-/-ei-/-oi-", "medium", "Vowel teams ending in y go at the end of words; teams ending in i go in the middle.", "y-যুক্ত vowel team সাধারণত শেষে এবং i-যুক্ত team মাঝে বসে।", ["play, day, key, boy, buy", "plain, vein, boil, fruit"], [], ["tricky-patterns"]],
  ["R37", "patterns", "AW/OW at end vs AU/OU middle", "শেষে -aw/-ow বনাম মাঝে -au-/-ou-", "medium", "Use aw/ow at word ends (or before single n/l); use au/ou in the middle or start.", "শব্দের শেষে সাধারণত aw/ow এবং মাঝে/শুরুতে au/ou বসে।", ["saw, draw, cow, now, brown", "cause, sauce, house, cloud, out"], ["snow, grow, blow (long o sound)"], ["tricky-patterns"]],
  ["R38", "patterns", "Words ending in -S: plural vs verb", "-S শেষে বহুবচন ও Verb নিয়ম", "high", "Nouns and 3rd-person singular verbs ending in s/ss add -es.", "s বা ss দিয়ে শেষ হওয়া noun ও verb-এ -es যোগ হয়।", ["bus → buses, class → classes", "pass → passes, miss → misses, guess → guesses"], [], ["plural-rules"]],
  ["R39", "patterns", "Adding -ed", "-ed যোগ করার নিয়ম", "high", "Add -ed; -e adds -d; consonant+y → -ied; vowel+y adds -ed; 1-1-1 doubles consonant.", "নিয়মিত verb-এ past form বানানোর নিয়ম।", ["walk → walked", "hope → hoped", "study → studied", "play → played", "stop → stopped"], [], ["suffix-rules", "irregular-verbs"]],
  ["R40", "patterns", "Adding -er / -est (Comparison)", "-er / -est তুলনায় যোগের নিয়ম", "high", "Add -er/-est to short adjectives; -e adds -r/-st; y→ier/-iest; 1-1-1 doubles; long words use more/most.", "ছোট adjective-এ -er/-est এবং বড় adjective-এ more/most বসে।", ["tall → taller", "nice → nicer", "happy → happier", "big → bigger", "more beautiful"], [], ["suffix-rules"]],

  // Part 5: Silent Letters (R41)
  ["R41", "silent", "Silent Letter Patterns", "নীরব অক্ষর (Silent Letter) প্যাটার্ন", "high", "Common silent letters follow clear patterns: kn-, wr-, gn-, -mb, -bt, -alk/-alm, -stle/-sten, ps-/pn-, -mn.", "নীরব অক্ষরগুলো নির্দিষ্ট প্যাটার্নে আসে—যেমন kn-, wr-, -mb, -bt, -stle, ps-।", ["knife, knowledge, knight", "write, wrist, wrestle", "climb, debt, doubt, subtle", "castle, listen, psychology, autumn, Wednesday"], [], ["silent-letter"]],

  // Part 6: Sound to Spelling (R42)
  ["R42", "sound", "One Sound, Many Spellings (Bangla Guide)", "এক উচ্চারণ, ভিন্ন বানান (বাংলাভাষী গাইড)", "low", "English sounds (/k/, /f/, /sh/, /s/, /z/, schwa) have multiple spellings—audio + syllable practice is essential.", "একই উচ্চারণের জন্য একাধিক বানান থাকায় বাংলাভাষীদের জন্য অডিও + সিলেবল অনুশীলন জরুরি।", ["/k/: cat, kite, back, school, unique", "/f/: fun, staff, phone, laugh", "/sh/: ship, nation, special, machine, ocean, sugar"], ["Schwa (unstressed vowel) causes most traps: sep-a-rate, diff-e-rence"], ["bangla-mistakes", "tricky-patterns"]],

  // Part 7: Word Origin (R43 - R44)
  ["R43", "origin", "Greek-Origin Spelling", "গ্রিক উৎসের বানান", "medium", "Greek words use ph (/f/), ch (/k/), ps (/s/), pn (/n/), rh (/r/), y (/i/), -ology, -graphy.", "গ্রিক শব্দে ph=/f/, ch=/k/, ps, pn, rh এবং মাঝে y থাকে।", ["phone, physical, pharmacy", "chemistry, character, chaos", "psychology, pneumonia, rhythm, system"], [], ["borrowed-words", "tricky-patterns"]],
  ["R44", "origin", "French-Origin Spelling", "ফরাসি উৎসের বানান", "medium", "French loanwords often use -eau, -que, -ette, -ier, -eur, and ch pronounced as /sh/.", "ফরাসি শব্দে -eau, -que, -ette, -eur এবং ch=/sh/ দেখা যায়।", ["bureau, plateau", "unique, technique, bouquet", "silhouette, entrepreneur", "chef, machine, brochure, rendezvous, restaurant"], [], ["borrowed-words", "spelling-bee"]],

  // Part 8: Confusing Words (R45 - R47)
  ["R45", "confusing", "Homophones (Same Sound, Different Spelling)", "সমোচ্চারিত শব্দ (Homophones)", "low", "Words that sound identical have different spellings and meanings—memorize with memory hooks.", "উচ্চারণ এক হলেও অর্থ ও বানান ভিন্ন; মেমরি ট্রিক দিয়ে মনে রাখতে হয়।", ["their / there / they're", "to / too / two", "write / right", "weather / whether", "peace / piece", "break / brake"], [], ["homophones"]],
  ["R46", "confusing", "Confusing Pairs", "কাছাকাছি শব্দজোড়া (Confusing Pairs)", "low", "Similar-looking/sounding pairs with distinct meanings and parts of speech—memorize each pair's contrast.", "উচ্চারণ বা বানান কাছাকাছি কিন্তু অর্থ আলাদা—প্রতিটি জোড়ার পার্থক্য মনে রাখুন।", ["affect (verb) / effect (noun)", "loose / lose", "quiet / quite", "desert / dessert", "principal / principle", "stationary / stationery"], [], ["confusing-pairs"]],
  ["R47", "confusing", "Noun (C) vs Verb (S) Pairs", "Noun (C) বনাম Verb (S) জোড়া", "medium", "In pairs like advice/advise and device/devise, the noun takes 'c' and the verb takes 's'.", "advice/advise, device/devise-এর মতো জোড়ায় Noun-এ c এবং Verb-এ s বসে।", ["advice (n) / advise (v)", "device (n) / devise (v)", "UK: practice/practise, licence/license"], ["US uses practice and license for both noun & verb"], ["confusing-pairs", "british-vs-american"], "N (noun) comes before V (verb), just like C comes before S."],

  // Part 9: British vs American (R48)
  ["R48", "uk-us", "British (UK) vs American (US) Differences", "ব্রিটিশ বনাম আমেরিকান বানান", "high", "Systematic UK/US patterns: -our/-or, -re/-er, -ise/-ize, -ce/-se, -ll-/-l-, -ogue/-og.", "UK ও US বানানে নির্দিষ্ট নিয়মিত পার্থক্য আছে; লেখায় যেকোনো একটি স্টাইল মেনে চলা উচিত।", ["colour / color", "centre / center", "organise / organize", "travelling / traveling", "defence / defense", "programme / program"], ["Both are accepted in IELTS if used consistently"], ["british-vs-american"]],

  // Part 10: Compounds, Apostrophes, Numbers (R49 - R53)
  ["R49", "compounds", "Compound Words (1 Word vs 2 Words)", "Compound Words (এক শব্দ বনাম দুই শব্দ)", "medium", "Learn which compounds are closed (everyone), open (a lot), or hyphenated (mother-in-law).", "কোনগুলো এক শব্দ, কোনগুলো দুই শব্দ এবং কোনগুলো hyphenated তা খেয়াল রাখুন।", ["notebook, everyone, website, however", "a lot (never alot), ice cream", "everyday (adj) vs every day (adv)", "maybe vs may be"], [], ["compound-words"]],
  ["R50", "compounds", "Apostrophes: Contractions", "Apostrophe: সংক্ষিপ্ত রূপ (Contractions)", "high", "An apostrophe replaces the missing letter(s) when two words are combined.", "দুটি শব্দ একসাথে সংক্ষিপ্ত করলে যে অক্ষর বাদ যায় তার জায়গায় apostrophe বসে।", ["it's = it is", "don't = do not", "can't = cannot", "you're = you are", "won't = will not"], [], ["apostrophe-contractions"]],
  ["R51", "compounds", "Apostrophes: Possession", "Apostrophe: মালিকানা (Possession)", "high", "Singular+'s, plural ending in s+', irregular plural+'s; possessive pronouns (its, whose, hers) never take an apostrophe.", "মালিকানা বোঝাতে 's বসে, তবে its/whose/hers-এ কখনো apostrophe বসে না।", ["the boy's book", "the boys' books", "children's toys", "its, whose, yours (no apostrophe)"], [], ["apostrophe-contractions"]],
  ["R52", "compounds", "Number Spelling Traps", "সংখ্যা বানানের ফাঁদ", "medium", "Watch dropped letters in numbers: forty (no u), ninth (no e), eighth (one t), twelfth (v→f), hyphen 21–99.", "forty-তে u নেই, ninth-এ e নেই, eighth-এ ১টি t, twelfth-এ f বসে।", ["fourteen vs forty", "ninety vs ninth", "eighth", "twelfth", "twenty-one"], [], ["days-months-numbers"]],
  ["R53", "compounds", "Days and Months", "দিন ও মাসের নাম", "medium", "Always capitalize days and months; watch silent d in Wednesday and r in February.", "দিন ও মাসের প্রথম অক্ষর Capital হয়; Wednesday-তে d ও February-তে r খেয়াল রাখুন।", ["Wednesday", "Tuesday", "Thursday", "February", "August", "September"], [], ["days-months-numbers"]],

  // Part 11: Study Strategies (R54 - R55)
  ["R54", "strategies", "Syllable Breakdown (Chunking)", "সিলেবল ভেঙে (Chunking) শেখা", "high", "Split long words at prefix/root/suffix or VC/CV boundaries to memorize effortlessly.", "বড় শব্দকে ছোট ছোট অংশে (prefix/root/suffix বা VC/CV) ভেঙে পড়লে বানান সহজ হয়।", ["un-nec-es-sar-y", "ac-com-mo-date", "en-vi-ron-ment", "pro-nun-ci-a-tion", "re-spon-si-bil-i-ty"], [], ["long-word-challenge"]],
  ["R55", "strategies", "Learn Word Families", "Word Family দিয়ে শেখা", "high", "Learn one root word and branch out with prefixes and suffixes to master 5–10 words at once.", "একটি মূল শব্দ শিখে তার prefix ও suffix যোগ করে একসাথে অনেক শব্দ আয়ত্ত করুন।", ["happy → unhappy, happily, happiness", "act → action, active, activity", "create → creation, creative, creativity"], [], ["word-families"]],
];

export const SPELLING_RULES_55: SpellRuleItem[] = RAW_RULES.map(
  ([id, part, title, titleBn, reliability, summaryEn, summaryBn, examples, exceptions, categories, mnemonic]) => ({
    id,
    part,
    title,
    titleBn,
    reliability,
    summaryEn,
    summaryBn,
    examples,
    exceptions,
    categories,
    mnemonic: mnemonic ?? null,
  })
);

export function getRulesForCategories(categories: SpellCategoryId[]): SpellRuleItem[] {
  const catSet = new Set(categories);
  return SPELLING_RULES_55.filter((r) => r.categories.some((c) => catSet.has(c)));
}

const UK_US_PAIRS: [string, string][] = [
  ["colour", "color"],
  ["centre", "center"],
  ["organise", "organize"],
  ["travelling", "traveling"],
  ["favourite", "favorite"],
  ["defence", "defense"],
  ["programme", "program"],
  ["behaviour", "behavior"],
  ["theatre", "theater"],
  ["honour", "honor"],
  ["neighbour", "neighbor"],
  ["neighbouring", "neighboring"],
  ["cancelled", "canceled"],
  ["fulfil", "fulfill"],
  ["judgement", "judgment"],
  ["acknowledgement", "acknowledgment"],
  ["apologise", "apologize"],
  ["realise", "realize"],
  ["recognise", "recognize"],
  ["analyse", "analyze"],
  ["globalisation", "globalization"],
  ["civilisation", "civilization"],
  ["jewellery", "jewelry"],
  ["practice", "practise"],
  ["licence", "license"],
];

const VARIANT_MAP = new Map<string, string>();
for (const [a, b] of UK_US_PAIRS) {
  VARIANT_MAP.set(a, b);
  VARIANT_MAP.set(b, a);
}

export function areSpellingVariantsEqual(attempt: string, target: string): boolean {
  const a = attempt.trim().toLowerCase();
  const t = target.trim().toLowerCase();
  if (a === t) return true;
  return VARIANT_MAP.get(t) === a;
}
