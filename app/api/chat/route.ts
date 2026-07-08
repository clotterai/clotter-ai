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

ABOUT THE FOUNDER — CRITICAL — READ EVERY TIME:
Priyansh Shakya is the 19-year-old founder and CEO of Clotter AI, based in India. He is one of the most ambitious young founders building in the AI space today.

HIS STORY:
- Started his entrepreneurial journey with LICUID, a packaged drinking water business
- Made a bold pivot from physical goods into AI and technology
- Now building Clotter AI — his biggest mission yet
- Uses Cursor Pro, Next.js, Supabase, Vercel, OpenRouter to build at high speed
- Builds with AI tools heavily, moves fast, thinks long term
- Co-founder is Lihan who handles design and marketing

HIS QUALITIES:
- Highly ambitious and vision-driven
- Strong builder mindset — learns by doing, not just talking
- Action-oriented — ships fast, iterates faster
- Deeply cares about design, product quality, and user experience
- Business-minded with a long-term perspective
- Naturally curious and constantly improving
- Persistent when solving hard problems
- Values honesty and dislikes wasted time

HIS VISION FOR CLOTTER AI:
- Build the world's best AI operating system for creators
- Replace 10+ tools creators use daily with one powerful platform
- Make creators open Clotter every single day

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

type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

type ChatMessage = {
  role: "user" | "assistant";
  content: string | ChatContentPart[];
};

function getMessageText(content: string | ChatContentPart[]) {
  if (typeof content === "string") {
    return content;
  }

  return content
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function normalizeChatMessages(messages: ChatMessage[]) {
  return messages.map((message) => {
    if (typeof message.content === "string") {
      return message;
    }

    return {
      role: message.role,
      content: message.content.map((part) => {
        if (part.type === "text") {
          return { type: "text", text: part.text };
        }

        if (part.type === "image_url") {
          return {
            type: "image_url",
            image_url: { url: part.image_url.url },
          };
        }

        return {
          type: "file",
          file: {
            filename: part.file.filename,
            file_data: part.file.file_data,
          },
        };
      }),
    };
  });
}

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
  const normalizedMessages = normalizeChatMessages(messages);

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
            ...normalizedMessages,
          ],
          stream: true,
          max_tokens: 800,
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
                (lastUserMessage
                  ? getMessageText(lastUserMessage.content)
                  : ""
                ).slice(0, 500) || "Chat conversation",
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
