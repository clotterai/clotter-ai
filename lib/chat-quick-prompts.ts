export const DEFAULT_NICHE = "lifestyle";

/** Chip label → prompt key for URL routing */
export const QUICK_PROMPT_LABELS = [
  "Give me reel ideas",
  "Write a caption",
  "Write a hook",
  "Find trending topics",
  "Give me script ideas",
  "What's viral right now?",
  "Help me grow on Instagram",
  "Give me content ideas",
] as const;

export type QuickPromptLabel = (typeof QUICK_PROMPT_LABELS)[number];

export const QUICK_PROMPT_KEY_BY_LABEL: Record<QuickPromptLabel, string> = {
  "Give me reel ideas": "reel-ideas",
  "Write a caption": "caption",
  "Write a hook": "hook",
  "Find trending topics": "trending",
  "Give me script ideas": "script-ideas",
  "What's viral right now?": "viral-now",
  "Help me grow on Instagram": "instagram-growth",
  "Give me content ideas": "content-ideas",
};

export const QUICK_PROMPT_LABEL_BY_KEY: Record<string, QuickPromptLabel> =
  Object.fromEntries(
    Object.entries(QUICK_PROMPT_KEY_BY_LABEL).map(([label, key]) => [
      key,
      label as QuickPromptLabel,
    ]),
  ) as Record<string, QuickPromptLabel>;

export function extractPrimaryNiche(nicheField: string | null | undefined): string {
  if (!nicheField?.trim()) return DEFAULT_NICHE;
  const first = nicheField.split(",")[0]?.trim();
  return first || DEFAULT_NICHE;
}

export function expandQuickPrompt(
  label: string,
  niche: string = DEFAULT_NICHE,
): string {
  const n = niche.trim() || DEFAULT_NICHE;

  const templates: Record<string, string> = {
    "Give me reel ideas": `Give me 5 viral Reel ideas for a ${n} creator with hooks for each`,
    "Write a caption": `Write 3 scroll-stopping captions for my latest post as a ${n} creator on Instagram`,
    "Write a hook": `Generate 5 high-retention hook variations for a short-form video about ${n}`,
    "Find trending topics": `What are the top trending topics for ${n} creators right now?`,
    "Give me script ideas": `Write a 60-second viral script for a ${n} creator on Instagram Reels`,
    "What's viral right now?": `What content formats are going viral right now for ${n} creators?`,
    "Help me grow on Instagram": `Give me a 7-day Instagram growth strategy for a ${n} creator`,
    "Give me content ideas": `Generate 10 unique content ideas for a ${n} creator this week`,
    "Give me 5 content ideas": `Generate 10 unique content ideas for a ${n} creator this week`,
  };

  return templates[label] ?? label;
}

export function resolvePromptFromKey(
  key: string,
  niche: string = DEFAULT_NICHE,
): string | null {
  const label = QUICK_PROMPT_LABEL_BY_KEY[key];
  if (!label) return null;
  return expandQuickPrompt(label, niche);
}

export function pickRandomPromptLabels(count: number): QuickPromptLabel[] {
  const shuffled = [...QUICK_PROMPT_LABELS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
