// Auto-generated from ECP_Conversations_Shopping_Money.md
// Complies with 20-step conversation ladder model (ECP_Conversation_Library_Master.md §2)

export interface LadderSpeaker {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  avatarChar: string;
  colorScheme: "brand" | "accent";
}

export interface LadderDialogueLine {
  id: string;
  sequenceNumber: number;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  englishText: string;
  translationBn: string;
  translationReviewStatus?: "draft" | "in_review" | "approved" | "stale" | "rejected";
  wordHighlights?: string[];
  learningNote?: string;
  audioUrl?: {
    "en-US"?: string;
    "en-GB"?: string;
  };
}

export interface LadderStepItem {
  stepNumber: number;
  stepSlug: string;
  title: string;
  titleBn: string;
  nicheName: string;
  nicheSlug: string;
  linesCount: number;
  level: string;
  cefrGroup: string;
  focus: string;
  speakers: LadderSpeaker[];
  lines: LadderDialogueLine[];
  prevStepSlug?: string;
  nextStepSlug?: string;
}

export const NICHE_01_SHOPPING_MONEY = {
  nicheNumber: 1,
  name: "Shopping & Money",
  nameBn: "কেনাকাটা ও লেনদেন",
  slug: "shopping-money",
  description: "Learn practical English for shopping, asking prices, negotiating discounts, returns, payments, and speaking with shopkeepers.",
  descriptionBn: "দোকানে গিয়ে কথা বলা, পণ্যের দাম ও সাইজ জিজ্ঞেস করা, ছাড় চাওয়া, বিল পেমেন্ট এবং পণ্য ফেরত দেওয়ার বাস্তব কথোপকথন।",
  totalSteps: 20,
  levelRange: "A1 to B2/C1",
  speakers: [
    { id: "rafi", name: "Rafi", nameBn: "রফি", role: "Shop Assistant", roleBn: "দোকান সহকারী" },
    { id: "nadia", name: "Nadia", nameBn: "নাদিয়া", role: "Customer", roleBn: "ক্রেতা" },
    { id: "karim", name: "Karim", nameBn: "করিম", role: "Shop Owner", roleBn: "দোকান মালিক" },
    { id: "mina", name: "Mina", nameBn: "মিনা", role: "Customer", roleBn: "ক্রেতা" },
  ],
};

export const SHOPPING_MONEY_LADDER_STEPS: LadderStepItem[] = [
  {
    "stepNumber": 1,
    "stepSlug": "shopping-money-step-01",
    "title": "Hello, and How Much?",
    "titleBn": "নমস্কার, এটার দাম কত? (Hello, and How Much?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 5,
    "level": "A1",
    "cefrGroup": "A1 Beginner",
    "focus": "greetings, \"Can I help you?\", \"How much is…?\", numbers",
    "speakers": [
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-01-t1",
        "sequenceNumber": 1,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Hello. Can I help you?",
        "translationBn": "নমস্কার। আমি কি আপনাকে সাহায্য করতে পারি?"
      },
      {
        "id": "shopping-money-step-01-t2",
        "sequenceNumber": 2,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes. How much is this bag?",
        "translationBn": "হ্যাঁ। এই ব্যাগটার দাম কত?"
      },
      {
        "id": "shopping-money-step-01-t3",
        "sequenceNumber": 3,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "It is five hundred taka.",
        "translationBn": "এটির দাম পাঁচশো টাকা।"
      },
      {
        "id": "shopping-money-step-01-t4",
        "sequenceNumber": 4,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Okay. Thank you.",
        "translationBn": "ঠিক আছে। ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-01-t5",
        "sequenceNumber": 5,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "You are welcome.",
        "translationBn": "আপনাকে স্বাগতম।"
      }
    ],
    "nextStepSlug": "shopping-money-step-02"
  },
  {
    "stepNumber": 2,
    "stepSlug": "shopping-money-step-02",
    "title": "This One or That One?",
    "titleBn": "এটা না ওটা? সাইজ ও রঙের পছন্দ (This One or That One?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 5,
    "level": "A1",
    "cefrGroup": "A1 Beginner",
    "focus": "this/that/these/those, \"I want…\", colours and sizes",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-02-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I want this shirt. What size is it?",
        "translationBn": "আমি এই শার্টটা চাই। এটার সাইজ কত?"
      },
      {
        "id": "shopping-money-step-02-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "It is medium. Here you are.",
        "translationBn": "এটা মিডিয়াম সাইজ। এই নিন।"
      },
      {
        "id": "shopping-money-step-02-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thanks. Do you have it in blue?",
        "translationBn": "ধন্যবাদ। এটা কি নীল রঙে আছে?"
      },
      {
        "id": "shopping-money-step-02-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, these are the blue ones.",
        "translationBn": "হ্যাঁ, এগুলো নীল রঙের।"
      },
      {
        "id": "shopping-money-step-02-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Perfect. I'll take that one.",
        "translationBn": "চমৎকার। আমি ওটাই নেব।"
      }
    ],
    "prevStepSlug": "shopping-money-step-01",
    "nextStepSlug": "shopping-money-step-03"
  },
  {
    "stepNumber": 3,
    "stepSlug": "shopping-money-step-03",
    "title": "Cash or Card?",
    "titleBn": "নগদ না কার্ডে পেমেন্ট? (Cash or Card?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 6,
    "level": "A1",
    "cefrGroup": "A1 Beginner",
    "focus": "paying — \"cash / card\", \"Here you are\", \"Keep the change\"",
    "speakers": [
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-03-t1",
        "sequenceNumber": 1,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "That's six hundred taka in total.",
        "translationBn": "মোট ছয়শো টাকা।"
      },
      {
        "id": "shopping-money-step-03-t2",
        "sequenceNumber": 2,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Can I pay by card?",
        "translationBn": "আমি কি কার্ডে পেমেন্ট করতে পারি?"
      },
      {
        "id": "shopping-money-step-03-t3",
        "sequenceNumber": 3,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Sure. Tap it here.",
        "translationBn": "অবশ্যই। এখানে ট্যাপ করুন।"
      },
      {
        "id": "shopping-money-step-03-t4",
        "sequenceNumber": 4,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Here you are. Keep the change.",
        "translationBn": "এই নিন। বাকি টাকা রাখুন।"
      },
      {
        "id": "shopping-money-step-03-t5",
        "sequenceNumber": 5,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Thank you very much.",
        "translationBn": "অনেক ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-03-t6",
        "sequenceNumber": 6,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "You're welcome. Have a nice day.",
        "translationBn": "স্বাগতম। ভালো থাকবেন।"
      }
    ],
    "prevStepSlug": "shopping-money-step-02",
    "nextStepSlug": "shopping-money-step-04"
  },
  {
    "stepNumber": 4,
    "stepSlug": "shopping-money-step-04",
    "title": "Do You Have…?",
    "titleBn": "ছোট সাইজ কি আছে? (Do You Have…?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 6,
    "level": "A1+",
    "cefrGroup": "A1 Beginner",
    "focus": "present simple questions and negatives — \"Do you have…?\", \"I don't…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-04-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Excuse me. Do you have a smaller size?",
        "translationBn": "মাফ করবেন। ছোট সাইজ আছে কি?"
      },
      {
        "id": "shopping-money-step-04-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry, we don't have small today.",
        "translationBn": "দুঃখিত, আজ ছোট সাইজ নেই।"
      },
      {
        "id": "shopping-money-step-04-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I don't like the big one. Does this come in black?",
        "translationBn": "আমি বড়টা পছন্দ করছি না। এটা কি কালো রঙে পাওয়া যায়?"
      },
      {
        "id": "shopping-money-step-04-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, we do. Black is very popular.",
        "translationBn": "হ্যাঁ, আছে। কালো রঙটা খুব জনপ্রিয়।"
      },
      {
        "id": "shopping-money-step-04-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Do you accept mobile payment?",
        "translationBn": "আপনারা কি মোবাইল পেমেন্ট নেন?"
      },
      {
        "id": "shopping-money-step-04-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, we accept it. Do you want to pay now?",
        "translationBn": "হ্যাঁ, নিই। এখনই পেমেন্ট করবেন?"
      }
    ],
    "prevStepSlug": "shopping-money-step-03",
    "nextStepSlug": "shopping-money-step-05"
  },
  {
    "stepNumber": 5,
    "stepSlug": "shopping-money-step-05",
    "title": "Is There a Discount?",
    "titleBn": "কোনো ছাড় বা ডিসকাউন্ট আছে কি? (Is There a Discount?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 7,
    "level": "A2",
    "cefrGroup": "A2 Elementary",
    "focus": "present continuous — \"I'm looking for…\"; asking for a discount",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-05-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Hi. I'm looking for a wallet for my brother.",
        "translationBn": "হাই। আমি আমার ভাইয়ের জন্য একটা মানিব্যাগ খুঁজছি।"
      },
      {
        "id": "shopping-money-step-05-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "We have many nice ones. Are you looking for leather?",
        "translationBn": "আমাদের কাছে অনেক সুন্দর ব্যাগ আছে। আপনি কি চামড়ার খুঁজছেন?"
      },
      {
        "id": "shopping-money-step-05-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, leather. Is this one on sale?",
        "translationBn": "হ্যাঁ, চামড়ার। এটা কি ছাড়ে আছে?"
      },
      {
        "id": "shopping-money-step-05-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, it's ten percent off today.",
        "translationBn": "হ্যাঁ, আজ দশ শতাংশ ছাড়।"
      },
      {
        "id": "shopping-money-step-05-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Is there any more discount if I buy two?",
        "translationBn": "আমি দুটো নিলে কি আরও ছাড় পাওয়া যাবে?"
      },
      {
        "id": "shopping-money-step-05-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm checking with the manager. Please wait a moment.",
        "translationBn": "আমি ম্যানেজারের সাথে কথা বলে দেখছি। একটু অপেক্ষা করুন।"
      },
      {
        "id": "shopping-money-step-05-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I'm waiting.",
        "translationBn": "ধন্যবাদ। আমি অপেক্ষা করছি।"
      }
    ],
    "prevStepSlug": "shopping-money-step-04",
    "nextStepSlug": "shopping-money-step-06"
  },
  {
    "stepNumber": 6,
    "stepSlug": "shopping-money-step-06",
    "title": "Could I Return This?",
    "titleBn": "এটা কি ফেরত নেওয়া যাবে? (Could I Return This?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 7,
    "level": "A2",
    "cefrGroup": "A2 Elementary",
    "focus": "\"Can/could I…?\", \"Would you…?\", polite requests",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-06-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Excuse me. Could I return this wallet, please?",
        "translationBn": "মাফ করবেন। আমি কি এই মানিব্যাগটা ফেরত দিতে পারি?"
      },
      {
        "id": "shopping-money-step-06-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. Would you tell me what's wrong with it?",
        "translationBn": "অবশ্যই। সমস্যাটা কী, একটু বলবেন?"
      },
      {
        "id": "shopping-money-step-06-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "The zip doesn't close. I can't use it.",
        "translationBn": "চেইনটা বন্ধ হচ্ছে না। আমি এটা ব্যবহার করতে পারছি না।"
      },
      {
        "id": "shopping-money-step-06-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry about that. Can I see the receipt?",
        "translationBn": "এর জন্য আমি দুঃখিত। রসিদটা কি একটু দেখতে পারি?"
      },
      {
        "id": "shopping-money-step-06-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Here it is. Can I exchange it for another one?",
        "translationBn": "এই যে। এটার বদলে আরেকটা নিতে পারি?"
      },
      {
        "id": "shopping-money-step-06-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, you can. Would you like the same colour?",
        "translationBn": "হ্যাঁ, পারবেন। একই রঙ চান?"
      },
      {
        "id": "shopping-money-step-06-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, the same colour, please.",
        "translationBn": "হ্যাঁ, একই রঙ দিন।"
      }
    ],
    "prevStepSlug": "shopping-money-step-05",
    "nextStepSlug": "shopping-money-step-07"
  },
  {
    "stepNumber": 7,
    "stepSlug": "shopping-money-step-07",
    "title": "It Didn't Work Yesterday",
    "titleBn": "গতকাল এটা কাজ করেনি (It Didn't Work Yesterday)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 8,
    "level": "A2",
    "cefrGroup": "A2 Elementary",
    "focus": "past simple — \"I bought it yesterday.\", \"It didn't work.\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-07-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Hi. I bought this phone charger yesterday.",
        "translationBn": "হাই। আমি গতকাল এই ফোন চার্জারটা কিনেছিলাম।"
      },
      {
        "id": "shopping-money-step-07-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Okay. What happened?",
        "translationBn": "ঠিক আছে। কী হয়েছে?"
      },
      {
        "id": "shopping-money-step-07-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "It didn't work this morning. The light didn't turn on.",
        "translationBn": "আজ সকালে এটা কাজ করেনি। লাইট জ্বলেনি।"
      },
      {
        "id": "shopping-money-step-07-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Did you use it with the cable from the box?",
        "translationBn": "বক্সের কেবল দিয়ে ব্যবহার করেছিলেন?"
      },
      {
        "id": "shopping-money-step-07-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, I used the same cable. I tried it twice.",
        "translationBn": "হ্যাঁ, একই কেবল ব্যবহার করেছি। দুবার চেষ্টা করেছি।"
      },
      {
        "id": "shopping-money-step-07-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I see. Let me check it for you.",
        "translationBn": "বুঝলাম। আমি আপনার জন্য চেক করে দেখি।"
      },
      {
        "id": "shopping-money-step-07-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I paid cash, so I have the receipt.",
        "translationBn": "ধন্যবাদ। আমি ক্যাশে দাম দিয়েছিলাম, তাই আমার কাছে রসিদ আছে।"
      },
      {
        "id": "shopping-money-step-07-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Good. This one is faulty. I'll replace it now.",
        "translationBn": "ভালো। এটা ত্রুটিপূর্ণ। আমি এখনই বদলে দিচ্ছি।"
      }
    ],
    "prevStepSlug": "shopping-money-step-06",
    "nextStepSlug": "shopping-money-step-08"
  },
  {
    "stepNumber": 8,
    "stepSlug": "shopping-money-step-08",
    "title": "Why Do You Want a Refund?",
    "titleBn": "টাকা ফেরত চান কেন? (Why Do You Want a Refund?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 8,
    "level": "A2",
    "cefrGroup": "A2 Elementary",
    "focus": "past simple questions; reasons with \"because\"",
    "speakers": [
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-08-t1",
        "sequenceNumber": 1,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Did you buy this jacket here?",
        "translationBn": "এই জ্যাকেটটা কি এখান থেকে কিনেছিলেন?"
      },
      {
        "id": "shopping-money-step-08-t2",
        "sequenceNumber": 2,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, I bought it last week. Can I get a refund?",
        "translationBn": "হ্যাঁ, গত সপ্তাহে কিনেছিলাম। আমি কি টাকা ফেরত পেতে পারি?"
      },
      {
        "id": "shopping-money-step-08-t3",
        "sequenceNumber": 3,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Sure. Why do you want to return it?",
        "translationBn": "অবশ্যই। কেন ফেরত দিতে চান?"
      },
      {
        "id": "shopping-money-step-08-t4",
        "sequenceNumber": 4,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Because it was too small for me.",
        "translationBn": "কারণ এটা আমার জন্য খুব ছোট ছিল।"
      },
      {
        "id": "shopping-money-step-08-t5",
        "sequenceNumber": 5,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Did you wear it outside?",
        "translationBn": "আপনি কি এটা বাইরে পরেছিলেন?"
      },
      {
        "id": "shopping-money-step-08-t6",
        "sequenceNumber": 6,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "No, I didn't. It still has the tag.",
        "translationBn": "না, পরিনি। এখনো ট্যাগ লাগানো আছে।"
      },
      {
        "id": "shopping-money-step-08-t7",
        "sequenceNumber": 7,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Great. Then a full refund is possible.",
        "translationBn": "চমৎকার। তাহলে পুরো টাকা ফেরত দেওয়া যাবে।"
      },
      {
        "id": "shopping-money-step-08-t8",
        "sequenceNumber": 8,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. How long will it take?",
        "translationBn": "ধন্যবাদ। কত সময় লাগবে?"
      }
    ],
    "prevStepSlug": "shopping-money-step-07",
    "nextStepSlug": "shopping-money-step-09"
  },
  {
    "stepNumber": 9,
    "stepSlug": "shopping-money-step-09",
    "title": "The Cheaper One or the Better One?",
    "titleBn": "কম দামিটা নাকি ভালো মানেরটা? (The Cheaper or Better One?)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 9,
    "level": "A2",
    "cefrGroup": "A2 Elementary",
    "focus": "comparatives and superlatives — \"cheaper\", \"the best\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-09-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'm comparing these two speakers. Which one is cheaper?",
        "translationBn": "আমি এই দুটো স্পিকার তুলনা করছি। কোনটা সস্তা?"
      },
      {
        "id": "shopping-money-step-09-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "This one. It's about two thousand taka less.",
        "translationBn": "এটা। প্রায় দুই হাজার টাকা কম।"
      },
      {
        "id": "shopping-money-step-09-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "And the other one sounds better, doesn't it?",
        "translationBn": "আর ওটার আওয়াজ তো ভালো শোনাচ্ছে, তাই না?"
      },
      {
        "id": "shopping-money-step-09-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, it's louder and the bass is stronger. It's the best one in this shop.",
        "translationBn": "হ্যাঁ, আওয়াজ জোরালো আর বেস বেশি শক্তিশালী। এই দোকানে এটাই সেরা।"
      },
      {
        "id": "shopping-money-step-09-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Is the battery life longer on the expensive one?",
        "translationBn": "দামি ওটার ব্যাটারি কি বেশি সময় চলে?"
      },
      {
        "id": "shopping-money-step-09-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, it lasts a little longer. About twelve hours.",
        "translationBn": "হ্যাঁ, একটু বেশি সময় চলে। প্রায় বারো ঘণ্টা।"
      },
      {
        "id": "shopping-money-step-09-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's more useful for me. I travel a lot.",
        "translationBn": "আমার জন্য সেটাই বেশি কাজের। আমি অনেক ভ্রমণ করি।"
      },
      {
        "id": "shopping-money-step-09-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Then this is the most suitable one for you.",
        "translationBn": "তাহলে আপনার জন্য এটাই সবচেয়ে উপযুক্ত।"
      },
      {
        "id": "shopping-money-step-09-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Okay, I'll take the expensive one. Thanks for your help.",
        "translationBn": "ঠিক আছে, দামিটাই নেব। সাহায্যের জন্য ধন্যবাদ।"
      }
    ],
    "prevStepSlug": "shopping-money-step-08",
    "nextStepSlug": "shopping-money-step-10"
  },
  {
    "stepNumber": 10,
    "stepSlug": "shopping-money-step-10",
    "title": "I'll Wrap It for You",
    "titleBn": "আমি প্যাকেট করে দিচ্ছি (I'll Wrap It for You)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 9,
    "level": "A2+",
    "cefrGroup": "A2 Elementary",
    "focus": "future — \"I'm going to…\", \"It will…\", offers with \"I'll\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-10-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'm going to buy this scarf for my mother. It's her birthday tomorrow.",
        "translationBn": "আমি আমার মায়ের জন্য এই স্কার্ফটা কিনতে যাচ্ছি। কাল তাঁর জন্মদিন।"
      },
      {
        "id": "shopping-money-step-10-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Oh, nice. Do you want me to wrap it?",
        "translationBn": "ওহ, চমৎকার। আপনি কি চান আমি এটা মুড়িয়ে দিই?"
      },
      {
        "id": "shopping-money-step-10-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, please. Will it take long?",
        "translationBn": "হ্যাঁ, দিন। বেশি সময় লাগবে?"
      },
      {
        "id": "shopping-money-step-10-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "No, it'll only take five minutes.",
        "translationBn": "না, মাত্র পাঁচ মিনিট লাগবে।"
      },
      {
        "id": "shopping-money-step-10-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Great. Can I get a gift card too?",
        "translationBn": "দারুণ। একটা গিফট কার্ডও কি পাওয়া যাবে?"
      },
      {
        "id": "shopping-money-step-10-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. I'll write a short message on it, if you like.",
        "translationBn": "অবশ্যই। আপনি চাইলে আমি এতে ছোট একটা বার্তা লিখে দেব।"
      },
      {
        "id": "shopping-money-step-10-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That would be lovely. Thank you.",
        "translationBn": "সেটা তো দারুণ হবে। ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-10-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "It will look beautiful. Shall I put the receipt in the bag?",
        "translationBn": "এটা খুব সুন্দর দেখাবে। রসিদটা কি ব্যাগে রেখে দেব?"
      },
      {
        "id": "shopping-money-step-10-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, please. Thanks again.",
        "translationBn": "হ্যাঁ, দিন। আবারও ধন্যবাদ।"
      }
    ],
    "prevStepSlug": "shopping-money-step-09",
    "nextStepSlug": "shopping-money-step-11"
  },
  {
    "stepNumber": 11,
    "stepSlug": "shopping-money-step-11",
    "title": "I've Never Had This Problem",
    "titleBn": "আগে কখনো এমন সমস্যা হয়নি (I've Never Had This Problem)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 10,
    "level": "B1",
    "cefrGroup": "B1 Intermediate",
    "focus": "present perfect — \"I've never…\", \"Have you got…?\", \"since / for\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-11-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I've been a customer here for three years. I've never had a problem before.",
        "translationBn": "আমি তিন বছর ধরে এখানকার কাস্টমার। আগে কখনো কোনো সমস্যা হয়নি।"
      },
      {
        "id": "shopping-money-step-11-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Thank you for coming back. What has happened this time?",
        "translationBn": "আবার আসার জন্য ধন্যবাদ। এবার কী হয়েছে?"
      },
      {
        "id": "shopping-money-step-11-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I've had this laptop bag for two weeks, and the handle has broken.",
        "translationBn": "আমার এই ল্যাপটপ ব্যাগটা দুই সপ্তাহ ধরে আছে, আর হ্যান্ডেলটা ভেঙে গেছে।"
      },
      {
        "id": "shopping-money-step-11-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm very sorry. Have you tried to repair it?",
        "translationBn": "খুব দুঃখিত। আপনি কি এটা মেরামত করার চেষ্টা করেছেন?"
      },
      {
        "id": "shopping-money-step-11-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "No, I haven't. I've only just noticed it this morning.",
        "translationBn": "না, করিনি। আজ সকালেই মাত্র খেয়াল করেছি।"
      },
      {
        "id": "shopping-money-step-11-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Have you got the receipt with you?",
        "translationBn": "আপনার কাছে কি রসিদ আছে?"
      },
      {
        "id": "shopping-money-step-11-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, I've got it here. Can I have a new bag?",
        "translationBn": "হ্যাঁ, এই যে আছে। আমি কি একটা নতুন ব্যাগ পেতে পারি?"
      },
      {
        "id": "shopping-money-step-11-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Let me check. We have the same model in stock.",
        "translationBn": "দেখি। একই মডেল স্টকে আছে।"
      },
      {
        "id": "shopping-money-step-11-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's a relief. I've been worried since this morning.",
        "translationBn": "এটা তো স্বস্তির খবর। সকাল থেকে আমি চিন্তায় ছিলাম।"
      },
      {
        "id": "shopping-money-step-11-t10",
        "sequenceNumber": 10,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here you are. I'm sorry for the trouble.",
        "translationBn": "এই নিন। ঝামেলার জন্য দুঃখিত।"
      }
    ],
    "prevStepSlug": "shopping-money-step-10",
    "nextStepSlug": "shopping-money-step-12"
  },
  {
    "stepNumber": 12,
    "stepSlug": "shopping-money-step-12",
    "title": "If You Buy Two, You'll Save More",
    "titleBn": "দুটো কিনলে বেশি সাশ্রয় (If You Buy Two, You'll Save More)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 12,
    "level": "B1",
    "cefrGroup": "B1 Intermediate",
    "focus": "first conditional — \"If you buy two, you'll get…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-12-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'd like to buy some notebooks for my office. How much are they?",
        "translationBn": "আমি অফিসের জন্য কিছু নোটবুক কিনতে চাই। এগুলোর দাম কত?"
      },
      {
        "id": "shopping-money-step-12-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "One is two hundred taka. But if you buy five, you'll get a discount.",
        "translationBn": "একটা দুইশো টাকা। কিন্তু পাঁচটা নিলে আপনি ছাড় পাবেন।"
      },
      {
        "id": "shopping-money-step-12-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "How much discount will I get?",
        "translationBn": "কত ছাড় পাব?"
      },
      {
        "id": "shopping-money-step-12-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "If you buy five, you'll pay nine hundred taka in total.",
        "translationBn": "পাঁচটা নিলে মোট নয়শো টাকা দিতে হবে।"
      },
      {
        "id": "shopping-money-step-12-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's good. What if I take ten?",
        "translationBn": "ভালো তো। দশটা নিলে কী হবে?"
      },
      {
        "id": "shopping-money-step-12-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "If you take ten, I'll give you a bigger discount. You'll pay about sixteen hundred.",
        "translationBn": "দশটা নিলে আমি আরও বড় ছাড় দেব। প্রায় ষোলোশো টাকা দিতে হবে।"
      },
      {
        "id": "shopping-money-step-12-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "If I order today, will you deliver them to my office?",
        "translationBn": "আমি আজ অর্ডার করলে কি অফিসে পৌঁছে দেবেন?"
      },
      {
        "id": "shopping-money-step-12-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes. If the address is inside the city, we'll deliver tomorrow.",
        "translationBn": "হ্যাঁ। ঠিকানা শহরের ভেতরে হলে কাল পৌঁছে দেব।"
      },
      {
        "id": "shopping-money-step-12-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Perfect. Can you tell me the total again?",
        "translationBn": "চমৎকার। মোটটা আরেকবার বলবেন?"
      },
      {
        "id": "shopping-money-step-12-t10",
        "sequenceNumber": 10,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. For ten notebooks, it's sixteen hundred taka, with free delivery.",
        "translationBn": "অবশ্যই। দশটা নোটবুকের জন্য ষোলোশো টাকা, ফ্রি ডেলিভারি সহ।"
      },
      {
        "id": "shopping-money-step-12-t11",
        "sequenceNumber": 11,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Okay. I'll take ten. Please send the bill to my email.",
        "translationBn": "ঠিক আছে। দশটাই নেব। বিলটা আমার ইমেইলে পাঠাবেন।"
      },
      {
        "id": "shopping-money-step-12-t12",
        "sequenceNumber": 12,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Sure. I'll send it right away.",
        "translationBn": "অবশ্যই। এখনই পাঠিয়ে দিচ্ছি।"
      }
    ],
    "prevStepSlug": "shopping-money-step-11",
    "nextStepSlug": "shopping-money-step-13"
  },
  {
    "stepNumber": 13,
    "stepSlug": "shopping-money-step-13",
    "title": "I've Been Waiting for Forty Minutes",
    "titleBn": "আমি চল্লিশ মিনিট ধরে অপেক্ষা করছি",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 14,
    "level": "B1",
    "cefrGroup": "B1 Intermediate",
    "focus": "complaints — \"I've been waiting…\", \"I'd like to speak to…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-13-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Excuse me. I've been waiting for forty minutes for my order.",
        "translationBn": "মাফ করবেন। আমি আমার অর্ডারের জন্য চল্লিশ মিনিট ধরে অপেক্ষা করছি।"
      },
      {
        "id": "shopping-money-step-13-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry about the delay. What is your order number?",
        "translationBn": "দেরির জন্য দুঃখিত। আপনার অর্ডার নম্বর কত?"
      },
      {
        "id": "shopping-money-step-13-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "It's 4471. I was told it would be ready in ten minutes.",
        "translationBn": "৪৪৭১। আমাকে বলা হয়েছিল দশ মিনিটের মধ্যে তৈরি হয়ে যাবে।"
      },
      {
        "id": "shopping-money-step-13-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Let me check. Yes, there was a problem with the printer.",
        "translationBn": "দেখি। হ্যাঁ, প্রিন্টারে একটা সমস্যা হয়েছিল।"
      },
      {
        "id": "shopping-money-step-13-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I've been here for a long time. I'd like to speak to the manager, please.",
        "translationBn": "আমি অনেকক্ষণ ধরে এখানে আছি। আমি ম্যানেজারের সাথে কথা বলতে চাই।"
      },
      {
        "id": "shopping-money-step-13-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. He's been dealing with another customer. Please wait one moment.",
        "translationBn": "অবশ্যই। তিনি আরেকজন কাস্টমারের সাথে ব্যস্ত ছিলেন। একটু অপেক্ষা করুন।"
      },
      {
        "id": "shopping-money-step-13-t7",
        "sequenceNumber": 7,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Hello, I'm Karim, the manager. I'm so sorry for the wait.",
        "translationBn": "হ্যালো, আমি করিম, ম্যানেজার। অপেক্ষা করানোর জন্য আমি খুবই দুঃখিত।"
      },
      {
        "id": "shopping-money-step-13-t8",
        "sequenceNumber": 8,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. The order is still not ready. I've already lost my lunch break.",
        "translationBn": "ধন্যবাদ। অর্ডারটা এখনো তৈরি হয়নি। আমার দুপুরের বিরতিও চলে গেছে।"
      },
      {
        "id": "shopping-money-step-13-t9",
        "sequenceNumber": 9,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "I understand. We will give you a discount on this order.",
        "translationBn": "আমি বুঝতে পারছি। এই অর্ডারে আমরা আপনাকে ছাড় দেব।"
      },
      {
        "id": "shopping-money-step-13-t10",
        "sequenceNumber": 10,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's kind. But I need it today, because I'm leaving for the airport tonight.",
        "translationBn": "এটা তো ভালো। কিন্তু আমার এটা আজকেই লাগবে, কারণ আজ রাতে আমি বিমানবন্দরে যাচ্ছি।"
      },
      {
        "id": "shopping-money-step-13-t11",
        "sequenceNumber": 11,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Then I'll print it myself now. Give me two minutes.",
        "translationBn": "তাহলে আমি এখনই নিজে প্রিন্ট করছি। আমাকে দুই মিনিট দিন।"
      },
      {
        "id": "shopping-money-step-13-t12",
        "sequenceNumber": 12,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I appreciate your help.",
        "translationBn": "ধন্যবাদ। আপনাদের সাহায্যের জন্য কৃতজ্ঞ।"
      },
      {
        "id": "shopping-money-step-13-t13",
        "sequenceNumber": 13,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "It's ready now. Please check the pages.",
        "translationBn": "এখন তৈরি। দয়া করে পাতাগুলো দেখে নিন।"
      },
      {
        "id": "shopping-money-step-13-t14",
        "sequenceNumber": 14,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Everything looks correct. Thank you for your patience.",
        "translationBn": "সব ঠিক আছে বলে মনে হচ্ছে। আপনার ধৈর্যের জন্য ধন্যবাদ।"
      }
    ],
    "prevStepSlug": "shopping-money-step-12",
    "nextStepSlug": "shopping-money-step-14"
  },
  {
    "stepNumber": 14,
    "stepSlug": "shopping-money-step-14",
    "title": "If I Were You, I'd Ask for a Receipt",
    "titleBn": "আমি হলে এখনই রসিদ চাইতাম",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 16,
    "level": "B1",
    "cefrGroup": "B1 Intermediate",
    "focus": "second conditional and advice — \"If I were you, I'd…\"",
    "speakers": [
      {
        "id": "mina",
        "name": "Mina",
        "nameBn": "মিনা",
        "role": "customer's friend",
        "roleBn": "ক্রেতা",
        "avatarChar": "M",
        "colorScheme": "accent"
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-14-t1",
        "sequenceNumber": 1,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer's friend",
        "englishText": "Nadia, did you check the price before you paid?",
        "translationBn": "নাদিয়া, পেমেন্ট করার আগে তুমি কি দাম চেক করেছিলে?"
      },
      {
        "id": "shopping-money-step-14-t2",
        "sequenceNumber": 2,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "No, I didn't. Why?",
        "translationBn": "না, করিনি। কেন?"
      },
      {
        "id": "shopping-money-step-14-t3",
        "sequenceNumber": 3,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer's friend",
        "englishText": "The price on the shelf is different from the bill.",
        "translationBn": "তাক-এর দাম আর বিলের দাম আলাদা।"
      },
      {
        "id": "shopping-money-step-14-t4",
        "sequenceNumber": 4,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Oh no. If I had checked, I wouldn't have paid this much.",
        "translationBn": "ওহ না। আমি যদি চেক করতাম, এত টাকা দিতাম না।"
      },
      {
        "id": "shopping-money-step-14-t5",
        "sequenceNumber": 5,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer's friend",
        "englishText": "If I were you, I'd ask for a receipt and talk to them now.",
        "translationBn": "আমি যদি তুমি হতাম, এখনই রসিদ চাইতাম আর ওদের সাথে কথা বলতাম।"
      },
      {
        "id": "shopping-money-step-14-t6",
        "sequenceNumber": 6,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "You're right. Excuse me, this bill doesn't match the price on the shelf.",
        "translationBn": "তুমি ঠিক বলেছ। মাফ করবেন, এই বিলের দাম তাকের দামের সাথে মিলছে না।"
      },
      {
        "id": "shopping-money-step-14-t7",
        "sequenceNumber": 7,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Let me look. Which item is it?",
        "translationBn": "দেখি। কোন জিনিসটা?"
      },
      {
        "id": "shopping-money-step-14-t8",
        "sequenceNumber": 8,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "The green mug. The shelf says three hundred, but I was charged four hundred.",
        "translationBn": "সবুজ মগটা। তাকে লেখা তিনশো, কিন্তু আমার কাছে চার্জ নিয়েছে চারশো।"
      },
      {
        "id": "shopping-money-step-14-t9",
        "sequenceNumber": 9,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry. If the shelf price is correct, I'll give you the difference.",
        "translationBn": "দুঃখিত। তাকের দামটা ঠিক হলে আমি আপনাকে পার্থক্যটা ফেরত দিচ্ছি।"
      },
      {
        "id": "shopping-money-step-14-t10",
        "sequenceNumber": 10,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer's friend",
        "englishText": "If they hadn't offered that, would you have asked for the manager?",
        "translationBn": "ওরা যদি এটা না দিত, তুমি কি ম্যানেজারকে ডাকতে?"
      },
      {
        "id": "shopping-money-step-14-t11",
        "sequenceNumber": 11,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, I would have. I don't like paying more than the price.",
        "translationBn": "হ্যাঁ, ডাকতাম। আমি দামের চেয়ে বেশি দিতে পছন্দ করি না।"
      },
      {
        "id": "shopping-money-step-14-t12",
        "sequenceNumber": 12,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here is one hundred taka back. Sorry again for the mistake.",
        "translationBn": "এই নিন একশো টাকা ফেরত। ভুলের জন্য আবারও দুঃখিত।"
      },
      {
        "id": "shopping-money-step-14-t13",
        "sequenceNumber": 13,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I'm glad we checked.",
        "translationBn": "ধন্যবাদ। আমি খুশি যে আমরা চেক করেছি।"
      },
      {
        "id": "shopping-money-step-14-t14",
        "sequenceNumber": 14,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer's friend",
        "englishText": "If I had been here, I would have noticed it sooner.",
        "translationBn": "আমি যদি এখানে থাকতাম, আরও আগে খেয়াল করতাম।"
      },
      {
        "id": "shopping-money-step-14-t15",
        "sequenceNumber": 15,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Next time, please check the bill before you leave the counter.",
        "translationBn": "পরের বার, কাউন্টার ছাড়ার আগে বিলটা একটু দেখে নেবেন।"
      },
      {
        "id": "shopping-money-step-14-t16",
        "sequenceNumber": 16,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I will definitely do that. Have a good day.",
        "translationBn": "আমি অবশ্যই তা করব। আপনার দিনটি ভালো কাটুক।"
      }
    ],
    "prevStepSlug": "shopping-money-step-13",
    "nextStepSlug": "shopping-money-step-15"
  },
  {
    "stepNumber": 15,
    "stepSlug": "shopping-money-step-15",
    "title": "The Order Arrived in the Wrong Size",
    "titleBn": "ভুল সাইজের পণ্য এসেছে",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 18,
    "level": "B1+",
    "cefrGroup": "B1 Intermediate",
    "focus": "phone and email language; reported speech",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "customer service",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-15-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Hello, this is Nadia. I'm calling about my online order.",
        "translationBn": "হ্যালো, আমি নাদিয়া বলছি। আমার অনলাইন অর্ডার নিয়ে ফোন করছি।"
      },
      {
        "id": "shopping-money-step-15-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "Hello Nadia, how can I help you today?",
        "translationBn": "হ্যালো নাদিয়া, আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
      },
      {
        "id": "shopping-money-step-15-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "The jacket arrived yesterday, but it's the wrong size. I ordered medium.",
        "translationBn": "জ্যাকেটটা গতকাল এসেছে, কিন্তু সাইজ ভুল। আমি মিডিয়াম অর্ডার করেছিলাম।"
      },
      {
        "id": "shopping-money-step-15-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "I'm sorry to hear that. Did you receive a confirmation email?",
        "translationBn": "শুনে খারাপ লাগছে। আপনি কি কনফার্মেশন ইমেইল পেয়েছিলেন?"
      },
      {
        "id": "shopping-money-step-15-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes. It said medium, so I'm sure about it.",
        "translationBn": "হ্যাঁ। সেখানে মিডিয়াম লেখা ছিল, তাই আমি নিশ্চিত।"
      },
      {
        "id": "shopping-money-step-15-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "Thank you. Could you send me a photo of the label?",
        "translationBn": "ধন্যবাদ। লেবেলের একটা ছবি পাঠাতে পারবেন?"
      },
      {
        "id": "shopping-money-step-15-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Sure. I'm sending it now.",
        "translationBn": "অবশ্যই। এখনই পাঠাচ্ছি।"
      },
      {
        "id": "shopping-money-step-15-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "I can see the mistake. The warehouse sent the wrong item.",
        "translationBn": "আমি ভুলটা দেখতে পাচ্ছি। গুদাম থেকে ভুল জিনিস পাঠানো হয়েছে।"
      },
      {
        "id": "shopping-money-step-15-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "So you'll send the correct size?",
        "translationBn": "তাহলে আপনারা সঠিক সাইজটা পাঠাবেন?"
      },
      {
        "id": "shopping-money-step-15-t10",
        "sequenceNumber": 10,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "Yes. I've arranged a replacement. It will arrive in two days.",
        "translationBn": "হ্যাঁ। আমি বদলে দেওয়ার ব্যবস্থা করেছি। দুই দিনের মধ্যে পৌঁছাবে।"
      },
      {
        "id": "shopping-money-step-15-t11",
        "sequenceNumber": 11,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Do I have to send the wrong one back?",
        "translationBn": "ভুলটা কি আমাকে ফেরত পাঠাতে হবে?"
      },
      {
        "id": "shopping-money-step-15-t12",
        "sequenceNumber": 12,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "No, you don't need to. Keep it until the new one arrives, and we'll send a pickup.",
        "translationBn": "না, লাগবে না। নতুনটা না আসা পর্যন্ত রেখে দিন, আর আমরা পিকআপের ব্যবস্থা করব।"
      },
      {
        "id": "shopping-money-step-15-t13",
        "sequenceNumber": 13,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I was told last time that returns take a week. Is that still true?",
        "translationBn": "গত বার আমাকে বলা হয়েছিল ফেরত দিতে এক সপ্তাহ লাগে। এখনো কি সেটাই?"
      },
      {
        "id": "shopping-money-step-15-t14",
        "sequenceNumber": 14,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "Not for this case. Since it's our mistake, the refund is faster.",
        "translationBn": "এই ক্ষেত্রে না। এটা আমাদের ভুল, তাই টাকা ফেরত দ্রুত হবে।"
      },
      {
        "id": "shopping-money-step-15-t15",
        "sequenceNumber": 15,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Good. Can you confirm the new delivery date by email?",
        "translationBn": "ভালো। নতুন ডেলিভারির তারিখটা ইমেইলে নিশ্চিত করতে পারবেন?"
      },
      {
        "id": "shopping-money-step-15-t16",
        "sequenceNumber": 16,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "Yes, I'll email you right after this call.",
        "translationBn": "হ্যাঁ, এই কল শেষ হলেই আপনাকে ইমেইল করব।"
      },
      {
        "id": "shopping-money-step-15-t17",
        "sequenceNumber": 17,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you for handling this so quickly.",
        "translationBn": "এত দ্রুত সমাধান করার জন্য ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-15-t18",
        "sequenceNumber": 18,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "customer service",
        "englishText": "You're welcome. Have a wonderful day.",
        "translationBn": "আপনাকে স্বাগতম। আপনার দিনটি চমৎকার কাটুক।"
      }
    ],
    "prevStepSlug": "shopping-money-step-14",
    "nextStepSlug": "shopping-money-step-16"
  },
  {
    "stepNumber": 16,
    "stepSlug": "shopping-money-step-16",
    "title": "Why I Pay More for Quality",
    "titleBn": "মানসম্মত জিনিসের জন্য কেন বেশি খরচ করব",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 20,
    "level": "B1+",
    "cefrGroup": "B1 Intermediate",
    "focus": "giving opinions and reasons; passive — \"It was made in…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-16-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'm thinking about buying a leather bag. Some are very expensive. Why?",
        "translationBn": "আমি একটা চামড়ার ব্যাগ কেনার কথা ভাবছি। কয়েকটা খুব দামি। কেন?"
      },
      {
        "id": "shopping-money-step-16-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "These are made in Italy, so the leather is much better.",
        "translationBn": "এগুলো ইতালিতে তৈরি, তাই চামড়াটা অনেক ভালো।"
      },
      {
        "id": "shopping-money-step-16-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I think a cheaper one is good enough for daily use.",
        "translationBn": "আমার মনে হয় দৈনন্দিন ব্যবহারের জন্য সস্তাটাই যথেষ্ট।"
      },
      {
        "id": "shopping-money-step-16-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "That's true. But this one was stitched by hand, so it lasts longer.",
        "translationBn": "এটা ঠিক। কিন্তু এটা হাতে সেলাই করা, তাই বেশি দিন টেকে।"
      },
      {
        "id": "shopping-money-step-16-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "How long do they usually last?",
        "translationBn": "এগুলো সাধারণত কত দিন টেকে?"
      },
      {
        "id": "shopping-money-step-16-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Around five years with good care. The cheap ones may need a change in two years.",
        "translationBn": "ভালো যত্ন নিলে প্রায় পাঁচ বছর। সস্তাগুলো দুই বছরের মধ্যে বদলাতে হতে পারে।"
      },
      {
        "id": "shopping-money-step-16-t7",
        "sequenceNumber": 7,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Excuse me, may I join? I think I can explain the difference.",
        "translationBn": "মাফ করবেন, আমি কি যোগ দিতে পারি? আমার মনে হয় আমি পার্থক্যটা বোঝাতে পারব।"
      },
      {
        "id": "shopping-money-step-16-t8",
        "sequenceNumber": 8,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Please do. I'd like to hear the reasons.",
        "translationBn": "অবশ্যই। আমি কারণগুলো শুনতে চাই।"
      },
      {
        "id": "shopping-money-step-16-t9",
        "sequenceNumber": 9,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "The stitching is strong, the zip is metal, and the lining is cotton. It's built to last.",
        "translationBn": "সেলাই শক্ত, চেইন ধাতুর, আর ভেতরের আস্তরণ সুতির। এটা টেকার জন্যই তৈরি।"
      },
      {
        "id": "shopping-money-step-16-t10",
        "sequenceNumber": 10,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That sounds reasonable. But the design is quite simple, isn't it?",
        "translationBn": "কথাটা যুক্তিসঙ্গত। তবে ডিজাইনটা তো বেশ সাধারণ, তাই না?"
      },
      {
        "id": "shopping-money-step-16-t11",
        "sequenceNumber": 11,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Simple is good. I think a simple bag suits almost every outfit.",
        "translationBn": "সাধারণ হওয়াটাই ভালো। আমার মনে হয় সাধারণ ব্যাগ প্রায় যেকোনো পোশাকের সাথেই মানায়।"
      },
      {
        "id": "shopping-money-step-16-t12",
        "sequenceNumber": 12,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I agree with that. Is there any warranty?",
        "translationBn": "আমি একমত। কোনো ওয়ারেন্টি আছে?"
      },
      {
        "id": "shopping-money-step-16-t13",
        "sequenceNumber": 13,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Yes, one year for the zip and stitching. If anything breaks, we repair it.",
        "translationBn": "হ্যাঁ, চেইন আর সেলাইয়ের জন্য এক বছর। কিছু ভাঙলে আমরা মেরামত করে দিই।"
      },
      {
        "id": "shopping-money-step-16-t14",
        "sequenceNumber": 14,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Also, the leather is cleaned and checked before it leaves our shop.",
        "translationBn": "এছাড়া, আমাদের দোকান থেকে বের হওয়ার আগে চামড়াটা পরিষ্কার আর চেক করা হয়।"
      },
      {
        "id": "shopping-money-step-16-t15",
        "sequenceNumber": 15,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's a good point. I feel more confident now.",
        "translationBn": "এটা একটা ভালো কথা। এখন আমার আরও ভরসা হচ্ছে।"
      },
      {
        "id": "shopping-money-step-16-t16",
        "sequenceNumber": 16,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Take your time. There's no pressure to buy today.",
        "translationBn": "ধীরে সুস্থে দেখুন। আজ কেনার কোনো চাপ নেই।"
      },
      {
        "id": "shopping-money-step-16-t17",
        "sequenceNumber": 17,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I think I'll take the one with the metal zip.",
        "translationBn": "ধন্যবাদ। আমার মনে হয় ধাতব চেইনেরটাই নেব।"
      },
      {
        "id": "shopping-money-step-16-t18",
        "sequenceNumber": 18,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Excellent choice. It was a good decision.",
        "translationBn": "চমৎকার পছন্দ। এটা একটা ভালো সিদ্ধান্ত।"
      },
      {
        "id": "shopping-money-step-16-t19",
        "sequenceNumber": 19,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Let me pack it carefully in a dust bag for you.",
        "translationBn": "আমি আপনার জন্য এটি যত্নসহকারে একটি ডাস্ট ব্যাগে প্যাক করে দিচ্ছি।"
      },
      {
        "id": "shopping-money-step-16-t20",
        "sequenceNumber": 20,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That is wonderful, thank you so much.",
        "translationBn": "দারুণ ব্যাপার, আপনাকে অনেক ধন্যবাদ।"
      }
    ],
    "prevStepSlug": "shopping-money-step-15",
    "nextStepSlug": "shopping-money-step-17"
  },
  {
    "stepNumber": 17,
    "stepSlug": "shopping-money-step-17",
    "title": "Our Return Policy",
    "titleBn": "আমাদের পণ্য ফেরত নীতিমালা",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 22,
    "level": "B2",
    "cefrGroup": "B2 Upper-Intermediate",
    "focus": "policies and negotiation; \"You have to…\", \"You don't need to…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-17-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I bought this lamp last month. It's flickering, and I want to return it.",
        "translationBn": "গত মাসে এই বাতিটা কিনেছিলাম। এটা ঝিকমিক করছে, আমি এটা ফেরত দিতে চাই।"
      },
      {
        "id": "shopping-money-step-17-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry to hear that. Do you have the receipt?",
        "translationBn": "শুনে দুঃখিত। আপনার কাছে রসিদ আছে?"
      },
      {
        "id": "shopping-money-step-17-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I have it, but it's on my phone. Is that acceptable?",
        "translationBn": "আছে, কিন্তু ফোনে। এটা কি গ্রহণযোগ্য?"
      },
      {
        "id": "shopping-money-step-17-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, a digital receipt is fine. You have to show the order number too.",
        "translationBn": "হ্যাঁ, ডিজিটাল রসিদ চলবে। অর্ডার নম্বরটাও দেখাতে হবে।"
      },
      {
        "id": "shopping-money-step-17-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Okay. Do I have to keep the box?",
        "translationBn": "ঠিক আছে। বক্সটা কি রাখতে হবে?"
      },
      {
        "id": "shopping-money-step-17-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "You don't need the box, but the item must be in good condition.",
        "translationBn": "বক্সের দরকার নেই, তবে জিনিসটা ভালো অবস্থায় থাকতে হবে।"
      },
      {
        "id": "shopping-money-step-17-t7",
        "sequenceNumber": 7,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Rafi, what's the normal policy for electrical items?",
        "translationBn": "রফি, বৈদ্যুতিক জিনিসের সাধারণ নিয়ম কী?"
      },
      {
        "id": "shopping-money-step-17-t8",
        "sequenceNumber": 8,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "We offer a replacement within seven days, or a refund within fourteen.",
        "translationBn": "সাত দিনের মধ্যে বদলে দেওয়া হয়, অথবা চৌদ্দ দিনের মধ্যে টাকা ফেরত।"
      },
      {
        "id": "shopping-money-step-17-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'd prefer a refund, because I don't want another lamp from the same batch.",
        "translationBn": "আমি টাকা ফেরত চাই, কারণ একই ব্যাচের আরেকটা বাতি আমি চাই না।"
      },
      {
        "id": "shopping-money-step-17-t10",
        "sequenceNumber": 10,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "That's a fair request. But our policy says we must check the wiring first.",
        "translationBn": "এটা ন্যায্য অনুরোধ। কিন্তু আমাদের নিয়ম অনুযায়ী আগে তারের অবস্থা দেখতে হবে।"
      },
      {
        "id": "shopping-money-step-17-t11",
        "sequenceNumber": 11,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "How long will the check take? I'm in a hurry this week.",
        "translationBn": "চেক করতে কত সময় লাগবে? এই সপ্তাহে আমার হাতে সময় কম।"
      },
      {
        "id": "shopping-money-step-17-t12",
        "sequenceNumber": 12,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Usually ten minutes. You don't have to wait here; we can call you.",
        "translationBn": "সাধারণত দশ মিনিট। আপনাকে এখানে অপেক্ষা করতে হবে না, আমরা ফোন করতে পারি।"
      },
      {
        "id": "shopping-money-step-17-t13",
        "sequenceNumber": 13,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That would be helpful. Can you call me on this number?",
        "translationBn": "সেটা তো সাহায্য হবে। এই নম্বরে ফোন করতে পারবেন?"
      },
      {
        "id": "shopping-money-step-17-t14",
        "sequenceNumber": 14,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes. And if the wiring is fine, we'll refund it to the same card.",
        "translationBn": "হ্যাঁ। আর তারের অবস্থা ভালো থাকলে একই কার্ডে টাকা ফেরত দেওয়া হবে।"
      },
      {
        "id": "shopping-money-step-17-t15",
        "sequenceNumber": 15,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Good. Will the money appear immediately?",
        "translationBn": "ভালো। টাকাটা কি সঙ্গে সঙ্গেই দেখা যাবে?"
      },
      {
        "id": "shopping-money-step-17-t16",
        "sequenceNumber": 16,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Usually it takes three to five working days, depending on the bank.",
        "translationBn": "সাধারণত ব্যাংকের উপর নির্ভর করে তিন থেকে পাঁচ কার্যদিবস লাগে।"
      },
      {
        "id": "shopping-money-step-17-t17",
        "sequenceNumber": 17,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I understand. You don't have to explain more. Please go ahead.",
        "translationBn": "আমি বুঝেছি। আর ব্যাখ্যা করতে হবে না। শুরু করুন।"
      },
      {
        "id": "shopping-money-step-17-t18",
        "sequenceNumber": 18,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Thank you for your patience. We'll sort this out today.",
        "translationBn": "ধৈর্যের জন্য ধন্যবাদ। আজকেই এটার সমাধান করব।"
      },
      {
        "id": "shopping-money-step-17-t19",
        "sequenceNumber": 19,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here is the return form. Please sign here.",
        "translationBn": "এই নিন রিটার্ন ফর্ম। এখানে সই করুন।"
      },
      {
        "id": "shopping-money-step-17-t20",
        "sequenceNumber": 20,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Done. Thank you both for your help.",
        "translationBn": "হয়ে গেছে। দুজনকেই সাহায্যের জন্য ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-17-t21",
        "sequenceNumber": 21,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Here is your customer receipt copy. We will call you within twenty minutes.",
        "translationBn": "এই নিন আপনার গ্রাহক রসিদের কপি। আমরা বিশ মিনিটের মধ্যে আপনাকে ফোন করব।"
      },
      {
        "id": "shopping-money-step-17-t22",
        "sequenceNumber": 22,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Perfect. I look forward to your phone call.",
        "translationBn": "চমৎকার। আমি আপনাদের ফোনের অপেক্ষায় থাকব।"
      }
    ],
    "prevStepSlug": "shopping-money-step-16",
    "nextStepSlug": "shopping-money-step-18"
  },
  {
    "stepNumber": 18,
    "stepSlug": "shopping-money-step-18",
    "title": "The Card Was Declined",
    "titleBn": "কার্ড ডিক্লাইন বা বাতিল হয়েছে",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 25,
    "level": "B2",
    "cefrGroup": "B2 Upper-Intermediate",
    "focus": "a complication; past perfect — \"I'd already paid…\"",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-18-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Hi, I'd like to buy these shoes. They're on sale, aren't they?",
        "translationBn": "হাই, এই জুতাটা কিনতে চাই। এটা তো ছাড়ে আছে, তাই না?"
      },
      {
        "id": "shopping-money-step-18-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, they are. That will be three thousand two hundred taka.",
        "translationBn": "হ্যাঁ, আছে। মোট তিন হাজার দুইশো টাকা।"
      },
      {
        "id": "shopping-money-step-18-t3",
        "sequenceNumber": 3,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Here's my card. Oh, wait. It says the payment was declined.",
        "translationBn": "এই নিন আমার কার্ড। ওহ, দাঁড়ান। পেমেন্ট ফেরত এসেছে বলে লেখা।"
      },
      {
        "id": "shopping-money-step-18-t4",
        "sequenceNumber": 4,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "That's strange. Could you try again?",
        "translationBn": "অদ্ভুত। আরেকবার চেষ্টা করবেন?"
      },
      {
        "id": "shopping-money-step-18-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I tried twice already. I think the limit has been reached.",
        "translationBn": "আমি তো আগেই দুবার চেষ্টা করেছি। আমার মনে হয় লিমিট শেষ হয়ে গেছে।"
      },
      {
        "id": "shopping-money-step-18-t6",
        "sequenceNumber": 6,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Can I help? Sometimes the card machine is just slow.",
        "translationBn": "আমি সাহায্য করতে পারি? কখনো কখনো কার্ড মেশিনটা শুধু ধীরে চলে।"
      },
      {
        "id": "shopping-money-step-18-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'd already paid part of it in cash last week. I could pay the rest now.",
        "translationBn": "গত সপ্তাহে আমি আগেই কিছুটা ক্যাশে দিয়েছিলাম। বাকিটা এখন দিতে পারি।"
      },
      {
        "id": "shopping-money-step-18-t8",
        "sequenceNumber": 8,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Do you have that receipt? If you had it on paper, it would help.",
        "translationBn": "ওই রসিদটা আছে? কাগজে থাকলে সাহায্য হতো।"
      },
      {
        "id": "shopping-money-step-18-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I have it on my phone. Here, look at the amount.",
        "translationBn": "ফোনে আছে। এই যে, অঙ্কটা দেখুন।"
      },
      {
        "id": "shopping-money-step-18-t10",
        "sequenceNumber": 10,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "I see. So you'd paid one thousand already. The rest is two thousand two hundred.",
        "translationBn": "বুঝলাম। তাহলে আপনি আগেই এক হাজার দিয়েছেন। বাকি দুই হাজার দুইশো।"
      },
      {
        "id": "shopping-money-step-18-t11",
        "sequenceNumber": 11,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes. And I'm not sure the card will work. Can I pay the rest in cash?",
        "translationBn": "হ্যাঁ। আর কার্ডটা কাজ করবে কি না আমি নিশ্চিত না। বাকিটা ক্যাশে দিতে পারি?"
      },
      {
        "id": "shopping-money-step-18-t12",
        "sequenceNumber": 12,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. Can I see the shoes first? Let me check the size.",
        "translationBn": "অবশ্যই। আগে জুতাটা একটু দেখতে পারি? সাইজটা চেক করি।"
      },
      {
        "id": "shopping-money-step-18-t13",
        "sequenceNumber": 13,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "They're size forty-one. I had tried them on earlier.",
        "translationBn": "সাইজ একচল্লিশ। আমি আগে এগুলো পরে দেখেছিলাম।"
      },
      {
        "id": "shopping-money-step-18-t14",
        "sequenceNumber": 14,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Yes, it's the right size. But one shoe has a small scratch on the side.",
        "translationBn": "হ্যাঁ, সাইজ ঠিক আছে। কিন্তু একটা জুতার পাশে সামান্য দাগ আছে।"
      },
      {
        "id": "shopping-money-step-18-t15",
        "sequenceNumber": 15,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Oh, I didn't notice that. Is there another pair?",
        "translationBn": "ওহ, আমি খেয়াল করিনি। আরেক জোড়া আছে?"
      },
      {
        "id": "shopping-money-step-18-t16",
        "sequenceNumber": 16,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Yes, in the back. Give us a moment.",
        "translationBn": "হ্যাঁ, পেছনে আছে। একটু সময় দিন।"
      },
      {
        "id": "shopping-money-step-18-t17",
        "sequenceNumber": 17,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "While I wait, can I check the warranty? I don't want a problem later.",
        "translationBn": "অপেক্ষার সময় ওয়ারেন্টিটা দেখতে পারি? পরে আমার কোনো সমস্যা চাই না।"
      },
      {
        "id": "shopping-money-step-18-t18",
        "sequenceNumber": 18,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Six months against manufacturing faults. You needn't worry about the sole.",
        "translationBn": "উৎপাদনের ত্রুটির বিরুদ্ধে ছয় মাস। সোল নিয়ে চিন্তা করতে হবে না।"
      },
      {
        "id": "shopping-money-step-18-t19",
        "sequenceNumber": 19,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here is the new pair. Same size, no scratches.",
        "translationBn": "এই নিন নতুন জোড়া। একই সাইজ, কোনো দাগ নেই।"
      },
      {
        "id": "shopping-money-step-18-t20",
        "sequenceNumber": 20,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Perfect. I'll pay the rest in cash now.",
        "translationBn": "চমৎকার। বাকিটা এখনই ক্যাশে দিচ্ছি।"
      },
      {
        "id": "shopping-money-step-18-t21",
        "sequenceNumber": 21,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here's your change, and your bill. Thank you for your patience.",
        "translationBn": "এই নিন ফেরতি টাকা আর বিল। ধৈর্যের জন্য ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-18-t22",
        "sequenceNumber": 22,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you. I'll check my card with the bank later.",
        "translationBn": "ধন্যবাদ। পরে ব্যাংকের সাথে কার্ডটা দেখে নেব।"
      },
      {
        "id": "shopping-money-step-18-t23",
        "sequenceNumber": 23,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Good idea. If the card still fails, come back and we'll help you again.",
        "translationBn": "ভালো বুদ্ধি। কার্ড ঠিক না হলে আবার আসুন, আমরা আবার সাহায্য করব।"
      },
      {
        "id": "shopping-money-step-18-t24",
        "sequenceNumber": 24,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I will. Have a lovely evening.",
        "translationBn": "আসব। সন্ধ্যাটা ভালো কাটুক।"
      },
      {
        "id": "shopping-money-step-18-t25",
        "sequenceNumber": 25,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Thank you Nadia, have a great evening too!",
        "translationBn": "ধন্যবাদ নাদিয়া, আপনার সন্ধ্যাটিও খুব ভালো কাটুক!"
      }
    ],
    "prevStepSlug": "shopping-money-step-17",
    "nextStepSlug": "shopping-money-step-19"
  },
  {
    "stepNumber": 19,
    "stepSlug": "shopping-money-step-19",
    "title": "The Last One on the Shelf",
    "titleBn": "তাকের শেষ পণ্যটি",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 30,
    "level": "B2",
    "cefrGroup": "B2 Upper-Intermediate",
    "focus": "two people with different needs; mixed tenses; softening disagreement",
    "speakers": [
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "mina",
        "name": "Mina",
        "nameBn": "মিনা",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "M",
        "colorScheme": "accent"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-19-t1",
        "sequenceNumber": 1,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Excuse me, is this the last grey jacket in medium?",
        "translationBn": "মাফ করবেন, মিডিয়াম সাইজের শেষ ধূসর জ্যাকেটটা কি এটাই?"
      },
      {
        "id": "shopping-money-step-19-t2",
        "sequenceNumber": 2,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "It is. We've sold almost all of them this week.",
        "translationBn": "জি, এটাই। এই সপ্তাহে প্রায় সবগুলোই বিক্রি হয়ে গেছে।"
      },
      {
        "id": "shopping-money-step-19-t3",
        "sequenceNumber": 3,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Oh, I was going to buy that one! I've been looking for it all morning.",
        "translationBn": "ওহ, আমিও তো ওটাই নিতে যাচ্ছিলাম! সকাল থেকে এটাই খুঁজছি।"
      },
      {
        "id": "shopping-money-step-19-t4",
        "sequenceNumber": 4,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'm sorry, but I picked it up first. I've been holding it for ten minutes.",
        "translationBn": "দুঃখিত, তবে আমি আগে তুলেছি। দশ মিনিট ধরে ধরে আছি।"
      },
      {
        "id": "shopping-money-step-19-t5",
        "sequenceNumber": 5,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I know, but I saw it on the shelf before you came in.",
        "translationBn": "জানি, কিন্তু আপনি আসার আগেই আমি এটা তাকে দেখেছিলাম।"
      },
      {
        "id": "shopping-money-step-19-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Please don't argue. Let me check whether we have another one in the store.",
        "translationBn": "দয়া করে তর্ক করবেন না। দেখি, গুদামে আরেকটা আছে কি না।"
      },
      {
        "id": "shopping-money-step-19-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I really need this one. I'm going to a wedding on Friday.",
        "translationBn": "আমার সত্যিই এটাই লাগবে। শুক্রবার একটা বিয়েতে যাচ্ছি।"
      },
      {
        "id": "shopping-money-step-19-t8",
        "sequenceNumber": 8,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "So am I! I'll wear it there too. It's my cousin's wedding.",
        "translationBn": "আমিও তো! আমিও ওখানে এটা পরব। আমার চাচাতো ভাইয়ের বিয়ে।"
      },
      {
        "id": "shopping-money-step-19-t9",
        "sequenceNumber": 9,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Excuse me, is there a problem? I'm Karim, the owner.",
        "translationBn": "মাফ করবেন, কোনো সমস্যা হয়েছে? আমি করিম, মালিক।"
      },
      {
        "id": "shopping-money-step-19-t10",
        "sequenceNumber": 10,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "We both want this jacket, and there's only one left.",
        "translationBn": "আমরা দুজনেই এই জ্যাকেটটা চাই, আর শুধু একটাই আছে।"
      },
      {
        "id": "shopping-money-step-19-t11",
        "sequenceNumber": 11,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "I understand. This is a difficult situation. Let me think for a moment.",
        "translationBn": "বুঝতে পারছি। এটা কঠিন পরিস্থিতি। একটু ভেবে দেখি।"
      },
      {
        "id": "shopping-money-step-19-t12",
        "sequenceNumber": 12,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "We could check the other branch. It might have stock.",
        "translationBn": "আমরা অন্য শাখাটা দেখতে পারি। সেখানে হয়তো স্টক আছে।"
      },
      {
        "id": "shopping-money-step-19-t13",
        "sequenceNumber": 13,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Good idea. Rafi, can you call the branch? Ask them to hold one.",
        "translationBn": "ভালো প্রস্তাব। রফি, শাখাটায় ফোন করতে পারবে? একটা রেখে দিতে বলো।"
      },
      {
        "id": "shopping-money-step-19-t14",
        "sequenceNumber": 14,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "They say they have one medium, but it's in the blue colour.",
        "translationBn": "ওরা বলছে একটা মিডিয়াম আছে, কিন্তু সেটা নীল রঙের।"
      },
      {
        "id": "shopping-money-step-19-t15",
        "sequenceNumber": 15,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Blue isn't my colour. Could you send the grey one from there?",
        "translationBn": "নীল আমার পছন্দ না। ওখান থেকে ধূসরটা পাঠাতে পারবেন?"
      },
      {
        "id": "shopping-money-step-19-t16",
        "sequenceNumber": 16,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "It takes about two hours to transfer. You'd need to wait until the evening.",
        "translationBn": "ট্রান্সফার করতে প্রায় দুই ঘণ্টা লাগবে। আপনাকে সন্ধ্যা পর্যন্ত অপেক্ষা করতে হবে।"
      },
      {
        "id": "shopping-money-step-19-t17",
        "sequenceNumber": 17,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I can wait. Actually, I could take the blue one if it's cheaper.",
        "translationBn": "আমি অপেক্ষা করতে পারি। আসলে, নীলটা যদি সস্তা হয়, আমি নিতে পারি।"
      },
      {
        "id": "shopping-money-step-19-t18",
        "sequenceNumber": 18,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "It's the same price, I'm afraid. But I can give you ten percent off.",
        "translationBn": "দামটা একই, দুঃখিত। তবে আমি আপনাকে দশ শতাংশ ছাড় দিতে পারি।"
      },
      {
        "id": "shopping-money-step-19-t19",
        "sequenceNumber": 19,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "That's generous. But I really wanted grey. It goes with my shoes.",
        "translationBn": "এটা তো উদারতা। কিন্তু আমি সত্যিই ধূসর চেয়েছিলাম। ওটা আমার জুতোর সাথে মানায়।"
      },
      {
        "id": "shopping-money-step-19-t20",
        "sequenceNumber": 20,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Look, I'm happy to wait for the evening. You could also hold it for me.",
        "translationBn": "দেখুন, আমি সন্ধ্যা পর্যন্ত অপেক্ষা করতে রাজি। আপনি চাইলে আমার জন্য রেখেও দিতে পারেন।"
      },
      {
        "id": "shopping-money-step-19-t21",
        "sequenceNumber": 21,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "What if Nadia takes the grey one from the branch, and Mina takes the blue one here with a discount?",
        "translationBn": "নাদিয়া শাখা থেকে ধূসরটা নেবেন, আর মিনা এখানে নীলটা নেবেন ছাড় সহ, কেমন হয়?"
      },
      {
        "id": "shopping-money-step-19-t22",
        "sequenceNumber": 22,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's not bad. But I'd need to be sure it's the right size at the branch.",
        "translationBn": "এটা খারাপ না। তবে শাখায় সাইজটা ঠিক আছে কি না আমার নিশ্চিত হওয়া দরকার।"
      },
      {
        "id": "shopping-money-step-19-t23",
        "sequenceNumber": 23,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'll confirm it with them right now. One moment, please.",
        "translationBn": "আমি এখনই ওদের সাথে নিশ্চিত করছি। একটু অপেক্ষা করুন।"
      },
      {
        "id": "shopping-money-step-19-t24",
        "sequenceNumber": 24,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Sure. Honestly, I think this is a good compromise.",
        "translationBn": "ঠিক আছে। সত্যি বলতে, আমার মনে হয় এটা একটা ভালো মীমাংসা।"
      },
      {
        "id": "shopping-money-step-19-t25",
        "sequenceNumber": 25,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "They confirmed. The grey one is medium, and it's reserved for you.",
        "translationBn": "ওরা নিশ্চিত করেছে। ধূসরটা মিডিয়াম, আর আপনার জন্য রাখা হয়েছে।"
      },
      {
        "id": "shopping-money-step-19-t26",
        "sequenceNumber": 26,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Thank you so much. And you're very kind, Mina.",
        "translationBn": "অনেক ধন্যবাদ। আর আপনি খুব ভালো, মিনা।"
      },
      {
        "id": "shopping-money-step-19-t27",
        "sequenceNumber": 27,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Thanks. I'd have done the same. Let's both get something nice.",
        "translationBn": "ধন্যবাদ। আমি হলেও একই করতাম। দুজনেই ভালো কিছু নিই।"
      },
      {
        "id": "shopping-money-step-19-t28",
        "sequenceNumber": 28,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Here's the blue one, with the discount included. Thank you both for being patient.",
        "translationBn": "এই নিন ছাড়সহ নীল জ্যাকেট। আপনাদের দুজনেরই ধৈর্য ধরার জন্য অনেক ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-19-t29",
        "sequenceNumber": 29,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Thank you. I'll tell my friends about this shop.",
        "translationBn": "ধন্যবাদ। আমি বন্ধুদের এই দোকানের কথা বলব।"
      },
      {
        "id": "shopping-money-step-19-t30",
        "sequenceNumber": 30,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'll come back on Friday to tell you how the wedding went.",
        "translationBn": "শুক্রবার আবার আসব, বিয়েটা কেমন হলো বলতে।"
      }
    ],
    "prevStepSlug": "shopping-money-step-18",
    "nextStepSlug": "shopping-money-step-20"
  },
  {
    "stepNumber": 20,
    "stepSlug": "shopping-money-step-20",
    "title": "The Shop on Sheikh Mujib Road",
    "titleBn": "শেখ মুজিব রোডের দোকানটি (The Shop on Sheikh Mujib Road — Full Story)",
    "nicheName": "Shopping & Money",
    "nicheSlug": "shopping-money",
    "linesCount": 55,
    "level": "B2/C1",
    "cefrGroup": "C1 Advanced Story",
    "focus": "**story**. A full arc: beginning, problem, attempt, turn, ending. All grammar from steps 1–19 appears naturally.",
    "speakers": [
      {
        "id": "rafi",
        "name": "Rafi",
        "nameBn": "রফি",
        "role": "shop assistant",
        "roleBn": "দোকান সহকারী",
        "avatarChar": "R",
        "colorScheme": "brand"
      },
      {
        "id": "karim",
        "name": "Karim",
        "nameBn": "করিম",
        "role": "shop owner",
        "roleBn": "দোকান মালিক",
        "avatarChar": "K",
        "colorScheme": "brand"
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "nameBn": "নাদিয়া",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "N",
        "colorScheme": "accent"
      },
      {
        "id": "mina",
        "name": "Mina",
        "nameBn": "মিনা",
        "role": "customer",
        "roleBn": "ক্রেতা",
        "avatarChar": "M",
        "colorScheme": "accent"
      }
    ],
    "lines": [
      {
        "id": "shopping-money-step-20-t1",
        "sequenceNumber": 1,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Good morning, everyone. We've been open for a week, and it's been a busy one.",
        "translationBn": "সুপ্রভাত সবাইকে। আমরা এক সপ্তাহ হলো খোলা, আর সপ্তাহটা খুব ব্যস্ত ছিল।"
      },
      {
        "id": "shopping-money-step-20-t2",
        "sequenceNumber": 2,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "It has. When I opened this shop, I never imagined so many people would come on the first day.",
        "translationBn": "ঠিক বলেছ। এই দোকান যখন খুলেছিলাম, প্রথম দিনেই এত মানুষ আসবে আমি কল্পনাও করিনি।"
      },
      {
        "id": "shopping-money-step-20-t3",
        "sequenceNumber": 3,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Still, we've been learning a lot. Last Monday, a customer returned a bag that had been used.",
        "translationBn": "তবু আমরা অনেক কিছু শিখছি। গত সোমবার একজন কাস্টমার একটা ব্যবহার করা ব্যাগ ফেরত দিয়েছিলেন।"
      },
      {
        "id": "shopping-money-step-20-t4",
        "sequenceNumber": 4,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "I remember. We had to decide quickly, and I'm not sure we made the right choice.",
        "translationBn": "মনে আছে। আমাদের দ্রুত সিদ্ধান্ত নিতে হয়েছিল, আর আমি নিশ্চিত না যে ঠিক সিদ্ধান্ত নিয়েছিলাম।"
      },
      {
        "id": "shopping-money-step-20-t5",
        "sequenceNumber": 5,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Excuse me, I'm sorry to interrupt. I've been listening, and I think I know that bag.",
        "translationBn": "মাফ করবেন, বাধা দিচ্ছি বলে দুঃখিত। আমি শুনছিলাম, আর মনে হচ্ছে ব্যাগটা আমি চিনি।"
      },
      {
        "id": "shopping-money-step-20-t6",
        "sequenceNumber": 6,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Really? Do you remember buying it here?",
        "translationBn": "সত্যি? এখান থেকে কেনার কথা মনে আছে?"
      },
      {
        "id": "shopping-money-step-20-t7",
        "sequenceNumber": 7,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I bought one like it last month. It was a gift, and I'd already given it to my sister.",
        "translationBn": "আমি গত মাসে এরকম একটা কিনেছিলাম। ওটা একটা উপহার ছিল, আর আমি আগেই আমার বোনকে দিয়ে দিয়েছিলাম।"
      },
      {
        "id": "shopping-money-step-20-t8",
        "sequenceNumber": 8,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Your sister? Did she have a problem with it?",
        "translationBn": "তোমার বোন? তার কোনো সমস্যা হয়েছিল?"
      },
      {
        "id": "shopping-money-step-20-t9",
        "sequenceNumber": 9,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "She said the strap broke after two weeks. She brought it back, and it was replaced.",
        "translationBn": "সে বলেছিল দুই সপ্তাহ পর স্ট্র্যাপটা ভেঙে গিয়েছিল। সে ফেরত দিয়েছিল, আর বদলে দেওয়া হয়েছিল।"
      },
      {
        "id": "shopping-money-step-20-t10",
        "sequenceNumber": 10,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Oh. Then that might be the same bag. The strap was replaced by our team.",
        "translationBn": "ওহ। তাহলে হয়তো এটাই সেই ব্যাগ। স্ট্র্যাপটা আমাদের টিম বদলেছিল।"
      },
      {
        "id": "shopping-money-step-20-t11",
        "sequenceNumber": 11,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "So the bag came back again, and this time someone used it, and we didn't check it well.",
        "translationBn": "তার মানে ব্যাগটা আবার ফেরত এসেছে, আর এবার কেউ ব্যবহার করেছে, আর আমরা ভালো করে চেক করিনি।"
      },
      {
        "id": "shopping-money-step-20-t12",
        "sequenceNumber": 12,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I didn't mean to cause trouble. I only wanted to help you understand.",
        "translationBn": "আমি ঝামেলা করতে চাইনি। শুধু বোঝাতে চেয়েছিলাম।"
      },
      {
        "id": "shopping-money-step-20-t13",
        "sequenceNumber": 13,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "No, no. You've helped us a lot. Please, sit down. Would you like some tea?",
        "translationBn": "না, না। আপনি আমাদের অনেক সাহায্য করেছেন। বসুন, চা খাবেন?"
      },
      {
        "id": "shopping-money-step-20-t14",
        "sequenceNumber": 14,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I'm also here. I came in for a jacket, but now I'm curious about this story.",
        "translationBn": "আমিও এখানে আছি। একটা জ্যাকেট কিনতে এসেছিলাম, কিন্তু এখন এই গল্পটা জানতে ইচ্ছে করছে।"
      },
      {
        "id": "shopping-money-step-20-t15",
        "sequenceNumber": 15,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Please, tell me. What happened with your jacket?",
        "translationBn": "বলুন। আপনার জ্যাকেটের কী হয়েছে?"
      },
      {
        "id": "shopping-money-step-20-t16",
        "sequenceNumber": 16,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I've been looking for a grey one for weeks. Yesterday I found one, but it was damaged at the collar.",
        "translationBn": "আমি কয়েক সপ্তাহ ধরে একটা ধূসর জ্যাকেট খুঁজছি। গতকাল একটা পেয়েছিলাম, কিন্তু কলারে ক্ষতি ছিল।"
      },
      {
        "id": "shopping-money-step-20-t17",
        "sequenceNumber": 17,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "I'm sorry to hear that. Which shop was it?",
        "translationBn": "শুনে দুঃখিত। কোন দোকান ছিল?"
      },
      {
        "id": "shopping-money-step-20-t18",
        "sequenceNumber": 18,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "A shop on the other side of the city. I was told it had been checked, but it hadn't.",
        "translationBn": "শহরের অন্য পাশের একটা দোকান। আমাকে বলা হয়েছিল চেক করা হয়েছে, কিন্তু হয়নি।"
      },
      {
        "id": "shopping-money-step-20-t19",
        "sequenceNumber": 19,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "That's a lesson for all of us. We should never sell anything we haven't checked ourselves.",
        "translationBn": "এটা আমাদের সবার জন্য শিক্ষা। যা নিজেরা চেক করিনি তা কখনো বিক্রি করা উচিত না।"
      },
      {
        "id": "shopping-money-step-20-t20",
        "sequenceNumber": 20,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I agree. I've learned that a quick look isn't enough. If I had looked more carefully, I wouldn't have bought the wrong one.",
        "translationBn": "আমি একমত। আমি শিখেছি যে শুধু একবার দেখে নিলেই হয় না। আমি যদি আরও ভালো করে দেখতাম, ভুলটা কিনতাম না।"
      },
      {
        "id": "shopping-money-step-20-t21",
        "sequenceNumber": 21,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "So what should we do with the returned bag?",
        "translationBn": "তাহলে ফেরত আসা ব্যাগটা নিয়ে আমরা কী করব?"
      },
      {
        "id": "shopping-money-step-20-t22",
        "sequenceNumber": 22,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "We've been thinking about it. I'd like to repair it properly and sell it as a discounted item, with a clear note.",
        "translationBn": "আমরা এটা নিয়ে ভাবছিলাম। আমি চাই এটা ঠিকভাবে মেরামত করে স্পষ্ট নোটসহ ছাড়ে বিক্রি করা হোক।"
      },
      {
        "id": "shopping-money-step-20-t23",
        "sequenceNumber": 23,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's fair. If you write \"Used once, strap replaced, full warranty for six months\", that sounds completely honest.",
        "translationBn": "এটা ঠিক। আপনি যদি লেখেন \"একবার ব্যবহৃত, স্ট্র্যাপ বদলানো, ছয় মাসের পূর্ণ ওয়ারেন্টি\", তবে এটি সম্পূর্ণ সৎ শোনাবে।"
      },
      {
        "id": "shopping-money-step-20-t24",
        "sequenceNumber": 24,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Excellent. People deserve to know exactly what they're buying.",
        "translationBn": "চমৎকার। মানুষের জানার অধিকার আছে তারা ঠিক কী কিনছে।"
      },
      {
        "id": "shopping-money-step-20-t25",
        "sequenceNumber": 25,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I'd buy it if it were in my size. Do you have medium?",
        "translationBn": "আমার সাইজে থাকলে আমি কিনতাম। মিডিয়াম আছে?"
      },
      {
        "id": "shopping-money-step-20-t26",
        "sequenceNumber": 26,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Let me look. Yes, there's one medium in the back room.",
        "translationBn": "দেখি। হ্যাঁ, পেছনের ঘরে একটা মিডিয়াম আছে।"
      },
      {
        "id": "shopping-money-step-20-t27",
        "sequenceNumber": 27,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Oh, great! Could I try it on?",
        "translationBn": "ওহ, দারুণ! আমি কি একটু পরে দেখতে পারি?"
      },
      {
        "id": "shopping-money-step-20-t28",
        "sequenceNumber": 28,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Sure. The fitting room is over there, on the left.",
        "translationBn": "অবশ্যই। ফিটিং রুম ওখানে, বাঁ দিকে।"
      },
      {
        "id": "shopping-money-step-20-t29",
        "sequenceNumber": 29,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Thank you. Give me two minutes.",
        "translationBn": "ধন্যবাদ। আমাকে দুই মিনিট দিন।"
      },
      {
        "id": "shopping-money-step-20-t30",
        "sequenceNumber": 30,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "While she's trying it on, can I ask about the bag I brought home? It was a gift for my sister's birthday.",
        "translationBn": "ও যখন দেখছে, আমি কি বাড়ি নিয়ে যাওয়া ব্যাগটার কথা জিজ্ঞেস করতে পারি? ওটা বোনের জন্মদিনের উপহার ছিল।"
      },
      {
        "id": "shopping-money-step-20-t31",
        "sequenceNumber": 31,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Of course. Did it arrive in good condition?",
        "translationBn": "অবশ্যই। ভালো অবস্থায় পৌঁছেছিল?"
      },
      {
        "id": "shopping-money-step-20-t32",
        "sequenceNumber": 32,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, it did. She loves it. But I'm worried the strap might break again.",
        "translationBn": "হ্যাঁ, পৌঁছেছিল। সে খুব পছন্দ করেছে। কিন্তু আমার চিন্তা, স্ট্র্যাপটা আবার ভেঙে যেতে পারে।"
      },
      {
        "id": "shopping-money-step-20-t33",
        "sequenceNumber": 33,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Then bring it in on Saturday. We'll tighten the strap and check the stitching, for free.",
        "translationBn": "তাহলে শনিবার নিয়ে আসুন। আমরা স্ট্র্যাপটা শক্ত করে দেব আর সেলাই চেক করব, বিনামূল্যে।"
      },
      {
        "id": "shopping-money-step-20-t34",
        "sequenceNumber": 34,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "That's very generous. I hope we're not taking too much of your time.",
        "translationBn": "এটা খুব উদার। আশা করি আপনাদের বেশি সময় নিচ্ছি না।"
      },
      {
        "id": "shopping-money-step-20-t35",
        "sequenceNumber": 35,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Not at all. Your feedback is helping us improve.",
        "translationBn": "একেবারেই না। আপনাদের মতামত আমাদের উন্নতিতে সাহায্য করছে।"
      },
      {
        "id": "shopping-money-step-20-t36",
        "sequenceNumber": 36,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I'm back! It fits well, but the sleeves are a bit long.",
        "translationBn": "আমি ফিরে এসেছি! ভালো ফিট করেছে, তবে হাতা একটু লম্বা।"
      },
      {
        "id": "shopping-money-step-20-t37",
        "sequenceNumber": 37,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "We can shorten them today. Give it to Rafi, and it will be ready in an hour.",
        "translationBn": "আমরা আজকেই ছোট করে দিতে পারি। রফিকে দিন, এক ঘণ্টার মধ্যে তৈরি হবে।"
      },
      {
        "id": "shopping-money-step-20-t38",
        "sequenceNumber": 38,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "I can wait here. Honestly, I'd rather not leave without it now.",
        "translationBn": "আমি এখানেই অপেক্ষা করতে পারি। সত্যি বলতে, এখন এটা ছাড়া যেতে আমার ইচ্ছে নেই।"
      },
      {
        "id": "shopping-money-step-20-t39",
        "sequenceNumber": 39,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "While Rafi alters the sleeves, let's sit together and have some tea. I'll tell you how this shop started.",
        "translationBn": "রফি হাতা ঠিক করার সময়ে আসুন একসাথে বসে চা খাই। এই দোকানটা কীভাবে শুরু হয়েছিল আমি আপনাদের বলব।"
      },
      {
        "id": "shopping-money-step-20-t40",
        "sequenceNumber": 40,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I'd love to hear it. I've been coming here since the beginning.",
        "translationBn": "শুনতে ভালো লাগবে। আমি তো শুরু থেকেই আসছি।"
      },
      {
        "id": "shopping-money-step-20-t41",
        "sequenceNumber": 41,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Ten years ago, I had a small stall near the bus station. I sold only bags, and I was often disappointed by low quality.",
        "translationBn": "দশ বছর আগে বাসস্টেশনের কাছে আমার একটা ছোট স্টল ছিল। শুধু ব্যাগ বিক্রি করতাম, আর কম মানের জিনিস দেখে প্রায়ই হতাশ হতাম।"
      },
      {
        "id": "shopping-money-step-20-t42",
        "sequenceNumber": 42,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "So you decided to open a proper shop?",
        "translationBn": "তাহলে আপনি একটা ঠিকঠাক দোকান খোলার সিদ্ধান্ত নিলেন?"
      },
      {
        "id": "shopping-money-step-20-t43",
        "sequenceNumber": 43,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Yes. I wanted to sell things I would be proud to give to my own family.",
        "translationBn": "হ্যাঁ। এমন জিনিস বিক্রি করতে চেয়েছিলাম যা নিজের পরিবারকে দিতে গর্ব হয়।"
      },
      {
        "id": "shopping-money-step-20-t44",
        "sequenceNumber": 44,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "That's why you hired me. I'd been working at a bigger shop, and I wanted a place where customers came first.",
        "translationBn": "সেজন্যই তো আমাকে নিয়োগ দিয়েছিলেন। আমি একটা বড় দোকানে কাজ করতাম, আর এমন একটা জায়গা চেয়েছিলাম যেখানে কাস্টমার আগে।"
      },
      {
        "id": "shopping-money-step-20-t45",
        "sequenceNumber": 45,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "I can see that in the way you treat people. It's rare.",
        "translationBn": "আপনাদের মানুষের সাথে ব্যবহারে সেটা বুঝতে পারি। এটা বিরল।"
      },
      {
        "id": "shopping-money-step-20-t46",
        "sequenceNumber": 46,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Thank you. Honestly, the mistakes we make are the reason we keep improving.",
        "translationBn": "ধন্যবাদ। সত্যি বলতে, আমাদের যে ভুলগুলো হয়, সেগুলোই আমাদের উন্নতির কারণ।"
      },
      {
        "id": "shopping-money-step-20-t47",
        "sequenceNumber": 47,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Here's the jacket. It's ready! Can you wrap it, please?",
        "translationBn": "এই যে জ্যাকেট। তৈরি! দয়া করে মুড়িয়ে দেবেন?"
      },
      {
        "id": "shopping-money-step-20-t48",
        "sequenceNumber": 48,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Of course. I'll put it in a bag with your receipt and the warranty card.",
        "translationBn": "অবশ্যই। রসিদ আর ওয়ারেন্টি কার্ড সহ ব্যাগে ভরে দিচ্ছি।"
      },
      {
        "id": "shopping-money-step-20-t49",
        "sequenceNumber": 49,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Thank you. Nadia, let's go. Our tea is finished.",
        "translationBn": "ধন্যবাদ। নাদিয়া, চলো। আমাদের চা শেষ।"
      },
      {
        "id": "shopping-money-step-20-t50",
        "sequenceNumber": 50,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "Yes, I'm coming. I'll bring my sister on Saturday for the strap.",
        "translationBn": "হ্যাঁ, আসছি। শনিবার বোনকে নিয়ে স্ট্র্যাপের জন্য আসব।"
      },
      {
        "id": "shopping-money-step-20-t51",
        "sequenceNumber": 51,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "We'll be here. Thank you both for your honesty today.",
        "translationBn": "আমরা থাকব। আজকে আপনাদের সততার জন্য দুজনকেই ধন্যবাদ।"
      },
      {
        "id": "shopping-money-step-20-t52",
        "sequenceNumber": 52,
        "speakerId": "mina",
        "speakerName": "Mina",
        "speakerRole": "customer",
        "englishText": "Thank you for the tea. And for the jacket. I'll remember this shop.",
        "translationBn": "চায়ের জন্য ধন্যবাদ। আর জ্যাকেটের জন্য। আমি এই দোকানের কথা মনে রাখব।"
      },
      {
        "id": "shopping-money-step-20-t53",
        "sequenceNumber": 53,
        "speakerId": "rafi",
        "speakerName": "Rafi",
        "speakerRole": "shop assistant",
        "englishText": "Take care on your way home. Please come back soon.",
        "translationBn": "বাড়ি ফেরার পথে সাবধানে যাবেন। শিগগিরই আবার আসবেন।"
      },
      {
        "id": "shopping-money-step-20-t54",
        "sequenceNumber": 54,
        "speakerId": "nadia",
        "speakerName": "Nadia",
        "speakerRole": "customer",
        "englishText": "We will. Goodbye for now.",
        "translationBn": "আসব। এখনকার মতো বিদায়।"
      },
      {
        "id": "shopping-money-step-20-t55",
        "sequenceNumber": 55,
        "speakerId": "karim",
        "speakerName": "Karim",
        "speakerRole": "shop owner",
        "englishText": "Goodbye. Have a safe evening.",
        "translationBn": "বিদায়। সন্ধ্যাটা নিরাপদে কাটুক।"
      }
    ],
    "prevStepSlug": "shopping-money-step-19"
  }
];

export function getShoppingMoneyStep(stepNumber: number): LadderStepItem | undefined {
  return SHOPPING_MONEY_LADDER_STEPS.find((s) => s.stepNumber === stepNumber);
}

export function getShoppingMoneyStepBySlug(slug: string): LadderStepItem | undefined {
  return SHOPPING_MONEY_LADDER_STEPS.find((s) => s.stepSlug === slug);
}
