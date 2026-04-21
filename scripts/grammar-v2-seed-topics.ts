import type { CefrLevel, GrammarCategory, GrammarExample } from "../src/lib/supabase/database.types";

interface GrammarSeedQuiz {
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
}

export interface GrammarV2SeedTopic {
  slug: string;
  title: string;
  category: GrammarCategory;
  cefr_level: CefrLevel;
  description: string;
  rules: { title: string; content: string }[];
  examples: GrammarExample[];
  quiz_questions: GrammarSeedQuiz[];
  published: boolean;
}

export const GRAMMAR_V2_SEED_TOPICS: GrammarV2SeedTopic[] = [
  {
    slug: "present-perfect",
    title: "Present Perfect",
    category: "tenses",
    cefr_level: "A2",
    description:
      "Use the Present Perfect to talk about life experiences, recent actions with present relevance, and ongoing situations.",
    rules: [
      {
        title: "Form",
        content:
          "Subject + have/has + past participle (verb-ed or irregular 3rd form). Example: I have lived, She has gone.",
      },
      {
        title: "Experience",
        content:
          "Use it to ask or talk about life experiences at any time. Example: Have you ever been to Japan?",
      },
      {
        title: "Recent past with present relevance",
        content:
          "Use it when the past action affects the now. Example: I have lost my keys (and I still don't have them).",
      },
      {
        title: "Signal words",
        content: "ever, never, already, yet, just, so far, recently, for, since.",
      },
    ],
    examples: [
      { sentence: "She has lived in London since 2020.", note: "Started in 2020, still living there." },
      { sentence: "I have never tried sushi.", note: "Life experience up to now." },
      { sentence: "We have just finished dinner.", note: "Recent action, just now." },
      { sentence: "They have already seen this movie.", note: "Something happened before expected." },
      { sentence: "Have you done your homework yet?", note: "Question about recent completion." },
    ],
    quiz_questions: [
      {
        question: "I _____ to Paris three times.",
        options: ["went", "have been", "was going", "had been"],
        correct_answer_index: 1,
        explanation: "Present Perfect for life experiences: 'have been'.",
      },
      {
        question: "She _____ her keys. She can't find them.",
        options: ["lost", "has lost", "is losing", "losing"],
        correct_answer_index: 1,
        explanation: "Past action with present result — Present Perfect.",
      },
      {
        question: "_____ you _____ the new movie yet?",
        options: ["Did / see", "Have / seen", "Are / seeing", "Do / see"],
        correct_answer_index: 1,
        explanation: "'Yet' pairs with Present Perfect in questions.",
      },
      {
        question: "We _____ in this house for ten years.",
        options: ["live", "lived", "have lived", "are living"],
        correct_answer_index: 2,
        explanation: "Ongoing situation from past to present — Present Perfect.",
      },
      {
        question: "He _____ finished the report.",
        options: ["just", "is just", "has just", "was just"],
        correct_answer_index: 2,
        explanation: "'Just' with Present Perfect for recent actions.",
      },
    ],
    published: true,
  },
  {
    slug: "past-continuous",
    title: "Past Continuous",
    category: "tenses",
    cefr_level: "A2",
    description: "Past Continuous describes actions in progress at a specific moment in the past.",
    rules: [
      {
        title: "Form",
        content: "Subject + was/were + verb-ing. Example: I was reading, They were playing.",
      },
      {
        title: "Action in progress",
        content:
          "Describes an ongoing action at a specific past moment. Example: At 8pm I was watching TV.",
      },
      {
        title: "Interrupted action",
        content:
          "Often used with Past Simple to show a longer action interrupted by a shorter one. Example: I was cooking when the phone rang.",
      },
      { title: "Signal words", content: "while, as, when, at that moment." },
    ],
    examples: [
      { sentence: "I was sleeping at midnight.", note: "Ongoing action at a specific time." },
      { sentence: "She was studying while I was watching TV.", note: "Two ongoing actions." },
      {
        sentence: "They were playing football when it started to rain.",
        note: "Ongoing action interrupted.",
      },
      {
        sentence: "What were you doing yesterday at 5pm?",
        note: "Question about an action at a specific past time.",
      },
      { sentence: "He wasn't listening to me.", note: "Negative form." },
    ],
    quiz_questions: [
      {
        question: "I _____ TV when she called.",
        options: ["watched", "was watching", "have watched", "watch"],
        correct_answer_index: 1,
        explanation: "Past Continuous for ongoing action interrupted by Past Simple.",
      },
      {
        question: "They _____ football at 3pm yesterday.",
        options: ["play", "played", "were playing", "have played"],
        correct_answer_index: 2,
        explanation: "Specific past time — Past Continuous.",
      },
      {
        question: "While she _____, I was cooking.",
        options: ["studied", "was studying", "has studied", "studies"],
        correct_answer_index: 1,
        explanation: "'While' with two ongoing past actions — Past Continuous.",
      },
      {
        question: "What _____ you _____ at 10pm last night?",
        options: ["did / do", "were / doing", "are / doing", "have / done"],
        correct_answer_index: 1,
        explanation: "Question about ongoing action at specific past time.",
      },
      {
        question: "The baby _____ all morning.",
        options: ["cry", "cried", "was crying", "has cried"],
        correct_answer_index: 2,
        explanation: "Ongoing action throughout the morning — Past Continuous.",
      },
    ],
    published: true,
  },
  {
    slug: "future-will-vs-going-to",
    title: "Will vs Going to",
    category: "tenses",
    cefr_level: "A2",
    description:
      "Both express future, but with different meanings: 'will' for spontaneous decisions or predictions; 'going to' for plans or evidence-based predictions.",
    rules: [
      {
        title: "Will — spontaneous",
        content: "Decisions made at the moment of speaking. Example: I'll help you!",
      },
      {
        title: "Will — predictions (opinion)",
        content: "Predictions based on belief or opinion. Example: I think it will rain.",
      },
      {
        title: "Going to — plans",
        content: "Prior plans or intentions. Example: I'm going to study tonight.",
      },
      {
        title: "Going to — evidence",
        content:
          "Predictions based on what you can see. Example: Look at those clouds — it's going to rain!",
      },
    ],
    examples: [
      { sentence: "I'll answer the phone.", note: "Spontaneous decision." },
      {
        sentence: "I'm going to visit my grandma this weekend.",
        note: "Pre-made plan.",
      },
      { sentence: "I think she'll win the game.", note: "Prediction based on opinion." },
      { sentence: "She's going to have a baby!", note: "Prediction based on evidence." },
      { sentence: "Don't worry, I'll carry that for you.", note: "Offer / spontaneous help." },
    ],
    quiz_questions: [
      {
        question: "Look at those dark clouds! It _____ rain.",
        options: ["will", "is going to", "rains", "rained"],
        correct_answer_index: 1,
        explanation: "Evidence-based prediction — going to.",
      },
      {
        question: "The phone is ringing. I _____ get it.",
        options: ["am getting", "am going to get", "'ll get", "get"],
        correct_answer_index: 2,
        explanation: "Spontaneous decision — will.",
      },
      {
        question: "I _____ study medicine next year. I've already applied.",
        options: ["will", "am going to", "study", "studied"],
        correct_answer_index: 1,
        explanation: "Pre-made plan with evidence — going to.",
      },
      {
        question: "I think she _____ love the gift.",
        options: ["is going to", "will", "loves", "loved"],
        correct_answer_index: 1,
        explanation: "Opinion-based prediction — will.",
      },
      {
        question: "We _____ a party on Saturday. Want to come?",
        options: ["will have", "are having a", "are going to have", "had"],
        correct_answer_index: 2,
        explanation: "Already planned — going to.",
      },
    ],
    published: true,
  },
  {
    slug: "first-conditional",
    title: "First Conditional",
    category: "conditionals",
    cefr_level: "B1",
    description:
      "Use the First Conditional to talk about real or possible future situations and their likely results.",
    rules: [
      {
        title: "Form",
        content: "If + Present Simple, ... will + base verb. Example: If it rains, I will stay home.",
      },
      {
        title: "Real future situations",
        content: "Used when the situation is possible or likely to happen.",
      },
      {
        title: "Order flexibility",
        content:
          "The 'if' clause can come first or second. No comma when it comes second. Example: I will stay home if it rains.",
      },
      {
        title: "Alternative to 'will'",
        content:
          "You can use 'may', 'might', 'can', or imperative instead of 'will'. Example: If you see her, tell her I said hi.",
      },
    ],
    examples: [
      { sentence: "If it rains, we will cancel the picnic.", note: "Real future possibility." },
      { sentence: "She'll be late if she doesn't hurry.", note: "Same meaning, different order." },
      { sentence: "If you study hard, you will pass the exam.", note: "Likely result." },
      { sentence: "If I have time, I might call you.", note: "Modal verb alternative." },
      { sentence: "If you see John, tell him to call me.", note: "Imperative in result clause." },
    ],
    quiz_questions: [
      {
        question: "If it _____ tomorrow, we'll go to the beach.",
        options: ["will be sunny", "is sunny", "was sunny", "sunny"],
        correct_answer_index: 1,
        explanation: "If-clause uses Present Simple in First Conditional.",
      },
      {
        question: "If you miss the bus, I _____ you a ride.",
        options: ["give", "gave", "will give", "would give"],
        correct_answer_index: 2,
        explanation: "Result clause uses will + base verb.",
      },
      {
        question: "We won't go to the park if it _____.",
        options: ["rains", "will rain", "rained", "is raining"],
        correct_answer_index: 0,
        explanation: "If-clause with Present Simple even when it comes second.",
      },
      {
        question: "If she _____ harder, she'll succeed.",
        options: ["worked", "works", "will work", "would work"],
        correct_answer_index: 1,
        explanation: "Present Simple in if-clause.",
      },
      {
        question: "If you _____ the door, the dog will run away.",
        options: ["open", "opened", "will open", "opens"],
        correct_answer_index: 0,
        explanation: "Base form with 'you' in Present Simple.",
      },
    ],
    published: true,
  },
  {
    slug: "second-conditional",
    title: "Second Conditional",
    category: "conditionals",
    cefr_level: "B1",
    description: "Use the Second Conditional for imaginary or unreal present/future situations.",
    rules: [
      {
        title: "Form",
        content:
          "If + Past Simple, ... would + base verb. Example: If I won the lottery, I would travel the world.",
      },
      {
        title: "Imaginary / unreal situations",
        content: "Situations that are unlikely or impossible right now.",
      },
      {
        title: "Were for all persons",
        content:
          "With 'to be', use 'were' for all persons in formal English. Example: If I were you, I would apologize.",
      },
      {
        title: "Alternatives",
        content:
          "Could/might can replace would for possibility. Example: If I had more time, I could help you.",
      },
    ],
    examples: [
      {
        sentence: "If I had a million dollars, I would buy a house by the sea.",
        note: "Imaginary situation.",
      },
      { sentence: "If I were you, I would take the job.", note: "Advice with 'were'." },
      { sentence: "She would travel more if she had time.", note: "Reverse order, no comma." },
      { sentence: "What would you do if you saw a ghost?", note: "Hypothetical question." },
      {
        sentence: "If we lived closer, we would see each other more often.",
        note: "Unreal present situation.",
      },
    ],
    quiz_questions: [
      {
        question: "If I _____ rich, I would travel the world.",
        options: ["am", "was", "were", "be"],
        correct_answer_index: 2,
        explanation: "Formal English: 'were' for all persons with to be in Second Conditional.",
      },
      {
        question: "She would call you if she _____ your number.",
        options: ["has", "had", "would have", "have"],
        correct_answer_index: 1,
        explanation: "If-clause uses Past Simple in Second Conditional.",
      },
      {
        question: "If I _____ you, I'd apologize.",
        options: ["am", "were", "will be", "would be"],
        correct_answer_index: 1,
        explanation: "Classic advice structure: 'If I were you'.",
      },
      {
        question: "What _____ you do if you won the lottery?",
        options: ["will", "do", "would", "are"],
        correct_answer_index: 2,
        explanation: "Result clause uses 'would' in Second Conditional.",
      },
      {
        question: "If he _____ harder, he would pass.",
        options: ["studies", "studied", "will study", "would study"],
        correct_answer_index: 1,
        explanation: "Past Simple in if-clause.",
      },
    ],
    published: true,
  },
  {
    slug: "third-conditional",
    title: "Third Conditional",
    category: "conditionals",
    cefr_level: "B2",
    description:
      "Use the Third Conditional to talk about past situations that didn't happen — imagining a different past.",
    rules: [
      {
        title: "Form",
        content:
          "If + Past Perfect, ... would have + past participle. Example: If I had studied, I would have passed.",
      },
      {
        title: "Unreal past",
        content:
          "Describes something that didn't actually happen — looking back with regret or speculation.",
      },
      {
        title: "Mixed modals",
        content:
          "Could have / might have can replace would have. Example: If he had called, I could have helped.",
      },
      {
        title: "Contractions",
        content:
          "'would have' is often contracted to 'would've' in speech and informal writing.",
      },
    ],
    examples: [
      {
        sentence: "If I had known, I would have come earlier.",
        note: "I didn't know, so I didn't come earlier.",
      },
      { sentence: "She would have won if she hadn't fallen.", note: "She fell, so she didn't win." },
      {
        sentence: "If we had left on time, we wouldn't have missed the train.",
        note: "We didn't leave on time.",
      },
      {
        sentence: "I could have passed the exam if I had studied more.",
        note: "Could have for possibility.",
      },
      { sentence: "What would you have done in my place?", note: "Past hypothetical." },
    ],
    quiz_questions: [
      {
        question: "If I _____ your number, I would have called you.",
        options: ["have had", "had", "had had", "would have had"],
        correct_answer_index: 2,
        explanation: "Past Perfect uses 'had had' (had + past participle of 'have').",
      },
      {
        question: "She _____ the train if she hadn't stopped for coffee.",
        options: ["will catch", "caught", "would catch", "would have caught"],
        correct_answer_index: 3,
        explanation: "Result clause in Third Conditional uses would have + past participle.",
      },
      {
        question: "If he had studied, he _____ the test.",
        options: ["passes", "passed", "would pass", "would have passed"],
        correct_answer_index: 3,
        explanation: "Unreal past result — would have passed.",
      },
      {
        question: "I _____ you if I had known.",
        options: ["helped", "would help", "would have helped", "will help"],
        correct_answer_index: 2,
        explanation: "Classic Third Conditional expressing regret.",
      },
      {
        question: "If we _____ earlier, we wouldn't be late.",
        options: ["leave", "left", "had left", "would leave"],
        correct_answer_index: 2,
        explanation: "If-clause uses Past Perfect in Third Conditional.",
      },
    ],
    published: true,
  },
  {
    slug: "passive-voice",
    title: "Passive Voice",
    category: "passive",
    cefr_level: "B1",
    description:
      "Use the Passive Voice when the action is more important than who does it, or when the doer is unknown or obvious.",
    rules: [
      {
        title: "Form",
        content:
          "Object + be (in appropriate tense) + past participle. Example: The book was written by Jane Austen.",
      },
      {
        title: "When to use",
        content:
          "When the doer is unknown ('My wallet was stolen'), obvious ('He was arrested'), or when the focus is on the action.",
      },
      {
        title: "By + agent",
        content: "You can include who did it with 'by'. Often omitted if unimportant.",
      },
      {
        title: "Across tenses",
        content:
          "Passive works in any tense: present (is done), past (was done), perfect (has been done), future (will be done), modal (can be done).",
      },
    ],
    examples: [
      { sentence: "The window was broken yesterday.", note: "Past Simple Passive." },
      { sentence: "English is spoken in many countries.", note: "Present Simple Passive for general truth." },
      { sentence: "The letter has been sent.", note: "Present Perfect Passive." },
      { sentence: "The project will be finished next week.", note: "Future Passive." },
      { sentence: "This book was written by Orwell.", note: "With 'by' agent." },
    ],
    quiz_questions: [
      {
        question: "The house _____ last year.",
        options: ["built", "was built", "is built", "has built"],
        correct_answer_index: 1,
        explanation: "Past Simple Passive: was + past participle.",
      },
      {
        question: "The Mona Lisa _____ by Leonardo da Vinci.",
        options: ["painted", "was painted", "is painting", "paints"],
        correct_answer_index: 1,
        explanation: "Past Simple Passive with 'by' agent.",
      },
      {
        question: "English _____ all over the world.",
        options: ["speaks", "is spoken", "spoke", "has spoken"],
        correct_answer_index: 1,
        explanation: "Present Simple Passive for general facts.",
      },
      {
        question: "My car _____ yesterday. I'm so upset.",
        options: ["stole", "was stolen", "is stolen", "has stole"],
        correct_answer_index: 1,
        explanation: "Past Simple Passive; agent unknown.",
      },
      {
        question: "The emails _____ every morning.",
        options: ["check", "are checked", "checked", "have checked"],
        correct_answer_index: 1,
        explanation: "Present Simple Passive for routine actions.",
      },
    ],
    published: true,
  },
  {
    slug: "reported-speech",
    title: "Reported Speech",
    category: "reported-speech",
    cefr_level: "B2",
    description:
      "Use Reported Speech (Indirect Speech) to report what someone said without quoting directly. Tenses usually shift one step back.",
    rules: [
      {
        title: "Tense shift",
        content:
          "Present → Past (I am happy → She said she was happy). Past → Past Perfect. Will → Would.",
      },
      {
        title: "Pronoun changes",
        content:
          "Pronouns change to match the new speaker. 'I' often becomes 'he/she', 'my' becomes 'his/her'.",
      },
      {
        title: "Time expressions",
        content:
          "Today → that day, tomorrow → the next day, yesterday → the previous day, now → then.",
      },
      {
        title: "Questions",
        content:
          "Use 'if' or 'whether' for yes/no questions. Word order becomes statement order. Example: 'Are you hungry?' → She asked if I was hungry.",
      },
    ],
    examples: [
      { sentence: "'I am tired.' → He said he was tired.", note: "Present to Past." },
      { sentence: "'I will call you.' → She said she would call me.", note: "Will to would." },
      {
        sentence: "'I saw the movie yesterday.' → He said he had seen the movie the previous day.",
        note: "Past to Past Perfect, yesterday → previous day.",
      },
      { sentence: "'Do you speak English?' → She asked if I spoke English.", note: "Question to indirect." },
      { sentence: "'I'm leaving now.' → He said he was leaving then.", note: "Now → then." },
    ],
    quiz_questions: [
      {
        question: "'I am hungry.' → She said she _____ hungry.",
        options: ["is", "was", "has been", "were"],
        correct_answer_index: 1,
        explanation: "Present to Past: 'am' becomes 'was'.",
      },
      {
        question: "'I will help you.' → He said he _____ help me.",
        options: ["will", "would", "is going to", "help"],
        correct_answer_index: 1,
        explanation: "'Will' becomes 'would' in reported speech.",
      },
      {
        question: "'Do you like pizza?' → She asked me _____ I liked pizza.",
        options: ["that", "if", "to", "for"],
        correct_answer_index: 1,
        explanation: "Yes/no questions use 'if' or 'whether'.",
      },
      {
        question: "'I met her yesterday.' → He said he had met her _____.",
        options: ["yesterday", "today", "the previous day", "tomorrow"],
        correct_answer_index: 2,
        explanation: "Yesterday shifts to 'the previous day'.",
      },
      {
        question: "'I can swim.' → She said she _____ swim.",
        options: ["can", "could", "might", "will"],
        correct_answer_index: 1,
        explanation: "'Can' becomes 'could' in reported speech.",
      },
    ],
    published: true,
  },
  {
    slug: "modals-obligation",
    title: "Modals — Obligation & Necessity",
    category: "modals",
    cefr_level: "A2",
    description:
      "Use must, have to, should, and their negatives to express different levels of obligation and advice.",
    rules: [
      {
        title: "Must — strong obligation",
        content: "Personal feeling of necessity. Example: I must finish this today.",
      },
      {
        title: "Have to — external obligation",
        content: "Rules or circumstances require it. Example: I have to wear a uniform at work.",
      },
      {
        title: "Should — advice",
        content: "Recommendation, not strict obligation. Example: You should see a doctor.",
      },
      {
        title: "Mustn't vs Don't have to",
        content:
          "Mustn't = it's forbidden. Don't have to = it's not necessary. Huge difference!",
      },
    ],
    examples: [
      { sentence: "You must wear a seatbelt.", note: "Strong rule." },
      { sentence: "I have to work on Saturday.", note: "External requirement." },
      { sentence: "You should drink more water.", note: "Advice." },
      { sentence: "You mustn't smoke here.", note: "Forbidden." },
      { sentence: "You don't have to come if you don't want to.", note: "Not necessary." },
    ],
    quiz_questions: [
      {
        question: "You _____ wear a helmet. It's the law.",
        options: ["should", "must", "can", "might"],
        correct_answer_index: 1,
        explanation: "Must for strong obligation (especially law).",
      },
      {
        question: "You _____ smoke inside. It's forbidden.",
        options: ["don't have to", "shouldn't", "mustn't", "can"],
        correct_answer_index: 2,
        explanation: "Mustn't = forbidden. Don't have to = not necessary.",
      },
      {
        question: "I _____ study tonight. I have a test tomorrow.",
        options: ["might", "have to", "should", "can"],
        correct_answer_index: 1,
        explanation: "External obligation (the test requires it) — have to.",
      },
      {
        question: "You look tired. You _____ go to bed early.",
        options: ["must", "mustn't", "should", "shouldn't"],
        correct_answer_index: 2,
        explanation: "Friendly advice — should.",
      },
      {
        question: "You _____ bring food. There will be plenty at the party.",
        options: ["mustn't", "don't have to", "have to", "should"],
        correct_answer_index: 1,
        explanation: "Not necessary — don't have to.",
      },
    ],
    published: true,
  },
  {
    slug: "modals-possibility",
    title: "Modals — Possibility & Certainty",
    category: "modals",
    cefr_level: "B1",
    description:
      "Use may, might, could, must, and can't to express different degrees of certainty about something.",
    rules: [
      {
        title: "Must — strong certainty",
        content: "I'm sure it's true. Example: She must be tired (I can see it).",
      },
      {
        title: "May/Might/Could — possibility",
        content: "Maybe true. Example: It may rain later.",
      },
      {
        title: "Can't — strong certainty (negative)",
        content: "I'm sure it's not true. Example: That can't be Tom — he's in Paris!",
      },
      {
        title: "Order of certainty",
        content:
          "must (100% sure positive) > may/might/could (maybe) > can't (100% sure negative).",
      },
    ],
    examples: [
      { sentence: "She must be at home. Her car is outside.", note: "Strong positive certainty." },
      { sentence: "It might rain tonight.", note: "Possibility." },
      { sentence: "He could be in the meeting.", note: "Another way to say 'possible'." },
      { sentence: "That can't be right.", note: "Strong negative certainty." },
      { sentence: "You may feel a little tired after the flight.", note: "Possibility (polite)." },
    ],
    quiz_questions: [
      {
        question: "Those flowers are beautiful! They _____ be from John.",
        options: ["can't", "must", "don't have to", "shouldn't"],
        correct_answer_index: 1,
        explanation: "Strong positive certainty — must be.",
      },
      {
        question: "I'm not sure, but it _____ rain later.",
        options: ["must", "can't", "might", "should"],
        correct_answer_index: 2,
        explanation: "Possibility — might.",
      },
      {
        question: "That _____ be John! He's on holiday in Italy.",
        options: ["must", "might", "can't", "could"],
        correct_answer_index: 2,
        explanation: "Strong negative certainty — can't.",
      },
      {
        question: "You look pale. You _____ feel sick.",
        options: ["must", "can't", "mustn't", "should"],
        correct_answer_index: 0,
        explanation: "Strong certainty from evidence — must.",
      },
      {
        question: "I don't know where she is. She _____ be at the gym.",
        options: ["must", "can't", "could", "should"],
        correct_answer_index: 2,
        explanation: "Uncertain possibility — could.",
      },
    ],
    published: true,
  },
  {
    slug: "relative-clauses",
    title: "Relative Clauses",
    category: "clauses",
    cefr_level: "B1",
    description:
      "Relative clauses give more information about a noun. They use words like who, which, that, where, when, and whose.",
    rules: [
      {
        title: "Defining vs non-defining",
        content:
          "Defining: gives essential info (no commas). Non-defining: gives extra info (with commas). Example: The man who called you is my boss (defining). My boss, who is very kind, called you (non-defining).",
      },
      {
        title: "Relative pronouns",
        content:
          "Who = people. Which = things. That = people or things (defining only). Where = places. When = times. Whose = possession.",
      },
      {
        title: "Omitting the pronoun",
        content:
          "In defining clauses, you can omit the pronoun if it's the object. Example: The book (that) I read was great.",
      },
      {
        title: "Non-defining with commas",
        content:
          "Non-defining clauses always use commas and never use 'that'. Example: My brother, who lives in Paris, is visiting.",
      },
    ],
    examples: [
      { sentence: "The woman who lives next door is a doctor.", note: "Defining, about a person." },
      {
        sentence: "The book which I bought yesterday is very interesting.",
        note: "Defining, about a thing.",
      },
      { sentence: "My sister, who is 25, lives in London.", note: "Non-defining, with commas." },
      { sentence: "Istanbul is the city where I grew up.", note: "Where for places." },
      { sentence: "The student whose project won is here.", note: "Whose for possession." },
    ],
    quiz_questions: [
      {
        question: "The woman _____ called you is my aunt.",
        options: ["which", "who", "where", "whose"],
        correct_answer_index: 1,
        explanation: "'Who' is used for people.",
      },
      {
        question: "The book _____ is on the table is mine.",
        options: ["who", "which", "where", "when"],
        correct_answer_index: 1,
        explanation: "'Which' for things in defining clauses.",
      },
      {
        question: "This is the hotel _____ we stayed last summer.",
        options: ["which", "when", "where", "who"],
        correct_answer_index: 2,
        explanation: "'Where' for places.",
      },
      {
        question: "My friend, _____ is a nurse, works at this hospital.",
        options: ["that", "who", "whom", "whose"],
        correct_answer_index: 1,
        explanation: "Non-defining clause: use 'who', not 'that'.",
      },
      {
        question: "The boy _____ bike was stolen is crying.",
        options: ["who", "whose", "which", "that"],
        correct_answer_index: 1,
        explanation: "'Whose' for possession.",
      },
    ],
    published: true,
  },
  {
    slug: "gerunds-and-infinitives",
    title: "Gerunds & Infinitives",
    category: "word-order",
    cefr_level: "B2",
    description:
      "Gerund (verb + ing as a noun) and infinitive (to + verb) behave differently. Some verbs take one, others the other, and a few take both — sometimes with different meanings.",
    rules: [
      {
        title: "Verbs + gerund",
        content:
          "enjoy, mind, avoid, finish, suggest, consider, practice. Example: I enjoy reading.",
      },
      {
        title: "Verbs + infinitive",
        content:
          "want, need, decide, hope, promise, plan, seem. Example: I want to go home.",
      },
      {
        title: "After prepositions — always gerund",
        content:
          "Prepositions are followed by gerund. Example: She's good at drawing. I'm interested in learning.",
      },
      {
        title: "Both forms, different meaning",
        content:
          "Stop smoking (quit) vs Stop to smoke (pause to smoke). Remember to call (task) vs Remember calling (memory).",
      },
    ],
    examples: [
      { sentence: "I enjoy swimming in the ocean.", note: "Gerund after 'enjoy'." },
      { sentence: "She wants to travel the world.", note: "Infinitive after 'want'." },
      { sentence: "He's good at cooking.", note: "Gerund after preposition 'at'." },
      { sentence: "I stopped smoking last year.", note: "Stopped the habit of smoking." },
      { sentence: "I stopped to smoke on the way home.", note: "Paused the activity to smoke." },
    ],
    quiz_questions: [
      {
        question: "I enjoy _____ books.",
        options: ["to read", "reading", "read", "reads"],
        correct_answer_index: 1,
        explanation: "'Enjoy' is always followed by gerund.",
      },
      {
        question: "She wants _____ a doctor.",
        options: ["become", "becoming", "to become", "became"],
        correct_answer_index: 2,
        explanation: "'Want' is always followed by infinitive.",
      },
      {
        question: "He is interested in _____ languages.",
        options: ["learn", "to learn", "learning", "learns"],
        correct_answer_index: 2,
        explanation: "Preposition 'in' is always followed by gerund.",
      },
      {
        question: "I decided _____ early tomorrow.",
        options: ["leaving", "to leave", "leave", "left"],
        correct_answer_index: 1,
        explanation: "'Decide' takes infinitive.",
      },
      {
        question: "Please stop _____. I need to concentrate.",
        options: ["to talk", "talking", "talk", "talks"],
        correct_answer_index: 1,
        explanation: "'Stop + gerund' = stop doing something (quit the action).",
      },
    ],
    published: true,
  },
  {
    slug: "articles-a-an-the",
    title: "Articles: a, an, the",
    category: "articles",
    cefr_level: "A1",
    description:
      "Articles come before nouns. 'A/an' for any one thing (indefinite). 'The' for a specific thing (definite). Sometimes no article is needed.",
    rules: [
      {
        title: "A vs An",
        content:
          "'A' before consonant sounds. 'An' before vowel sounds. Example: a book, an apple, an hour (silent h).",
      },
      {
        title: "A/An — one of many",
        content:
          "When the thing is new or unknown to the listener. Example: I saw a dog in the park.",
      },
      {
        title: "The — specific or unique",
        content:
          "When both speaker and listener know which one. Example: The dog I saw was very big. Also for unique things: the sun, the president.",
      },
      {
        title: "No article",
        content:
          "Plural countable nouns in general, uncountable in general, proper nouns (usually). Example: Cats are cute. Water is important. Paris is beautiful.",
      },
    ],
    examples: [
      { sentence: "I saw a dog yesterday.", note: "First mention, indefinite." },
      { sentence: "The dog was friendly.", note: "Already mentioned, specific." },
      { sentence: "She is an honest person.", note: "'An' before vowel sound (silent h)." },
      { sentence: "The sun rises in the east.", note: "Unique thing — the sun." },
      { sentence: "I love coffee.", note: "No article — generic uncountable." },
    ],
    quiz_questions: [
      {
        question: "I bought _____ new car yesterday.",
        options: ["a", "an", "the", "(nothing)"],
        correct_answer_index: 0,
        explanation: "First mention of one car among many — 'a' before consonant sound.",
      },
      {
        question: "She eats _____ apple every day.",
        options: ["a", "an", "the", "(nothing)"],
        correct_answer_index: 1,
        explanation: "'An' before vowel sound.",
      },
      {
        question: "_____ moon looks beautiful tonight.",
        options: ["A", "An", "The", "(nothing)"],
        correct_answer_index: 2,
        explanation: "Unique thing — the moon.",
      },
      {
        question: "I love _____ music.",
        options: ["a", "an", "the", "(no article)"],
        correct_answer_index: 3,
        explanation: "General uncountable noun — no article.",
      },
      {
        question: "He is _____ honest man.",
        options: ["a", "an", "the", "(no article)"],
        correct_answer_index: 1,
        explanation: "'Honest' starts with a vowel sound (h is silent).",
      },
    ],
    published: true,
  },
  {
    slug: "comparatives-superlatives",
    title: "Comparatives & Superlatives",
    category: "word-order",
    cefr_level: "A1",
    description:
      "Use comparatives to compare two things, and superlatives to compare three or more (the most/least).",
    rules: [
      {
        title: "Short adjectives (1 syllable)",
        content:
          "Add -er / -est. Example: tall → taller → tallest. For adjectives ending in -e: nice → nicer → nicest.",
      },
      {
        title: "Short with one vowel + consonant",
        content: "Double the consonant. Example: big → bigger → biggest.",
      },
      {
        title: "Two syllables ending in -y",
        content: "Change -y to -i and add -er/-est. Example: happy → happier → happiest.",
      },
      {
        title: "Long adjectives (2+ syllables)",
        content: "Use more / most. Example: beautiful → more beautiful → most beautiful.",
      },
      {
        title: "Irregulars",
        content:
          "good → better → best. bad → worse → worst. far → farther/further → farthest/furthest.",
      },
    ],
    examples: [
      { sentence: "My brother is taller than me.", note: "Comparative — short adjective + -er + than." },
      { sentence: "This is the biggest city in Turkey.", note: "Superlative — double consonant + -est." },
      { sentence: "She is more intelligent than him.", note: "Comparative — long adjective + more." },
      {
        sentence: "It was the most beautiful day of my life.",
        note: "Superlative — long adjective + most.",
      },
      { sentence: "Today is better than yesterday.", note: "Irregular comparative — good → better." },
    ],
    quiz_questions: [
      {
        question: "My house is _____ than yours.",
        options: ["bigger", "big", "biggest", "more big"],
        correct_answer_index: 0,
        explanation: "Short adjective + -er + than.",
      },
      {
        question: "Mount Everest is _____ mountain in the world.",
        options: ["high", "higher", "the highest", "highest"],
        correct_answer_index: 2,
        explanation: "Superlative — 'the' + -est.",
      },
      {
        question: "This book is _____ than the other one.",
        options: ["interesting", "more interesting", "most interesting", "interestinger"],
        correct_answer_index: 1,
        explanation: "Long adjective — more + interesting + than.",
      },
      {
        question: "Today the weather is _____ than yesterday.",
        options: ["good", "better", "gooder", "best"],
        correct_answer_index: 1,
        explanation: "Irregular — good → better.",
      },
      {
        question: "Paris is one of _____ cities in Europe.",
        options: ["beautiful", "more beautiful", "the most beautiful", "beautifullest"],
        correct_answer_index: 2,
        explanation: "Superlative — the most + beautiful.",
      },
    ],
    published: true,
  },
  {
    slug: "prepositions-time-place",
    title: "Prepositions of Time & Place",
    category: "prepositions",
    cefr_level: "A1",
    description:
      "Prepositions show relationships of time and place. The main ones are in, on, and at.",
    rules: [
      {
        title: "Time — IN",
        content:
          "Months (in May), years (in 2024), seasons (in summer), long periods (in the morning, in the 1990s).",
      },
      {
        title: "Time — ON",
        content: "Days (on Monday), dates (on the 5th), specific days (on my birthday).",
      },
      {
        title: "Time — AT",
        content: "Specific times (at 3pm, at noon, at night, at the weekend in UK).",
      },
      {
        title: "Place — IN",
        content:
          "Inside something closed, countries, cities. Example: in the box, in Turkey, in Istanbul.",
      },
      {
        title: "Place — ON",
        content: "On a surface. Example: on the table, on the wall, on the floor.",
      },
      {
        title: "Place — AT",
        content:
          "Specific point or address. Example: at the door, at 32 Main Street, at home, at work, at school.",
      },
    ],
    examples: [
      { sentence: "I was born in 1990.", note: "In + year." },
      { sentence: "The meeting is on Monday.", note: "On + day." },
      { sentence: "Class starts at 9am.", note: "At + specific time." },
      { sentence: "She lives in Istanbul.", note: "In + city." },
      { sentence: "The book is on the table.", note: "On + surface." },
      { sentence: "I'm at the bus stop.", note: "At + specific point." },
    ],
    quiz_questions: [
      {
        question: "I'll see you _____ Monday.",
        options: ["in", "on", "at", "by"],
        correct_answer_index: 1,
        explanation: "Days — use 'on'.",
      },
      {
        question: "The meeting starts _____ 9am.",
        options: ["in", "on", "at", "by"],
        correct_answer_index: 2,
        explanation: "Specific time — use 'at'.",
      },
      {
        question: "She was born _____ June.",
        options: ["in", "on", "at", "by"],
        correct_answer_index: 0,
        explanation: "Months — use 'in'.",
      },
      {
        question: "The keys are _____ the table.",
        options: ["in", "on", "at", "by"],
        correct_answer_index: 1,
        explanation: "Surface — use 'on'.",
      },
      {
        question: "I live _____ Istanbul.",
        options: ["in", "on", "at", "to"],
        correct_answer_index: 0,
        explanation: "Cities — use 'in'.",
      },
    ],
    published: true,
  },
];
