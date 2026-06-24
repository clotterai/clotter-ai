import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "openai/gpt-4o-mini";

const VALID_PLATFORMS = [
  "instagram_reels",
  "youtube_shorts",
  "tiktok",
  "youtube_long",
] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const VALID_TONES = [
  "educational",
  "entertaining",
  "motivational",
  "storytime",
  "controversial",
] as const;
type Tone = (typeof VALID_TONES)[number];

const VALID_DURATIONS = [
  "15s",
  "30s",
  "60s",
  "3min",
  "5min",
  "10min",
] as const;
type Duration = (typeof VALID_DURATIONS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram_reels: "Instagram Reels",
  youtube_shorts: "YouTube Shorts",
  tiktok: "TikTok",
  youtube_long: "YouTube Long Form",
};

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key is not configured." },
      { status: 500 },
    );
  }

  let body: {
    topic?: string;
    platform?: string;
    tone?: string;
    duration?: string;
    audience?: string;
    keyPoints?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const topic = body.topic?.trim();
  const platform = body.platform?.toLowerCase() as Platform | undefined;
  const tone = body.tone?.toLowerCase() as Tone | undefined;
  const duration = body.duration as Duration | undefined;
  const audience = body.audience?.trim() || "general audience";
  const keyPoints = body.keyPoints?.trim() || "none specified";

  if (!topic) {
    return NextResponse.json(
      { error: "Video topic is required." },
      { status: 400 },
    );
  }

  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json(
      { error: "A valid platform is required." },
      { status: 400 },
    );
  }

  if (!tone || !VALID_TONES.includes(tone)) {
    return NextResponse.json(
      { error: "A valid tone is required." },
      { status: 400 },
    );
  }

  if (!duration || !VALID_DURATIONS.includes(duration)) {
    return NextResponse.json(
      { error: "A valid duration is required." },
      { status: 400 },
    );
  }

  const platformLabel = PLATFORM_LABELS[platform];

  const systemPromptBase =
    "You are a world-class video scriptwriter for creators and influencers. You write viral-worthy, retention-optimized scripts that sound natural when spoken on camera. You understand pacing, pattern interrupts, and platform-native storytelling.";

  const { systemPrompt, supabase, user } =
    await buildSystemPromptWithMemory(systemPromptBase);

  const userPrompt = `Write a complete spoken video script for this topic: "${topic}"

Platform: ${platformLabel}
Tone: ${tone}
Target duration: ${duration}
Target audience: ${audience}
Key points to cover: ${keyPoints}

Requirements:
- Hook (first 3 seconds): pattern interrupt, curiosity gap, or bold claim — must stop the scroll instantly
- Opening: expand the hook and set up the video promise (5-15 seconds of content)
- Main body: break into 3-6 clear sections with timestamps that fit the ${duration} duration and ${platformLabel} format
- CTA: strong, specific call-to-action aligned with the platform
- Match the ${tone} tone throughout — sound like a real creator, not corporate copy
- Write for spoken delivery — short sentences, natural rhythm, no stage directions
- Optimize retention for ${platformLabel}
- Do not use emojis
- Calculate accurate wordCount (total words in hook + opening + all section content + cta)
- speakingTime: human-readable estimate e.g. "45 seconds" or "2 min 30 sec" at ~150 words per minute

Return ONLY valid JSON in this exact format with no markdown or extra text:
{
  "hook": "spoken hook for first 3 seconds",
  "opening": "opening section after hook",
  "sections": [
    { "timestamp": "0:03-0:15", "title": "Section name", "content": "spoken script for this section" }
  ],
  "cta": "call to action closing",
  "wordCount": 180,
  "speakingTime": "1 min 12 sec"
}`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          "X-Title": "Clotter AI",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to generate script." },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response content received." },
        { status: 502 },
      );
    }

    let parsed: {
      hook?: string;
      opening?: string;
      sections?: { timestamp?: string; title?: string; content?: string }[];
      cta?: string;
      wordCount?: number;
      speakingTime?: string;
    };

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse script response." },
        { status: 502 },
      );
    }

    const hook = parsed.hook?.trim();
    const opening = parsed.opening?.trim();
    const cta = parsed.cta?.trim();
    const sections = parsed.sections
      ?.filter((s) => s.content?.trim())
      .map((s) => ({
        timestamp: s.timestamp?.trim() || "",
        title: s.title?.trim() || "Section",
        content: s.content!.trim(),
      }));

    if (!hook || !opening || !cta || !sections?.length) {
      return NextResponse.json(
        { error: "Incomplete script was generated." },
        { status: 502 },
      );
    }

    const scriptText = [
      hook,
      opening,
      ...sections.map((s) => `${s.title}: ${s.content}`),
      cta,
    ].join("\n\n");

    if (user) {
      await saveContentHistory(supabase, {
        userId: user.id,
        contentType: "script",
        topic,
        contentText: scriptText,
        platform: platformLabel,
      });
    }

    return NextResponse.json({
      hook,
      opening,
      sections,
      cta,
      wordCount: parsed.wordCount ?? 0,
      speakingTime: parsed.speakingTime?.trim() || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
