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

export interface NicheStepExerciseSet {
  stepSlug: string;
  stepNumber: number;
  listeningQuizzes: ListeningQuizQuestion[];
  completeLines: CompleteLineExercise[];
  dialogueOrder?: DialogueOrderExercise;
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
  },
};

export function getExercisesForStep(stepSlug: string): NicheStepExerciseSet | undefined {
  return SEED_EXERCISES_MAP[stepSlug];
}
