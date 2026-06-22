import { NextResponse } from "next/server";

const MODEL = "openai/gpt-4o-mini";

const VALID_PLATFORMS = [
  "reels",
  "tiktok",
  "youtube_shorts",
  "linkedin",
] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  reels: "Instagram Reels",
  tiktok: "TikTok",
  youtube_shorts: "YouTube Shorts",
  linkedin: "LinkedIn",
};

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  let body: { topic?: string; platform?: string };

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

  const platformLabel = PLATFORM_LABELS[platform];

  const systemPrompt =
    "You are an expert short-form video hook writer for creators and influencers. You write scroll-stopping opening lines that maximize watch time and engagement.";

  const userPrompt = `Generate exactly 10 unique scroll-stopping video hooks for this topic: "${topic}"

Platform: ${platformLabel}

Requirements:
- Each hook must be a distinct angle or pattern (curiosity gap, bold claim, question, contrarian take, story opener, etc.)
- Optimized specifically for ${platformLabel} — match pacing, culture, and audience expectations
- Keep hooks short and punchy (one to two sentences max)
- Write in first or second person where it fits
- Do not use emojis
- Do not number the hooks in the text itself
- Hooks should work as the first line spoken or shown on screen

Return ONLY valid JSON in this exact format with no markdown or extra text:
{"hooks":["hook one","hook two","hook three","hook four","hook five","hook six","hook seven","hook eight","hook nine","hook ten"]}`;

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
        { error: errorText || "Failed to generate hooks." },
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

    let parsed: { hooks?: string[] };

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse hook response." },
        { status: 502 },
      );
    }

    const hooks = parsed.hooks?.filter(Boolean).slice(0, 10);

    if (!hooks?.length) {
      return NextResponse.json(
        { error: "No hooks were generated." },
        { status: 502 },
      );
    }

    return NextResponse.json({ hooks });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
