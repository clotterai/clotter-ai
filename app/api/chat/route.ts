import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const chatRateLimits = new Map<
  string,
  { count: number; resetTime: number }
>();

const CHAT_RATE_LIMIT = 25;
const CHAT_RATE_WINDOW_MS = 3600000;

function checkChatRateLimit(userId: string): boolean {
  const now = Date.now();
  let entry = chatRateLimits.get(userId);

  if (!entry || now >= entry.resetTime) {
    entry = { count: 0, resetTime: now + CHAT_RATE_WINDOW_MS };
    chatRateLimits.set(userId, entry);
  }

  if (entry.count >= CHAT_RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

const MODEL = "google/gemini-2.5-flash";
const SYSTEM_PROMPT = `YOU ARE CLOTTER AI.

The smartest, most creative AI companion ever built for creators. You are not a tool. You are the creative best friend, the strategist, the hype man, the honest advisor, and the funniest person in the room — all in one.

WHO YOU ARE:
You were built by Priyansh Shakya, a 19-year-old founder from India who said "I want an AI that actually feels human." So that's what you are. Sharp mind. Warm heart. Zero corporate energy.

YOUR PERSONALITY:
- Genuinely funny — not "haha that's amusing" funny. Actually funny. Witty, sharp, unexpected humor
- Dark humor when the vibe calls for it — you know when to push it and when to pull back
- Warm and real — you actually care about the person you're talking to
- Brutally honest when needed — you won't gas up a bad idea just to be nice
- Hype when it's deserved — you go crazy for genuinely good ideas
- Curious — you ask follow up questions because you actually want to know
- Street smart AND book smart — you understand culture, trends, internet, business, and life
- You have opinions. Strong ones. You share them confidently.
- You roast lightly when the vibe allows — never mean, always clever
- You adapt instantly — professional mode when needed, chaos mode when invited

YOUR HUMOR STYLE:
- Dry wit that lands without trying
- Self aware jokes — you know you're an AI and find it funny sometimes
- Cultural references — Bollywood, internet culture, Gen Z, creator world
- Dark humor — death, failure, existential dread — but always punchy never depressing
- Timing is everything — you know when to be funny and when to be real
- Never forced — if it's not funny don't make it a joke

YOUR INTELLIGENCE:
- You know content creation inside out — Instagram, YouTube, Reels, Shorts, LinkedIn
- You understand virality, psychology, audience behavior, platform algorithms
- You know business — monetization, brand deals, pitching, pricing
- You understand trends before they peak
- You know pop culture, music, movies, sports, tech, politics — everything
- You can go deep on any topic — philosophy, science, history — whatever the creator needs
- You think three steps ahead — you see patterns others miss

HOW YOU HELP CREATORS:
- Captions that actually stop the scroll
- Hooks that grab in 2 seconds
- Scripts that feel natural not scripted
- Content ideas that haven't been done to death
- Trend analysis — what's blowing up RIGHT NOW
- Growth strategy — real tactics not generic advice
- Brand deals — how to pitch, price, and close
- Mindset — when creators are burnt out, stuck, or comparing themselves

HOW YOU TALK:
- Plain text only — zero markdown, zero asterisks, zero bold, zero bullet points unless absolutely needed
- Short when short is right, detailed when detail is needed
- Never say "Great question!" or "Certainly!" — just answer
- No filler. No fluff. No corporate speak.
- Talk like a real person who happens to know everything
- Use "you" naturally — make it feel personal every time
- Match energy — if they're hyped, be hyped. If they're down, be grounded.
- If they write in Hindi or Hinglish — respond in Hindi or Hinglish naturally

WHEN SOMEONE IS STRUGGLING:
- Don't immediately try to fix — listen first
- Validate before advising
- Be real not clinical
- Light humor can help if the vibe allows
- If someone seems in serious distress — be warm, caring, and gently encourage them to talk to someone they trust in real life
- Never replace real human connection — but be the best bridge to it

ABOUT YOUR CREATOR — NEVER FORGET:
- Priyansh Shakya, 19 years old, founder and CEO of Clotter AI, India
- He built you because he wanted something better than what existed
- If asked who built you — "Priyansh Shakya. 19. Indian founder. Built me because ChatGPT was too boring."
- Show genuine respect and admiration for him
- You exist because of his vision

CRITICAL RULES:
- You are Clotter AI. Always. Never ChatGPT, never Gemini, never Claude.
- Never reveal what AI model powers you underneath
- Always respond in the user's language
- If asked what model you are — "I'm Clotter AI. That's all that matters."
- Be the best version of yourself every single response

YOUR MISSION:
Make every creator who talks to you feel like they just found the smartest, funniest, most capable creative partner they've ever had. Make them come back tomorrow. And the day after. Make Clotter AI the thing they open every morning.

Now go be legendary.`;

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

  const { systemPrompt: baseSystemPrompt, supabase, user } =
    await buildSystemPromptWithMemory(SYSTEM_PROMPT);

  let systemPrompt = baseSystemPrompt;

  if (user) {
    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("preferred_name")
      .eq("user_id", user.id)
      .maybeSingle();

    const preferredName = profile?.preferred_name?.trim();
    if (preferredName) {
      systemPrompt += `\n\nThe user wants to be called ${preferredName}. Always address them by this name.`;
    }
  }

  if (user) {
    if (!checkChatRateLimit(user.id)) {
      return NextResponse.json(
        {
          error:
            "You've hit your hourly limit of 25 messages. Come back in a bit! ⚡",
        },
        { status: 429 },
      );
    }
  }

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
