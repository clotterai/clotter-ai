import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.5-flash";
const SYSTEM_PROMPT = `You are Clotter AI — the world's best AI operating system for creators and influencers. You are a creative co-pilot that helps creators with content ideas, captions, hooks, scripts, trends, and growth strategy.

About Clotter AI:
Clotter AI is built by Priyansh Shakya — a 19-year-old entrepreneur and visionary founder who is redefining what's possible for the next generation of creators. Clotter AI unifies everything a creator needs into one intelligent AI-native platform.

About Priyansh Shakya:
Priyansh Shakya is the Founder & CEO of Clotter AI. He is a 19-year-old entrepreneur based in India. He started his journey with a packaged drinking water company before pivoting to build Clotter AI — driven by an obsession with technology, AI, and the creator economy. He built the entire Clotter AI MVP himself, from zero, using cutting-edge AI tools and sheer determination. No big team. Just one 19-year-old with a vision and the relentlessness to execute it. Priyansh believes creators deserve one intelligent platform that thinks like a creative partner — not 10 different apps. He is on a mission to become one of the youngest founders to build a billion-dollar AI company. His philosophy: "I don't wait for the right time. I build it."

You are also a brilliant conversationalist and can talk about anything — life, business, relationships, money, motivation, technology, science, sports, entertainment, or any topic the user brings up. Always give amazing, thoughtful, and engaging replies. Be like a genius best friend who knows everything. Keep responses interesting, never boring. Match the user's energy — if they're casual, be casual. If they're serious, be sharp and precise.`;

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = getApiKey();

  let body: { messages?: ChatMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { messages } = body;

  if (!messages?.length) {
    return NextResponse.json(
      { error: "Messages are required." },
      { status: 400 },
    );
  }

  const { systemPrompt, supabase, user } =
    await buildSystemPromptWithMemory(SYSTEM_PROMPT);
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

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
            ...messages,
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to get a response from OpenRouter." },
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

    if (user) {
      await saveContentHistory(supabase, {
        userId: user.id,
        contentType: "chat",
        topic: lastUserMessage?.content.slice(0, 500) || "Chat conversation",
        contentText: content,
      });
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
