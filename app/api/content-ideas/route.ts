import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.0-flash-001";

const VALID_PLATFORMS = ["instagram", "youtube", "tiktok", "linkedin"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  let body: { niche?: string; platform?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const niche = body.niche?.trim();
  const platform = body.platform?.toLowerCase() as Platform | undefined;

  if (!niche) {
    return NextResponse.json(
      { error: "Niche is required." },
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

  const systemPromptBase =
    "You are an expert content strategist for creators and influencers. You generate viral, high-performing content ideas tailored to specific niches and platforms.";

  const { systemPrompt, supabase, user } =
    await buildSystemPromptWithMemory(systemPromptBase);

  const userPrompt = `Generate exactly 20 unique viral content ideas for this niche: "${niche}"

Platform: ${platformLabel}

Requirements:
- Each idea should be a concise, actionable content concept (title + brief angle in one line)
- Mix formats: tutorials, stories, trends, hot takes, listicles, behind-the-scenes, challenges, etc.
- Optimized specifically for ${platformLabel} — match what performs on that platform
- Ideas should feel fresh, specific to the niche, and have viral potential
- Do not use emojis
- Do not number the ideas in the text itself
- Keep each idea to one sentence

Return ONLY valid JSON in this exact format with no markdown or extra text:
{"ideas":["idea one","idea two","idea three","idea four","idea five","idea six","idea seven","idea eight","idea nine","idea ten","idea eleven","idea twelve","idea thirteen","idea fourteen","idea fifteen","idea sixteen","idea seventeen","idea eighteen","idea nineteen","idea twenty"]}`;

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
        { error: errorText || "Failed to generate content ideas." },
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

    let parsed: { ideas?: string[] };

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse content ideas response." },
        { status: 502 },
      );
    }

    const ideas = parsed.ideas?.filter(Boolean).slice(0, 20);

    if (!ideas?.length) {
      return NextResponse.json(
        { error: "No content ideas were generated." },
        { status: 502 },
      );
    }

    if (user) {
      await saveContentHistory(supabase, {
        userId: user.id,
        contentType: "idea",
        topic: niche,
        contentText: ideas.join("\n"),
        platform: platformLabel,
      });
    }

    return NextResponse.json({ ideas });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
