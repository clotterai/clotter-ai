"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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

import { ClotterLogo } from "@/app/dashboard/components/clotter-logo";

function ClotterLogoMark() {
  return <ClotterLogo size={64} />;
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

type ChatAiAvatarState = "thinking" | "bounce" | "settled";

function ChatAiAvatar({ state = "settled" }: { state?: ChatAiAvatarState }) {
  return (
    <div className={`chat-ai-logo mt-0.5 shrink-0 chat-ai-logo--${state}`}>
      <ClotterLogo size={28} />
    </div>
  );
}

function MessageActions({
  children,
  align = "start",
}: {
  children: ReactNode;
  align?: "start" | "end";
}) {
  return (
    <div
      className={`flex items-center gap-0.5 pt-1 ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      {children}
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
      className={`inline-flex h-6 min-w-[1.5rem] shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent px-1.5 text-[10px] font-medium text-white/40 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white/70 ${
        align === "end" ? "self-end" : ""
      } ${isCopied ? "text-[#A855F7]" : ""}`}
      aria-label={isCopied ? "Copied" : "Copy message"}
    >
      {isCopied ? (
        "Copied!"
      ) : (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3 w-3"
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
        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent transition hover:bg-white/[0.04] ${
          feedback === "like"
            ? "text-green-400"
            : "text-white/35 hover:text-white/60"
        }`}
        aria-label="Like response"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3 w-3"
          aria-hidden
        >
          <path
            d="M5 14V7.5M5 7.5L6.8 3.2a1 1 0 0 1 .95-.7H10a1 1 0 0 1 1 1v2h2.2a1 1 0 0 1 .98 1.2l-.8 4A1 1 0 0 1 12.4 11H8.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 7.5H3.5a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1H5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onFeedback(messageIndex, "dislike")}
        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent transition hover:bg-white/[0.04] ${
          feedback === "dislike"
            ? "text-red-400"
            : "text-white/35 hover:text-white/60"
        }`}
        aria-label="Dislike response"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3 w-3"
          aria-hidden
        >
          <path
            d="M5 2v6.5M5 8.5L6.8 12.8a1 1 0 0 0 .95.7H10a1 1 0 0 0 1-1v-2h2.2a1 1 0 0 0 .98-1.2l-.8-4A1 1 0 0 0 12.4 5H8.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 8.5H3.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1H5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
  const [feedbackThanksIndex, setFeedbackThanksIndex] = useState<number | null>(
    null,
  );
  const [animatingAvatarId, setAnimatingAvatarId] = useState<string | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (!isEmpty) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isEmpty]);

  useEffect(() => {
    if (!animatingAvatarId) return;

    const timeout = setTimeout(() => {
      setAnimatingAvatarId(null);
    }, 400);

    return () => clearTimeout(timeout);
  }, [animatingAvatarId]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
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
    setFeedbackThanksIndex(messageIndex);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackThanksIndex((current) =>
        current === messageIndex ? null : current,
      );
    }, 2000);
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

      const assistantId = crypto.randomUUID();

      setMessages((current) => [
        ...current,
        {
          id: assistantId,
          role: "assistant",
          content: data.content,
        },
      ]);
      setAnimatingAvatarId(assistantId);
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
      <style>{`
        @keyframes chat-ai-logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes chat-ai-logo-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        @keyframes chat-ai-logo-glow {
          0%, 100% {
            box-shadow:
              0 0 6px rgba(168, 85, 247, 0.22),
              0 0 14px rgba(124, 58, 237, 0.12);
          }
          50% {
            box-shadow:
              0 0 14px rgba(168, 85, 247, 0.55),
              0 0 28px rgba(124, 58, 237, 0.35);
          }
        }

        .chat-ai-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
        }

        .chat-ai-logo--thinking {
          animation: chat-ai-logo-spin 1s linear infinite;
        }

        .chat-ai-logo--bounce {
          animation:
            chat-ai-logo-bounce 400ms ease-out forwards,
            chat-ai-logo-glow 3s ease-in-out 400ms infinite;
        }

        .chat-ai-logo--settled {
          animation: chat-ai-logo-glow 3s ease-in-out infinite;
        }
      `}</style>
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
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`chat-msg-enter w-full ${
                  message.role === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                {message.role === "user" ? (
                  <div className="flex max-w-[85%] flex-col items-end">
                    <div className="rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-3 text-[15px] leading-[1.7] tracking-[-0.018em] text-white ring-1 ring-white/10 sm:px-5 sm:py-3.5">
                      <MessageText content={message.content} />
                    </div>
                    <MessageActions align="end">
                      <CopyButton
                        messageIndex={index}
                        content={message.content}
                        copiedIndex={copiedIndex}
                        onCopy={handleCopy}
                        align="end"
                      />
                    </MessageActions>
                  </div>
                ) : (
                  <div className="flex w-full max-w-[92%] gap-3 sm:max-w-[88%] sm:gap-3.5">
                    <ChatAiAvatar
                      state={
                        message.id === animatingAvatarId ? "bounce" : "settled"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[15px] leading-[1.7] tracking-[-0.018em] text-white/90 sm:px-5 sm:py-3.5">
                        <MessageText content={message.content} />
                      </div>
                      <MessageActions>
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
                        {feedbackThanksIndex === index && (
                          <span className="ml-1 text-[10px] font-medium text-white/40">
                            Thanks for the feedback!
                          </span>
                        )}
                      </MessageActions>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg-enter flex w-full max-w-[92%] gap-3 sm:max-w-[88%] sm:gap-3.5">
                <ChatAiAvatar state="thinking" />
                <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.03] px-5 py-4">
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
        <div className="mx-auto w-full max-w-3xl">
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

          <div className="chat-input-bar flex items-end gap-3 rounded-2xl border border-white/10 bg-[#13131f]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:gap-4 sm:p-3.5">
            <textarea
              ref={textareaRef}
              autoFocus
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message Clotter AI..."
              rows={1}
              disabled={isLoading}
              className="max-h-52 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[1rem] leading-[1.65] tracking-[-0.018em] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-50 sm:min-h-[56px] sm:px-4 sm:py-3"
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
