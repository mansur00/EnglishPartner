/**
 * Professional English Career Paths Registry (Milestone 4A)
 * Complies with ECP_Phase_Plan.md §7.1 (Track 4A) and ECP_System_Framework.md §4.
 */

export interface ProfessionMeta {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  description: string;
  descriptionBn: string;
  category: "tech" | "business" | "service" | "education";
  targetCefr: string;
  estimatedHours: number;
  scenarioCount: number;
  competenciesBn: string[];
  roleExamplesBn: string[];
}

export const PROFESSIONS_REGISTRY: Record<string, ProfessionMeta> = {
  "ui-ux-designer": {
    id: "uiux",
    slug: "ui-ux-designer",
    name: "UI/UX Designer",
    nameBn: "ইউআই/ইউএক্স ডিজাইনার",
    tagline: "Design Critiques, Client Discovery & Tech Handoffs",
    taglineBn: "ডিজাইন প্রেজেন্টেশন, ক্লায়েন্ট মিটিং ও ডেভেলপার হ্যান্ডঅফ",
    description:
      "Master professional English for remote product design: pitch user research, justify visual choices, and navigate scope revisions.",
    descriptionBn:
      "রিমোট প্রজেক্টে ক্লায়েন্ট মিটিং পরিচালনা, ওয়্যারফ্রেম প্রেজেন্টেশন এবং ডেভেলপারদের সাথে ডিজাইন টোকেন নিয়ে আত্মবিশ্বাসী আলোচনা শিখুন।",
    category: "tech",
    targetCefr: "B1 - B2",
    estimatedHours: 6,
    scenarioCount: 5,
    competenciesBn: [
      "প্রজেক্ট কিকঅফ ও ডিসকভারি মিটিং",
      "ওয়্যারফ্রেম ও প্রোটোটাইপ প্রেজেন্টেশন",
      "ইউজার রিসার্চের ভিত্তিতে ডিজাইন যুক্তি উপস্থাপন",
      "ফিডব্যাক গ্রহণ ও স্কোপ পরিবর্তন নেগোসিয়েশন",
      "ইঞ্জিনিয়ারদের সাথে ডিজাইন সিস্টেম হ্যান্ডঅফ",
    ],
    roleExamplesBn: ["UI Designer", "Product Designer", "UX Researcher"],
  },
  "software-engineer": {
    id: "swe",
    slug: "software-engineer",
    name: "Software Engineer",
    nameBn: "সফটওয়্যার ইঞ্জিনিয়ার",
    tagline: "Daily Standups, Pull Requests & Architecture Reviews",
    taglineBn: "ডেইলি স্ক্রাম স্ট্যান্ডআপ, পিআর কোড রিভিউ ও আর্কিটেকচার মিটিং",
    description:
      "Communicate clearly in global agile engineering teams: articulate blockers, review code constructively, and debate technical trade-offs.",
    descriptionBn:
      "গ্লোবাল এজাইল স্প্রিন্টে ব্লকার জানানো, পিআরে গঠনমূলক কোড রিভিউ দেওয়া এবং সিস্টেম আর্কিটেকচারের সুবিধা-অসুবিধা যুক্তি দিয়ে বোঝানো শিখুন।",
    category: "tech",
    targetCefr: "B1 - B2",
    estimatedHours: 5,
    scenarioCount: 3,
    competenciesBn: [
      "ডেইলি স্ট্যান্ডআপে অগ্রগতি ও ব্লকার উপস্থাপন",
      "গিটহাবে মার্জিত ও গঠনমূলক কোড রিভিউ মন্তব্য",
      "সিস্টেম ডিজাইন ও টেকনিক্যাল ট্রেড-অফ ডিসকাশন",
    ],
    roleExamplesBn: ["Frontend Engineer", "Backend Developer", "Full-Stack Dev"],
  },
  "remote-freelancer": {
    id: "freelancer",
    slug: "remote-freelancer",
    name: "Remote Freelancer",
    nameBn: "রিমোট ফ্রিল্যান্সার ও কনসালট্যান্ট",
    tagline: "Client Proposals, Deadlines & Payment Negotiation",
    taglineBn: "ক্লায়েন্ট প্রপোজাল, ডেডলাইন ও পেমেন্ট নেগোসিয়েশন",
    description:
      "Thrive in global marketplaces: clarify client requirements, handle project extensions, and negotiate contracts professionally.",
    descriptionBn:
      "আপওয়ার্ক বা ফাইভার ক্লায়েন্টদের সাথে প্রজেক্টের বাজেট নির্ধারণ, সময়সীমা বৃদ্ধি এবং পারিশ্রমিক সংক্রান্ত পেশাদার যোগাযোগ শিখুন।",
    category: "business",
    targetCefr: "B1 - B2",
    estimatedHours: 5,
    scenarioCount: 3,
    competenciesBn: [
      "প্রপোজাল সাবমিশন ও প্রথম ক্লায়েন্ট কল",
      "সময়মতো ডেডলাইন বৃদ্ধি ও মাইলস্টোন আপডেট",
      "বাজেট নেগোসিয়েশন ও ইনভয়েস ফলোআপ",
    ],
    roleExamplesBn: ["Digital Marketer", "Virtual Assistant", "Independent Consultant"],
  },
  "healthcare-worker": {
    id: "health",
    slug: "healthcare-worker",
    name: "Healthcare Assistant",
    nameBn: "স্বাস্থ্যসেবা ও ক্লিনিক সহকারী",
    tagline: "Patient Triage, Care Handover & Medical English",
    taglineBn: "রোগীর ইতিহাস গ্রহণ, শিফট হ্যান্ডওভার ও চিকিৎসা সংক্রান্ত ইংরেজি",
    description:
      "Communicate with empathy and accuracy: take patient histories, report vitals, and coordinate care with senior doctors.",
    descriptionBn:
      "হাসপাতাল বা ক্লিনিকে রোগীর লক্ষণ নির্ভুলভাবে লিপিবদ্ধ করা, শিফট হস্তান্তরের সময় রিপোর্ট ব্রিফিং এবং ডাক্তারদের সাথে সমন্বয় শিখুন।",
    category: "service",
    targetCefr: "A2 - B1",
    estimatedHours: 4,
    scenarioCount: 2,
    competenciesBn: [
      "রোগীর প্রাথমিক লক্ষণ ও অ্যালার্জি সংক্রান্ত ইতিহাস গ্রহণ",
      "ডাক্তারদের কাছে রোগীর ভাইটাল রিপোর্ট হ্যান্ডওভার",
    ],
    roleExamplesBn: ["Nurse", "Clinic Coordinator", "Medical Assistant"],
  },
  "teacher": {
    id: "edu",
    slug: "teacher",
    name: "Teacher & Educator",
    nameBn: "শিক্ষক ও শিক্ষা সমন্বয়কারী",
    tagline: "Parent-Teacher Conferences & Classroom Communication",
    taglineBn: "অভিভাবক সমাবেশ, পাঠ পরিকল্পনা ও ক্লাসরুম নির্দেশনা",
    description:
      "Engage students and parents with clarity: conduct progress meetings, give constructive student feedback, and lead workshops.",
    descriptionBn:
      "অভিভাবকদের সাথে শিক্ষার্থীর অগ্রগতি পর্যালোচনা, ইতিবাচক ফিডব্যাক প্রদান এবং আন্তর্জাতিক সেমিনারে পাঠদান উপস্থাপন শিখুন।",
    category: "education",
    targetCefr: "B1 - B2",
    estimatedHours: 4,
    scenarioCount: 2,
    competenciesBn: [
      "অভিভাবক মিটিংয়ে শিক্ষার্থীর পারফরম্যান্স আলোচনা",
      "শ্রেণিকক্ষে স্পষ্ট ও বিনম্র ইংরেজি নির্দেশনা",
    ],
    roleExamplesBn: ["ESL Teacher", "School Coordinator", "Online Tutor"],
  },
};

export const ALL_PROFESSIONS = Object.values(PROFESSIONS_REGISTRY);

export function getProfessionBySlug(slug: string): ProfessionMeta | undefined {
  if (slug === "designer") {
    return PROFESSIONS_REGISTRY["ui-ux-designer"];
  }
  return PROFESSIONS_REGISTRY[slug];
}
