// Phase 2 Milestone 2A: Listening & Recall Exercise Seed Data
// Complies with ECP_Exercises_SRS_Spec.md §4.1, §4.4, §4.5

export interface ListeningQuizQuestion {
  id: string;
  stepSlug: string;
  question: string;
  questionBn: string;
  audioPrompt?: string;
  options: {
    id: string;
    text: string;
    textBn: string;
  }[];
  correctOptionId: string;
  explanationBn: string;
}

export interface CompleteLineExercise {
  id: string;
  stepSlug: string;
  maskedSentence: string;
  fullSentence: string;
  translationBn: string;
  blanks: {
    blankIndex: number;
    options: string[];
    correctAnswer: string;
  }[];
  explanationBn: string;
}

export interface DialogueOrderTurn {
  id: string;
  correctSequence: number;
  speakerName: string;
  speakerRole: string;
  englishText: string;
  translationBn: string;
}

export interface DialogueOrderExercise {
  id: string;
  stepSlug: string;
  title: string;
  titleBn: string;
  shuffledTurns: DialogueOrderTurn[];
}

export interface SentenceBuilderExercise {
  id: string;
  stepSlug: string;
  dialogueLineId?: string;
  promptBn: string;
  fullSentence: string;
  translationBn: string;
  chunks: string[];
  acceptedOrders: string[][];
  explanationBn: string;
}

export interface NicheStepExerciseSet {
  stepSlug: string;
  stepNumber: number;
  listeningQuizzes: ListeningQuizQuestion[];
  completeLines: CompleteLineExercise[];
  dialogueOrder?: DialogueOrderExercise;
  sentenceBuilders?: SentenceBuilderExercise[];
}

export const SEED_EXERCISES_MAP: Record<string, NicheStepExerciseSet> = {
  // Step 01: Hello, and How Much?
  "shopping-money-step-01": {
    stepSlug: "shopping-money-step-01",
    stepNumber: 1,
    listeningQuizzes: [
      {
        id: "sm-01-q1",
        stepSlug: "shopping-money-step-01",
        question: "How much does the customer's bag cost?",
        questionBn: "ক্রেতার পছন্দের ব্যাগটির দাম কত ছিল?",
        audioPrompt: "How much is this bag? It is five hundred taka.",
        options: [
          { id: "a", text: "Three hundred taka", textBn: "তিনশত টাকা" },
          { id: "b", text: "Five hundred taka", textBn: "পাঁচশত টাকা" },
          { id: "c", text: "One thousand taka", textBn: "এক হাজার টাকা" },
        ],
        correctOptionId: "b",
        explanationBn: "সঠিক উত্তর! বিক্রেতা রফি বলেছিল: 'It is five hundred taka.' (এটির দাম পাঁচশো টাকা)।",
      },
      {
        id: "sm-01-q2",
        stepSlug: "shopping-money-step-01",
        question: "How did the shop assistant politely greet the customer?",
        questionBn: "দোকান সহকারী কীভাবে ক্রেতাকে অভিবাদন জানিয়েছিল?",
        audioPrompt: "Hello. Can I help you?",
        options: [
          { id: "a", text: "What do you want?", textBn: "আপনি কী চান?" },
          { id: "b", text: "Hello. Can I help you?", textBn: "নমস্কার, আমি কি সাহায্য করতে পারি?" },
          { id: "c", text: "Buy something please.", textBn: "দয়া করে কিছু কিনুন।" },
        ],
        correctOptionId: "b",
        explanationBn: "ইংরেজি দোকানে 'Can I help you?' হলো দৃষ্টি আকর্ষণ ও সম্মান জানানোর প্রমিত ও বিনম্র শুরু।",
      },
    ],
    completeLines: [
      {
        id: "sm-01-c1",
        stepSlug: "shopping-money-step-01",
        maskedSentence: "Yes. How ___ is this bag?",
        fullSentence: "Yes. How much is this bag?",
        translationBn: "হ্যাঁ। এই ব্যাগটার দাম কত?",
        blanks: [
          {
            blankIndex: 0,
            options: ["much", "many", "price", "cost"],
            correctAnswer: "much",
          },
        ],
        explanationBn: "কোনো পণ্যের দাম জানতে 'How much is...?' প্রশ্ন গঠন ব্যবহৃত হয়। 'How many' গণনাযোগ্য বস্তুর সংখ্যার জন্য বসে।",
      },
      {
        id: "sm-01-c2",
        stepSlug: "shopping-money-step-01",
        maskedSentence: "You are ___.",
        fullSentence: "You are welcome.",
        translationBn: "আপনাকে স্বাগতম।",
        blanks: [
          {
            blankIndex: 0,
            options: ["welcome", "please", "happy", "good"],
            correctAnswer: "welcome",
          },
        ],
        explanationBn: "ধন্যবাদ (Thank you)-এর জবাবে বিনম্র প্রমিত উত্তর হলো 'You are welcome'।",
      },
    ],
    sentenceBuilders: [
      {
        id: "sm-01-sb1",
        stepSlug: "shopping-money-step-01",
        promptBn: "এই ব্যাগটার দাম কত?",
        fullSentence: "How much is this bag?",
        translationBn: "এই ব্যাগটার দাম কত?",
        chunks: ["How much", "is", "this bag?"],
        acceptedOrders: [
          ["How much", "is", "this bag?"]
        ],
        explanationBn: "দামের ক্ষেত্রে প্রশ্ন তৈরি করার নিয়ম: 'How much' + সাহায্যকারী ক্রিয়া ('is') + উদ্দেশ্য ('this bag?')।",
      },
      {
        id: "sm-01-sb2",
        stepSlug: "shopping-money-step-01",
        promptBn: "নমস্কার, আমি কি সাহায্য করতে পারি?",
        fullSentence: "Hello. Can I help you?",
        translationBn: "নমস্কার, আমি কি সাহায্য করতে পারি?",
        chunks: ["Hello.", "Can I", "help you?"],
        acceptedOrders: [
          ["Hello.", "Can I", "help you?"]
        ],
        explanationBn: "দোকানে অভিবাদন জানাতে প্রথমে 'Hello.' এরপর প্রস্তাবসূচক প্রশ্ন 'Can I help you?' ব্যবহৃত হয়।",
      },
    ],
    dialogueOrder: {
      id: "sm-01-order",
      stepSlug: "shopping-money-step-01",
      title: "Arrange the Shopping Greeting",
      titleBn: "সংলাপটি সঠিক ক্রমানুসারে সাজান",
      shuffledTurns: [
        {
          id: "turn-3",
          correctSequence: 3,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "It is five hundred taka.",
          translationBn: "এটির দাম পাঁচশো টাকা।",
        },
        {
          id: "turn-1",
          correctSequence: 1,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "Hello. Can I help you?",
          translationBn: "নমস্কার। আমি কি আপনাকে সাহায্য করতে পারি?",
        },
        {
          id: "turn-4",
          correctSequence: 4,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Okay. Thank you.",
          translationBn: "ঠিক আছে। ধন্যবাদ।",
        },
        {
          id: "turn-2",
          correctSequence: 2,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Yes. How much is this bag?",
          translationBn: "হ্যাঁ। এই ব্যাগটার দাম কত?",
        },
      ],
    },
  },

  // Step 02: This One or That One?
  "shopping-money-step-02": {
    stepSlug: "shopping-money-step-02",
    stepNumber: 2,
    listeningQuizzes: [
      {
        id: "sm-02-q1",
        stepSlug: "shopping-money-step-02",
        question: "What size of shirt is Nadia looking at?",
        questionBn: "নাদিয়া যে শার্টটি দেখেছিল সেটার সাইজ কী ছিল?",
        audioPrompt: "What size is it? It is medium.",
        options: [
          { id: "a", text: "Small", textBn: "ছোট" },
          { id: "b", text: "Medium", textBn: "মিডিয়াম" },
          { id: "c", text: "Extra Large", textBn: "এক্সট্রা লার্জ" },
        ],
        correctOptionId: "b",
        explanationBn: "সঠিক! বিক্রেতা বলেছিল: 'It is medium. Here you are.'",
      },
      {
        id: "sm-02-q2",
        stepSlug: "shopping-money-step-02",
        question: "Which color did Nadia ask for?",
        questionBn: "নাদিয়া কোন রঙের শার্টটি চেয়েছিল?",
        audioPrompt: "Thanks. Do you have it in blue?",
        options: [
          { id: "a", text: "Red", textBn: "লাল" },
          { id: "b", text: "Blue", textBn: "নীল" },
          { id: "c", text: "Green", textBn: "সবুজ" },
        ],
        correctOptionId: "b",
        explanationBn: "নাদিয়া জিজ্ঞেস করেছিল: 'Do you have it in blue?' (এটা কি নীল রঙে আছে?)।",
      },
    ],
    completeLines: [
      {
        id: "sm-02-c1",
        stepSlug: "shopping-money-step-02",
        maskedSentence: "Yes, ___ are the blue ones.",
        fullSentence: "Yes, these are the blue ones.",
        translationBn: "হ্যাঁ, এগুলো নীল রঙের।",
        blanks: [
          {
            blankIndex: 0,
            options: ["these", "this", "that", "those"],
            correctAnswer: "these",
          },
        ],
        explanationBn: "কাছের একাধিক বহুবচন বস্তুর ক্ষেত্রে 'these' নির্দেশক সর্বনাম বসে।",
      },
    ],
    sentenceBuilders: [
      {
        id: "sm-02-sb1",
        stepSlug: "shopping-money-step-02",
        promptBn: "আপনার কাছে কি এটা নীল রঙের আছে?",
        fullSentence: "Do you have it in blue?",
        translationBn: "আপনার কাছে কি এটা নীল রঙের আছে?",
        chunks: ["Do you", "have it", "in blue?"],
        acceptedOrders: [
          ["Do you", "have it", "in blue?"]
        ],
        explanationBn: "রং জানতে প্রশ্ন করার নিয়ম: 'Do you have it' + 'in [color]?'।",
      },
    ],
    dialogueOrder: {
      id: "sm-02-order",
      stepSlug: "shopping-money-step-02",
      title: "Arrange the Size & Color Inquiry",
      titleBn: "সাইজ ও রঙের অনুসন্ধান সঠিকভাবে সাজান",
      shuffledTurns: [
        {
          id: "sm02-turn-3",
          correctSequence: 3,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Thanks. Do you have it in blue?",
          translationBn: "ধন্যবাদ। এটা কি নীল রঙে আছে?",
        },
        {
          id: "sm02-turn-1",
          correctSequence: 1,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "I want this shirt. What size is it?",
          translationBn: "আমি এই শার্টটা চাই। এটার সাইজ কত?",
        },
        {
          id: "sm02-turn-5",
          correctSequence: 5,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Perfect. I'll take that one.",
          translationBn: "চমৎকার। আমি ওটাই নেব।",
        },
        {
          id: "sm02-turn-2",
          correctSequence: 2,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "It is medium. Here you are.",
          translationBn: "এটা মিডিয়াম সাইজ। এই নিন।",
        },
        {
          id: "sm02-turn-4",
          correctSequence: 4,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "Yes, these are the blue ones.",
          translationBn: "হ্যাঁ, এগুলো নীল রঙের।",
        },
      ],
    },
  },

  // Step 03: Cash or Card?
  "shopping-money-step-03": {
    stepSlug: "shopping-money-step-03",
    stepNumber: 3,
    listeningQuizzes: [
      {
        id: "sm-03-q1",
        stepSlug: "shopping-money-step-03",
        question: "How did Nadia want to pay her bill?",
        questionBn: "নাদিয়া কীভাবে বিল পরিশোধ করতে চেয়েছিল?",
        audioPrompt: "Can I pay by card? Sure. Tap it here.",
        options: [
          { id: "a", text: "By cash only", textBn: "শুধু নগদে" },
          { id: "b", text: "By card", textBn: "কার্ডের মাধ্যমে" },
          { id: "c", text: "By bank cheque", textBn: "ব্যাংক চেকে" },
        ],
        correctOptionId: "b",
        explanationBn: "নাদিয়া বলেছিল: 'Can I pay by card?' এবং রফি কার্ড ট্যাপ করতে বলেছিল।",
      },
    ],
    completeLines: [
      {
        id: "sm-03-c1",
        stepSlug: "shopping-money-step-03",
        maskedSentence: "Here you are. Keep the ___.",
        fullSentence: "Here you are. Keep the change.",
        translationBn: "এই নিন। বাকি টাকা রাখুন।",
        blanks: [
          {
            blankIndex: 0,
            options: ["change", "money", "card", "bill"],
            correctAnswer: "change",
          },
        ],
        explanationBn: "'Keep the change' একটি বহুল প্রচলিত মার্জিত ইংরেজি প্রকাশভঙ্গি, যার অর্থ বাকি খুচরা টাকা রেখে দিন।",
      },
    ],
    sentenceBuilders: [
      {
        id: "sm-03-sb1",
        stepSlug: "shopping-money-step-03",
        promptBn: "আমি কি কার্ড দিয়ে পরিশোধ করতে পারি?",
        fullSentence: "Can I pay by card?",
        translationBn: "আমি কি কার্ড দিয়ে পরিশোধ করতে পারি?",
        chunks: ["Can I", "pay", "by card?"],
        acceptedOrders: [
          ["Can I", "pay", "by card?"]
        ],
        explanationBn: "পদ্ধতি বোঝাতে 'by' প্রিপজিশন ব্যবহৃত হয়: 'pay by card'।",
      },
      {
        id: "sm-03-sb2",
        stepSlug: "shopping-money-step-03",
        promptBn: "এই নিন। বাকি টাকাটা রেখে দিন।",
        fullSentence: "Here you are. Keep the change.",
        translationBn: "এই নিন। বাকি টাকাটা রেখে দিন।",
        chunks: ["Here you are.", "Keep", "the change."],
        acceptedOrders: [
          ["Here you are.", "Keep", "the change."]
        ],
        explanationBn: "বাকি খুচরা টাকা বকশিশ হিসেবে ছাড়ার জন্য 'Keep the change' বলা হয়।",
      },
    ],
    dialogueOrder: {
      id: "sm-03-order",
      stepSlug: "shopping-money-step-03",
      title: "Arrange Payment & Change Conversation",
      titleBn: "বিল পরিশোধ ও ভাংতি টাকার সংলাপ সাজান",
      shuffledTurns: [
        {
          id: "sm03-turn-2",
          correctSequence: 2,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Can I pay by card?",
          translationBn: "আমি কি কার্ডে পেমেন্ট করতে পারি?",
        },
        {
          id: "sm03-turn-4",
          correctSequence: 4,
          speakerName: "Nadia",
          speakerRole: "Customer",
          englishText: "Here you are. Keep the change.",
          translationBn: "এই নিন। বাকি টাকা রাখুন।",
        },
        {
          id: "sm03-turn-1",
          correctSequence: 1,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "That's six hundred taka in total.",
          translationBn: "মোট ছয়শো টাকা।",
        },
        {
          id: "sm03-turn-3",
          correctSequence: 3,
          speakerName: "Rafi",
          speakerRole: "Shop Assistant",
          englishText: "Sure. Tap it here.",
          translationBn: "অবশ্যই। এখানে ট্যাপ করুন।",
        },
      ],
    },
  },
};

export function getExercisesForStep(stepSlug: string): NicheStepExerciseSet | undefined {
  return SEED_EXERCISES_MAP[stepSlug];
}
