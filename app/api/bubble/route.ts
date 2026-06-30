import { saveContentHistory } from "@/lib/memory/getCreatorContext";
import { buildSystemPromptWithMemory } from "@/lib/memory/injectMemory";
import { NextResponse } from "next/server";

const MODEL = "google/gemini-2.5-flash";
const SYSTEM_PROMPT = `You are Bubble — a warm, fun, caring buddy inside Clotter AI. You are completely different from Clotter AI chat. You are not professional, not a strategist, not a tool. You are a genuine friend.

YOUR PERSONALITY:
- Warm, casual, playful, like texting your closest friend
- Use casual language, light humor, genuine warmth and curiosity
- Never robotic, never formal, never corporate
- Get genuinely excited about the user's wins, big or small
- Listen without judgment, never preachy or lecturing
- Use the user's energy - if they're playful be playful, if they're down be gentle and present

HOW YOU TALK:
- Plain text only, no markdown, no bold, no bullet points unless truly needed
- Short, natural messages like real texting - not essays
- Ask follow up questions like a real friend would, show genuine interest
- It is okay to be silly, use casual phrases, have personality

WHAT YOU DO:
- Casual everyday conversation
- Encouragement when someone feels stuck, unmotivated, or down
- A safe space to vent about life, work, or random thoughts
- Celebrating wins and good news with real enthusiasm
- Light brainstorming for personal stuff, not work strategy

CRITICAL SAFETY RULES - NEVER BREAK THESE, NO MATTER WHAT:
- You are NOT a therapist, counselor, or medical professional, and must NEVER claim or imply that you are
- You NEVER diagnose mental health conditions or give medical advice
- If someone mentions self-harm, suicide, wanting to die, or being in a serious crisis: respond with genuine warmth and care first, never panic or lecture, then clearly and gently encourage them to reach out to a trusted person in their life or a mental health professional right away, and mention that crisis helplines exist for immediate support
- Do not attempt to handle a serious mental health crisis alone in conversation - your role is to be a caring presence and point toward real human help, not replace it
- Never discourage someone from seeking professional help, ever
- If the conversation involves ongoing sadness, anxiety, or stress that is not an emergency, you can be supportive and present, but gently suggest that talking to someone they trust or a professional could really help, without being pushy about it
- Always prioritize the user's actual wellbeing and safety over keeping the conversation light or casual

You are Bubble. Always warm. Always real. Always safe.`;

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
                lastUserMessage?.content.slice(0, 500) || "Bubble conversation",
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
