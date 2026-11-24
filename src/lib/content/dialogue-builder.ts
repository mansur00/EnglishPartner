import type {
  ConversationVersionData,
  DialogueLineItem,
  DialogueSpeaker,
} from "../../content/seed/dialogues.ts";
import {
  getLengthTierById,
  getDefaultLengthTierForLevel,
  type CefrLevelCode,
  type ConversationStyle,
  type LengthTier,
} from "./length-tiers.ts";

interface TurnTemplate {
  en: string;
  bn: string;
  note?: string;
}

const DEFAULT_SPEAKERS: DialogueSpeaker[] = [
  {
    id: "spk-a",
    name: "Speaker A",
    nameBn: "বক্তা ক",
    role: "Learner",
    roleBn: "শিক্ষার্থী",
    avatarChar: "A",
    colorScheme: "brand",
  },
  {
    id: "spk-b",
    name: "Speaker B",
    nameBn: "বক্তা খ",
    role: "Partner",
    roleBn: "সহযোগী",
    avatarChar: "B",
    colorScheme: "accent",
  },
];

function buildTurnPool(
  topic: string,
  level: CefrLevelCode,
  style: ConversationStyle
): TurnTemplate[] {
  const isCasual = style === "casual";
  const isFormal = style === "formal";

  if (level === "A1") {
    return [
      {
        en: isCasual ? "Hello! How are you?" : isFormal ? "Good morning. May I help you?" : "Hello! Can you help me?",
        bn: isCasual ? "হ্যালো! কেমন আছেন?" : isFormal ? "শুভ সকাল। আমি কি আপনাকে সাহায্য করতে পারি?" : "হ্যালো! আপনি কি আমাকে সাহায্য করতে পারেন?",
        note: "Simple basic greeting to start a conversation.",
      },
      {
        en: isCasual ? "Hi! I am good, thanks." : isFormal ? "Yes, please. I need some help." : "Hi! Yes, how can I help you?",
        bn: isCasual ? "হাই! আমি ভালো আছি, ধন্যবাদ।" : isFormal ? "জি, অনুগ্রহ করে। আমার কিছু সাহায্য দরকার।" : "হাই! জি, কীভাবে সাহায্য করতে পারি?",
      },
      {
        en: `I want to ask about ${topic.toLowerCase()}.`,
        bn: `আমি ${topic} সম্পর্কে জানতে চাই।`,
        note: "Basic present simple statement: I want to...",
      },
      {
        en: isCasual ? "Sure! What do you need?" : "Of course. Please tell me.",
        bn: isCasual ? "অবশ্যই! আপনার কী প্রয়োজন?" : "অবশ্যই। অনুগ্রহ করে বলুন।",
      },
      {
        en: "Is this available right now?",
        bn: "এটি কি এখন পাওয়া যাবে?",
      },
      {
        en: "Yes, it is right here.",
        bn: "হ্যাঁ, এটি এখানেই আছে।",
      },
      {
        en: "How much does it cost?",
        bn: "এটার দাম কত?",
      },
      {
        en: "It is twenty dollars.",
        bn: "এটার দাম বিশ ডলার।",
      },
      {
        en: "Can I see another one?",
        bn: "আমি কি আরেকটি দেখতে পারি?",
      },
      {
        en: "Yes, look at this one.",
        bn: "হ্যাঁ, এটি দেখুন।",
      },
      {
        en: "This one is very nice.",
        bn: "এটি খুব সুন্দর।",
      },
      {
        en: "Do you want to take it?",
        bn: "আপনি কি এটি নিতে চান?",
      },
      {
        en: "Yes, I will take this.",
        bn: "হ্যাঁ, আমি এটি নেব।",
      },
      {
        en: "Great! Please pay here.",
        bn: "দারুণ! অনুগ্রহ করে এখানে পেমেন্ট করুন।",
      },
      {
        en: isCasual ? "Thanks a lot! Bye!" : "Thank you very much. Goodbye!",
        bn: isCasual ? "অনেক ধন্যবাদ! বিদায়!" : "আপনাকে অনেক ধন্যবাদ। বিদায়!",
      },
      {
        en: "You are welcome. Have a nice day!",
        bn: "স্বাগতম। আপনার দিনটি শুভ হোক!",
      },
    ];
  }

  if (level === "A2") {
    return [
      {
        en: isCasual ? `Hey there! I'm looking into ${topic.toLowerCase()} today.` : isFormal ? `Good afternoon. I would like to discuss ${topic.toLowerCase()}.` : `Hello! I have a question about ${topic.toLowerCase()}.`,
        bn: isCasual ? `হ্যালো! আমি আজ ${topic} নিয়ে খোঁজ নিচ্ছি।` : isFormal ? `শুভ অপরাহ্ন। আমি ${topic} নিয়ে আলোচনা করতে চাই।` : `হ্যালো! ${topic} নিয়ে আমার একটি প্রশ্ন আছে।`,
      },
      {
        en: isCasual ? "Sure thing! Tell me what you're looking for." : "Certainly! I'd be happy to assist you with that.",
        bn: isCasual ? "অবশ্যই! আপনি কী খুঁজছেন বলুন।" : "অবশ্যই! আমি আপনাকে সাহায্য করতে পেরে খুশি হব।",
      },
      {
        en: "I tried checking earlier, but I wasn't sure about the details.",
        bn: "আমি আগে দেখার চেষ্টা করেছিলাম, কিন্তু বিস্তারিত বিষয়ে নিশ্চিত ছিলাম না।",
        note: "Simple + compound sentence connected with 'but'.",
      },
      {
        en: "That makes sense, and I can explain everything clearly.",
        bn: "এটা স্বাভাবিক, এবং আমি সবকিছু পরিষ্কারভাবে বুঝিয়ে দিতে পারি।",
      },
      {
        en: "First, could you tell me how long this usually takes?",
        bn: "প্রথমে, এটি সাধারণত কত সময় নেয় বলতে পারেন?",
      },
      {
        en: "It usually takes about ten minutes, so you won't have to wait long.",
        bn: "এতে সাধারণত প্রায় দশ মিনিট লাগে, তাই আপনাকে বেশিক্ষণ অপেক্ষা করতে হবে না।",
      },
      {
        en: "What options do I have if I need something different?",
        bn: "আমার যদি ভিন্ন কিছুর প্রয়োজন হয় তবে কী কী বিকল্প আছে?",
      },
      {
        en: "We have two other choices, and both are quite popular.",
        bn: "আমাদের আরও দুটি বিকল্প আছে, এবং দুটিই বেশ জনপ্রিয়।",
      },
      {
        en: "Could you show me the second option because it sounds better?",
        bn: "আপনি কি আমাকে দ্বিতীয় বিকল্পটি দেখাতে পারেন কারণ এটি বেশি ভালো মনে হচ্ছে?",
      },
      {
        en: "Here it is! You can compare the features side by side.",
        bn: "এই যে! আপনি বৈশিষ্ট্যগুলো পাশাপাশি তুলনা করতে পারেন।",
      },
      {
        en: "Do you accept card payments, or should I pay in cash?",
        bn: "আপনারা কি কার্ড পেমেন্ট গ্রহণ করেন, নাকি নগদে পরিশোধ করতে হবে?",
      },
      {
        en: "We accept both cards and mobile payments for your convenience.",
        bn: "আপনার সুবিধার জন্য আমরা কার্ড ও মোবাইল পেমেন্ট উভয়ই গ্রহণ করি।",
      },
      {
        en: "Is there any extra fee if I change my mind later?",
        bn: "আমি পরে সিদ্ধান্ত পরিবর্তন করলে কি কোনো অতিরিক্ত ফি লাগবে?",
      },
      {
        en: "No, there is no fee as long as you let us know within seven days.",
        bn: "না, আপনি সাত দিনের মধ্যে জানালে কোনো ফি লাগবে না।",
      },
      {
        en: "That sounds really fair, so let's go ahead with this plan.",
        bn: "এটি বেশ যুক্তিসঙ্গত মনে হচ্ছে, তাই চলুন এই পরিকল্পনাতেই এগোই।",
      },
      {
        en: "Wonderful! I will prepare everything for you right away.",
        bn: "দারুণ! আমি এখনই আপনার জন্য সবকিছু প্রস্তুত করছি।",
      },
      {
        en: "Thank you for being so helpful today!",
        bn: "আজ এতটা সাহায্য করার জন্য ধন্যবাদ!",
      },
      {
        en: "My pleasure! Let me know if you need anything else.",
        bn: "আমার সৌভাগ্য! আর কোনো কিছুর প্রয়োজন হলে জানাবেন।",
      },
    ];
  }

  if (level === "B1" || level === "B2") {
    return [
      {
        en: isFormal
          ? `Good morning. I'm reaching out regarding ${topic.toLowerCase()}, as we need to align on several key details.`
          : `Hi! I wanted to talk about ${topic.toLowerCase()} because there are a few things we should sort out.`,
        bn: isFormal
          ? `শুভ সকাল। ${topic} সংক্রান্ত কয়েকটি গুরুত্বপূর্ণ বিষয়ে সমন্বয়ের জন্য আমি যোগাযোগ করেছি।`
          : `হাই! আমি ${topic} নিয়ে কথা বলতে চেয়েছিলাম কারণ আমাদের কয়েকটি বিষয় ঠিক করা দরকার।`,
        note: "Complex opener using 'as' or 'because' to state purpose.",
      },
      {
        en: isFormal
          ? "Thank you for bringing this up. Which aspect would you like to prioritize first?"
          : "Sure, I'm glad you brought it up. Where should we start?",
        bn: isFormal
          ? "বিষয়টি তোলার জন্য ধন্যবাদ। আপনি প্রথমে কোন দিকটিকে অগ্রাধিকার দিতে চান?"
          : "অবশ্যই, ভালো হয়েছে আপনি কথাটা তুলেছেন। আমরা কোথা থেকে শুরু করব?",
      },
      {
        en: "Although we discussed the basic outline yesterday, some requirements have changed since then.",
        bn: "যদিও আমরা গতকাল মূল রূপরেখা নিয়ে আলোচনা করেছি, তারপর থেকে কিছু চাহিদা বদলেছে।",
        note: "Subordinate clause with 'Although' showing contrast.",
      },
      {
        en: "I see. If the requirements have shifted, we'll need to adjust our timeline accordingly.",
        bn: "বুঝেছি। চাহিদা বদলে থাকলে আমাদের সময়সূচিও সে অনুযায়ী সমন্বয় করতে হবে।",
      },
      {
        en: "Could you walk me through the main constraints we are facing right now?",
        bn: "আমরা বর্তমানে যেসব মূল সীমাবদ্ধতার মুখোমুখি হচ্ছি, তা কি একটু ব্যাখ্যা করবেন?",
      },
      {
        en: "Well, the biggest challenge is balancing quality with the limited resources we currently have.",
        bn: "আসলে, আমাদের বর্তমান সীমিত রিসোর্সের মধ্যে মান বজায় রাখাটাই সবচেয়ে বড় চ্যালেঞ্জ।",
      },
      {
        en: "What if we break this into two phases so that the core features are delivered on time?",
        bn: "আমরা যদি এটিকে দুই ধাপে ভাগ করি যাতে মূল ফিচারগুলো সময়মতো ডেলিভারি দেওয়া যায়, তাহলে কেমন হয়?",
        note: "Conditional suggestion with 'What if...' and 'so that'.",
      },
      {
        en: "That's a practical approach, provided everyone agrees on what belongs in phase one.",
        bn: "এটি একটি বাস্তবসম্মত পদ্ধতি, তবে প্রথম ধাপে কী থাকবে তা নিয়ে সবার একমত হতে হবে।",
      },
      {
        en: "I completely agree, and I think we should document those priorities before moving forward.",
        bn: "আমি সম্পূর্ণ একমত, এবং আমার মনে হয় সামনে এগোনোর আগে অগ্রাধিকারগুলো লিখে রাখা উচিত।",
      },
      {
        en: "Have you already spoken with the rest of the team, or should we schedule a quick sync?",
        bn: "আপনি কি ইতিমধ্যে দলের বাকিদের সাথে কথা বলেছেন, নাকি আমাদের একটি সংক্ষিপ্ত মিটিং করা উচিত?",
      },
      {
        en: "I've briefed two colleagues already, yet we still need final confirmation from the lead.",
        bn: "আমি ইতিমধ্যে দুইজন সহকর্মীকে জানিয়েছি, তবে আমাদের এখনও টিম লিডের চূড়ান্ত সম্মতি দরকার।",
      },
      {
        en: "Once we get that confirmation, how quickly can we expect the first update?",
        bn: "আমরা সেই সম্মতি পাওয়ার পর কত দ্রুত প্রথম আপডেট আশা করতে পারি?",
      },
      {
        en: "If everything goes smoothly, we should have a working draft ready by Thursday afternoon.",
        bn: "সবকিছু ঠিকঠাক চললে বৃহস্পতিবার বিকেলের মধ্যেই আমাদের একটি কার্যকরী খসড়া তৈরি হয়ে যাবে।",
      },
      {
        en: "Would it be possible to include a brief summary of potential risks as well?",
        bn: "সম্ভাব্য ঝুঁকিগুলোর একটি সংক্ষিপ্ত সারসংক্ষেপও কি এতে যুক্ত করা সম্ভব হবে?",
      },
      {
        en: "Certainly. Highlighting risks early helps us avoid costly delays later on.",
        bn: "অবশ্যই। শুরুতেই ঝুঁকি চিহ্নিত করলে পরবর্তীতে ব্যয়বহুল বিলম্ব এড়ানো যায়।",
      },
      {
        en: "I appreciate how thorough you're being with this; it really builds confidence.",
        bn: "আপনি বিষয়টি নিয়ে যেভাবে পুঙ্খানুপুঙ্খভাবে কাজ করছেন তা প্রশংসনীয়; এটি সত্যিই আস্থা বাড়ায়।",
      },
      {
        en: "Let's review the action items one more time to ensure nothing was overlooked.",
        bn: "কোনো কিছু বাদ পড়েছে কি না তা নিশ্চিত করতে চলুন করণীয় বিষয়গুলো আরেকবার দেখে নিই।",
      },
      {
        en: "Sounds good—I'll send a follow-up note right after our conversation ends.",
        bn: "খুব ভালো—আমাদের কথা শেষ হওয়ার পরপরই আমি একটি ফলো-আপ নোট পাঠিয়ে দেব।",
      },
    ];
  }

  // C1 / C2: Advanced Complex & Compound-Complex Sentences
  return [
    {
      en: isFormal
        ? `Good morning. Given the strategic implications of ${topic.toLowerCase()}, I wanted to examine our long-term assumptions before finalizing the proposal.`
        : `Hi there—considering how much is riding on ${topic.toLowerCase()}, we really ought to unpack the underlying trade-offs before locking anything in.`,
      bn: isFormal
        ? `শুভ সকাল। ${topic}-এর কৌশলগত গুরুত্ব বিবেচনা করে প্রস্তাবনা চূড়ান্ত করার আগে আমি আমাদের দীর্ঘমেয়াদি অনুমানগুলো যাচাই করতে চেয়েছিলাম।`
        : `হ্যালো—${topic}-এর ওপর অনেক কিছু নির্ভর করছে, তাই কোনো কিছু চূড়ান্ত করার আগে আমাদের মূল সুবিধা-অসুবিধাগুলো খতিয়ে দেখা উচিত।`,
      note: "C1/C2 participial & subordinate opening clause.",
    },
    {
      en: isFormal
        ? "I couldn't agree more; while our initial projections looked promising, recent market shifts have introduced variables that we cannot afford to ignore."
        : "Absolutely; even though the early numbers looked great, several unexpected variables have popped up that could derail us if we're not careful.",
      bn: isFormal
        ? "আমি সম্পূর্ণ একমত; আমাদের প্রাথমিক হিসাব আশাব্যঞ্জক মনে হলেও সাম্প্রতিক বাজার পরিবর্তনের ফলে এমন কিছু চলক তৈরি হয়েছে যা উপেক্ষা করা যাবে না।"
        : "একদম ঠিক; শুরুর দিকের সংখ্যাগুলো ভালো দেখালেও কিছু অপ্রত্যাশিত বিষয় সামনে এসেছে যা সাবধান না হলে আমাদের সমস্যায় ফেলতে পারে।",
      note: "Compound-complex sentence combining 'while/even though' with relative clauses.",
    },
    {
      en: "Precisely, and what complicates matters further is that stakeholders hold conflicting expectations regarding both the budget and the delivery horizon.",
      bn: "ঠিক তাই, এবং বিষয়টিকে আরও জটিল করে তুলেছে এই যে, বাজেট এবং ডেলিভারির সময়সীমা—উভয় ক্ষেত্রেই অংশীজনদের প্রত্যাশা পরস্পরবিরোধী।",
    },
    {
      en: "Whereas one group prioritizes rapid deployment at the expense of polish, the executive committee insists on rigorous compliance, which inevitably extends our timeline.",
      bn: "যেখানে একটি পক্ষ নিখুঁত কাজের চেয়ে দ্রুত বাস্তবায়নকে অগ্রাধিকার দেয়, সেখানে নির্বাহী কমিটি কঠোর নিয়মনীতির ওপর জোর দেয়, যা অনিবার্যভাবে আমাদের সময়সীমা বাড়িয়ে দেয়।",
      note: "Contrastive 'Whereas...' + non-defining relative clause 'which inevitably...'.",
    },
    {
      en: "Have we considered proposing a tiered rollout so that we satisfy the urgency for core capabilities while preserving a buffer for comprehensive auditing?",
      bn: "আমরা কি ধাপে ধাপে চালুর (tiered rollout) প্রস্তাব দেওয়ার কথা ভেবেছি, যাতে মূল সক্ষমতার জরুরি চাহিদা পূরণের পাশাপাশি পূর্ণাঙ্গ অডিটের জন্যও সময় রাখা যায়?",
    },
    {
      en: "That might bridge the gap, provided we articulate the trade-offs transparently and establish measurable milestones that hold every department accountable.",
      bn: "এটি হয়তো ব্যবধান কমাতে পারে, তবে শর্ত হলো আমাদের সুবিধা-অসুবিধাগুলো স্বচ্ছভাবে তুলে ধরতে হবে এবং প্রতিটি বিভাগকে জবাবদিহির মধ্যে রাখতে পরিমাপযোগ্য মাইলস্টোন নির্ধারণ করতে হবে।",
    },
    {
      en: "Not only would that mitigate operational risk, but it would also demonstrate to our partners that we are proactively managing complexity rather than reacting to crises.",
      bn: "এটি শুধু অপারেশনাল ঝুঁকিই কমাবে না, বরং আমাদের পার্টনারদের কাছেও প্রমাণ করবে যে আমরা সংকটের অপেক্ষা না করে আগে থেকেই জটিলতা সামাল দিচ্ছি।",
      note: "Inversion structure: 'Not only would that..., but it would also...'.",
    },
    {
      en: "True, yet we must be careful not to overpromise; if an unforeseen bottleneck arises during integration, our credibility could suffer disproportionately.",
      bn: "সত্যি, তবুও আমাদের অতিরিক্ত প্রতিশ্রুতি না দেওয়ার বিষয়ে সতর্ক থাকতে হবে; ইন্টিগ্রেশনের সময় কোনো অপ্রত্যাশিত বাধা এলে আমাদের বিশ্বাসযোগ্যতা মারাত্মকভাবে ক্ষতিগ্রস্ত হতে পারে।",
    },
    {
      en: "In light of that, how should we frame our contingency plan so that leadership feels reassured without feeling overwhelmed by technical minutiae?",
      bn: "সেই আলোকে, আমাদের বিকল্প পরিকল্পনাটি কীভাবে সাজানো উচিত যাতে নেতৃত্ব কারিগরি খুঁটিনাটিতে বিভ্রান্ত না হয়েই আশ্বস্ত বোধ করেন?",
    },
    {
      en: "I'd recommend presenting three clear scenarios—optimistic, baseline, and conservative—each paired with concrete triggers that dictate when we pivot.",
      bn: "আমি তিনটি স্পষ্ট দৃশ্যপট—আশাবাদী, স্বাভাবিক এবং সতর্কতামূলক—উপস্থাপনের পরামর্শ দেব, যার প্রতিটির সাথে কখন সিদ্ধান্ত পরিবর্তন করতে হবে তার সুনির্দিষ্ট সূচক যুক্ত থাকবে।",
    },
    {
      en: "That level of clarity is compelling, especially since decision-makers often hesitate simply because they lack visibility into downside protection.",
      bn: "এই ধরনের স্বচ্ছতা খুবই কার্যকর, বিশেষ করে যখন সিদ্ধান্ত গ্রহণকারীরা কেবল সম্ভাব্য ঝুঁকি মোকাবিলার উপায় না জানার কারণে দ্বিধায় থাকেন।",
    },
    {
      en: "Furthermore, by anchoring our metrics to tangible outcomes rather than abstract percentages, we make it far easier for cross-functional teams to stay aligned.",
      bn: "তাছাড়া, বিমূর্ত শতাংশের বদলে বাস্তব ফলাফলের সাথে আমাদের পরিমাপকগুলো যুক্ত করলে ক্রস-ফাংশনাল দলগুলোর জন্য সমন্বয় বজায় রাখা অনেক সহজ হয়।",
    },
    {
      en: "Should we also anticipate questions regarding long-term maintenance costs, which tend to escalate once the initial launch enthusiasm subsides?",
      bn: "আমাদের কি দীর্ঘমেয়াদি রক্ষণাবেক্ষণ খরচ নিয়ে সম্ভাব্য প্রশ্নগুলোর উত্তরও প্রস্তুত রাখা উচিত, যা শুরুর উচ্ছ্বাস কমে যাওয়ার পর সাধারণত বেড়ে যায়?",
    },
    {
      en: "Definitely; factoring total cost of ownership into our presentation upfront will preempt skepticism and signal mature financial stewardship.",
      bn: "অবশ্যই; উপস্থাপনার শুরুতেই মোট মালিকানা ব্যয় (TCO) অন্তর্ভুক্ত করলে যেকোনো সংশয় দূর হবে এবং পরিপক্ব আর্থিক ব্যবস্থাপনার পরিচয় মিলবে।",
    },
    {
      en: "Let's synthesize these points into an executive brief by tomorrow morning, after which we can run a dry rehearsal to sharpen our delivery.",
      bn: "চলুন আগামীকাল সকালের মধ্যে এই পয়েন্টগুলোকে একটি সংক্ষিপ্ত নির্বাহী সারসংক্ষেপে রূপ দিই, এবং এরপর আমাদের উপস্থাপনা শাণিত করতে একটি মহড়া দিই।",
    },
    {
      en: "Agreed—I'll draft the analytical framework tonight, and you can refine the strategic narrative so that both pieces reinforce each other seamlessly.",
      bn: "একমত—আমি আজ রাতেই বিশ্লেষণাত্মক কাঠামোটি তৈরি করব, আর আপনি কৌশলগত বিবরণটি পরিমার্জন করবেন যাতে দুটি অংশই একে অপরকে নিখুঁতভাবে পরিপূরক করে।",
    },
  ];
}

function buildExpansionTurn(
  turnNum: number,
  totalTurns: number,
  topic: string,
  level: CefrLevelCode,
  style: ConversationStyle
): TurnTemplate {
  const isSpeakerA = turnNum % 2 === 1;
  const isFormal = style === "formal";

  if (level === "A1") {
    const a1Pool: TurnTemplate[] = [
      { en: "Excuse me, is this the right place?", bn: "মাফ করবেন, এটিই কি সঠিক জায়গা?" },
      { en: "Yes, you are in the right place.", bn: "হ্যাঁ, আপনি সঠিক জায়গায় আছেন।" },
      { en: "Can you speak slowly, please?", bn: "অনুগ্রহ করে একটু ধীরে বলবেন কি?" },
      { en: "Sure! I will speak slowly.", bn: "অবশ্যই! আমি ধীরে বলছি।" },
      { en: "What time do you close today?", bn: "আজ আপনারা কয়টার সময় বন্ধ করেন?" },
      { en: "We close at nine o'clock.", bn: "আমরা রাত নয়টায় বন্ধ করি।" },
      { en: "Where can I find the exit?", bn: "আমি প্রস্থান পথ কোথায় পাব?" },
      { en: "Turn left near the door.", bn: "দরজার কাছে বামে ঘুরুন।" },
    ];
    return a1Pool[turnNum % a1Pool.length];
  }

  if (level === "A2") {
    const a2Pool: TurnTemplate[] = [
      { en: `Could you repeat what you said about ${topic.toLowerCase()}?`, bn: `${topic} সম্পর্কে আপনি যা বললেন তা কি আরেকবার বলবেন?` },
      { en: "Yes, I meant that you can choose whichever option fits your schedule.", bn: "হ্যাঁ, আমি বুঝিয়েছি যে আপনার সময়সূচির সাথে মানানসই যেকোনো বিকল্প আপনি বেছে নিতে পারেন।" },
      { en: "Do I need to bring any documents with me next time?", bn: "পরের বার আসার সময় কি আমাকে কোনো কাগজপত্র আনতে হবে?" },
      { en: "Just bring your ID card, and we will handle the rest.", bn: "শুধু আপনার আইডি কার্ড নিয়ে আসবেন, বাকিটা আমরাই দেখব।" },
      { en: "What happens if there is a delay?", bn: "যদি কোনো বিলম্ব হয় তাহলে কী হবে?" },
      { en: "We will send you a message right away so you can plan ahead.", bn: "আমরা সাথে সাথে আপনাকে মেসেজ পাঠাব যাতে আপনি আগে থেকেই পরিকল্পনা করতে পারেন।" },
    ];
    return a2Pool[turnNum % a2Pool.length];
  }

  if (level === "B1" || level === "B2") {
    const bPool: TurnTemplate[] = [
      {
        en: isSpeakerA
          ? `Considering our progress on ${topic.toLowerCase()}, do you think we've addressed all edge cases?`
          : `Mostly yes, although we should still verify how the system behaves under heavier demand.`,
        bn: isSpeakerA
          ? `${topic} নিয়ে আমাদের অগ্রগতি বিবেচনায়, আমরা কি সব ব্যতিক্রমী পরিস্থিতি সমাধান করতে পেরেছি?`
          : `বেশিরভাগ ক্ষেত্রেই হ্যাঁ, যদিও বাড়তি চাপের সময় সিস্টেম কেমন কাজ করে তা আমাদের যাচাই করা উচিত।`,
      },
      {
        en: isSpeakerA
          ? "If we run a quick stress test tomorrow morning, would that give us enough confidence?"
          : "It definitely would, especially if we document the response times for comparison.",
        bn: isSpeakerA
          ? "আমরা যদি আগামীকাল সকালে একটি দ্রুত পরীক্ষা চালাই, তবে কি তা যথেষ্ট আত্মবিশ্বাস দেবে?"
          : "অবশ্যই দেবে, বিশেষ করে যদি আমরা তুলনা করার জন্য ফলাফলগুলো লিখে রাখি।",
      },
      {
        en: isSpeakerA
          ? "What about communication with external partners—who is taking ownership of that?"
          : "I can take the lead on partner updates, while you focus on finalizing the internal checklist.",
        bn: isSpeakerA
          ? "বাইরের পার্টনারদের সাথে যোগাযোগের বিষয়টি কী হবে—সেটার দায়িত্ব কে নিচ্ছেন?"
          : "আমি পার্টনারদের আপডেট দেওয়ার নেতৃত্ব দিতে পারি, আর আপনি অভ্যন্তরীণ তালিকা চূড়ান্ত করার দিকে মনোযোগ দিন।",
      },
      {
        en: isSpeakerA
          ? "That division of work makes a lot of sense and saves us from duplicating effort."
          : "Agreed. Keeping our roles distinct will help us stay focused until the milestone is complete.",
        bn: isSpeakerA
          ? "কাজের এই বণ্টন খুবই যুক্তিসঙ্গত এবং এটি আমাদের একই কাজ দুবার করা থেকে বাঁচাবে।"
          : "একমত। আমাদের ভূমিকা আলাদা রাখলে মাইলস্টোন সম্পন্ন না হওয়া পর্যন্ত মনোযোগ ধরে রাখা সহজ হবে।",
      },
    ];
    return bPool[turnNum % bPool.length];
  }

  // C1 / C2: Rich multi-clause compound-complex turns for long 45–60 turn dialogues
  const cPool: TurnTemplate[] = [
    {
      en: isSpeakerA
        ? isFormal
          ? `Examining ${topic.toLowerCase()} through a broader lens, one notices that short-term optimizations frequently undermine long-term resilience unless clear guardrails are established.`
          : `When you step back and look at ${topic.toLowerCase()}, quick fixes often backfire in the long run unless we build real safeguards from the start.`
        : isFormal
          ? "That observation is spot-on, and it underscores why governance frameworks must evolve alongside operational execution rather than trailing behind it."
          : "That's so true, which is exactly why our guidelines need to grow with our workflow instead of always playing catch-up.",
      bn: isSpeakerA
        ? `${topic}-কে বৃহত্তর দৃষ্টিকোণ থেকে দেখলে বোঝা যায় যে, সুস্পষ্ট নীতিমালা না থাকলে স্বল্পমেয়াদি সমাধান প্রায়ই দীর্ঘমেয়াদি স্থিতিশীলতাকে দুর্বল করে দেয়।`
        : "এই পর্যবেক্ষণটি একদম সঠিক, এবং এটি প্রমাণ করে যে পরিচালন কাঠামোর উন্নতি কাজের গতির সাথেই তাল মিলিয়ে চলা উচিত।",
    },
    {
      en: isSpeakerA
        ? "Moreover, whenever cross-departmental incentives diverge, teams tend to optimize locally, which inadvertently creates friction at the integration layer."
        : "On top of that, whenever different teams chase conflicting goals, they end up creating bottlenecks right where their work has to connect.",
      bn: isSpeakerA
        ? "তাছাড়া, যখনই বিভিন্ন বিভাগের লক্ষ্য ভিন্নমুখী হয়, তখন দলগুলো কেবল নিজেদের সুবিধা দেখে, যা সমন্বয়ের স্তরে অযাচিত জটিলতা তৈরি করে।"
        : "এর পাশাপাশি, যখন বিভিন্ন দল পরস্পরবিরোধী লক্ষ্যের পেছনে ছোটে, তখন কাজের সংযোগস্থলে জটিলতা তৈরি হয়।",
    },
    {
      en: isSpeakerA
        ? "How might we institutionalize regular feedback loops so that anomalies are surfaced early, long before they compound into systemic failures?"
        : "How can we build steady feedback loops so small issues get spotted early before they snowball into major headaches?",
      bn: isSpeakerA
        ? "আমরা কীভাবে নিয়মিত ফিডব্যাক ব্যবস্থা প্রাতিষ্ঠানিক করতে পারি যাতে অসংগতিগুলো বড় ব্যর্থতায় রূপ নেওয়ার আগেই শুরুতে ধরা পড়ে?"
        : "আমরা কীভাবে নিয়মিত ফিডব্যাক চক্র তৈরি করতে পারি যাতে ছোট সমস্যাগুলো বড় আকার ধারণ করার আগেই ধরা পড়ে?",
    },
    {
      en: isSpeakerA
        ? "Establishing biweekly retrospectives—paired with anonymous pulse surveys—allows candid insights to emerge without triggering defensive posturing."
        : "Running short biweekly check-ins alongside quick anonymous surveys lets honest feedback surface without anyone getting defensive.",
      bn: isSpeakerA
        ? "পাক্ষিক পর্যালোচনার পাশাপাশি বেনামী জরিপ চালু করলে রক্ষণাত্মক মনোভাব ছাড়াই খোলামেলা ও সত্যিকারের মতামত উঠে আসে।"
        : "প্রতি দুই সপ্তাহে সংক্ষিপ্ত পর্যালোচনা ও জরিপ চালালে কারো রক্ষণাত্মক মনোভাব ছাড়াই সৎ মতামত পাওয়া যায়।",
    },
    {
      en: isSpeakerA
        ? `At step ${turnNum} of ${totalTurns}, it's worth asking whether our current assumptions about resource allocation still hold under scrutiny.`
        : `Looking at where we stand now, we should double-check whether our original assumptions about time and budget still make sense.`,
      bn: isSpeakerA
        ? "এই পর্যায়ে আমাদের যাচাই করে দেখা উচিত যে রিসোর্স বণ্টন নিয়ে আমাদের বর্তমান অনুমানগুলো বাস্তবতার নিরিখে এখনও টিকে আছে কি না।"
        : "বর্তমান অবস্থায় দাঁড়িয়ে আমাদের আরেকবার যাচাই করা উচিত যে সময় ও বাজেট নিয়ে আমাদের শুরুর অনুমানগুলো এখনও কার্যকর কি না।",
    },
    {
      en: isSpeakerA
        ? "Indeed, revisiting foundational premises periodically is not a sign of indecision; rather, it reflects intellectual rigor and adaptability."
        : "Exactly—rechecking our core assumptions isn't indecisiveness; it just shows we're disciplined enough to adapt when facts change.",
      bn: isSpeakerA
        ? "নিঃসন্দেহে, মূল ভিত্তিগুলো নিয়মিত পুনর্বিবেচনা করা সিদ্ধান্তহীনতার লক্ষণ নয়; বরং এটি বৌদ্ধিক দক্ষতা ও অভিযোজন ক্ষমতার পরিচয় বহন করে।"
        : "একদম ঠিক—মূল অনুমানগুলো যাচাই করা মানে দ্বিধাগ্রস্ত হওয়া নয়; বরং এটি পরিস্থিতি অনুযায়ী মানিয়ে নেওয়ার সক্ষমতা প্রকাশ করে।",
    },
  ];
  return cPool[turnNum % cPool.length];
}

export function buildProgressiveDialogueVersion(params: {
  slug: string;
  title: string;
  level: CefrLevelCode;
  lengthTierId?: string;
  style?: ConversationStyle;
  speakers?: DialogueSpeaker[];
}): ConversationVersionData {
  const tier: LengthTier =
    (params.lengthTierId ? getLengthTierById(params.lengthTierId) : undefined) ||
    getDefaultLengthTierForLevel(params.level);

  const style: ConversationStyle = params.style || "neutral";
  const speakers = params.speakers && params.speakers.length >= 2 ? params.speakers : DEFAULT_SPEAKERS;
  const targetTurns = tier.targetTurns;

  const corePool = buildTurnPool(params.title, params.level, style);
  const lines: DialogueLineItem[] = [];

  for (let i = 0; i < targetTurns; i++) {
    const seq = i + 1;
    const speaker = speakers[i % 2];
    let tmpl: TurnTemplate;

    if (i < corePool.length - 2) {
      tmpl = corePool[i];
    } else if (i >= targetTurns - 2) {
      // Natural closing turns from corePool end
      const closingIdx = corePool.length - (targetTurns - i);
      tmpl = corePool[Math.max(0, closingIdx)];
    } else {
      tmpl = buildExpansionTurn(seq, targetTurns, params.title, params.level, style);
    }

    lines.push({
      id: `${params.slug}-${tier.id}-${style}-${seq}`,
      sequenceNumber: seq,
      speakerId: speaker.id,
      englishText: tmpl.en,
      translationBn: tmpl.bn,
      translationReviewStatus: "draft",
      learningNote: tmpl.note,
    });
  }

  return {
    versionId: `${params.slug}-${tier.id}-${style}`,
    versionName: `${tier.labelEn} • ${style}`,
    level: params.level,
    lengthType: targetTurns <= 15 ? "short" : targetTurns <= 35 ? "medium" : "long",
    communicationStyle: style,
    speakers,
    lines,
  };
}
