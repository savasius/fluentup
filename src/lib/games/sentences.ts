export interface SentenceData {
  id: string;
  sentence: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1";
}

export const SENTENCE_BANK: SentenceData[] = [
  { id: "s1", sentence: "I have a book", cefrLevel: "A1" },
  { id: "s2", sentence: "She is my sister", cefrLevel: "A1" },
  { id: "s3", sentence: "We eat breakfast every morning", cefrLevel: "A1" },
  { id: "s4", sentence: "The cat is on the table", cefrLevel: "A1" },
  { id: "s5", sentence: "He goes to school", cefrLevel: "A1" },
  { id: "s6", sentence: "I like pizza", cefrLevel: "A1" },
  { id: "s7", sentence: "They are my friends", cefrLevel: "A1" },
  { id: "s8", sentence: "My brother is ten years old", cefrLevel: "A1" },

  { id: "s9", sentence: "She went to the store yesterday", cefrLevel: "A2" },
  {
    id: "s10",
    sentence: "We are going to travel next week",
    cefrLevel: "A2",
  },
  { id: "s11", sentence: "I have lived here for five years", cefrLevel: "A2" },
  { id: "s12", sentence: "The weather is beautiful today", cefrLevel: "A2" },
  { id: "s13", sentence: "He does not like cold coffee", cefrLevel: "A2" },
  { id: "s14", sentence: "Can you help me with this", cefrLevel: "A2" },
  {
    id: "s15",
    sentence: "I was reading a book when she called",
    cefrLevel: "A2",
  },

  {
    id: "s16",
    sentence: "If I had more time I would travel more",
    cefrLevel: "B1",
  },
  {
    id: "s17",
    sentence: "She has been working here since 2020",
    cefrLevel: "B1",
  },
  {
    id: "s18",
    sentence: "The meeting was postponed until next week",
    cefrLevel: "B1",
  },
  {
    id: "s19",
    sentence: "I wish I could speak more languages",
    cefrLevel: "B1",
  },
  { id: "s20", sentence: "He asked me what I was doing", cefrLevel: "B1" },
  { id: "s21", sentence: "They have decided to move abroad", cefrLevel: "B1" },

  {
    id: "s22",
    sentence: "She would have called if she had known",
    cefrLevel: "B2",
  },
  {
    id: "s23",
    sentence: "The report must be finished by Friday",
    cefrLevel: "B2",
  },
  {
    id: "s24",
    sentence: "Despite the rain we enjoyed our walk",
    cefrLevel: "B2",
  },
  {
    id: "s25",
    sentence: "I am looking forward to hearing from you",
    cefrLevel: "B2",
  },
];

export function getShuffledWords(sentence: string): string[] {
  const words = sentence.split(" ");
  if (words.length <= 1) return words;

  // Fisher-Yates with guaranteed distinct order.
  for (let attempt = 0; attempt < 10; attempt++) {
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (shuffled.join(" ") !== sentence) return shuffled;
  }
  // Fallback: swap first two
  return [words[1], words[0], ...words.slice(2)];
}
