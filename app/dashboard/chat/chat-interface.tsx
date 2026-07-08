"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ClotterLogo } from "@/app/dashboard/components/clotter-logo";
import { createClient } from "@/lib/supabase/client";
import { dispatchChatSessionsUpdated } from "@/lib/chat-sessions-events";
import { generateSmartChatTitle } from "@/lib/generate-chat-title";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type MessageFeedback = "like" | "dislike";

const promptPool = [
  "Give me reel ideas",
  "Write a caption",
  "Find trending topics",
  "Write a hook",
  "Give me script ideas",
  "What's viral right now?",
  "Help me grow on Instagram",
  "Give me 5 content ideas",
];

function pickRandomPrompts(count: number) {
  const shuffled = [...promptPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateTitle(firstMessage: string) {
  return generateSmartChatTitle(firstMessage);
}

function formatMessageTime(createdAt?: string) {
  const date = createdAt ? new Date(createdAt) : new Date();
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageTimestamp({ createdAt }: { createdAt?: string }) {
  return (
    <p className="chat-msg-timestamp mt-1 text-right text-[10px] text-white/25">
      {formatMessageTime(createdAt)}
    </p>
  );
}

function ClotterLogoMark() {
  return (
    <div className="chat-logo-glow">
      <ClotterLogo size={64} />
    </div>
  );
}

function MessageText({ content }: { content: string }) {
  const paragraphs = content.split(/\n+/).filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <p className="whitespace-pre-wrap text-base leading-relaxed tracking-[-0.018em]">
        {content}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-base leading-relaxed tracking-[-0.018em] last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function ChatAiAvatar({ thinking = false }: { thinking?: boolean }) {
  return (
    <div
      className={`chat-ai-logo mt-0.5 shrink-0${thinking ? " chat-ai-logo--thinking" : ""}`}
    >
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
      className={`flex flex-wrap items-center gap-2 pt-2.5 ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      {children}
    </div>
  );
}

const pillButtonClass =
  "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-white/8 bg-white/[0.04] px-2.5 text-[11px] font-medium transition-all duration-150 hover:scale-[1.02] hover:border-white/15 hover:bg-white/[0.08]";

function AssistantMessageActions({
  messageIndex,
  content,
  feedback,
  copiedIndex,
  feedbackThanksIndex,
  onFeedback,
  onCopy,
}: {
  messageIndex: number;
  content: string;
  feedback?: MessageFeedback;
  copiedIndex: number | null;
  feedbackThanksIndex: number | null;
  onFeedback: (messageIndex: number, value: MessageFeedback) => void;
  onCopy: (messageIndex: number, content: string) => void;
}) {
  const isCopied = copiedIndex === messageIndex;
  const isLiked = feedback === "like";
  const isDisliked = feedback === "dislike";

  return (
    <div className="chat-actions-fade-in mt-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onFeedback(messageIndex, "like")}
          className={`${pillButtonClass} ${
            isLiked
              ? "border-green-500/30 text-green-400"
              : "text-white/40 hover:text-white/65"
          }`}
          aria-label="Mark as helpful"
        >
          <svg
            viewBox="0 0 16 16"
            fill={isLiked ? "currentColor" : "none"}
            className="h-3 w-3 shrink-0"
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
          Helpful
        </button>
        <button
          type="button"
          onClick={() => onFeedback(messageIndex, "dislike")}
          className={`${pillButtonClass} ${
            isDisliked
              ? "border-red-500/30 text-red-400"
              : "text-white/40 hover:text-white/65"
          }`}
          aria-label="Mark as not helpful"
        >
          <svg
            viewBox="0 0 16 16"
            fill={isDisliked ? "currentColor" : "none"}
            className="h-3 w-3 shrink-0"
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
          Not helpful
        </button>
        <button
          type="button"
          onClick={() => onCopy(messageIndex, content)}
          className={`${pillButtonClass} ${
            isCopied
              ? "border-green-500/30 text-green-400"
              : "text-white/40 hover:text-white/65"
          }`}
          aria-label={isCopied ? "Copied" : "Copy message"}
        >
          {isCopied ? (
            "Copied!"
          ) : (
            <>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3 w-3 shrink-0"
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
              Copy
            </>
          )}
        </button>
      </div>
      {feedbackThanksIndex === messageIndex && (
        <p className="mt-2 text-[11px] font-medium text-white/35">
          Thanks for the feedback!
        </p>
      )}
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
      className={`${pillButtonClass} ${
        align === "end" ? "self-end" : ""
      } ${
        isCopied
          ? "border-pink-500/30 text-pink-400"
          : "text-white/40 hover:text-white/65"
      }`}
      aria-label={isCopied ? "Copied" : "Copy message"}
    >
      {isCopied ? (
        "Copied!"
      ) : (
        <>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4"
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
          Copy
        </>
      )}
    </button>
  );
}

export function ChatInterface({
  selectedModel = "Clotter Lite",
  sessionId = null,
}: {
  selectedModel?: string;
  sessionId?: string | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedPrompts] = useState(() => pickRandomPrompts(4));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<number, MessageFeedback>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedbackThanksIndex, setFeedbackThanksIndex] = useState<number | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locallyActiveSessionRef = useRef<string | null>(null);
  const loadGenerationRef = useRef(0);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (sessionId === null) {
      locallyActiveSessionRef.current = null;
      setMessages([]);
      setFeedback({});
      setCopiedIndex(null);
      setFeedbackThanksIndex(null);
      setError(null);
      return;
    }

    if (sessionId === locallyActiveSessionRef.current) {
      return;
    }

    const generation = ++loadGenerationRef.current;
    locallyActiveSessionRef.current = null;

    async function loadSession() {
      setIsLoadingSession(true);
      setError(null);

      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to load chat.");
        }

        const data = (await response.json()) as {
          session?: { messages?: Message[] };
        };

        if (generation !== loadGenerationRef.current) return;

        const loadedMessages = Array.isArray(data.session?.messages)
          ? data.session.messages.filter(
              (message): message is Message =>
                typeof message === "object" &&
                message !== null &&
                typeof message.id === "string" &&
                (message.role === "user" || message.role === "assistant") &&
                typeof message.content === "string",
            )
          : [];

        setMessages(loadedMessages);
        setFeedback({});
        setCopiedIndex(null);
        setFeedbackThanksIndex(null);
      } catch (err) {
        if (generation !== loadGenerationRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to load chat.");
        setMessages([]);
      } finally {
        if (generation === loadGenerationRef.current) {
          setIsLoadingSession(false);
        }
      }
    }

    void loadSession();
  }, [sessionId]);

  async function persistMessages(
    activeSessionId: string,
    updatedMessages: Message[],
  ) {
    const response = await fetch(`/api/chat-sessions/${activeSessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    if (response.ok) {
      dispatchChatSessionsUpdated();
    }
  }

  useEffect(() => {
    if (!isEmpty) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, isLoading, isEmpty]);

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

    const messageContent = messages[messageIndex]?.content;
    if (messageContent) {
      void (async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          await supabase.from("chat_feedback").insert({
            user_id: user.id,
            type: "chat_feedback",
            value: value === "like" ? "liked" : "disliked",
            content: messageContent,
            created_at: new Date().toISOString(),
          });
        } catch {
          // Save feedback silently in the background.
        }
      })();
    }
  }

  async function sendMessage(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading || isLoadingSession) return;

    let activeSessionId = sessionId;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
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
      if (!activeSessionId) {
        const title = generateTitle(trimmed);
        const createResponse = await fetch("/api/chat-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        if (!createResponse.ok) {
          setMessages(messages);
          throw new Error("Failed to create chat session.");
        }

        const createData = (await createResponse.json()) as {
          session?: { id: string };
        };

        if (!createData.session?.id) {
          setMessages(messages);
          throw new Error("Failed to create chat session.");
        }

        activeSessionId = createData.session.id;
        locallyActiveSessionRef.current = activeSessionId;
        router.push(`/dashboard/chat?session=${activeSessionId}`, {
          scroll: false,
        });
        dispatchChatSessionsUpdated();
      }

      const history = nextMessages.map(({ role, content }) => ({ role, content }));
      const assistantId = crypto.randomUUID();

      setMessages([
        ...nextMessages,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, selectedModel }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setMessages(nextMessages);
        throw new Error(data?.error || "Something went wrong.");
      }

      if (!response.body) {
        setMessages(nextMessages);
        throw new Error("No response stream received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        content += decoder.decode(value, { stream: true });
        const snapshot = content;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: snapshot }
              : message,
          ),
        );
      }

      if (!content.trim()) {
        setMessages(nextMessages);
        throw new Error("No response content received.");
      }

      const assistantCreatedAt = new Date().toISOString();
      const finalMessages: Message[] = [
        ...nextMessages,
        {
          id: assistantId,
          role: "assistant",
          content,
          createdAt: assistantCreatedAt,
        },
      ];

      if (activeSessionId) {
        await persistMessages(activeSessionId, finalMessages);
      }
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

        .chat-ai-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(0deg);
          transition: transform 0.35s ease-out;
        }

        .chat-ai-logo--thinking {
          animation: chat-ai-logo-spin 1s linear infinite;
        }
      `}</style>
      {/* Messages or welcome */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingSession ? (
          <div className="chat-session-loading flex h-full items-center justify-center px-6 py-12">
            <p className="text-sm text-white/40">Loading chat...</p>
          </div>
        ) : isEmpty ? (
          <div className="chat-welcome flex h-full flex-col items-center justify-center px-6 py-12">
            <ClotterLogoMark />
            <h2 className="font-heading chat-welcome-title-shimmer mt-8 text-center text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.75rem]">
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
                  className="chat-prompt-chip transition-transform duration-150 hover:scale-105"
                  style={{ "--chip-delay": `${0.55 + index * 0.1}s` } as React.CSSProperties}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
            {messages.map((message, index) => {
              const isStreamingMessage =
                isLoading &&
                message.role === "assistant" &&
                index === messages.length - 1;

              return (
              <div
                key={message.id}
                className="chat-msg-enter w-full"
                style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
              >
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="flex max-w-[85%] flex-col items-end">
                      <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 px-4 py-3 text-white shadow-[0_8px_32px_-12px_rgba(236,72,153,0.45)]">
                        <MessageText content={message.content} />
                        <MessageTimestamp createdAt={message.createdAt} />
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
                  </div>
                ) : (
                  <div className="flex w-full gap-3">
                    <ChatAiAvatar thinking={isStreamingMessage} />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white/95 backdrop-blur-md ${
                          isStreamingMessage ? "chat-streaming-bubble" : ""
                        }`}
                      >
                        {message.content ? (
                          <div
                            className={
                              isStreamingMessage ? "chat-streaming-content" : ""
                            }
                          >
                            <MessageText content={message.content} />
                            {!isStreamingMessage && (
                              <MessageTimestamp createdAt={message.createdAt} />
                            )}
                          </div>
                        ) : (
                          <span className="inline-block h-4 w-4" aria-hidden />
                        )}
                      </div>
                      {!isStreamingMessage && (
                        <AssistantMessageActions
                          messageIndex={index}
                          content={message.content}
                          feedback={feedback[index]}
                          copiedIndex={copiedIndex}
                          feedbackThanksIndex={feedbackThanksIndex}
                          onFeedback={handleFeedback}
                          onCopy={handleCopy}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
            })}

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
              className="chat-send-btn inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-[0_0_40px_-6px_rgba(236,72,153,0.6)] ring-1 ring-white/10 transition-transform duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
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
            Clotter AI may make mistakes. Verify important information before using.
          </p>
        </div>
      </div>
    </div>
  );
}
