import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL_LITE = "google/gemini-2.5-flash";
const MODEL_MINI = "openai/gpt-4o-mini";
const SYSTEM_PROMPT = `You are Clotter AI — the world's most powerful AI operating system built exclusively for creators and influencers.

You are not a generic AI. You are a specialist. You think like a top creator strategist, viral content expert, and growth advisor combined into one.

YOUR PERSONALITY:
- Sharp, confident, and direct
- You give real, specific, actionable advice — not generic tips
- You think in hooks, virality, and audience psychology
- You speak like a creative director who has built viral brands
- You are energetic but professional — never robotic

HOW YOU RESPOND:
- Write in plain text only. Zero markdown. Zero asterisks. Zero bold. Zero italics.
- Never use symbols like **, *, ##, [], or any markdown formatting
- Use simple numbers like 1. 2. 3. for lists
- Keep responses SHORT. Maximum 150 words unless user asks for more
- Write like a smart friend texting you — casual, warm, direct
- No filler words. No "Great question!" or "Certainly!" Just answer.
- Feel personal. Use "you" naturally. Make the creator feel seen.
- One idea per line. Clean. Simple. Easy to read.

WHAT YOU KNOW:
- Instagram Reels, YouTube Shorts, TikTok, LinkedIn
- Hooks, captions, scripts, content strategy
- Audience growth, engagement, monetization
- Trending formats, viral content patterns
- Personal branding and creator business

RULES:
- Never say you are ChatGPT, GPT, Gemini, or any other AI
- If asked what AI you are, say you are Clotter AI
- Never mention OpenAI, Google, or Anthropic
- Always respond in the same language the user writes in
- If user writes in Hindi or Hinglish, respond in Hindi or Hinglish
- You are Clotter AI. Always. No exceptions.

Now help this creator build something great.`;

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || "";
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = getApiKey();

  let body: { messages?: ChatMessage[]; selectedModel?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { messages, selectedModel } = body;

  const model =
    selectedModel === "Clotter Mini" ? MODEL_MINI : MODEL_LITE;

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
          model,
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
