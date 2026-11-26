import type { GrammarDetailedLesson, GrammarQuizQuestion, RightWordQuestion } from "../learning-path";

function padQuiz(base: GrammarQuizQuestion[], topicTitle: string): GrammarQuizQuestion[] {
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
  void topicTitle;
  return out;
}

function padRightWord(base: RightWordQuestion[]): RightWordQuestion[] {
  return base;
}

export const STAGE_2_TO_4_LESSONS: GrammarDetailedLesson[] = [
  // ================= STAGE 2: CORE ENGINE =================
  {
    id: "tenses-present",
    stageNumber: 2,
    title: "1. Present Tenses (All 4 Forms)",
    formula: "Simple: V1/V(s/es) · Continuous: am/is/are+V-ing · Perfect: have/has+V3 · Perf. Cont.: have/has been+V-ing",
    overviewRule: {
      bn: "বর্তমান সময়ের কাজকে ৪টি ভাগে ভাগ করা হয়: (১) Present Simple — অভ্যাস ও চিরন্তন সত্য, (২) Present Continuous — এখন চলছে, (৩) Present Perfect — সদ্য শেষ হয়েছে বা ফল এখনো আছে, (৪) Present Perfect Continuous — আগে শুরু হয়ে এখনো চলছে (since/for)।",
      hi: "वर्तमान काल के 4 रूप: Simple (आदत/सत्य), Continuous (अभी चल रहा है), Perfect (अभी पूरा हुआ), Perfect Continuous (पहले से चल रहा है)।",
      en: "Present tenses cover 4 aspects: Simple (habits/facts), Continuous (happening now), Perfect (completed with present link), and Perfect Continuous (ongoing duration).",
    },
    subTypes: [
      {
        name: "1. Present Simple & Present Continuous",
        rule: {
          bn: "Simple-এ 3rd person singular (he/she/it/Rahim) হলে Verb-এ s/es হয়। Continuous-এ am/is/are + V-ing বসে। 'always, daily, usually' থাকলে Simple এবং 'now, right now, at this moment' থাকলে Continuous হয়।",
          hi: "Simple में he/she/it के साथ V+s/es और Continuous में am/is/are + V-ing लगता है।",
          en: "Simple uses V1 (V+s/es for he/she/it) for habits/facts; Continuous uses am/is/are + V-ing for actions happening right now.",
        },
        words: ["reads", "goes", "watches", "always", "usually", "am reading", "is working", "are playing"],
        sentences: ["She reads the newspaper every morning.", "They are practicing English right now."],
      },
      {
        name: "2. Present Perfect & Present Perfect Continuous",
        rule: {
          bn: "Perfect: have/has + V3 ('just, already, yet, ever, recently' থাকলে)। Perfect Continuous: have/has been + V-ing + since (শুরুর সময়) / for (মোট সময়)।",
          hi: "Perfect: have/has + V3 (already, just, yet)। Perfect Continuous: have/has been + V-ing + since/for।",
          en: "Perfect uses have/has + V3; Perfect Continuous uses have/has been + V-ing with 'since' (point) or 'for' (duration).",
        },
        words: ["have finished", "has gone", "already", "just", "yet", "since", "for", "have been waiting"],
        sentences: ["I have already completed my assignment.", "He has been living here since 2021."],
      },
    ],
    wordBank: [
      "always", "usually", "often", "every day", "now", "at the moment",
      "just", "already", "yet", "recently", "ever", "never", "since", "for",
      "reads", "writes", "am learning", "is cooking", "are working",
      "have done", "has arrived", "have been studying", "has been raining",
    ],
    sentenceExamples: [
      "Simple: Water freezes at 0 degrees Celsius.",
      "Continuous: Look! It is raining outside.",
      "Perfect: Have you ever visited Sylhet?",
      "Perfect Continuous: She has been practicing for two hours.",
    ],
    sentencePrompts: [
      "Write a Present Simple sentence about a daily habit (use he/she + V-s/es).",
      "Write a Present Continuous sentence about something happening right now.",
      "Write a Present Perfect sentence using 'already' or 'just'.",
      "Write a Present Perfect Continuous sentence using 'since' or 'for'.",
      "Write a Present Simple question starting with 'Does' or 'Do'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "She ___ to school every day.", options: ["go", "goes", "is going", "has gone"], correctIndex: 1, explanation: { bn: "'every day' ও Subject 'She' থাকায় Present Simple 'goes' হবে।", hi: "'every day' और 'She' के साथ 'goes' आएगा।", en: "Habitual 'every day' with 'She' takes 'goes'." } },
      { prompt: "Look! The children ___ in the garden.", options: ["play", "plays", "are playing", "have played"], correctIndex: 2, explanation: { bn: "'Look!' এখন চলমান কাজ বোঝায়, তাই 'are playing' হবে।", hi: "'Look!' वर्तमान में चल रहे कार्य को दर्शाता है।", en: "'Look!' signals an action happening now." } },
      { prompt: "I have ___ finished my homework.", options: ["yesterday", "already", "now", "ago"], correctIndex: 1, explanation: { bn: "Present Perfect-এ 'already' ব্যবহৃত হয়।", hi: "Present Perfect में 'already' आता है।", en: "'already' pairs with Present Perfect." } },
      { prompt: "It has been raining ___ 8 o'clock.", options: ["for", "since", "from", "at"], correctIndex: 1, explanation: { bn: "নির্দিষ্ট শুরুর সময় ('8 o'clock') হলে 'since' বসে।", hi: "निश्चित शुरुआती समय के लिए 'since' आता है।", en: "Specific starting point takes 'since'." } },
      { prompt: "___ your brother like coffee?", options: ["Do", "Does", "Is", "Has"], correctIndex: 1, explanation: { bn: "3rd person singular 'your brother'-এর প্রশ্নে 'Does' বসে।", hi: "एकवचन कर्ता के प्रश्न में 'Does' आता है।", en: "Singular 'your brother' takes 'Does'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which tense is used for universal truths?", options: ["Present Continuous", "Present Simple", "Present Perfect", "Past Simple"], correctIndex: 1, explanation: { bn: "চিরন্তন সত্যে Present Simple হয়।", hi: "सार्वभौमिक सत्य के लिए Present Simple होता है।", en: "Universal truths use Present Simple." } },
      { question: "Complete: 'He has been working here ___ five years.'", options: ["since", "for", "from", "in"], correctIndex: 1, explanation: { bn: "মোট সময়কাল ('five years') হলে 'for' বসে।", hi: "अवधि के लिए 'for' आता है।", en: "Durations take 'for'." } },
      { question: "Which marker signals Present Perfect?", options: ["yesterday", "yet", "last night", "tomorrow"], correctIndex: 1, explanation: { bn: "'yet' Present Perfect-এ ব্যবহৃত হয়।", hi: "'yet' Present Perfect का सूचक है।", en: "'yet' is a Present Perfect marker." } },
      { question: "Choose the correct sentence:", options: ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", "She isn't like tea."], correctIndex: 2, explanation: { bn: "doesn't-এর পরে V1 ('like') বসে।", hi: "doesn't के बाद V1 आता है।", en: "Use base 'like' after 'doesn't'." } },
      { question: "What is the structure of Present Perfect Continuous?", options: ["am/is/are + V-ing", "have/has + V3", "have/has been + V-ing", "had been + V-ing"], correctIndex: 2, explanation: { bn: "have/has been + V-ing হলো Present Perfect Continuous।", hi: "have/has been + V-ing सही संरचना है।", en: "have/has been + V-ing." } },
    ], "Present Tenses"),
    levels: ["school", "admission", "ielts", "spoken"],
  },

  {
    id: "tenses-past",
    stageNumber: 2,
    title: "2. Past Tenses (All 4 Forms)",
    formula: "Simple: V2 · Continuous: was/were+V-ing · Perfect: had+V3 · Perf. Cont.: had been+V-ing",
    overviewRule: {
      bn: "অতীত কালের ৪টি রূপ: (১) Past Simple (V2) — অতীতে শেষ হওয়া কাজ, (২) Past Continuous (was/were+ing) — অতীতে চলছিল, (৩) Past Perfect (had+V3) — অতীতের দুটি কাজের মধ্যে আগের কাজটি, (৪) Past Perfect Continuous (had been+ing) — অতীতে দীর্ঘ সময় চলছিল।",
      hi: "भूतकाल के 4 रूप: Simple (V2), Continuous (was/were+ing), Perfect (had+V3), Perfect Continuous (had been+ing)।",
      en: "Past tenses express finished past events (V2), ongoing past actions (was/were+ing), earlier past actions (had+V3), and past duration (had been+ing).",
    },
    subTypes: [
      {
        name: "1. Past Simple & Past Continuous",
        rule: {
          bn: "'Yesterday, ago, last night' থাকলে Past Simple (V2; না-বোধক/প্রশ্নে did + V1) হয়। অতীতে একটি কাজ চলাকালীন আরেকটি ঘটলে চলমানটিতে Past Continuous (was/were+ing) ও হঠাৎ ঘটাটিতে Past Simple (V2) হয়।",
          hi: "'Yesterday / ago' होने पर V2 (नकारात्मक में did + V1) और चल रहे काम के लिए was/were + V-ing लगता है।",
          en: "Finished past time markers take V2 (did + V1 in negatives/questions). Interrupted actions pair Past Continuous with Past Simple.",
        },
        words: ["went", "wrote", "saw", "did not go", "was reading", "were playing", "yesterday", "ago"],
        sentences: ["I met him two days ago.", "She was cooking when the phone rang."],
      },
      {
        name: "2. Past Perfect & Past Perfect Continuous",
        rule: {
          bn: "অতীতে দুটি কাজের মধ্যে যেটি আগে ঘটেছিল তাতে Past Perfect (had + V3) এবং পরেরটিতে Past Simple (V2) হয় ('before'-এর আগে এবং 'after'-এর পরে had+V3 বসে)।",
          hi: "दो भूतकालिक कार्यों में पहले हुए कार्य के लिए had + V3 ('before' से पहले, 'after' के बाद) आता है।",
          en: "Past Perfect (had + V3) marks the earlier of two past actions (before + V2; after + had V3).",
        },
        words: ["had left", "had finished", "before", "after", "had been waiting"],
        sentences: ["The train had left before we reached the station.", "They had been waiting for an hour before the bus came."],
      },
    ],
    wordBank: [
      "yesterday", "ago", "last week", "last night", "in 2020", "before", "after", "when", "while",
      "went", "came", "saw", "wrote", "did", "was studying", "were talking",
      "had arrived", "had completed", "had been working", "had been raining",
    ],
    sentenceExamples: [
      "Simple: Did you watch the news last night?",
      "Interrupted: While I was walking home, I saw an old friend.",
      "Past Perfect: After she had finished her work, she went to sleep.",
      "Past Perf. Cont.: He had been studying for three hours before dinner.",
    ],
    sentencePrompts: [
      "Write a Past Simple sentence using 'yesterday' or 'ago'.",
      "Write a negative Past Simple sentence using 'did not + V1'.",
      "Write a sentence combining Past Continuous and Past Simple using 'when' or 'while'.",
      "Write a Past Perfect sentence using 'before' or 'after'.",
      "Write a Past Perfect Continuous sentence showing duration before a past event.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "I ___ my friend yesterday.", options: ["meet", "met", "have met", "was meet"], correctIndex: 1, explanation: { bn: "'yesterday' থাকায় Past Simple (V2) 'met' হবে।", hi: "'yesterday' के कारण V2 'met' आएगा।", en: "'yesterday' requires Past Simple 'met'." } },
      { prompt: "Did you ___ to the market?", options: ["went", "gone", "go", "going"], correctIndex: 2, explanation: { bn: "'Did'-এর পরে সবসময় V1 ('go') বসে।", hi: "'Did' के बाद हमेशा V1 आता है।", en: "After 'Did', use base verb 'go'." } },
      { prompt: "The patient ___ before the doctor came.", options: ["died", "has died", "had died", "was dying"], correctIndex: 2, explanation: { bn: "'before'-এর আগের কাজটি আগে ঘটেছে, তাই Past Perfect 'had died' হবে।", hi: "'before' से पहले हुआ कार्य Past Perfect (had+V3) लेता है।", en: "Earlier past action before 'before' takes 'had died'." } },
      { prompt: "She ___ TV when I entered the room.", options: ["watched", "was watching", "has watched", "watches"], correctIndex: 1, explanation: { bn: "কাজটি তখন চলছিল, তাই Past Continuous 'was watching' হবে।", hi: "उस समय कार्य चल रहा था, इसलिए 'was watching' सही है।", en: "Ongoing past action takes 'was watching'." } },
      { prompt: "They ___ in Dhaka for ten years before moving to Sylhet.", options: ["had been living", "are living", "live", "will live"], correctIndex: 0, explanation: { bn: "অতীতের একটি ঘটনার আগে দীর্ঘ সময় ধরে চলছিল বোঝাতে 'had been living' বসে।", hi: "भूतकाल से पहले की अवधि के लिए 'had been living' आता है।", en: "Duration before another past event uses Past Perfect Continuous." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which verb form follows 'did not'?", options: ["V1 (base)", "V2 (past)", "V3 (participle)", "V-ing"], correctIndex: 0, explanation: { bn: "'did not'-এর পরে V1 বসে।", hi: "'did not' के बाद V1 आता है।", en: "Base verb V1 follows 'did not'." } },
      { question: "In 'After he ___ the letter, he posted it', choose:", options: ["wrote", "had written", "writes", "is writing"], correctIndex: 1, explanation: { bn: "'After'-এর পরে আগের কাজটি Past Perfect ('had written') হয়।", hi: "'After' के बाद Past Perfect आता है।", en: "'After' introduces the earlier action (had written)." } },
      { question: "Which time marker requires Past Simple?", options: ["now", "already", "two days ago", "tomorrow"], correctIndex: 2, explanation: { bn: "'ago' থাকলে Past Simple হয়।", hi: "'ago' Past Simple दर्शाता है।", en: "'ago' signals Past Simple." } },
      { question: "'While I was reading, the lights ___ out.'", options: ["go", "went", "gone", "going"], correctIndex: 1, explanation: { bn: "হঠাৎ ঘটে যাওয়া কাজটি Past Simple ('went')।", hi: "अचानक हुई क्रिया V2 ('went') होगी।", en: "The interrupting action takes Past Simple 'went'." } },
      { question: "What is the V2 of 'teach'?", options: ["teached", "taught", "teaching", "teaches"], correctIndex: 1, explanation: { bn: "'teach'-এর Past (V2) হলো 'taught'।", hi: "'teach' का V2 'taught' है।", en: "Past tense of 'teach' is 'taught'." } },
    ], "Past Tenses"),
    levels: ["school", "admission", "ielts", "spoken"],
  },

  {
    id: "tenses-future",
    stageNumber: 2,
    title: "3. Future Tenses (All 4 Forms)",
    formula: "Simple: will+V1 · Continuous: will be+V-ing · Perfect: will have+V3 · Perf. Cont.: will have been+V-ing",
    overviewRule: {
      bn: "ভবিষ্যৎ কালের ৪টি রূপ: (১) Future Simple (will + V1), (২) Future Continuous (will be + V-ing) — ভবিষ্যতে চলতে থাকবে, (৩) Future Perfect (will have + V3) — নির্দিষ্ট সময়ের মধ্যে শেষ হয়ে যাবে ('by next month'), (৪) Future Perfect Continuous (will have been + V-ing)।",
      hi: "भविष्य काल के 4 रूप: Simple (will+V1), Continuous (will be+ing), Perfect (will have+V3), Perfect Continuous (will have been+ing)।",
      en: "Future tenses express future decisions/predictions (will+V1), future actions in progress (will be+ing), actions completed by a deadline (will have+V3), and duration up to a future point.",
    },
    subTypes: [
      {
        name: "1. Future Simple & 'Going to'",
        rule: {
          bn: "তাৎক্ষণিক সিদ্ধান্ত বা সাধারণ ভবিষ্যতে 'will + V1', আর আগে থেকে ঠিক করা পরিকল্পনায় 'am/is/are going to + V1' বসে।",
          hi: "तुरंत निर्णय के लिए 'will + V1' और पूर्व योजना के लिए 'going to + V1' आता है।",
          en: "Use 'will + V1' for spontaneous decisions/predictions and 'going to + V1' for prior plans.",
        },
        words: ["will help", "will call", "going to start", "tomorrow", "next week"],
        sentences: ["I will call you back in ten minutes.", "She is going to study medicine next year."],
      },
      {
        name: "2. Future Continuous & Future Perfect",
        rule: {
          bn: "ভবিষ্যতে কোনো নির্দিষ্ট সময়ে কাজ চলতে থাকবে বোঝালে 'will be + V-ing' এবং 'by + ভবিষ্যৎ সময়' (যেমন by 2027) থাকলে 'will have + V3' বসে।",
          hi: "भविष्य में चल रहे काम के लिए 'will be + V-ing' और 'by + समय' के साथ 'will have + V3' लगता है।",
          en: "Future Continuous (will be + V-ing) shows an action in progress; Future Perfect (will have + V3) pairs with 'by + future time'.",
        },
        words: ["will be traveling", "will have finished", "by tomorrow", "by next year", "will have been working"],
        sentences: ["At 10 AM tomorrow, we will be taking the test.", "By next Friday, I will have finished this book."],
      },
    ],
    wordBank: [
      "tomorrow", "next week", "next year", "soon", "by tomorrow", "by 2028",
      "will go", "will start", "is going to", "will be waiting", "will be studying",
      "will have completed", "will have arrived", "will have been living",
    ],
    sentenceExamples: [
      "Simple: Don't worry, everything will be fine.",
      "Going to: Look at the dark clouds; it is going to rain.",
      "Continuous: This time next week, I will be flying to London.",
      "Perfect: She will have graduated by December.",
    ],
    sentencePrompts: [
      "Write a Future Simple sentence using 'will + V1'.",
      "Write a planned future sentence using 'going to + V1'.",
      "Write a Future Continuous sentence ('will be + V-ing').",
      "Write a Future Perfect sentence using 'by + future time' ('will have + V3').",
      "Write a Future question starting with 'Will you...'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "By next month, she ___ her training.", options: ["completes", "will complete", "will have completed", "completed"], correctIndex: 2, explanation: { bn: "'By next month' থাকায় Future Perfect 'will have completed' হবে।", hi: "'By next month' के साथ Future Perfect आता है।", en: "'By + future time' signals Future Perfect." } },
      { prompt: "Tomorrow at 9 AM, I ___ an exam.", options: ["take", "will be taking", "took", "have taken"], correctIndex: 1, explanation: { bn: "ভবিষ্যতের নির্দিষ্ট সময়ে কাজ চলবে বোঝাতে 'will be taking' বসে।", hi: "भविष्य के निश्चित समय पर चल रहे काम के लिए 'will be taking' सही है।", en: "Specific future moment in progress uses Future Continuous." } },
      { prompt: "We ___ visit Cox's Bazar next winter.", options: ["will", "did", "were", "have"], correctIndex: 0, explanation: { bn: "'next winter' ভবিষ্যৎ বোঝায়, তাই 'will' বসবে।", hi: "'next winter' भविष्य दर्शाता है।", en: "Future time takes 'will'." } },
      { prompt: "Look at those dark clouds! It ___ rain.", options: ["is going to", "was", "has", "did"], correctIndex: 0, explanation: { bn: "বর্তমান প্রমাণ দেখে ভবিষ্যৎ অনুমানে 'is going to' বসে।", hi: "वर्तमान संकेत से भविष्य बताने में 'is going to' आता है।", en: "Evidence-based prediction uses 'going to'." } },
      { prompt: "By 2030, they ___ in this city for 15 years.", options: ["will have been living", "live", "lived", "are living"], correctIndex: 0, explanation: { bn: "ভবিষ্যতের কোনো সময় পর্যন্ত দীর্ঘস্থায়ী কাজে Future Perfect Continuous হয়।", hi: "भविष्य की अवधि के लिए Future Perfect Continuous आता है।", en: "Duration up to a future point uses Future Perfect Continuous." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which structure is Future Perfect?", options: ["will + V1", "will be + V-ing", "will have + V3", "had + V3"], correctIndex: 2, explanation: { bn: "will have + V3 হলো Future Perfect।", hi: "will have + V3 Future Perfect है।", en: "Future Perfect = will have + V3." } },
      { question: "'By next year' usually triggers:", options: ["Past Simple", "Future Perfect", "Present Continuous", "Past Continuous"], correctIndex: 1, explanation: { bn: "'By + ভবিষ্যৎ সময়' থাকলে Future Perfect হয়।", hi: "'By + भविष्य समय' Future Perfect लेता है।", en: "'By + future time' triggers Future Perfect." } },
      { question: "After 'will', always use:", options: ["V1 (base)", "V2", "V3", "V-ing"], correctIndex: 0, explanation: { bn: "Modal 'will'-এর পরে V1 বসে।", hi: "'will' के बाद V1 आता है।", en: "'will' is followed by base verb V1." } },
      { question: "For prior intentions/plans, we often use:", options: ["going to + V1", "had + V3", "did + V1", "was + V-ing"], correctIndex: 0, explanation: { bn: "আগের পরিকল্পনায় 'going to + V1' বসে।", hi: "पूर्व योजना के लिए 'going to + V1' आता है।", en: "Prior plans use 'going to + V1'." } },
      { question: "Choose the correct sentence:", options: ["She will goes home.", "She will going home.", "She will go home.", "She will went home."], correctIndex: 2, explanation: { bn: "'will'-এর পরে সরাসরি V1 ('go') বসে।", hi: "'will go' सही है।", en: "'will go' uses base form." } },
    ], "Future Tenses"),
    levels: ["school", "admission", "ielts", "spoken"],
  },

  {
    id: "auxiliary-modal-verbs",
    stageNumber: 2,
    title: "4. Auxiliary & Modal Verbs",
    formula: "Primary: be, do, have | Modals: can, could, may, might, shall, should, will, would, must + V1",
    overviewRule: {
      bn: "Auxiliary Verb (be, do, have) Tense, প্রশ্ন ও না-বোধক বাক্য বানায়। আর Modal Verb (can, could, may, might, should, must, would) ক্ষমতা, ভদ্র অনুরোধ, সম্ভাবনা, উপদেশ বা বাধ্যবাধকতা প্রকাশ করে। Modal-এর পরে সবসময় V1 বসে (কখনো s/ed/ing/to বসে না)।",
      hi: "Auxiliary Verb (be, do, have) Tense और प्रश्न बनाते हैं। Modal Verbs (can, could, should, must, would) क्षमता, सलाह, अनुमति या अनिवार्यता दिखाते हैं। Modal के बाद हमेशा V1 आता है।",
      en: "Primary auxiliaries (be, do, have) build tenses and questions. Modals (can, could, may, might, should, must, would) express ability, permission, advice, or obligation, always followed by base V1.",
    },
    subTypes: [
      {
        name: "1. Ability & Polite Requests (can, could, would)",
        rule: {
          bn: "বর্তমান ক্ষমতায় 'can', অতীত ক্ষমতা বা ভদ্র অনুরোধে 'could', এবং অত্যন্ত ভদ্র অনুরোধ/প্রস্তাবে 'would' বসে।",
          hi: "वर्तमान क्षमता के लिए 'can', भूतकाल/विनम्र अनुरोध के लिए 'could' और 'would' का प्रयोग होता है।",
          en: "'can' (present ability), 'could' (past ability / polite request), 'would' (polite offer/request).",
        },
        words: ["can", "cannot", "could", "would", "Would you mind"],
        sentences: ["She can speak English fluently.", "Could you please open the window?"],
      },
      {
        name: "2. Advice, Obligation & Possibility (should, must, may, might)",
        rule: {
          bn: "উপদেশে 'should / ought to', কঠোর বাধ্যবাধকতায় 'must / have to', এবং সম্ভাবনা বা অনুমতিতে 'may / might' বসে।",
          hi: "सलाह के लिए 'should', अनिवार्यता के लिए 'must', और संभावना/अनुमति के लिए 'may/might' लगता है।",
          en: "'should' (advice), 'must' (strong obligation), 'may/might' (permission/possibility).",
        },
        words: ["should", "must", "have to", "may", "might", "ought to"],
        sentences: ["You should revise your notes daily.", "We must respect our parents."],
      },
    ],
    wordBank: [
      "am", "is", "are", "was", "were", "do", "does", "did", "have", "has", "had",
      "can", "could", "may", "might", "shall", "should", "will", "would", "must",
    ],
    sentenceExamples: [
      "Ability: I can solve this puzzle in two minutes.",
      "Polite request: Would you like a cup of tea?",
      "Obligation: Everyone must wear a seatbelt.",
      "Possibility: It might rain this evening.",
    ],
    sentencePrompts: [
      "Write a sentence showing ability with 'can' or 'could'.",
      "Write a polite request using 'Could you please...' or 'Would you...'.",
      "Write a piece of advice using 'should'.",
      "Write a strong rule or obligation using 'must'.",
      "Write a sentence showing possibility using 'may' or 'might'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "You ___ follow the traffic rules.", options: ["must", "can", "might", "would"], correctIndex: 0, explanation: { bn: "আইন বা কঠোর বাধ্যবাধকতায় 'must' বসে।", hi: "अनिवार्यता के लिए 'must' आता है।", en: "Rules/obligation take 'must'." } },
      { prompt: "She can ___ three languages.", options: ["speaks", "spoke", "speak", "speaking"], correctIndex: 2, explanation: { bn: "Modal 'can'-এর পরে সবসময় V1 ('speak') বসে।", hi: "Modal के बाद हमेशा V1 आता है।", en: "Modals take base verb 'speak'." } },
      { prompt: "___ I come in, sir?", options: ["May", "Must", "Should", "Will"], correctIndex: 0, explanation: { bn: "ভদ্রভাবে অনুমতি চাইতে 'May' বসে।", hi: "अनुमति के लिए 'May' आता है।", en: "Formal permission uses 'May'." } },
      { prompt: "You look tired; you ___ take some rest.", options: ["should", "may", "did", "were"], correctIndex: 0, explanation: { bn: "উপদেশ দিতে 'should' ব্যবহৃত হয়।", hi: "सलाह के लिए 'should' आता है।", en: "Advice uses 'should'." } },
      { prompt: "It ___ rain later, so take an umbrella.", options: ["might", "must", "did", "does"], correctIndex: 0, explanation: { bn: "সম্ভাবনা বোঝাতে 'might' বসে।", hi: "संभावना के लिए 'might' आता है।", en: "Possibility uses 'might'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which verb form follows a Modal Verb?", options: ["V1 (base)", "V2", "V3", "to + V1"], correctIndex: 0, explanation: { bn: "Modal-এর পরে V1 বসে।", hi: "Modal के बाद V1 आता है।", en: "Base verb V1 follows modals." } },
      { question: "Which modal expresses advice?", options: ["must", "should", "can", "might"], correctIndex: 1, explanation: { bn: "'should' উপদেশ বোঝায়।", hi: "'should' सलाह देता है।", en: "'should' gives advice." } },
      { question: "Choose the correct sentence:", options: ["He can swims.", "He can swim.", "He can to swim.", "He cans swim."], correctIndex: 1, explanation: { bn: "Modal-এর সাথে 's' বা 'to' বসে না।", hi: "Modal के साथ s या to नहीं लगता।", en: "No '-s' or 'to' with modals." } },
      { question: "Which is a polite request?", options: ["Could you help me?", "You must help me.", "You should help me.", "May you help."], correctIndex: 0, explanation: { bn: "'Could you...' ভদ্র অনুরোধ প্রকাশ করে।", hi: "'Could you...' विनम्र अनुरोध है।", en: "'Could you...' is a polite request." } },
      { question: "Which is a primary auxiliary?", options: ["should", "might", "have", "must"], correctIndex: 2, explanation: { bn: "be, do, have হলো Primary Auxiliary।", hi: "'have' Primary Auxiliary है।", en: "'have' is a primary auxiliary." } },
    ], "Auxiliary & Modal Verbs"),
    levels: ["school", "admission", "ielts", "spoken"],
  },

  {
    id: "subject-verb-agreement",
    stageNumber: 2,
    title: "5. Subject-Verb Agreement",
    formula: "Singular Subject → Singular Verb | Plural Subject → Plural Verb",
    overviewRule: {
      bn: "বাক্যের Subject-এর Number ও Person অনুযায়ী Verb বসানোর নিয়মকে Subject-Verb Agreement বলে। Each, every, everyone, nobody, one of থাকলে Verb Singular হয়। 'Either...or / Neither...nor' থাকলে কাছের Subject অনুযায়ী Verb বসে।",
      hi: "Subject के वचन के अनुसार Verb लगाने का नियम Subject-Verb Agreement है। Each, everyone हमेशा एकवचन Verb लेते हैं।",
      en: "Verbs must agree with their subjects in number and person. Indefinite pronouns (each, everyone) take singular verbs; 'either...or' / 'neither...nor' agree with the nearer subject.",
    },
    subTypes: [
      {
        name: "1. Indefinite Pronouns & 'One of the...'",
        rule: {
          bn: "Each, every, everyone, somebody, nobody থাকলে Verb Singular। 'One of the + Plural Noun' থাকলেও Verb সবসময় Singular হয় (কারণ মূল Subject হলো 'One')।",
          hi: "Each, every, everyone और 'One of the + Plural Noun' के साथ हमेशा Singular Verb आता है।",
          en: "Each/every/everyone and 'One of the + plural noun' always take a singular verb.",
        },
        words: ["is", "was", "has", "everyone", "each", "one of the"],
        sentences: ["One of my friends lives in Canada.", "Each student has a dictionary."],
      },
      {
        name: "2. 'Either...or', 'Neither...nor' & 'As well as'",
        rule: {
          bn: "'Either...or / Neither...nor'-এ শেষের/কাছের Subject অনুযায়ী Verb বসে। কিন্তু 'as well as, along with, together with' থাকলে প্রথম Subject অনুযায়ী Verb বসে।",
          hi: "'Neither...nor' में पास वाले Subject के अनुसार, जबकि 'as well as / along with' में पहले Subject के अनुसार Verb लगता है।",
          en: "With 'either...or / neither...nor', match the nearer subject. With 'as well as / along with', match the first subject.",
        },
        words: ["either...or", "neither...nor", "as well as", "along with", "together with"],
        sentences: ["Neither the teacher nor the students were late.", "Rahim, as well as his friends, is coming."],
      },
    ],
    wordBank: [
      "is", "are", "was", "were", "has", "have", "does", "do",
      "each", "every", "everyone", "nobody", "one of", "neither...nor", "either...or", "as well as",
    ],
    sentenceExamples: [
      "Bread and butter is my favorite breakfast.",
      "The quality of these mangoes is very good.",
      "Neither the manager nor the workers were informed.",
      "Fifty miles is a long distance to walk.",
    ],
    sentencePrompts: [
      "Write a sentence starting with 'One of my friends...' and a singular verb.",
      "Write a sentence using 'Each' or 'Everyone' with a singular verb.",
      "Write a sentence using 'Neither...nor' matching the nearer subject.",
      "Write a sentence using 'as well as' or 'along with' matching the first subject.",
      "Write a sentence with a collective noun like 'The team' or 'My family'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "One of the boys ___ absent today.", options: ["are", "were", "is", "have"], correctIndex: 2, explanation: { bn: "'One of the + plural noun' থাকলে Verb Singular ('is') হয়।", hi: "'One of the' के साथ Singular Verb 'is' आता है।", en: "'One' is singular, so use 'is'." } },
      { prompt: "Neither Rina nor her friends ___ present.", options: ["was", "is", "were", "has"], correctIndex: 2, explanation: { bn: "কাছের Subject 'her friends' Plural হওয়ায় 'were' হবে।", hi: "पास वाले Subject 'friends' के अनुसार 'were' आएगा।", en: "Nearer subject 'friends' is plural, taking 'were'." } },
      { prompt: "The teacher, along with his students, ___ going on a trip.", options: ["is", "are", "were", "have"], correctIndex: 0, explanation: { bn: "'along with' থাকলে প্রথম Subject 'The teacher' অনুযায়ী 'is' হয়।", hi: "'along with' में पहले Subject के अनुसार 'is' आएगा।", en: "Match the first subject 'The teacher' -> 'is'." } },
      { prompt: "Slow and steady ___ the race.", options: ["win", "wins", "winning", "have won"], correctIndex: 1, explanation: { bn: "একটি একক ধারণা বোঝালে Singular Verb 'wins' বসে।", hi: "एक विचार होने के कारण 'wins' सही है।", en: "Single idea takes singular 'wins'." } },
      { prompt: "Everyone ___ to be successful.", options: ["want", "wants", "are wanting", "were wanting"], correctIndex: 1, explanation: { bn: "'Everyone' Singular হওয়ায় 'wants' হবে।", hi: "'Everyone' एकवचन है, इसलिए 'wants' आएगा।", en: "'Everyone' takes singular 'wants'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Choose the correct verb: 'Each of the girls ___ a prize.'", options: ["get", "gets", "are getting", "were getting"], correctIndex: 1, explanation: { bn: "'Each' Singular হওয়ায় 'gets' বসবে।", hi: "'Each' एकवचन है।", en: "'Each' takes singular 'gets'." } },
      { question: "'The news ___ true.'", options: ["are", "were", "is", "have"], correctIndex: 2, explanation: { bn: "'news' দেখতে plural মনে হলেও এটি Singular Uncountable Noun।", hi: "'news' हमेशा एकवचन होता है।", en: "'news' is singular and takes 'is'." } },
      { question: "'Mathematics ___ my favorite subject.'", options: ["is", "are", "were", "have"], correctIndex: 0, explanation: { bn: "বিষয়ের নাম (Mathematics, Physics) Singular হয়।", hi: "विषय का नाम एकवचन होता है।", en: "Subject names take singular 'is'." } },
      { question: "'Either you or he ___ responsible.'", options: ["are", "were", "is", "have"], correctIndex: 2, explanation: { bn: "কাছের Subject 'he' অনুযায়ী 'is' বসবে।", hi: "'he' के अनुसार 'is' आएगा।", en: "Matches nearer subject 'he'." } },
      { question: "'Two-thirds of the work ___ finished.'", options: ["is", "are", "were", "have"], correctIndex: 0, explanation: { bn: "'work' Uncountable হওয়ায় 'is' বসবে।", hi: "'work' Uncountable है, इसलिए 'is' सही है।", en: "Uncountable 'work' takes 'is'." } },
    ], "Subject-Verb Agreement"),
    levels: ["school", "admission", "ielts"],
  },

  // ================= STAGE 3: SENTENCE BUILDING =================
  {
    id: "phrase-and-clause",
    stageNumber: 3,
    title: "1. Phrase & Clause",
    formula: "Phrase (No Sub+Verb) | Clause (Sub + Finite Verb: Noun, Adjective, Adverb Clause)",
    overviewRule: {
      bn: "Phrase হলো শব্দের সমষ্টি যাতে Subject ও Finite Verb থাকে না (যেমন: in the morning)। আর Clause-এ অবশ্যই একটি Subject ও একটি Finite Verb থাকে। Dependent Clause ৩ প্রকার: Noun Clause, Adjective Clause ও Adverb Clause।",
      hi: "Phrase में Subject+Verb नहीं होते, जबकि Clause में Subject और Finite Verb दोनों होते हैं।",
      en: "A Phrase lacks a subject-verb pair; a Clause has both a subject and a finite verb. Dependent clauses act as Noun, Adjective, or Adverb clauses.",
    },
    subTypes: [
      {
        name: "1. Noun, Adjective & Adverb Clauses",
        rule: {
          bn: "Noun Clause: Subject/Object হিসেবে বসে (What he said is true)। Adjective Clause: Noun-কে বর্ণনা করে (The boy who came...)। Adverb Clause: সময়/কারণ/শর্ত বোঝায় (when I arrived)।",
          hi: "Noun Clause संज्ञा की तरह, Adjective Clause विशेषण की तरह, और Adverb Clause क्रिया-विशेषण की तरह काम करता है।",
          en: "Noun clauses act as nouns; Adjective clauses modify nouns (who/which/that); Adverb clauses show time/reason/condition.",
        },
        words: ["in the morning", "a man of letters", "what you said", "who helped me", "when it rained"],
        sentences: ["What she told me is a secret. (Noun)", "The pen that I bought is smooth. (Adjective)"],
      },
    ],
    wordBank: [
      "in the morning", "on the table", "at the station", "for a while",
      "who", "which", "that", "what", "when", "where", "because", "although", "if",
    ],
    sentenceExamples: [
      "Phrase: Walking in the park is refreshing.",
      "Noun Clause: I know that he is honest.",
      "Adjective Clause: The book which you lent me was great.",
      "Adverb Clause: Call me when you reach home.",
    ],
    sentencePrompts: [
      "Write a sentence starting with a Prepositional Phrase (e.g., In the morning...).",
      "Write a sentence with a Noun Clause using 'that' or 'what'.",
      "Write a sentence with an Adjective Clause using 'who' or 'which'.",
      "Write a sentence with an Adverb Clause of time using 'when' or 'before'.",
      "Write a sentence with an Adverb Clause of reason using 'because'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "___ you said surprised everyone.", options: ["What", "Who", "Which", "Where"], correctIndex: 0, explanation: { bn: "Noun Clause-এর Subject হিসেবে 'What' বসে।", hi: "Noun Clause के Subject में 'What' आता है।", en: "'What you said' functions as a Noun Clause." } },
      { prompt: "The man ___ lives next door is a doctor.", options: ["which", "who", "what", "where"], correctIndex: 1, explanation: { bn: "ব্যক্তির জন্য Adjective Clause-এ 'who' বসে।", hi: "व्यक्ति के लिए 'who' आता है।", en: "'who' introduces an adjective clause for people." } },
      { prompt: "'In the evening' is a ___.", options: ["Clause", "Phrase", "Sentence", "Verb"], correctIndex: 1, explanation: { bn: "এতে কোনো Subject বা Finite Verb নেই, তাই Phrase।", hi: "इसमें Subject+Verb नहीं है, इसलिए Phrase है।", en: "No subject-verb pair = Phrase." } },
      { prompt: "I stayed home ___ it was raining.", options: ["who", "because", "which", "what"], correctIndex: 1, explanation: { bn: "কারণ বোঝাতে Adverb Clause 'because' দিয়ে শুরু হয়।", hi: "कारण बताने के लिए 'because' आता है।", en: "'because' introduces an adverb clause of reason." } },
      { prompt: "A clause must contain a subject and a ___.", options: ["Preposition", "Finite Verb", "Adjective", "Comma"], correctIndex: 1, explanation: { bn: "Clause-এ অবশ্যই Subject ও Finite Verb থাকতে হবে।", hi: "Clause में Subject और Finite Verb होना जरूरी है।", en: "Every clause has a subject and finite verb." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which is a Phrase?", options: ["He runs fast", "Under the tree", "Because I was late", "She smiled"], correctIndex: 1, explanation: { bn: "'Under the tree'-তে Verb নেই, তাই Phrase।", hi: "'Under the tree' एक Phrase है।", en: "'Under the tree' has no verb." } },
      { question: "In 'I know where he lives', 'where he lives' is:", options: ["Noun Clause", "Adjective Clause", "Phrase", "Interjection"], correctIndex: 0, explanation: { bn: "'know' Verb-এর Object হিসেবে বসায় এটি Noun Clause।", hi: "Object के रूप में यह Noun Clause है।", en: "It acts as the object of 'know' (Noun Clause)." } },
      { question: "An Adjective Clause usually begins with:", options: ["who / which / that", "in / on / at", "wow / alas", "very / too"], correctIndex: 0, explanation: { bn: "Relative Pronoun (who/which/that) দিয়ে Adjective Clause শুরু হয়।", hi: "Adjective Clause 'who/which/that' से शुरू होता है।", en: "Relative pronouns introduce adjective clauses." } },
      { question: "'When the bell rang' is an:", options: ["Independent Clause", "Adverb Clause", "Noun Phrase", "Interjection"], correctIndex: 1, explanation: { bn: "সময় নির্দেশ করছে বলে এটি Adverb Clause।", hi: "समय बताने के कारण Adverb Clause है।", en: "It modifies the main verb with time (Adverb Clause)." } },
      { question: "How many finite verbs does a single clause have?", options: ["Zero", "One", "Three", "Unlimited"], correctIndex: 1, explanation: { bn: "প্রতিটি Clause-এ একটি Finite Verb থাকে।", hi: "एक Clause में एक Finite Verb होता है।", en: "One finite verb per clause." } },
    ], "Phrase & Clause"),
    levels: ["admission", "ielts"],
  },

  {
    id: "simple-compound-complex",
    stageNumber: 3,
    title: "2. Simple, Compound & Complex Sentences",
    formula: "Simple: 1 Ind. Clause | Compound: 2+ Ind. (FANBOYS) | Complex: 1 Ind. + 1+ Dep.",
    overviewRule: {
      bn: "গঠন অনুযায়ী বাক্য ৩ প্রকার: (১) Simple — ১টি মাত্র মূল Clause (১টি Finite Verb), (২) Compound — ২ বা ততোধিক স্বাধীন Clause (and, but, or, so, yet দ্বারা যুক্ত), (৩) Complex — ১টি মূল Clause + অন্তত ১টি নির্ভরশীল Clause (because, although, if, when, who)।",
      hi: "रचना के आधार पर वाक्य 3 प्रकार के हैं: Simple (1 मुख्य Clause), Compound (FANBOYS से जुड़े स्वतंत्र Clause), Complex (1 मुख्य + 1 आश्रित Clause)।",
      en: "Sentences are Simple (1 independent clause), Compound (2+ independent clauses joined by FANBOYS), or Complex (1 independent + 1+ dependent clauses).",
    },
    subTypes: [
      {
        name: "1. Converting Between Simple, Compound & Complex",
        rule: {
          bn: "বৈপরীত্য বোঝাতে: Simple-এ 'In spite of / Despite + V-ing/Noun', Compound-এ 'but / yet', এবং Complex-এ 'Although / Though' বসে।",
          hi: "विरोध दिखाने के लिए: Simple में 'In spite of', Compound में 'but/yet', और Complex में 'Although' लगता है।",
          en: "Contrast patterns: Despite/In spite of (Simple) ↔ but/yet (Compound) ↔ Although/Though (Complex).",
        },
        words: ["Despite", "In spite of", "but", "yet", "so", "although", "because", "since"],
        sentences: ["Despite being tired, he kept working. (Simple)", "Although he was tired, he kept working. (Complex)"],
      },
    ],
    wordBank: ["Despite", "In spite of", "and", "but", "or", "so", "yet", "although", "though", "because", "since", "if", "when"],
    sentenceExamples: [
      "Simple: Working hard, she achieved her goal.",
      "Compound: She worked hard, and she achieved her goal.",
      "Complex: Because she worked hard, she achieved her goal.",
      "Complex: If you read regularly, you will improve.",
    ],
    sentencePrompts: [
      "Write a Simple sentence starting with 'Despite...' or 'In spite of...'.",
      "Write a Compound sentence joining two clauses with 'but' or 'so'.",
      "Write a Complex sentence using 'although' or 'though'.",
      "Write a Complex sentence using 'because' or 'since'.",
      "Write a Complex sentence using 'when' or 'if'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "___ the heavy rain, we reached on time.", options: ["Although", "Despite", "But", "Because"], correctIndex: 1, explanation: { bn: "'the heavy rain' একটি Noun Phrase হওয়ায় Simple বাক্যে 'Despite' বসবে।", hi: "Noun Phrase के पहले 'Despite' आता है।", en: "'Despite' precedes noun phrases in simple sentences." } },
      { prompt: "He studied hard, ___ he failed to pass.", options: ["so", "yet", "because", "although"], correctIndex: 1, explanation: { bn: "Compound বাক্যে বৈপরীত্য বোঝাতে 'yet' বসে।", hi: "Compound में विरोध के लिए 'yet' आता है।", en: "Compound contrast uses 'yet' or 'but'." } },
      { prompt: "___ he was late, he apologized politely.", options: ["Despite", "But", "Since", "So"], correctIndex: 2, explanation: { bn: "কারণ বোঝাতে Complex বাক্যে 'Since' বসে।", hi: "कारण बताने के लिए 'Since' आता है।", en: "'Since' introduces a reason clause." } },
      { prompt: "Which sentence is Simple?", options: ["I came and I saw.", "After finishing work, I left.", "When I finished, I left.", "I finished, so I left."], correctIndex: 1, explanation: { bn: "'After finishing work, I left.'-এ একটি মাত্র Finite Verb ('left') আছে।", hi: "इसमें केवल एक Finite Verb है, इसलिए Simple है।", en: "Only one finite verb ('left') = Simple sentence." } },
      { prompt: "A Compound sentence joins two independent clauses using:", options: ["because", "although", "FANBOYS", "who"], correctIndex: 2, explanation: { bn: "FANBOYS (for, and, nor, but, or, yet, so) Compound বাক্য তৈরি করে।", hi: "FANBOYS से Compound वाक्य बनता है।", en: "FANBOYS join independent clauses." } },
    ]),
    quizQuestions: padQuiz([
      { question: "How many finite verbs are in a Simple sentence?", options: ["One", "Two", "Three", "Zero"], correctIndex: 0, explanation: { bn: "Simple বাক্যে ১টি Finite Verb থাকে।", hi: "Simple वाक्य में 1 Finite Verb होता है।", en: "A simple sentence has 1 finite verb." } },
      { question: "Identify the sentence type: 'She smiled, and everyone felt happy.'", options: ["Simple", "Compound", "Complex", "Optative"], correctIndex: 1, explanation: { bn: "দুটি স্বাধীন Clause 'and' দ্বারা যুক্ত, তাই Compound।", hi: "'and' से जुड़े दो स्वतंत्र Clause = Compound।", en: "Two independent clauses joined by 'and' = Compound." } },
      { question: "Identify: 'If you run, you will catch the bus.'", options: ["Simple", "Compound", "Complex", "Fragment"], correctIndex: 2, explanation: { bn: "'If' দিয়ে একটি নির্ভরশীল Clause থাকায় Complex।", hi: "'If' से आश्रित Clause होने के कारण Complex है।", en: "Contains dependent 'If' clause = Complex." } },
      { question: "Never use 'of' after:", options: ["In spite", "Despite", "Because", "Instead"], correctIndex: 1, explanation: { bn: "'In spite of' হয়, কিন্তু 'Despite'-এর পরে কখনো 'of' বসে না।", hi: "'Despite' के बाद 'of' नहीं लगता।", en: "Say 'Despite', never 'Despite of'." } },
      { question: "Which linker creates a Complex sentence?", options: ["and", "but", "although", "so"], correctIndex: 2, explanation: { bn: "'although' একটি Subordinating Conjunction যা Complex বাক্য তৈরি করে।", hi: "'although' Complex वाक्य बनाता है।", en: "'although' forms a complex sentence." } },
    ], "Simple, Compound & Complex"),
    levels: ["admission", "ielts"],
  },

  {
    id: "conjunctions-linking",
    stageNumber: 3,
    title: "3. Conjunctions & Linking Words",
    formula: "Addition: moreover, furthermore · Contrast: however, nevertheless · Result: therefore, consequently",
    overviewRule: {
      bn: "লেখায় ও বলায় বাক্যগুলোর মধ্যে সুন্দর প্রবাহ (Cohesion) তৈরি করতে Linking Words ব্যবহৃত হয়। যোগ করতে 'moreover/furthermore', বৈপরীত্যে 'however/nevertheless', কারণে 'due to/because', এবং ফলাফলে 'therefore/consequently' ব্যবহার করা হয়।",
      hi: "वाक्यों में प्रवाह लाने के लिए Linking Words का प्रयोग होता है: जोड़ने (moreover), विरोध (however), परिणाम (therefore)।",
      en: "Linking words build coherence across sentences: addition (moreover, furthermore), contrast (however, nevertheless), cause (due to), and result (therefore, consequently).",
    },
    subTypes: [
      {
        name: "1. Academic & IELTS Linking Words",
        rule: {
          bn: "বাক্যের শুরুতে 'However,' বা 'Therefore,' বসালে তার ঠিক পরে কমা (,) দিতে হয়। দুটি সম্পূর্ণ বাক্য একসাথে যুক্ত করতে সেমিকোলন (;) ব্যবহার হয় (যেমন: ...; however, ...)।",
          hi: "वाक्य की शुरुआत में 'However,' या 'Therefore,' के बाद अल्पविराम (,) लगता है।",
          en: "Conjunctive adverbs (however, therefore, moreover) take a comma after them, and a semicolon or period before them.",
        },
        words: ["however", "therefore", "moreover", "furthermore", "consequently", "nevertheless", "in addition", "on the other hand"],
        sentences: ["The plan was risky; however, it succeeded.", "Therefore, we must act immediately."],
      },
    ],
    wordBank: ["however", "therefore", "moreover", "furthermore", "nevertheless", "consequently", "meanwhile", "in addition", "as a result", "on the contrary"],
    sentenceExamples: [
      "Addition: Regular exercise improves health; moreover, it boosts mood.",
      "Contrast: He studied little; nevertheless, he passed.",
      "Result: Costs rose sharply; consequently, prices increased.",
      "Comparison: On the other hand, online learning offers flexibility.",
    ],
    sentencePrompts: [
      "Write a sentence using 'however' to show contrast.",
      "Write a sentence using 'therefore' or 'consequently' to show result.",
      "Write a sentence using 'moreover' or 'furthermore' to add a point.",
      "Write a sentence using 'on the other hand' to compare two ideas.",
      "Write a sentence using 'as a result'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "It was raining; ___, we enjoyed the picnic.", options: ["therefore", "nevertheless", "moreover", "consequently"], correctIndex: 1, explanation: { bn: "বৈপরীত্য বোঝাতে 'nevertheless' (তবুও) বসে।", hi: "विरोध (फिर भी) के लिए 'nevertheless' आता है।", en: "'nevertheless' shows contrast." } },
      { prompt: "He forgot his passport; ___, he missed the flight.", options: ["however", "consequently", "moreover", "meanwhile"], correctIndex: 1, explanation: { bn: "ফলাফল বোঝাতে 'consequently' বসে।", hi: "परिणाम के लिए 'consequently' आता है।", en: "'consequently' shows result." } },
      { prompt: "The hotel is affordable; ___, it is close to the beach.", options: ["however", "moreover", "therefore", "otherwise"], correctIndex: 1, explanation: { bn: "অতিরিক্ত ভালো তথ্য যোগ করতে 'moreover' বসে।", hi: "अतिरिक्त जानकारी जोड़ने के लिए 'moreover' आता है।", en: "'moreover' adds supporting info." } },
      { prompt: "Put a comma after ___ at the start of a sentence.", options: ["And", "However", "But", "Because"], correctIndex: 1, explanation: { bn: "'However,'-এর পরে কমা বসে।", hi: "'However,' के बाद अल्पविराम लगता है।", en: "'However,' takes a comma." } },
      { prompt: "She worked hard; ___, she won first prize.", options: ["as a result", "on the other hand", "despite", "although"], correctIndex: 0, explanation: { bn: "ফলাফলে 'as a result' বসে।", hi: "परिणाम के लिए 'as a result' आता है।", en: "'as a result' expresses outcome." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which linker shows addition?", options: ["However", "Furthermore", "Therefore", "Although"], correctIndex: 1, explanation: { bn: "'Furthermore' অতিরিক্ত তথ্য যোগ করে।", hi: "'Furthermore' जोड़ने का काम करता है।", en: "'Furthermore' adds information." } },
      { question: "Which linker shows contrast?", options: ["Moreover", "Consequently", "However", "In addition"], correctIndex: 2, explanation: { bn: "'However' বৈপরীত্য বোঝায়।", hi: "'However' विरोध दिखाता है।", en: "'However' shows contrast." } },
      { question: "Which linker shows cause/result?", options: ["Therefore", "Nevertheless", "Meanwhile", "Yet"], correctIndex: 0, explanation: { bn: "'Therefore' ফলাফল নির্দেশ করে।", hi: "'Therefore' परिणाम बताता है।", en: "'Therefore' shows result." } },
      { question: "Correct punctuation: 'He was tired ___ he kept going.'", options: [", however,", "; however,", "however", "despite"], correctIndex: 1, explanation: { bn: "দুটি clause যুক্ত করতে '; however,' সঠিক।", hi: "'; however,' सही विराम चिह्न है।", en: "Use semicolon before and comma after 'however'." } },
      { question: "'On the other hand' is used to:", options: ["Give a contrasting viewpoint", "Show time", "End a story", "Ask a question"], correctIndex: 0, explanation: { bn: "ভিন্ন দৃষ্টিভঙ্গি তুলনা করতে ব্যবহৃত হয়।", hi: "विपरीत दृष्टिकोण दिखाने के लिए है।", en: "Compares a contrasting viewpoint." } },
    ], "Linking Words"),
    levels: ["admission", "ielts"],
  },

  // ================= STAGE 4: VERB POWER =================
  {
    id: "non-finite-verbs",
    stageNumber: 4,
    title: "1. Non-finite Verbs (Infinitive, Gerund, Participle)",
    formula: "Infinitive: to + V1 · Gerund: V-ing (Noun) · Participle: V-ing / V3 (Adjective)",
    overviewRule: {
      bn: "যে Verb Subject বা Tense অনুযায়ী বদলায় না তাকে Non-finite Verb বলে। এর ৩টি রূপ: (১) Infinitive (to + V1) — উদ্দেশ্য বোঝায়, (২) Gerund (V-ing) — Noun হিসেবে কাজ করে, (৩) Participle (V-ing বা V3) — Adjective হিসেবে কাজ করে।",
      hi: "Non-finite Verbs Tense से नहीं बदलते: Infinitive (to + V1), Gerund (V-ing संज्ञा के रूप में), Participle (V-ing/V3 विशेषण के रूप में)।",
      en: "Non-finite verbs stay unchanged across tenses: Infinitives (to + V1), Gerunds (V-ing as noun), and Participles (V-ing / V3 as adjective).",
    },
    subTypes: [
      {
        name: "1. Gerund vs Present Participle (both end in -ing)",
        rule: {
          bn: "V-ing যখন Noun-এর কাজ করে (Subject/Object) তখন Gerund (যেমন: Swimming is good)। আর যখন Noun-কে বর্ণনা করে (Adjective) তখন Present Participle (যেমন: a flying bird)।",
          hi: "जब V-ing संज्ञा का काम करे तो Gerund, और जब विशेषण का काम करे तो Participle होता है।",
          en: "Gerund = V-ing acting as a noun; Present Participle = V-ing acting as an adjective.",
        },
        words: ["to learn", "to succeed", "swimming", "reading", "flying", "barking", "broken", "written"],
        sentences: ["Reading books improves knowledge. (Gerund)", "Do not wake a sleeping dog. (Participle)"],
      },
    ],
    wordBank: ["to go", "to learn", "to help", "swimming", "reading", "writing", "enjoying", "avoiding", "flying", "sleeping", "broken", "tired", "excited"],
    sentenceExamples: [
      "Infinitive: She came here to learn English.",
      "Gerund: I enjoy listening to music.",
      "Present Participle: Look at the smiling baby.",
      "Past Participle: He repaired the broken chair.",
    ],
    sentencePrompts: [
      "Write a sentence using an Infinitive ('to + V1') to show purpose.",
      "Write a sentence starting with a Gerund as the Subject (e.g., Walking...).",
      "Write a sentence using a Gerund after 'enjoy', 'avoid', or 'finish'.",
      "Write a sentence using a Present Participle (V-ing) before a Noun.",
      "Write a sentence using a Past Participle (V3) as an adjective (e.g., broken, written).",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "I enjoy ___ short stories.", options: ["to read", "read", "reading", "reads"], correctIndex: 2, explanation: { bn: "'enjoy'-এর পরে সবসময় Gerund (V-ing) বসে।", hi: "'enjoy' के बाद हमेशा Gerund (V-ing) आता है।", en: "'enjoy' is followed by a gerund." } },
      { prompt: "He went to the library ___ a book.", options: ["borrowing", "to borrow", "borrowed", "borrow"], correctIndex: 1, explanation: { bn: "উদ্দেশ্য বোঝাতে Infinitive 'to borrow' বসে।", hi: "उद्देश्य बताने के लिए 'to borrow' आता है।", en: "Purpose takes infinitive 'to borrow'." } },
      { prompt: "We saw a ___ glass on the floor.", options: ["break", "breaking", "broken", "broke"], correctIndex: 2, explanation: { bn: "ভাঙা অবস্থা বোঝাতে Past Participle 'broken' বসে।", hi: "टूटा हुआ दिखाने के लिए 'broken' आता है।", en: "Completed state uses past participle 'broken'." } },
      { prompt: "___ is a great exercise.", options: ["Swim", "Swimming", "Swam", "Swum"], correctIndex: 1, explanation: { bn: "Subject হিসেবে Gerund 'Swimming' বসে।", hi: "Subject के रूप में Gerund 'Swimming' सही है।", en: "Gerund 'Swimming' acts as subject." } },
      { prompt: "Look at the ___ birds in the sky.", options: ["fly", "flew", "flying", "flown"], correctIndex: 2, explanation: { bn: "চলমান অবস্থা বোঝাতে Present Participle 'flying' বসে।", hi: "उड़ते हुए दिखाने के लिए 'flying' आता है।", en: "Active ongoing modifier uses 'flying'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "In 'Walking is good for health', 'Walking' is a:", options: ["Participle", "Gerund", "Infinitive", "Finite Verb"], correctIndex: 1, explanation: { bn: "Subject (Noun) হিসেবে কাজ করায় 'Walking' Gerund।", hi: "Subject होने के कारण 'Walking' Gerund है।", en: "'Walking' acts as a noun subject (Gerund)." } },
      { question: "Which verb takes a Gerund?", options: ["want", "decide", "avoid", "hope"], correctIndex: 2, explanation: { bn: "'avoid'-এর পরে V-ing বসে।", hi: "'avoid' के बाद Gerund आता है।", en: "'avoid' takes a gerund." } },
      { question: "In 'a barking dog', 'barking' is a:", options: ["Gerund", "Present Participle", "Infinitive", "Noun"], correctIndex: 1, explanation: { bn: "'dog' Noun-কে বর্ণনা করায় এটি Present Participle।", hi: "'dog' की विशेषता बताने के कारण Participle है।", en: "'barking' modifies 'dog' (Participle)." } },
      { question: "What is the structure of an Infinitive?", options: ["V-ing", "to + V1", "had + V3", "will + V1"], correctIndex: 1, explanation: { bn: "to + V1 হলো Infinitive।", hi: "to + V1 Infinitive है।", en: "Infinitive = to + V1." } },
      { question: "Choose the correct sentence:", options: ["I decided going.", "I decided to go.", "I enjoy to swim.", "She avoided to talk."], correctIndex: 1, explanation: { bn: "'decide'-এর পরে Infinitive ('to go') বসে।", hi: "'decide' के बाद 'to go' आता है।", en: "'decide' takes an infinitive." } },
    ], "Non-finite Verbs"),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "right-form-of-verb",
    stageNumber: 4,
    title: "2. Right Form of Verb (Exam Rules)",
    formula: "look forward to / with a view to + V-ing | It is high time + Sub + V2 | lest + Sub + should + V1",
    overviewRule: {
      bn: "SSC, HSC ও Admission পরীক্ষার সবচেয়ে গুরুত্বপূর্ণ টপিক হলো Right Form of Verb। এখানে নির্দিষ্ট কিছু phrase ও structure-এর পরে Verb-এর কোন ফর্ম (V1, V2, V3, V-ing) বসবে তা জানা আবশ্যক।",
      hi: "परीक्षाओं में Right Form of Verb सबसे महत्वपूर्ण है — कुछ विशेष वाक्यांशों के बाद निश्चित Verb रूप आते हैं।",
      en: "Right Form of Verb tests exact verb forms after triggers like 'look forward to', 'with a view to', 'It is high time', 'lest', and passive contexts.",
    },
    subTypes: [
      {
        name: "1. High-Frequency Exam Triggers",
        rule: {
          bn: "(১) look forward to / with a view to / addicted to / mind / worth + V-ing। (২) It is high time + Subject + V2। (৩) Walk fast lest you should miss... (lest-এর পর should + V1)। (৪) No sooner had...than / Hardly had...when।",
          hi: "look forward to / with a view to + V-ing; It is high time + Sub + V2; lest + Sub + should + V1।",
          en: "Triggers: look forward to + V-ing; It is high time + Sub + V2; lest + Sub + should + V1.",
        },
        words: ["meeting", "buying", "changed", "should miss", "had reached"],
        sentences: ["I am looking forward to meeting you.", "It is high time we stopped wasting time."],
      },
    ],
    wordBank: ["look forward to", "with a view to", "get used to", "mind", "worth", "It is high time", "lest", "No sooner had", "as if", "would rather"],
    sentenceExamples: [
      "He came here with a view to learning computer skills.",
      "Would you mind opening the window?",
      "Study hard lest you should fail in the exam.",
      "It is high time we protected our environment.",
    ],
    sentencePrompts: [
      "Write a sentence using 'look forward to + V-ing'.",
      "Write a sentence using 'with a view to + V-ing'.",
      "Write a sentence using 'It is high time + Subject + V2'.",
      "Write a sentence using 'lest + Subject + should + V1'.",
      "Write a sentence using 'Would you mind + V-ing?'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "I am looking forward to ___ you soon.", options: ["see", "seeing", "saw", "seen"], correctIndex: 1, explanation: { bn: "'look forward to'-এর পরে V-ing বসে।", hi: "'look forward to' के बाद V-ing आता है।", en: "'look forward to' takes V-ing." } },
      { prompt: "It is high time we ___ our bad habits.", options: ["change", "changed", "will change", "changing"], correctIndex: 1, explanation: { bn: "'It is high time + Subject'-এর পরে V2 বসে।", hi: "'It is high time + Sub' के बाद V2 आता है।", en: "Subject after 'It is high time' takes V2." } },
      { prompt: "Walk fast lest you ___ the train.", options: ["miss", "will miss", "should miss", "missed"], correctIndex: 2, explanation: { bn: "'lest'-এর পরে 'should + V1' বসে (এবং not বসে না)।", hi: "'lest' के बाद 'should + V1' आता है।", en: "'lest' takes 'should + V1'." } },
      { prompt: "He went to the shop with a view to ___ a pen.", options: ["buy", "buying", "bought", "buys"], correctIndex: 1, explanation: { bn: "'with a view to'-এর পরে V-ing বসে।", hi: "'with a view to' के बाद V-ing आता है।", en: "'with a view to' takes V-ing." } },
      { prompt: "Would you mind ___ me a favor?", options: ["do", "doing", "did", "to do"], correctIndex: 1, explanation: { bn: "'mind'-এর পরে V-ing বসে।", hi: "'mind' के बाद V-ing आता है।", en: "'Would you mind' takes V-ing." } },
    ]),
    quizQuestions: padQuiz([
      { question: "After 'with a view to', use:", options: ["V1", "V2", "V-ing", "V3"], correctIndex: 2, explanation: { bn: "'with a view to'-এর পরে V-ing বসে।", hi: "V-ing आता है।", en: "Use V-ing." } },
      { question: "'This book is worth ___.'", options: ["read", "to read", "reading", "reads"], correctIndex: 2, explanation: { bn: "'worth'-এর পরে V-ing বসে।", hi: "'worth' के बाद V-ing आता है।", en: "'worth' takes V-ing." } },
      { question: "'No sooner had he arrived ___ the rain started.'", options: ["when", "than", "then", "after"], correctIndex: 1, explanation: { bn: "'No sooner had'-এর সাথে 'than' বসে।", hi: "'No sooner' के साथ 'than' आता है।", en: "'No sooner' pairs with 'than'." } },
      { question: "'lest' already carries a negative meaning, so:", options: ["Never use 'not' after it", "Always use 'not'", "Use V2", "Use V-ing"], correctIndex: 0, explanation: { bn: "'lest'-এর পরে কখনো 'not' বসে না।", hi: "'lest' के बाद 'not' नहीं लगता।", en: "Never put 'not' after 'lest'." } },
      { question: "'Had I the wings of a bird, I ___ fly.'", options: ["will", "would", "can", "shall"], correctIndex: 1, explanation: { bn: "অবাস্তব কল্পনায় 'would + V1' বসে।", hi: "कल्पना में 'would' आता है।", en: "Unreal conditional uses 'would'." } },
    ], "Right Form of Verb"),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "conditionals",
    stageNumber: 4,
    title: "3. Conditionals (Zero, 1st, 2nd, 3rd, Mixed)",
    formula: "0: If+V1, V1 | 1st: If+V1, will+V1 | 2nd: If+V2, would+V1 | 3rd: If+had+V3, would have+V3",
    overviewRule: {
      bn: "শর্তসাপেক্ষ বাক্য (If-clause): Zero (বৈজ্ঞানিক সত্য), First (বাস্তব ভবিষ্যৎ সম্ভাবনা), Second (বর্তমানের অবাস্তব কল্পনা — If + V2/were, would + V1), Third (অতীতের অপূর্ণ শর্ত — If + had + V3, would have + V3), এবং Mixed (অতীত শর্ত + বর্তমান ফল)।",
      hi: "Conditionals: Zero (तथ्य), 1st (संभावना), 2nd (कल्पना: V2/were → would+V1), 3rd (अतीत: had+V3 → would have+V3)।",
      en: "Conditionals express cause-and-effect across reality levels: Zero (facts), 1st (real future), 2nd (unreal present), 3rd (unreal past), and Mixed.",
    },
    subTypes: [
      {
        name: "1. Zero, First & Second Conditionals",
        rule: {
          bn: "Zero: If you heat ice, it melts. First: If it rains, I will stay home. Second: কল্পনায় 'was'-এর বদলে সব Subject-এর সাথে 'were' বসে (If I were a king, I would help everyone)।",
          hi: "Second Conditional में कल्पना के लिए सभी Subjects के साथ 'were' लगता है (If I were...)।",
          en: "Second conditional uses 'were' for all subjects in unreal scenarios ('If I were you...').",
        },
        words: ["if", "melts", "will", "were", "would", "could"],
        sentences: ["If I were you, I would accept the offer.", "If she studies, she will pass."],
      },
      {
        name: "2. Third & Mixed Conditionals",
        rule: {
          bn: "Third: অতীতের ঘটনা বদলানো সম্ভব নয় (If he had studied, he would have passed)। Mixed: অতীতের শর্তের ফল বর্তমানে পড়লে (If I had taken that job, I would be rich now)।",
          hi: "Third Conditional: If + had + V3, would have + V3।",
          en: "Third conditional uses 'had + V3' with 'would have + V3' for unreal past.",
        },
        words: ["had studied", "would have passed", "could have", "might have", "now"],
        sentences: ["If we had left earlier, we would have caught the train.", "If I had slept well, I would feel fresh now."],
      },
    ],
    wordBank: ["if", "unless", "will", "would", "could", "might", "were", "had", "would have", "could have"],
    sentenceExamples: [
      "Zero: If you mix red and white, you get pink.",
      "First: If you practice daily, your English will improve.",
      "Second: If I had a million dollars, I would travel the world.",
      "Third: If she had called me, I would have helped her.",
    ],
    sentencePrompts: [
      "Write a Zero Conditional sentence (scientific/general fact).",
      "Write a First Conditional sentence ('If + V1, ... will + V1').",
      "Write a Second Conditional sentence starting with 'If I were...'.",
      "Write a Third Conditional sentence ('If + had + V3, ... would have + V3').",
      "Write a Mixed Conditional sentence ending with 'now'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "If I ___ a bird, I would fly to you.", options: ["am", "was", "were", "had"], correctIndex: 2, explanation: { bn: "Second Conditional-এ অবাস্তব কল্পনায় 'were' বসে।", hi: "Second Conditional में 'were' आता है।", en: "Unreal conditional uses 'were'." } },
      { prompt: "If you had invited me, I ___ come.", options: ["will", "would", "would have", "had"], correctIndex: 2, explanation: { bn: "Third Conditional-এ 'had + V3'-এর সাথে 'would have + V3' বসে।", hi: "Third Conditional में 'would have + V3' आता है।", en: "Third conditional takes 'would have + V3'." } },
      { prompt: "If you heat water to 100°C, it ___.", options: ["will boiled", "boils", "would boil", "boiled"], correctIndex: 1, explanation: { bn: "বৈজ্ঞানিক সত্য (Zero Conditional) তাই Present Simple 'boils' হবে।", hi: "वैज्ञानिक सत्य में Present Simple 'boils' आता है।", en: "Zero conditional uses Present Simple." } },
      { prompt: "If it rains tomorrow, we ___ cancel the picnic.", options: ["will", "would", "had", "were"], correctIndex: 0, explanation: { bn: "First Conditional-এ 'will' বসে।", hi: "First Conditional में 'will' आता है।", en: "Real future possibility uses 'will'." } },
      { prompt: "___ I known the truth, I would have told you.", options: ["If", "Had", "Were", "Did"], correctIndex: 1, explanation: { bn: "'If I had known'-এর সংক্ষিপ্ত Inverted রূপ হলো 'Had I known'!", hi: "'If I had known' का संक्षिप्त रूप 'Had I known' है।", en: "Inverted 3rd conditional starts with 'Had'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "Which is the 2nd Conditional formula?", options: ["If+V1, will+V1", "If+V2, would+V1", "If+had+V3, would have+V3", "If+V1, V1"], correctIndex: 1, explanation: { bn: "2nd Conditional = If + V2, would + V1।", hi: "If + V2, would + V1 सही है।", en: "2nd conditional = If + V2, would + V1." } },
      { question: "3rd Conditional expresses:", options: ["Facts", "Real future", "Unreal past regrets", "Habits"], correctIndex: 2, explanation: { bn: "অতীতের অবাস্তব বা আফসোসের ঘটনা বোঝায়।", hi: "अतीत के पछतावे को दर्शाता है।", en: "Expresses unreal past situations." } },
      { question: "'If I were you' is an example of:", options: ["Zero", "First", "Second", "Third"], correctIndex: 2, explanation: { bn: "এটি Second Conditional।", hi: "यह Second Conditional है।", en: "Second conditional." } },
      { question: "Complete: 'If she works hard, she ___ succeed.'", options: ["would", "will", "had", "were"], correctIndex: 1, explanation: { bn: "1st Conditional-এ 'will' বসে।", hi: "1st Conditional में 'will' आता है।", en: "1st conditional uses 'will'." } },
      { question: "In 3rd Conditional, the If-clause uses:", options: ["V1", "V2", "had + V3", "will + V1"], correctIndex: 2, explanation: { bn: "3rd Conditional-এর If-clause-এ had + V3 বসে।", hi: "had + V3 आता है।", en: "If + had + V3." } },
    ], "Conditionals"),
    levels: ["school", "admission", "ielts"],
  },

  {
    id: "wish-if-only-would-rather",
    stageNumber: 4,
    title: "4. Wish, If only, As if, Would rather",
    formula: "I wish + Sub + V2/were/had+V3 | Sub + would rather + V1 ... than + V1",
    overviewRule: {
      bn: "বর্তমানের অপূর্ণ ইচ্ছা বোঝাতে 'I wish / If only'-এর পরে V2 বা 'were' বসে। অতীতের আফসোস বোঝাতে 'had + V3' বসে। দুটি কাজের মধ্যে একটি বেছে নিতে 'would rather + V1 ... than + V1' ব্যবহৃত হয়।",
      hi: "वर्तमान की अधूरी इच्छा के लिए 'wish + V2/were' और अतीत के लिए 'had+V3' लगता है। पसंद के लिए 'would rather + V1 than V1' आता है।",
      en: "Use 'wish / if only + V2 (or were)' for present regrets, 'had + V3' for past regrets, 'as if + V2/were' for unreal manner, and 'would rather + V1 than V1' for preference.",
    },
    subTypes: [
      {
        name: "1. Wish / As if & Would rather",
        rule: {
          bn: "Present + as if + Past (V2/were), আর Past + as if + Past Perfect (had + V3)। 'would rather'-এর পরে 'to' বসে না, সরাসরি V1 বসে।",
          hi: "Present + as if + V2/were; Past + as if + had + V3। 'would rather' के बाद 'to' नहीं लगता।",
          en: "Present + as if + V2/were; Past + as if + had + V3. Never use 'to' after 'would rather'.",
        },
        words: ["wish", "if only", "as if", "as though", "would rather", "than", "were"],
        sentences: ["He talks as if he knew everything.", "I would rather walk than wait for the bus."],
      },
    ],
    wordBank: ["wish", "if only", "as if", "as though", "would rather", "had better", "than", "were", "knew", "had studied"],
    sentenceExamples: [
      "Present wish: I wish I lived near the sea.",
      "Past regret: I wish I had saved more money.",
      "As if: She acted as if nothing had happened.",
      "Would rather: I would rather stay home than go out.",
    ],
    sentencePrompts: [
      "Write a present wish starting with 'I wish I were...' or 'I wish I knew...'.",
      "Write a past regret starting with 'I wish I had...'.",
      "Write a sentence using 'If only...'.",
      "Write a sentence using 'as if' or 'as though'.",
      "Write a sentence using 'would rather ... than ...'.",
    ],
    rightWordQuestions: padRightWord([
      { prompt: "I wish I ___ a better memory.", options: ["have", "had", "will have", "having"], correctIndex: 1, explanation: { bn: "বর্তমানের অপূর্ণ ইচ্ছায় 'wish'-এর পরে V2 ('had') বসে।", hi: "'wish' के बाद V2 'had' आता है।", en: "Present wish takes past form 'had'." } },
      { prompt: "He speaks as if he ___ the boss.", options: ["is", "was", "were", "has been"], correctIndex: 2, explanation: { bn: "'as if'-এর পরে অবাস্তব বোঝাতে 'were' বসে।", hi: "'as if' के बाद 'were' आता है।", en: "Unreal comparison uses 'were'." } },
      { prompt: "I would rather ___ tea than coffee.", options: ["to drink", "drink", "drinking", "drank"], correctIndex: 1, explanation: { bn: "'would rather'-এর পরে সরাসরি V1 ('drink') বসে।", hi: "'would rather' के बाद V1 आता है।", en: "'would rather' takes bare infinitive 'drink'." } },
      { prompt: "If only I ___ harder last year!", options: ["study", "studied", "had studied", "will study"], correctIndex: 2, explanation: { bn: "অতীতের ('last year') আফসোসে 'had + V3' বসে।", hi: "अतीत के पछतावे में 'had + V3' आता है।", en: "Past regret takes 'had studied'." } },
      { prompt: "You had better ___ now.", options: ["to leave", "leave", "leaving", "left"], correctIndex: 1, explanation: { bn: "'had better'-এর পরেও V1 ('leave') বসে।", hi: "'had better' के बाद V1 आता है।", en: "'had better' takes base verb 'leave'." } },
    ]),
    quizQuestions: padQuiz([
      { question: "After 'I wish' for a present unreal state, use:", options: ["am/is", "were/V2", "will", "has"], correctIndex: 1, explanation: { bn: "V2 বা were বসে।", hi: "V2 या were लगता है।", en: "Use V2 or were." } },
      { question: "'would rather' is followed by:", options: ["to + V1", "V1", "V-ing", "V3"], correctIndex: 1, explanation: { bn: "সরাসরি V1 বসে।", hi: "सीधे V1 आता है।", en: "Bare V1 follows 'would rather'." } },
      { question: "In 'He talked as if he ___ everything', choose:", options: ["knows", "had known", "will know", "is knowing"], correctIndex: 1, explanation: { bn: "প্রথম অংশ Past ('talked') হওয়ায় পরের অংশ had + V3 হবে।", hi: "पहले Past होने पर 'had known' आता है।", en: "Past main verb + as if takes 'had + V3'." } },
      { question: "'would rather' pairs with:", options: ["then", "than", "to", "from"], correctIndex: 1, explanation: { bn: "তুলনায় 'than' বসে।", hi: "'than' आता है।", en: "'would rather ... than ...'." } },
      { question: "Choose the correct sentence:", options: ["I wish I am rich.", "I wish I were rich.", "I wish I will rich.", "I wish I to be rich."], correctIndex: 1, explanation: { bn: "'I wish I were rich.' সঠিক।", hi: "'I wish I were rich.' सही है।", en: "'I wish I were rich.' is correct." } },
    ], "Wish & Would Rather"),
    levels: ["school", "admission"],
  },
];
