import { NextResponse } from "next/server";

const MODEL = "openai/gpt-4o-mini";
const FALLBACK_API_KEY =
  "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";

const VALID_TONES = ["funny", "professional", "viral", "emotional"] as const;
type Tone = (typeof VALID_TONES)[number];

function getApiKey() {
  const envKey = process.env.OPENROUTER_API_KEY?.trim();
  return envKey || FALLBACK_API_KEY;
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  let body: { topic?: string; tone?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const topic = body.topic?.trim();
  const tone = body.tone?.toLowerCase() as Tone | undefined;

  if (!topic) {
    return NextResponse.json(
      { error: "Post topic is required." },
      { status: 400 },
    );
  }

  if (!tone || !VALID_TONES.includes(tone)) {
    return NextResponse.json(
      { error: "A valid tone is required." },
      { status: 400 },
    );
  }

  const systemPrompt =
    "You are an expert social media caption writer for creators and influencers. Write engaging, platform-ready captions.";

  const userPrompt = `Generate exactly 5 unique social media captions for this post topic: "${topic}"

Tone: ${tone}

Requirements:
- Each caption should be distinct in style and angle
- Match the ${tone} tone throughout
- Keep captions concise and scroll-stopping
- Do not use emojis
- Do not number the captions in the text itself

Return ONLY valid JSON in this exact format with no markdown or extra text:
{"captions":["caption one","caption two","caption three","caption four","caption five"]}`;

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
        { error: errorText || "Failed to generate captions." },
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

    let parsed: { captions?: string[] };

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse caption response." },
        { status: 502 },
      );
    }

    const captions = parsed.captions?.filter(Boolean).slice(0, 5);

    if (!captions?.length) {
      return NextResponse.json(
        { error: "No captions were generated." },
        { status: 502 },
      );
    }

    return NextResponse.json({ captions });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
