import { countWords, type AudioBookItem } from "@/lib/audiobooks/types";

const STORY_1 = `Every morning at six thirty, Arif walked down the narrow lane behind his apartment building to the small corner tea stall. The air in Dhaka was still cool before the traffic woke up, and the smell of fresh ginger tea drifted across the street. Arif worked as a junior software support specialist, and his biggest dream was to speak English fluently in international client meetings. For two years, he had memorized long lists of difficult vocabulary words from thick books, yet whenever a foreign client asked him a simple question on a video call, his mind went completely blank.

One rainy Tuesday, Arif met an elderly retired professor named Mr. Karim at the tea stall. While they waited for the rain to slow down, Arif noticed Mr. Karim listening to an English podcast through worn wired headphones and quietly repeating short sentences under his breath. Curious, Arif asked him how he stayed so sharp. Mr. Karim smiled and placed his teacup down on the wooden bench. He explained that speaking fluently does not start with memorizing rare words; it starts with training your ears to recognize natural rhythm, pauses, and everyday phrases.

From that morning onward, Mr. Karim gave Arif a simple twenty-minute routine. First, Arif would listen to a short story or real conversation without looking at the text, just trying to catch the main idea. Second, he would listen again while following the sentences on his screen, noticing how words connected smoothly together instead of sounding separate. Third, he would pause after each sentence and read it aloud at the exact same speed and tone as the speaker.

During the first two weeks, Arif felt shy practicing aloud in his small room, especially when he stumbled over phrases like "Could you clarify what you mean by that?" or "Let me double-check the timeline and get back to you." However, because he practiced with real stories and realistic workplace scenes every single morning, his ears began to recognize patterns effortlessly. Instead of translating word by word from Bangla in his head, whole phrases started coming out naturally.

Three months later, during a tense Friday afternoon deployment call with a team in London, the senior engineer suddenly asked Arif to explain why a customer report was delayed. Arif took a calm breath. He did not panic, and he did not search for fancy words. Clearly and steadily, he explained the root cause, shared the exact fix, and promised an update within thirty minutes. After the call ended, his manager sent him a message saying how confident and clear he sounded. Walking back past the tea stall that evening, Arif realized that consistent listening had turned his quiet morning habit into real-world confidence.`;

const STORY_2 = `Last autumn, Maya boarded an overnight train from London to Edinburgh for her very first solo business trip. As a freelance UI designer, she had worked with overseas clients online for years, but meeting a creative director face-to-face in another country felt completely different. She carried a light backpack, a notebook full of sketches, and a quiet worry that she might miss important details if people spoke too fast in Scottish accents.

When she arrived at Waverley Station early in the morning, mist hung over the stone bridges and the air smelled of roasted coffee and damp autumn leaves. Maya walked into a busy café near Princes Street to prepare her presentation slides before her ten o'clock meeting. The café was warm and loud with morning chatter. At the counter, the barista greeted her quickly with a cheerful question she did not quite catch. Instead of freezing or nodding blindly, Maya smiled politely and said, "Sorry, could you say that one more time a little slower?" The barista immediately repeated it clearly, asking if she wanted oat milk or regular milk in her latte. That tiny moment reminded Maya that asking for clarification is a sign of confidence, not weakness.

At ten o'clock sharp, Maya stepped into a sunlit studio overlooking the old town. The creative director, Hannah, welcomed her warmly and introduced two other teammates. During the first ten minutes, everyone talked rapidly about deadlines, user testing, and mobile navigation patterns. Maya focused carefully on listening for key verbs and main ideas rather than trying to catch every single syllable. Whenever she needed to confirm a requirement, she paraphrased it in her own words: "Just to make sure I understood correctly, you want the checkout flow simplified into three steps, right?" Hannah nodded enthusiastically and appreciated how attentive Maya was.

By noon, the meeting wrapped up with a signed contract for a three-month redesign project. Before heading back to the train station, Maya treated herself to a quiet walk up Calton Hill. Looking out over the city rooftops and the distant sea, she wrote a short note in her journal: clear communication is never about sounding perfect or hiding an accent; it is about listening patiently, asking honest questions when something is unclear, and sharing your ideas with calm purpose.`;

const STORY_3 = `For almost six months, Tanvir avoided answering phone calls in English whenever he could. As a customer operations coordinator at a growing logistics company, he felt comfortable writing polite emails because he had time to check his grammar and edit every sentence twice. Phone calls, however, felt unforgiving. There were no subtitles, no pause button, and no extra time to think. Whenever his desk phone rang with an international shipping inquiry, his heart raced before he even picked up the receiver.

Everything changed when his team launched an urgent express delivery service, and Tanvir was assigned to handle live status updates with partner warehouses abroad. On his very first morning in the new role, a partner manager called from Singapore to ask about a delayed customs document. Tanvir misunderstood a single number—hearing "fifteen" instead of "fifty"—and nearly scheduled the wrong truck size. Fortunately, his supervisor caught the mistake before dispatch and pulled Tanvir aside for a calm, practical conversation.

Instead of criticizing him, his supervisor shared three habits that experienced call handlers use every day. First, always repeat numbers, dates, and addresses back to the caller digit by digit, such as "Just to confirm, is that one-five or five-zero?" Second, keep a short list of natural bridging phrases right beside the keyboard, like "Let me pull up your tracking file right now" or "Give me just a second to verify that with our warehouse team." Third, practice active listening every evening by playing short five-minute audio stories at normal speed and summarizing them out loud in four simple sentences.

Tanvir followed those three steps faithfully. Every night after dinner, he put on his headphones, listened to realistic workplace stories, and practiced repeating key numbers and polite confirmation phrases until they rolled off his tongue smoothly. Within a few weeks, the ringing desk phone no longer scared him. When international partners called with urgent changes, Tanvir listened steadily, confirmed every detail aloud, and solved problems faster than anyone expected. What once felt like his biggest weakness slowly became the skill his whole team relied on most.`;

const STORY_4 = `On a bright Saturday morning, Nadia decided to spend the entire day exploring a neighborhood street market without using a map app on her phone. She had recently moved to a new city for her postgraduate studies and realized that although she spent hours studying academic English articles, she rarely had spontaneous everyday conversations with local people. Stepping out of her apartment with only a canvas tote bag and a bottle of water, she challenged herself to ask real people for directions, recommendations, and stories.

Her first stop was a crowded fruit stall painted in bright yellow and green. Nadia picked up a small basket of oranges and asked the shopkeeper how to tell which ones were sweetest. The shopkeeper's eyes lit up. He spent three lively minutes explaining how to check the weight, smell the peel, and look at the stem, throwing in cheerful jokes along the way. Nadia laughed, followed along easily, and walked away with both sweet oranges and a new phrase she had never seen in a textbook: "fresh off the truck."

Next, she wandered toward a second-hand book corner tucked beside an old bakery. She spotted a collection of short mystery stories and asked the bookseller which one he recommended for someone who loved clever endings. They ended up chatting about favorite childhood books, rainy weekend reading habits, and how reading short stories aloud helps learners remember natural sentence flow. Before she left, the bookseller wrote down three classic short story titles on a bookmark for her.

By the time Nadia returned home late in the afternoon, her tote bag was heavy with fresh fruit, warm bread, and two paperback books. More importantly, she felt a quiet shift inside herself. She had spoken with strangers, asked follow-up questions without overthinking grammar rules, and understood real everyday English spoken at natural speed. That evening, she opened her notebook and realized that language comes alive the moment we stop treating it like an exam and start using it to connect with the world around us.`;

export const SEED_AUDIOBOOKS: AudioBookItem[] = [
  {
    id: "story-dhaka-tea-stall",
    kind: "story_book",
    title: "Morning Coffee & Confidence at the Corner Stall",
    titleBn: "সকালের চায়ের দোকানে ইংরেজি বলার আত্মবিশ্বাস",
    description:
      "A relatable story about overcoming hesitation in client calls through a daily 20-minute listening routine.",
    descriptionBn:
      "প্রতিদিন মাত্র ২০ মিনিটের লিসেনিং অভ্যাসের মাধ্যমে কীভাবে ক্লায়েন্ট মিটিংয়ের জড়তা কাটানো যায় তার বাস্তব গল্প।",
    level: "A2",
    category: "Daily Life & Career",
    storyText: STORY_1,
    summaryBn:
      "আরিফ নামের একজন জুনিয়র সফটওয়্যার সাপোর্ট কর্মী শুধু কঠিন শব্দ মুখস্থ করেও ইংরেজি বলতে পারছিলেন না। অবসরপ্রাপ্ত অধ্যাপক করিমের পরামর্শে প্রতিদিন গল্প শুনে ও একসাথে পড়ে-পড়ে তিনি সাবলীলভাবে কথা বলার আত্মবিশ্বাস অর্জন করেন।",
    wordCount: countWords(STORY_1),
    durationLabel: "~3 min",
    createdAt: "2026-11-27T00:00:00.000Z",
    isBuiltIn: true,
  },
  {
    id: "story-edinburgh-trip",
    kind: "story_book",
    title: "The Solo Business Trip to Edinburgh",
    titleBn: "এডিনবার্গে প্রথম একক বিজনেস ট্রিপ",
    description:
      "How polite clarification and active listening helped a freelance designer win a 3-month project.",
    descriptionBn:
      "দ্রুত কথাবার্তার মাঝেও ভদ্রভাবে প্রশ্ন করে ও মনোযোগ দিয়ে শুনে কীভাবে একজন ডিজাইনার বড় প্রজেক্ট পেলেন।",
    level: "B1",
    category: "Workplace & Travel",
    storyText: STORY_2,
    summaryBn:
      "ফ্রিল্যান্সার মায়া প্রথমবার সরাসরি ক্লায়েন্ট মিটিংয়ের জন্য এডিনবার্গে যান। অ্যাকসেন্ট বা গতির ভয়ে না থেমে, ক্লিয়ারিফিকেশন প্রশ্ন ও মূল ভাব শোনার কৌশলে তিনি সফলভাবে চুক্তি সম্পন্ন করেন।",
    wordCount: countWords(STORY_2),
    durationLabel: "~3 min",
    createdAt: "2026-11-27T00:00:00.000Z",
    isBuiltIn: true,
  },
  {
    id: "story-phone-confidence",
    kind: "story_book",
    title: "Turning Phone Anxiety into Calm Clarity",
    titleBn: "ফোন কলের ভয় কাটিয়ে স্পষ্ট যোগাযোগ",
    description:
      "Practical listening habits for handling fast international phone calls and confirming numbers accurately.",
    descriptionBn:
      "আন্তর্জাতিক ফোন কলে সংখ্যা ও তথ্য সঠিকভাবে বুঝে ও নিশ্চিত করে কথা বলার কার্যকর কৌশল।",
    level: "B1",
    category: "Workplace Listening",
    storyText: STORY_3,
    summaryBn:
      "তানভীর ইংরেজিতে ইমেইল লিখতে স্বাচ্ছন্দ্যবোধ করলেও ফোন কলে ভয় পেতেন। সংখ্যা পুনরাবৃত্তি, ব্রিজিং ফ্রেজ ও নিয়মিত অডিও গল্প শোনার মাধ্যমে তিনি টিমের সেরা কমিউনিকেটরে পরিণত হন।",
    wordCount: countWords(STORY_3),
    durationLabel: "~3 min",
    createdAt: "2026-11-27T00:00:00.000Z",
    isBuiltIn: true,
  },
  {
    id: "story-saturday-market",
    kind: "story_book",
    title: "A Saturday Without Maps at the Street Market",
    titleBn: "ম্যাপ ছাড়াই শনিবারের স্ট্রিট মার্কেটে একদিন",
    description:
      "Discover how natural, everyday conversations at a local market bring textbook English to life.",
    descriptionBn:
      "বইয়ের বাইরে বাস্তব জীবনের ছোট ছোট কথোপকথন কীভাবে ইংরেজি শেখাকে জীবন্ত করে তোলে।",
    level: "A2",
    category: "Everyday Social",
    storyText: STORY_4,
    summaryBn:
      "নাদিয়া পরীক্ষার ইংরেজির বাইরে গিয়ে বাস্তব মানুষের সাথে কথা বলার চ্যালেঞ্জ নেন। ফল বিক্রেতা ও বই বিক্রেতার সাথে স্বাভাবিক আড্ডায় তিনি বুঝতে পারেন ভাষা আসলে যোগাযোগের মাধ্যম।",
    wordCount: countWords(STORY_4),
    durationLabel: "~3 min",
    createdAt: "2026-11-27T00:00:00.000Z",
    isBuiltIn: true,
  },
];
