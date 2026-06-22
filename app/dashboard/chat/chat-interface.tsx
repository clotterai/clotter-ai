"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestedPrompts = [
  "Give me reel ideas",
  "Write a caption",
  "Find trending topics",
  "Write a hook",
];

function ClotterLogo() {
  return (
    <div className="chat-logo-glow relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] ring-1 ring-white/15">
      <span className="text-2xl font-bold text-white">C</span>
    </div>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (!isEmpty) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isEmpty]);

  async function sendMessage(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const history = nextMessages.map(({ role, content }) => ({ role, content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 200)}px`;
  }

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      {/* Messages or welcome */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="chat-welcome flex h-full flex-col items-center justify-center px-6 py-12">
            <ClotterLogo />
            <h2 className="font-heading chat-welcome-title mt-8 text-center text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.75rem]">
              What are we creating today?
            </h2>
            <p className="chat-welcome-subtitle mt-4 max-w-md text-center text-[1.0625rem] leading-relaxed tracking-[-0.018em] text-white/45">
              Your AI creative partner for content ideas, captions, hooks, and
              growth strategy.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isLoading}
                  className="chat-prompt-chip"
                  style={{ "--chip-delay": `${0.55 + index * 0.1}s` } as React.CSSProperties}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-msg-enter flex w-full ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "user" ? (
                  <div className="chat-user-bubble">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : (
                  <div className="flex w-full gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-xs font-bold text-white shadow-[0_0_24px_-4px_#A855F7] ring-1 ring-white/10">
                      AI
                    </div>
                    <div className="chat-ai-bubble min-w-0">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg-enter flex w-full gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-xs font-bold text-white ring-1 ring-white/10">
                  AI
                </div>
                <div className="chat-ai-bubble">
                  <div className="chat-typing-dots">
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="relative shrink-0 border-t border-[#7C3AED]/10 bg-[#05050f]/35 px-6 py-6 backdrop-blur-xl sm:px-10 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent"
        />
        <div className="mx-auto w-full max-w-4xl">
          {error && (
            <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-[15px] leading-relaxed text-red-300">
              {error}
            </p>
          )}

          {!isEmpty && (
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  disabled={isLoading}
                  className="chat-prompt-chip !py-2 !text-[13px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-bar flex items-end gap-4 p-3 sm:p-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message Clotter AI..."
              rows={1}
              disabled={isLoading}
              className="max-h-52 min-h-[56px] flex-1 resize-none bg-transparent px-3 py-3 text-[1.0625rem] leading-[1.65] tracking-[-0.018em] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50 sm:min-h-[60px] sm:px-4 sm:py-3.5"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isLoading}
              className="chat-send-btn inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white shadow-[0_0_40px_-6px_#A855F7] ring-1 ring-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="mt-4 text-center text-[13px] tracking-[-0.01em] text-white/30">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
