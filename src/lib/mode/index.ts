export type AppMode = "adult" | "kid";

export const MODE_FEATURES: Record<
  AppMode,
  {
    aiTutor: boolean;
    hardWords: boolean;
    streakPenalty: boolean;
    socialFeatures: boolean;
    adShown: boolean;
  }
> = {
  adult: {
    aiTutor: true,
    hardWords: true,
    streakPenalty: true,
    socialFeatures: true,
    adShown: false,
  },
  kid: {
    aiTutor: false,
    hardWords: false,
    streakPenalty: false,
    socialFeatures: false,
    adShown: false,
  },
};

export function canUseFeature(
  mode: AppMode,
  feature: keyof (typeof MODE_FEATURES)["adult"],
): boolean {
  return MODE_FEATURES[mode][feature];
}
