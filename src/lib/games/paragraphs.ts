export interface SpeedParagraph {
  id: string;
  cefr: "A1" | "A2" | "B1" | "B2";
  text: string;
  questions: {
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  }[];
}

export const SPEED_READING_PARAGRAPHS: SpeedParagraph[] = [
  {
    id: "p1",
    cefr: "A1",
    text: "Anna wakes up at seven o'clock. She eats breakfast and drinks coffee. Then she walks to the bus stop. The bus comes at ten past eight. She says hello to the driver and sits at the window. At school she meets her friends and they start the day with English class.",
    questions: [
      {
        question: "What does Anna drink in the morning?",
        options: ["Tea", "Water", "Coffee", "Juice"],
        correct_index: 2,
        explanation: "The text says she drinks coffee.",
      },
      {
        question: "How does Anna get to school?",
        options: ["By car", "By bus", "On foot only", "By train"],
        correct_index: 1,
        explanation: "She walks to the bus stop and takes the bus.",
      },
      {
        question: "What is the first class at school?",
        options: ["Math", "English", "Science", "History"],
        correct_index: 1,
        explanation: "They start with English class.",
      },
    ],
  },
  {
    id: "p2",
    cefr: "A1",
    text: "Tom's family is small but happy. His mother works in a hospital and his father drives a taxi. They have dinner together every evening. On weekends they visit Tom's grandparents and play games in the garden. The weather is often nice in spring.",
    questions: [
      {
        question: "Where does Tom's mother work?",
        options: ["A school", "A hospital", "A shop", "An airport"],
        correct_index: 1,
        explanation: "She works in a hospital.",
      },
      {
        question: "What does Tom's father do?",
        options: ["He is a teacher", "He drives a taxi", "He is a doctor", "He works in an office"],
        correct_index: 1,
        explanation: "His father drives a taxi.",
      },
      {
        question: "When do they visit grandparents?",
        options: ["Every day", "On weekends", "Only in winter", "Never"],
        correct_index: 1,
        explanation: "They visit on weekends.",
      },
    ],
  },
  {
    id: "p3",
    cefr: "A2",
    text: "Last Saturday Maria went shopping in the city. She needed new shoes and a winter jacket because the weather was getting cold. She compared prices in two stores and chose the cheaper jacket. She felt tired but satisfied when she came home with a full shopping bag.",
    questions: [
      {
        question: "Why did Maria need a jacket?",
        options: ["It was a gift", "The weather was getting cold", "She lost hers", "Her job required it"],
        correct_index: 1,
        explanation: "The text says the weather was getting cold.",
      },
      {
        question: "How did Maria choose the jacket?",
        options: ["She picked the first one", "She compared prices", "She asked a friend", "She bought online"],
        correct_index: 1,
        explanation: "She compared prices in two stores.",
      },
      {
        question: "How did Maria feel at the end?",
        options: ["Angry", "Tired but satisfied", "Confused", "Bored"],
        correct_index: 1,
        explanation: "She felt tired but satisfied.",
      },
    ],
  },
  {
    id: "p4",
    cefr: "A2",
    text: "Daniel is learning to play the guitar. He practices for thirty minutes after work. Sometimes his fingers hurt, but he knows that regular practice is important. His teacher says he will improve quickly if he listens carefully and repeats difficult parts slowly.",
    questions: [
      {
        question: "When does Daniel practice?",
        options: ["Before work", "After work", "At lunch", "Only on Sundays"],
        correct_index: 1,
        explanation: "He practices after work.",
      },
      {
        question: "What does his teacher recommend for difficult parts?",
        options: ["Skip them", "Repeat them slowly", "Play faster", "Change instrument"],
        correct_index: 1,
        explanation: "Repeat difficult parts slowly.",
      },
      {
        question: "What does Daniel accept about learning?",
        options: ["It is always easy", "His fingers sometimes hurt", "He never makes mistakes", "He hates music"],
        correct_index: 1,
        explanation: "Sometimes his fingers hurt.",
      },
    ],
  },
  {
    id: "p5",
    cefr: "B1",
    text: "Remote work has changed how many companies organise meetings. Instead of travelling for hours, employees join video calls from home. This saves time and money, but some managers worry that teams lose informal conversations that happen naturally in an office. The best solution is often a mix of remote days and office days.",
    questions: [
      {
        question: "What is one advantage of video calls mentioned?",
        options: ["They replace all email", "They save time and money", "They remove the need for managers", "They always improve quality"],
        correct_index: 1,
        explanation: "The text says this saves time and money.",
      },
      {
        question: "What do some managers worry about?",
        options: ["Losing informal conversations", "Too much email", "Slow internet", "Cheap flights"],
        correct_index: 0,
        explanation: "They worry teams lose informal conversations.",
      },
      {
        question: "What does the writer suggest as a solution?",
        options: ["Everyone must work in office", "A mix of remote and office days", "No meetings at all", "Only night shifts"],
        correct_index: 1,
        explanation: "The best solution is often a mix.",
      },
    ],
  },
  {
    id: "p6",
    cefr: "B1",
    text: "Scientists have observed that short walks in green spaces can lower stress. The effect is stronger when people leave their phones in their pockets and focus on sounds and colours around them. This does not replace medicine for serious conditions, but it is a simple habit that supports mental health.",
    questions: [
      {
        question: "What can short walks in green spaces do?",
        options: ["Replace all medicine", "Lower stress", "Guarantee sleep", "Remove all noise"],
        correct_index: 1,
        explanation: "They can lower stress.",
      },
      {
        question: "When is the effect stronger?",
        options: ["When running fast", "When phones stay in pockets", "When alone at night", "Only in winter"],
        correct_index: 1,
        explanation: "Stronger when people leave phones in pockets.",
      },
      {
        question: "What does the writer say about serious conditions?",
        options: ["Walking always cures them", "This habit replaces medicine", "It does not replace medicine", "Doctors disagree"],
        correct_index: 2,
        explanation: "It does not replace medicine for serious conditions.",
      },
    ],
  },
  {
    id: "p7",
    cefr: "B2",
    text: "Critics argue that standardised tests measure exam technique as much as subject knowledge. Students who can manage time and anxiety often score higher than peers who understand the material but struggle under pressure. Fair assessment therefore requires more than one format, including projects and oral presentations.",
    questions: [
      {
        question: "What do critics say tests measure?",
        options: ["Only vocabulary", "Exam technique as much as knowledge", "Only speed", "Nothing useful"],
        correct_index: 1,
        explanation: "They measure exam technique as much as knowledge.",
      },
      {
        question: "Who might score higher according to the text?",
        options: ["Only native speakers", "Students who manage time and anxiety well", "Students who never study", "People who skip questions"],
        correct_index: 1,
        explanation: "Those who manage time and anxiety often score higher.",
      },
      {
        question: "What does 'fair assessment' require?",
        options: ["Only tests", "More than one format", "Longer essays only", "No teachers"],
        correct_index: 1,
        explanation: "Fair assessment requires more than one format.",
      },
    ],
  },
  {
    id: "p8",
    cefr: "B2",
    text: "Negotiation often fails when both sides defend their opening position instead of exploring shared interests. Skilled negotiators ask questions, summarise what they hear, and look for creative options before committing to a final offer. Patience is not weakness; it prevents costly mistakes.",
    questions: [
      {
        question: "When does negotiation often fail?",
        options: ["When people speak slowly", "When both sides only defend opening positions", "When there is a translator", "When meetings are short"],
        correct_index: 1,
        explanation: "It fails when both sides defend opening positions only.",
      },
      {
        question: "What do skilled negotiators do early on?",
        options: ["Reject all offers", "Ask questions and summarise", "Ignore the other side", "Raise their voice"],
        correct_index: 1,
        explanation: "They ask questions and summarise what they hear.",
      },
      {
        question: "How is patience described?",
        options: ["As weakness", "As preventing costly mistakes", "As unnecessary", "As rude"],
        correct_index: 1,
        explanation: "Patience prevents costly mistakes.",
      },
    ],
  },
  {
    id: "p9",
    cefr: "A2",
    text: "The small town library opens at nine and closes at six. Children can borrow up to three books, and adults can borrow five. If you return books late, you pay a small fee. Many people use the quiet room to study for exams or write job applications.",
    questions: [
      {
        question: "How many books can children borrow?",
        options: ["One", "Three", "Five", "Ten"],
        correct_index: 1,
        explanation: "Children can borrow up to three books.",
      },
      {
        question: "What happens if you return books late?",
        options: ["Nothing", "You pay a small fee", "You cannot return them", "The library closes"],
        correct_index: 1,
        explanation: "You pay a small fee.",
      },
      {
        question: "What is the quiet room for?",
        options: ["Parties", "Studying and writing applications", "Selling books", "Sleeping"],
        correct_index: 1,
        explanation: "People study or write job applications there.",
      },
    ],
  },
  {
    id: "p10",
    cefr: "B1",
    text: "Airlines recommend arriving at the airport two hours before a European flight. Long queues at security can appear suddenly, especially in summer. Keep your passport and boarding pass easy to reach, and remember that liquids over one hundred millilitres must go in checked luggage unless you buy them after security.",
    questions: [
      {
        question: "How early should you arrive for a European flight?",
        options: ["Thirty minutes", "Two hours", "Five hours", "At midnight"],
        correct_index: 1,
        explanation: "Two hours before the flight.",
      },
      {
        question: "When can security queues be longer?",
        options: ["Only in winter", "Especially in summer", "Never", "Only at night"],
        correct_index: 1,
        explanation: "Especially in summer.",
      },
      {
        question: "Where must large liquids go?",
        options: ["In hand luggage always", "In checked luggage", "In the bin", "At home"],
        correct_index: 1,
        explanation: "Liquids over 100ml must go in checked luggage.",
      },
    ],
  },
];
