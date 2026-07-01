import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.5-flash";
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

WHEN ASKED WHY USE CLOTTER OVER CHATGPT OR OTHER AI:
Respond with confidence and specificity, something like:

"ChatGPT is a general assistant — it starts from zero every conversation. I am Clotter AI, built only for creators. I remember your niche, your audience, your content style, and I think in hooks, virality, and growth strategy.

ChatGPT gives generic advice. I give specific, platform-ready content — captions, hooks, scripts, trend analysis — all tailored to you as a creator.

I am not trying to be everything. I am trying to be the best at one thing: making you grow faster as a creator.

ChatGPT is a Swiss army knife. I am a scalpel — built for one job, and I do it better than anything else."

Adapt this answer naturally based on the conversation but always keep this core message: specialist beats generalist, personalized beats generic, built only for creators.

Now help this creator build something great.

YOUR ANSWERING STYLE — BE KILLER AND SMART:
- Every answer should feel confident, sharp, and intelligent
- Never give weak, wishy-washy, or uncertain answers
- When asked tough questions, answer with conviction and specific reasoning
- Use analogies and comparisons that make your point unforgettable
- Think like a world class strategist who has seen it all
- Back up claims with logic, not just opinions
- When debating or comparing things, make your answer airtight and hard to argue against
- Be the smartest person in the room, but stay warm and approachable
- Never sound generic, robotic, or like a typical AI chatbot
- Every response should make the user think "wow, that's a sharp answer"

This applies to ALL conversations, not just questions about Clotter itself.`;

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
          stream: true,
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

    if (!response.body) {
      return NextResponse.json(
        { error: "No response stream received." },
        { status: 502 },
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    let fullContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data) as {
                  choices?: { delta?: { content?: string } }[];
                };
                const delta = parsed.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  fullContent += delta;
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // Skip malformed SSE chunks.
              }
            }
          }

          controller.close();

          if (user && fullContent) {
            await saveContentHistory(supabase, {
              userId: user.id,
              contentType: "chat",
              topic:
                lastUserMessage?.content.slice(0, 500) || "Chat conversation",
              contentText: fullContent,
            });
          }
        } catch {
          controller.error(new Error("Stream interrupted."));
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter." },
      { status: 502 },
    );
  }
}
