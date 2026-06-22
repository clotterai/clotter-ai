import { NextResponse } from "next/server";

const MODEL = "openai/gpt-4o-mini";
const FALLBACK_API_KEY =
  "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";

const VALID_PLATFORMS = ["instagram", "youtube", "tiktok", "linkedin"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const VALID_SCORES = ["high", "medium", "low"] as const;
type ViralScore = (typeof VALID_SCORES)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

function getApiKey() {
  const envKey = process.env.OPENROUTER_API_KEY?.trim();
  return envKey || FALLBACK_API_KEY;
}

type TrendItem = {
  topic: string;
  whyTrending: string;
  contentAngle: string;
  viralScore: ViralScore;
};

function normalizeScore(value: unknown): ViralScore {
  const score = String(value ?? "").toLowerCase();
  if (score === "high" || score === "medium" || score === "low") return score;
  return "medium";
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
    return NextResponse.json({ error: "Niche is required." }, { status: 400 });
  }

  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json(
      { error: "A valid platform is required." },
      { status: 400 },
    );
  }

  const platformLabel = PLATFORM_LABELS[platform];

  const systemPrompt =
    "You are an expert social media trend analyst for creators and influencers. You identify emerging and current trending topics, explain why they resonate, and suggest actionable content angles.";

  const userPrompt = `Analyze current trending topics for this niche: "${niche}"
Platform focus: ${platformLabel}

Generate exactly 10 trending topics relevant to this niche on ${platformLabel} right now (based on your knowledge of creator culture, platform trends, and audience behavior).

For each trend provide:
- topic: short trend name/title
- whyTrending: 1-2 sentences on why this is trending now
- contentAngle: 1-2 sentences with a specific content angle the creator should use
- viralScore: exactly one of "high", "medium", or "low" based on viral potential on ${platformLabel}

Requirements:
- Topics must be specific to the ${niche} niche
- Mix timely trends with evergreen angles where relevant
- Do not use emojis
- viralScore must be lowercase: high, medium, or low

Return ONLY valid JSON in this exact format with no markdown or extra text:
{"trends":[{"topic":"...","whyTrending":"...","contentAngle":"...","viralScore":"high"}]}`;

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
        { error: errorText || "Failed to analyze trends." },
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

    let parsed: { trends?: TrendItem[] };

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse trend response." },
        { status: 502 },
      );
    }

    const trends = parsed.trends
      ?.filter((t) => t?.topic?.trim())
      .slice(0, 10)
      .map((t) => ({
        topic: t.topic.trim(),
        whyTrending: t.whyTrending?.trim() || "Trending in this niche.",
        contentAngle: t.contentAngle?.trim() || "Create content around this topic.",
        viralScore: normalizeScore(t.viralScore),
      }));

    if (!trends?.length) {
      return NextResponse.json(
        { error: "No trends were generated." },
        { status: 502 },
      );
    }

    return NextResponse.json({ trends });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
