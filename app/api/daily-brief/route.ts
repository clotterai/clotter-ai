import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.5-flash";

const GENERIC_OPPORTUNITIES = [
  "Film a quick behind-the-scenes clip showing how you create today's content.",
  "Reply to 10 comments on your latest post to boost reach and loyalty.",
  "Test one trending format or audio in your niche before it peaks.",
];

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

function parseOpportunities(content: string): string[] | null {
  try {
    const parsed = JSON.parse(content) as { opportunities?: unknown };
    if (
      Array.isArray(parsed.opportunities) &&
      parsed.opportunities.length >= 3 &&
      parsed.opportunities.every((item) => typeof item === "string")
    ) {
      return parsed.opportunities.slice(0, 3);
    }
  } catch {
    const match = content.match(/\{[\s\S]*"opportunities"[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as { opportunities?: unknown };
        if (
          Array.isArray(parsed.opportunities) &&
          parsed.opportunities.length >= 3 &&
          parsed.opportunities.every((item) => typeof item === "string")
        ) {
          return parsed.opportunities.slice(0, 3);
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function GET() {
  const apiKey = getApiKey();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("niche, platforms, biggest_goal")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.niche) {
    return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
  }

  const niche = profile.niche;
  const platform = profile.platforms?.[0] ?? "social media";

  if (!apiKey) {
    return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
  }

  const systemPrompt =
    "You are Clotter AI generating a personalized daily brief for a creator. Be specific, short, and actionable.";

  const userPrompt = `Generate exactly 3 specific opportunities for today for a ${niche} creator on ${platform}. Each must be ONE short sentence, specific and actionable. Return ONLY this JSON: {opportunities: ['...','...','...']}`;

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
          max_tokens: 300,
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
    }

    const opportunities = parseOpportunities(content);

    if (!opportunities) {
      return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
    }

    return NextResponse.json({ opportunities });
  } catch {
    return NextResponse.json({ opportunities: GENERIC_OPPORTUNITIES });
  }
}
