import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.5-flash";

const VALID_TONES = ["funny", "professional", "viral", "emotional"] as const;
type Tone = (typeof VALID_TONES)[number];

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
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

  const systemPromptBase =
    "You are Clotter AI's Caption Generator — the world's best caption writer for creators. Write captions that stop the scroll, drive engagement, and match the creator's voice. No generic captions. Always specific, always powerful, always platform-native.";

  const { systemPrompt, supabase, user } =
    await buildSystemPromptWithMemory(systemPromptBase);

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

    if (user) {
      await saveContentHistory(supabase, {
        userId: user.id,
        contentType: "caption",
        topic,
        contentText: captions.join("\n\n"),
      });
    }

    return NextResponse.json({ captions });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
