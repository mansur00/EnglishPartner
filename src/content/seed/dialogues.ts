export interface DialogueSpeaker {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  avatarChar: string;
  colorScheme: "brand" | "accent" | "peach";
}

export interface DialogueLineItem {
  id: string;
  sequenceNumber: number;
  speakerId: string;
  englishText: string;
  translationBn: string;
  learningNote?: string;
  wordHighlights?: string[];
  audioUrl?: {
    "en-US"?: string;
    "en-GB"?: string;
  };
  durationMs?: number;
}

export interface ConversationVersionData {
  versionId: string;
  versionName: string; // "Short" | "Medium"
  level: string;
  lengthType: "short" | "medium";
  communicationStyle: "casual" | "neutral" | "formal";
  speakers: DialogueSpeaker[];
  lines: DialogueLineItem[];
  fullAudioDurationMs?: number;
}

export const SEED_DIALOGUES: Record<string, ConversationVersionData[]> = {
  // 1. ASKING FOR A PRICE & PRODUCT DETAILS (SHOPPING)
  "asking-price-product-details": [
    {
      versionId: "ver-01-short",
      versionName: "Short",
      level: "A1",
      lengthType: "short",
      communicationStyle: "casual",
      speakers: [
        {
          id: "spk-customer",
          name: "Customer",
          nameBn: "ক্রেতা",
          role: "Shopper",
          roleBn: "ক্রেতা",
          avatarChar: "C",
          colorScheme: "brand",
        },
        {
          id: "spk-assistant",
          name: "Shop Assistant",
          nameBn: "বিক্রেতা",
          role: "Store Clerk",
          roleBn: "দোকান সহকারী",
          avatarChar: "S",
          colorScheme: "accent",
        },
      ],
      lines: [
        {
          id: "line-01",
          sequenceNumber: 1,
          speakerId: "spk-customer",
          englishText: "Excuse me, could you tell me how much this blue jacket costs?",
          translationBn: "মাফ করবেন, আপনি কি বলতে পারেন এই নীল জ্যাকেটটির দাম কত?",
          learningNote: "Use 'Could you tell me...' to make a polite inquiry in shops.",
          wordHighlights: ["Excuse me", "costs", "jacket"],
          durationMs: 3200,
        },
        {
          id: "line-02",
          sequenceNumber: 2,
          speakerId: "spk-assistant",
          englishText: "Certainly! It is forty-five dollars, and today we have a ten percent discount on it.",
          translationBn: "অবশ্যই! এটার দাম ৪৫ ডলার, এবং আজ এটার ওপর ১০ শতাংশ ছাড় চলছে।",
          learningNote: "'Certainly!' is a warm, professional confirmation phrase.",
          wordHighlights: ["Certainly", "discount", "percent"],
          durationMs: 4100,
        },
        {
          id: "line-03",
          sequenceNumber: 3,
          speakerId: "spk-customer",
          englishText: "That sounds great! Do you have this in a medium size?",
          translationBn: "দারুণ তো! এটা কি মিডিয়াম সাইজে আছে?",
          learningNote: "'That sounds great!' indicates interest and enthusiasm.",
          wordHighlights: ["sounds great", "medium size"],
          durationMs: 2800,
        },
        {
          id: "line-04",
          sequenceNumber: 4,
          speakerId: "spk-assistant",
          englishText: "Yes, we do. Here is a medium one. The fitting rooms are right over there if you want to try it on.",
          translationBn: "হ্যাঁ, আছে। এই যে মিডিয়াম সাইজ। আপনি ট্রাই করতে চাইলে ফিটিং রুম ঠিক ওদিকেই।",
          learningNote: "'Try it on' is a phrasal verb meaning to wear clothing to check fit.",
          wordHighlights: ["fitting rooms", "try it on"],
          durationMs: 5000,
        },
      ],
      fullAudioDurationMs: 15100,
    },
    {
      versionId: "ver-01-medium",
      versionName: "Medium",
      level: "A2",
      lengthType: "medium",
      communicationStyle: "neutral",
      speakers: [
        {
          id: "spk-customer",
          name: "Customer",
          nameBn: "ক্রেতা",
          role: "Shopper",
          roleBn: "ক্রেতা",
          avatarChar: "C",
          colorScheme: "brand",
        },
        {
          id: "spk-assistant",
          name: "Shop Assistant",
          nameBn: "বিক্রেতা",
          role: "Store Clerk",
          roleBn: "দোকান সহকারী",
          avatarChar: "S",
          colorScheme: "accent",
        },
      ],
      lines: [
        {
          id: "line-m-01",
          sequenceNumber: 1,
          speakerId: "spk-customer",
          englishText: "Excuse me, could you tell me how much this blue jacket costs?",
          translationBn: "মাফ করবেন, আপনি কি বলতে পারেন এই নীল জ্যাকেটটির দাম কত?",
          wordHighlights: ["Excuse me", "costs"],
          durationMs: 3200,
        },
        {
          id: "line-m-02",
          sequenceNumber: 2,
          speakerId: "spk-assistant",
          englishText: "Certainly! It is forty-five dollars, and today we have a ten percent discount on it.",
          translationBn: "অবশ্যই! এটার দাম ৪৫ ডলার, এবং আজ এটার ওপর ১০ শতাংশ ছাড় চলছে।",
          wordHighlights: ["discount", "percent"],
          durationMs: 4100,
        },
        {
          id: "line-m-03",
          sequenceNumber: 3,
          speakerId: "spk-customer",
          englishText: "That sounds great! Do you have this in a medium size?",
          translationBn: "দারুণ তো! এটা কি মিডিয়াম সাইজে আছে?",
          wordHighlights: ["medium size"],
          durationMs: 2800,
        },
        {
          id: "line-m-04",
          sequenceNumber: 4,
          speakerId: "spk-assistant",
          englishText: "Yes, we do. Here is a medium one. Would you like to try it on in the fitting room?",
          translationBn: "হ্যাঁ, আছে। এই যে মিডিয়াম। আপনি কি ফিটিং রুমে ট্রাই করে দেখতে চান?",
          wordHighlights: ["try it on", "fitting room"],
          durationMs: 4400,
        },
        {
          id: "line-m-05",
          sequenceNumber: 5,
          speakerId: "spk-customer",
          englishText: "Yes, please. Also, does this fabric require dry cleaning or is it machine washable?",
          translationBn: "হ্যাঁ, দেখতে চাই। আর এই কাপড়টি কি ড্রাই ক্লিন করতে হবে নাকি মেশিনে ধোয়া যাবে?",
          learningNote: "Asking about garment care instructions.",
          wordHighlights: ["fabric", "dry cleaning", "machine washable"],
          durationMs: 4900,
        },
        {
          id: "line-m-06",
          sequenceNumber: 6,
          speakerId: "spk-assistant",
          englishText: "It is completely machine washable on a gentle cycle with cold water.",
          translationBn: "এটি সাধারণ ঠাণ্ডা পানিতে ওয়াশিং মেশিনের জেন্টল সাইকেলে ধোয়া যাবে।",
          wordHighlights: ["gentle cycle", "cold water"],
          durationMs: 4200,
        },
        {
          id: "line-m-07",
          sequenceNumber: 7,
          speakerId: "spk-customer",
          englishText: "Wonderful. It fits comfortably. Can I pay with a contactless card?",
          translationBn: "চমৎকার। এটা একদম সুন্দরভাবে ফিট হয়েছে। আমি কি কনট্যাক্টলেস কার্ডে পেমেন্ট করতে পারব?",
          wordHighlights: ["fits comfortably", "contactless card"],
          durationMs: 3800,
        },
        {
          id: "line-m-08",
          sequenceNumber: 8,
          speakerId: "spk-assistant",
          englishText: "Of course! You can tap your card right here at the counter.",
          translationBn: "অবশ্যই! আপনি কাউন্টারে এখানে কার্ড ট্যাপ করতে পারেন।",
          wordHighlights: ["tap your card", "counter"],
          durationMs: 3500,
        },
      ],
      fullAudioDurationMs: 30900,
    },
  ],

  // 2. AIRPORT CHECK-IN & BAGGAGE DROP (TRAVEL)
  "airport-checkin-baggage-drop": [
    {
      versionId: "ver-05-short",
      versionName: "Short",
      level: "A2",
      lengthType: "short",
      communicationStyle: "neutral",
      speakers: [
        {
          id: "spk-passenger",
          name: "Passenger",
          nameBn: "যাত্রী",
          role: "Traveler",
          roleBn: "ভ্রমণকারী",
          avatarChar: "P",
          colorScheme: "brand",
        },
        {
          id: "spk-agent",
          name: "Check-in Agent",
          nameBn: "এয়ারলাইন কর্মকর্তা",
          role: "Airline Representative",
          roleBn: "এয়ারলাইন প্রতিনিধি",
          avatarChar: "A",
          colorScheme: "accent",
        },
      ],
      lines: [
        {
          id: "line-air-01",
          sequenceNumber: 1,
          speakerId: "spk-passenger",
          englishText: "Good morning. I would like to check in for flight EK-582 to London.",
          translationBn: "শুভ সকাল। আমি লন্ডনের EK-582 ফ্লাইটের জন্য চেক-ইন করতে চাই।",
          learningNote: "'I would like to...' is the standard polite opener at airport counters.",
          wordHighlights: ["check in", "flight"],
          durationMs: 3800,
        },
        {
          id: "line-air-02",
          sequenceNumber: 2,
          speakerId: "spk-agent",
          englishText: "Good morning! May I see your passport and ticket confirmation, please?",
          translationBn: "শুভ সকাল! আপনার পাসপোর্ট এবং টিকিটের কনফার্মেশনটা কি দেখতে পারি?",
          wordHighlights: ["passport", "confirmation"],
          durationMs: 3600,
        },
        {
          id: "line-air-03",
          sequenceNumber: 3,
          speakerId: "spk-passenger",
          englishText: "Here you go. Could I please get a window seat if one is available?",
          translationBn: "এই যে নিন। কোনো উইন্ডো সিট খালি থাকলে কি পাওয়া যাবে?",
          learningNote: "'Here you go' is a natural phrase when handing someone documents.",
          wordHighlights: ["Here you go", "window seat"],
          durationMs: 3700,
        },
        {
          id: "line-air-04",
          sequenceNumber: 4,
          speakerId: "spk-agent",
          englishText: "Let me check for you. Yes, seat 14A is open. Please place your checked bag on the scale.",
          translationBn: "একটু দেখছি। হ্যাঁ, ১৪এ সিটটি খালি আছে। আপনার বড় লাগেজটি স্কেলের ওপর রাখুন।",
          wordHighlights: ["checked bag", "scale"],
          durationMs: 5100,
        },
      ],
      fullAudioDurationMs: 16200,
    },
  ],

  // 3. UI/UX DESIGNER KICKOFF (PROFESSIONAL TRACK)
  "designer-client-kickoff-questions": [
    {
      versionId: "ver-13-short",
      versionName: "Short",
      level: "B1",
      lengthType: "short",
      communicationStyle: "formal",
      speakers: [
        {
          id: "spk-designer",
          name: "UX Designer",
          nameBn: "ইউএক্স ডিজাইনার",
          role: "Product Designer",
          roleBn: "প্রোডাক্ট ডিজাইনার",
          avatarChar: "D",
          colorScheme: "brand",
        },
        {
          id: "spk-founder",
          name: "Client Lead",
          nameBn: "ক্লায়েন্ট প্রধান",
          role: "Startup Founder",
          roleBn: "প্রতিষ্ঠাতা",
          avatarChar: "C",
          colorScheme: "accent",
        },
      ],
      lines: [
        {
          id: "line-ux-01",
          sequenceNumber: 1,
          speakerId: "spk-designer",
          englishText: "Thanks for meeting today! Before we draft wireframes, could you clarify your primary target persona?",
          translationBn: "আজকের মিটিংয়ে যোগ দেওয়ার জন্য ধন্যবাদ! ওয়্যারফ্রেম আঁকার আগে আপনাদের প্রধান টার্গেট ইউজার কারা সে সম্পর্কে একটু বলবেন?",
          learningNote: "Essential stakeholder discovery questioning.",
          wordHighlights: ["wireframes", "clarify", "target persona"],
          durationMs: 5200,
        },
        {
          id: "line-ux-02",
          sequenceNumber: 2,
          speakerId: "spk-founder",
          englishText: "Our core users are busy working professionals who need to manage their daily tasks in under five minutes.",
          translationBn: "আমাদের মূল ব্যবহারকারী হলেন ব্যস্ত চাকুরিজীবীরা, যাদের পাঁচ মিনিটের মধ্যে দৈনন্দিন কাজ পরিচালনা করা প্রয়োজন।",
          wordHighlights: ["core users", "working professionals", "manage"],
          durationMs: 5100,
        },
        {
          id: "line-ux-03",
          sequenceNumber: 3,
          speakerId: "spk-designer",
          englishText: "Understood. That means we should prioritize an uncluttered mobile layout with minimal taps to complete tasks.",
          translationBn: "বুঝতে পেরেছি। তার মানে আমাদের অল্প ক্লিকে কাজ শেষ করার মতো পরিচ্ছন্ন মোবাইল লেআউটকে প্রাধান্য দিতে হবে।",
          learningNote: "Translating stakeholder business requirements into UX interaction decisions.",
          wordHighlights: ["prioritize", "uncluttered", "minimal taps"],
          durationMs: 5800,
        },
        {
          id: "line-ux-04",
          sequenceNumber: 4,
          speakerId: "spk-founder",
          englishText: "Exactly! Simplicity and high contrast are our top priorities for this initial launch.",
          translationBn: "একদম ঠিক! এই প্রথম রিলিজের জন্য সারল্য এবং স্পষ্ট ভিজ্যুয়াল কনট্রাস্টই আমাদের প্রধান অগ্রাধিকার।",
          wordHighlights: ["Simplicity", "high contrast", "priorities"],
          durationMs: 4400,
        },
      ],
      fullAudioDurationMs: 20500,
    },
  ],
};
