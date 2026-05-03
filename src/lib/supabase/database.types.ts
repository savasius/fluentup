/**
 * Supabase database types.
 *
 * MANUAL: Bu dosya şu an elle yazılmış. Production'da Supabase CLI ile
 * otomatik generate edilecek:
 *   npx supabase gen types typescript --project-id qfsyyymuepcxegmakrkw > src/lib/supabase/database.types.ts
 *
 * Schema değişirse manuel güncelle veya CLI'ı çalıştır.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type WordRarity = "common" | "rare" | "epic";
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "determiner"
  | "interjection"
  | "phrase";
export type GrammarCategory =
  | "tenses"
  | "articles"
  | "prepositions"
  | "pronouns"
  | "modals"
  | "conditionals"
  | "passive"
  | "reported-speech"
  | "clauses"
  | "questions"
  | "word-order"
  | "punctuation";

export interface WordMeaning {
  definition: string;
  examples: string[];
  context?: "formal" | "informal" | "slang" | "technical";
}

export interface Collocation {
  phrase: string;
  translation?: string;
}

export interface GrammarExample {
  sentence: string;
  translation?: string;
  note?: string;
}

export interface CommonMistake {
  wrong: string;
  correct: string;
  why: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

/** Lesson quiz JSON stored in `lessons.quiz_questions` */
export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Database {
  public: {
    Tables: {
      words: {
        Relationships: [];
        Row: {
          id: string;
          slug: string;
          word: string;
          translation_tr: string | null;
          kid_safe: boolean;
          phonetic_uk: string | null;
          phonetic_us: string | null;
          audio_url_uk: string | null;
          audio_url_us: string | null;
          cefr_level: CefrLevel;
          rarity: WordRarity;
          part_of_speech: PartOfSpeech;
          meanings: WordMeaning[];
          synonyms: string[];
          antonyms: string[];
          collocations: Collocation[];
          search_keywords: string[];
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["words"]["Row"],
          "id" | "created_at" | "updated_at" | "translation_tr" | "kid_safe"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          translation_tr?: string | null;
          kid_safe?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["words"]["Insert"]>;
      };

      grammar_topics: {
        Relationships: [];
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          cefr_level: CefrLevel;
          category: GrammarCategory;
          explanation: string;
          form_structure: Record<string, string>;
          examples: GrammarExample[];
          common_mistakes: CommonMistake[];
          quiz_questions: QuizQuestion[];
          related_topic_ids: string[];
          related_word_ids: string[];
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["grammar_topics"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["grammar_topics"]["Insert"]
        >;
      };

      lessons: {
        Relationships: [];
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          cefr_level: CefrLevel;
          order_index: number;
          intro_text: string;
          word_slugs: string[];
          grammar_topic_slug: string | null;
          grammar_tip: string | null;
          grammar_examples: string[] | null;
          quiz_questions: LessonQuizQuestion[];
          xp_reward: number;
          estimated_minutes: number;
          published: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lessons"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };

      user_lesson_progress: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          lesson_slug: string;
          status: "in_progress" | "completed";
          current_step: number;
          quiz_score: number | null;
          quiz_total: number | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_lesson_progress"]["Row"],
          "id" | "started_at"
        > & {
          id?: string;
          started_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_lesson_progress"]["Insert"]
        >;
      };

      flashcard_reviews: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          word_slug: string;
          easiness: number;
          interval_days: number;
          repetitions: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["flashcard_reviews"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["flashcard_reviews"]["Insert"]
        >;
      };

      profiles: {
        Relationships: [];
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          native_language: string;
          learning_language: string;
          cefr_level: CefrLevel;
          mode: "adult" | "kid";
          age: number | null;
          parent_email: string | null;
          parent_consent: boolean;
          parent_consent_at: string | null;
          kid_interests: string[] | null;
          onboarding_completed: boolean;
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          hearts: number;
          last_active_at: string | null;
          daily_goal: number;
          daily_xp_earned: number;
          daily_xp_date: string;
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          | "created_at"
          | "updated_at"
          | "mode"
          | "age"
          | "parent_email"
          | "parent_consent"
          | "parent_consent_at"
          | "kid_interests"
        > & {
          created_at?: string;
          updated_at?: string;
          mode?: "adult" | "kid";
          age?: number | null;
          parent_email?: string | null;
          parent_consent?: boolean;
          parent_consent_at?: string | null;
          kid_interests?: string[] | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      user_progress: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          mastery_level: number;
          ease_factor: number;
          interval_days: number;
          next_review_at: string;
          times_seen: number;
          times_correct: number;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_progress"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_progress"]["Insert"]
        >;
      };

      user_lesson_completions: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          score: number | null;
          xp_earned: number;
          hearts_used: number;
          completed_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_lesson_completions"]["Row"],
          "id" | "completed_at"
        > & {
          id?: string;
          completed_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_lesson_completions"]["Insert"]
        >;
      };

      word_of_the_day: {
        Relationships: [];
        Row: {
          date: string;
          word_id: string;
          created_at: string;
        };
        Insert: {
          date: string;
          word_id: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["word_of_the_day"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
