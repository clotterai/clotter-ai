"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type MessageFeedback = "like" | "dislike";

const suggestedPrompts = [
  "Give me reel ideas",
  "Write a caption",
  "Find trending topics",
  "Write a hook",
];

import { ClotterLogo } from "../components/clotter-logo";

function ClotterLogoMark() {
  return <ClotterLogo size={64} className="chat-logo-glow" />;
}

function MessageText({ content }: { content: string }) {
  const paragraphs = content.split(/\n+/).filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <p className="whitespace-pre-wrap leading-[1.85] tracking-[-0.018em]">
        {content}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="leading-[1.85] tracking-[-0.018em] last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function CopyButton({
  messageIndex,
  content,
  copiedIndex,
  onCopy,
  align = "start",
}: {
  messageIndex: number;
  content: string;
  copiedIndex: number | null;
  onCopy: (messageIndex: number, content: string) => void;
  align?: "start" | "end";
}) {
  const isCopied = copiedIndex === messageIndex;

  return (
    <button
      type="button"
      onClick={() => onCopy(messageIndex, content)}
      className={`inline-flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center gap-1 rounded-md border border-[#7C3AED]/20 bg-[#0D0D1A] px-2 text-[11px] font-medium text-white/60 transition hover:border-[#7C3AED]/35 hover:text-white/80 ${
        align === "end" ? "self-end" : ""
      } ${isCopied ? "border-[#A855F7]/40 text-[#A855F7]" : ""}`}
      aria-label={isCopied ? "Copied" : "Copy message"}
    >
      {isCopied ? (
        "Copied!"
      ) : (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <rect
            x="5"
            y="5"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M5 11H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5h5.5A1.5 1.5 0 0 1 11 4v1"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      )}
    </button>
  );
}

function FeedbackButtons({
  messageIndex,
  feedback,
  onFeedback,
}: {
  messageIndex: number;
  feedback?: MessageFeedback;
  onFeedback: (messageIndex: number, value: MessageFeedback) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onFeedback(messageIndex, "like")}
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-sm transition ${
          feedback === "like"
            ? "border-green-500/50 bg-green-500/20 text-green-400"
            : "border-[#7C3AED]/20 bg-[#0D0D1A] text-white/60 hover:border-[#7C3AED]/35 hover:text-white/80"
        }`}
        aria-label="Like response"
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => onFeedback(messageIndex, "dislike")}
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-sm transition ${
          feedback === "dislike"
            ? "border-red-500/50 bg-red-500/20 text-red-400"
            : "border-[#7C3AED]/20 bg-[#0D0D1A] text-white/60 hover:border-[#7C3AED]/35 hover:text-white/80"
        }`}
        aria-label="Dislike response"
      >
        👎
      </button>
    </>
  );
}

export function ChatInterface({
  selectedModel = "Clotter Lite",
}: {
  selectedModel?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<number, MessageFeedback>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (!isEmpty) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isEmpty]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy(messageIndex: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(messageIndex);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopiedIndex((current) =>
          current === messageIndex ? null : current,
        );
      }, 2000);
    } catch {
      // Clipboard access can fail in unsupported contexts.
    }
  }

  function handleFeedback(messageIndex: number, value: MessageFeedback) {
    setFeedback((current) => ({
      ...current,
      [messageIndex]: value,
    }));
  }

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
        body: JSON.stringify({ messages: history, selectedModel }),
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
            <ClotterLogoMark />
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
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 sm:gap-12 sm:px-10 sm:py-12">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`chat-msg-enter w-full pb-1 ${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
              >
                {message.role === "user" ? (
                  <div className="flex max-w-[75%] flex-col items-end gap-2">
                    <div className="chat-user-bubble">
                      <MessageText content={message.content} />
                    </div>
                    <div className="relative z-10 flex shrink-0 items-center">
                      <CopyButton
                        messageIndex={index}
                        content={message.content}
                        copiedIndex={copiedIndex}
                        onCopy={handleCopy}
                        align="end"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex w-full gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-xs font-bold text-white shadow-[0_0_24px_-4px_#A855F7] ring-1 ring-white/10">
                        AI
                      </div>
                      <div className="chat-ai-bubble min-w-0 flex-1">
                        <MessageText content={message.content} />
                      </div>
                    </div>
                    <div className="relative z-10 mt-2 flex shrink-0 items-center gap-1.5 pl-14">
                      <FeedbackButtons
                        messageIndex={index}
                        feedback={feedback[index]}
                        onFeedback={handleFeedback}
                      />
                      <CopyButton
                        messageIndex={index}
                        content={message.content}
                        copiedIndex={copiedIndex}
                        onCopy={handleCopy}
                      />
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
                  d="M12 19V5M7 10l5-5 5 5"
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
