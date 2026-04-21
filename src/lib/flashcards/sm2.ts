export type FlashcardQuality = 1 | 2 | 3 | 4 | 5;

export interface FlashcardState {
  easiness: number;
  interval: number;
  repetitions: number;
}

export function calculateNext(
  state: FlashcardState,
  quality: FlashcardQuality,
): FlashcardState {
  let { easiness, interval, repetitions } = state;

  if (quality < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easiness);
  }

  easiness =
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  return { easiness, interval, repetitions };
}
