"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ClotterLogo } from "@/app/dashboard/components/clotter-logo";
import { useToast } from "@/app/dashboard/components/toast-provider";
import { BubbleIcon } from "@/app/dashboard/bubble/bubble-icon";
import { createClient } from "@/lib/supabase/client";
import { dispatchChatSessionsUpdated } from "@/lib/chat-sessions-events";
import { generateSmartChatTitle } from "@/lib/generate-chat-title";

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionEvent = {
  results: ArrayLike<{ 0?: { transcript?: string } }>;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type MessageAttachment = {
  type: "image" | "pdf";
  name: string;
  mimeType: string;
  dataUrl: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  attachment?: MessageAttachment;
};

type ApiContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

type ApiChatMessage = {
  role: "user" | "assistant";
  content: string | ApiContentPart[];
};

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

function isMessageAttachment(value: unknown): value is MessageAttachment {
  if (!value || typeof value !== "object") return false;
  const attachment = value as MessageAttachment;
  return (
    (attachment.type === "image" || attachment.type === "pdf") &&
    typeof attachment.name === "string" &&
    typeof attachment.mimeType === "string" &&
    typeof attachment.dataUrl === "string"
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function toApiMessage(message: Message): ApiChatMessage {
  if (!message.attachment) {
    return { role: message.role, content: message.content };
  }

  const parts: ApiContentPart[] = [];

  if (message.content.trim()) {
    parts.push({ type: "text", text: message.content });
  }

  if (message.attachment.type === "image") {
    parts.push({
      type: "image_url",
      image_url: { url: message.attachment.dataUrl },
    });
  } else {
    parts.push({
      type: "file",
      file: {
        filename: message.attachment.name,
        file_data: message.attachment.dataUrl,
      },
    });
  }

  return { role: message.role, content: parts };
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 12.5V7.5a3.5 3.5 0 0 1 7 0v8a5.5 5.5 0 0 1-11 0V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 4h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v4h4M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const CHAT_INPUT_LINE_HEIGHT = 20;
const CHAT_INPUT_MAX_LINES = 4;

const inputUtilityButtonClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50 transition-all duration-150 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40";

const sendButtonClass =
  "chat-send-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-[0_0_24px_-8px_rgba(236,72,153,0.55)] ring-1 ring-white/10 transition-all duration-150 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100";

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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
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
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="m4 8.5 2.5 2.5L12 5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbsUpIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      className={className}
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
  );
}

function ThumbsDownIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      className={className}
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
  );
}

function isAcceptedFile(file: File) {
  if (file.type.startsWith("video/")) {
    return false;
  }
  return file.type === "application/pdf" || file.type.startsWith("image/");
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

const iconActionButtonClass =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/[0.02] transition-all duration-150 hover:border-white/10 hover:bg-white/[0.06]";

const actionIconClass = "h-4 w-4 shrink-0";

function AssistantMessageActions({
  messageIndex,
  content,
  createdAt,
  feedback,
  copiedIndex,
  feedbackThanksIndex,
  onFeedback,
  onCopy,
}: {
  messageIndex: number;
  content: string;
  createdAt?: string;
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
    <div className="chat-actions-fade-in">
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onFeedback(messageIndex, "like")}
            className={`${iconActionButtonClass} ${
              isLiked ? "text-[#EC4899]" : "text-white/40 hover:text-white/60"
            }`}
            aria-label="Mark as helpful"
          >
            <ThumbsUpIcon filled={isLiked} className={actionIconClass} />
          </button>
          <button
            type="button"
            onClick={() => onFeedback(messageIndex, "dislike")}
            className={`${iconActionButtonClass} ${
              isDisliked ? "text-[#F97316]" : "text-white/40 hover:text-white/60"
            }`}
            aria-label="Mark as not helpful"
          >
            <ThumbsDownIcon filled={isDisliked} className={actionIconClass} />
          </button>
          <button
            type="button"
            onClick={() => onCopy(messageIndex, content)}
            className={`${iconActionButtonClass} ${
              isCopied ? "text-green-400" : "text-white/40 hover:text-white/70"
            }`}
            aria-label={isCopied ? "Copied" : "Copy message"}
          >
            {isCopied ? (
              <CheckIcon className={actionIconClass} />
            ) : (
              <CopyIcon className={actionIconClass} />
            )}
          </button>
        </div>
        <span className="ml-auto shrink-0 text-xs text-white/25">
          {formatMessageTime(createdAt)}
        </span>
      </div>
      {feedbackThanksIndex === messageIndex && (
        <p className="mt-2 text-[11px] font-medium text-white/35">
          Thanks for the feedback!
        </p>
      )}
    </div>
  );
}

function UserMessageActions({
  messageIndex,
  content,
  createdAt,
  copiedIndex,
  onCopy,
}: {
  messageIndex: number;
  content: string;
  createdAt?: string;
  copiedIndex: number | null;
  onCopy: (messageIndex: number, content: string) => void;
}) {
  const isCopied = copiedIndex === messageIndex;

  return (
    <div className="flex w-full items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onCopy(messageIndex, content)}
          className={`${iconActionButtonClass} ${
            isCopied ? "text-green-400" : "text-white/40 hover:text-white/70"
          }`}
          aria-label={isCopied ? "Copied" : "Copy message"}
        >
          {isCopied ? (
            <CheckIcon className={actionIconClass} />
          ) : (
            <CopyIcon className={actionIconClass} />
          )}
        </button>
      </div>
      <span className="ml-auto shrink-0 text-xs text-white/25">
        {formatMessageTime(createdAt)}
      </span>
    </div>
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
  const { showToast } = useToast();
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
  const [selectedAttachment, setSelectedAttachment] =
    useState<MessageAttachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
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
          ? data.session.messages
              .filter(
                (message): message is Message =>
                  typeof message === "object" &&
                  message !== null &&
                  typeof message.id === "string" &&
                  (message.role === "user" || message.role === "assistant") &&
                  typeof message.content === "string" &&
                  (message.attachment === undefined ||
                    isMessageAttachment(message.attachment)),
              )
              .map((message) => ({
                ...message,
                createdAt:
                  typeof message.createdAt === "string"
                    ? message.createdAt
                    : undefined,
              }))
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
      recognitionRef.current?.stop();
    };
  }, []);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!isAcceptedFile(file)) {
      if (file.type.startsWith("video/")) {
        setError("Videos aren't supported in chat yet. Please attach an image or PDF.");
      } else {
        setError("Please select a JPG, PNG, WebP image, or PDF file.");
      }
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setError("File must be 10MB or smaller.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedAttachment({
        type: file.type === "application/pdf" ? "pdf" : "image",
        name: file.name,
        mimeType: file.type,
        dataUrl,
      });
      setError(null);
    } catch {
      setError("Failed to read the selected file.");
    }
  }

  function handleRemoveAttachment() {
    setSelectedAttachment(null);
  }

  function toggleVoiceInput() {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      showToast("Voice not supported on this browser", "error");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join("")
        .trim();

      if (transcript) {
        setInput((current) => {
          const nextValue = current ? `${current} ${transcript}` : transcript;
          return nextValue.trim();
        });
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      textareaRef.current?.focus();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function handleCopy(messageIndex: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(messageIndex);
      showToast("Message copied");

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
    const attachment = selectedAttachment;

    if ((!trimmed && !attachment) || isLoading || isLoadingSession) return;

    let activeSessionId = sessionId;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
      attachment: attachment ?? undefined,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSelectedAttachment(null);
    setError(null);
    setIsLoading(true);

    try {
      if (!activeSessionId) {
        const title = generateTitle(trimmed || attachment?.name || "New Chat");
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

      const history = nextMessages.map(toApiMessage);
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

  const syncTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const maxHeight = CHAT_INPUT_LINE_HEIGHT * CHAT_INPUT_MAX_LINES;
    textarea.style.height = `${CHAT_INPUT_LINE_HEIGHT}px`;
    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, CHAT_INPUT_LINE_HEIGHT),
      maxHeight,
    );
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
    requestAnimationFrame(syncTextareaHeight);
  }

  useEffect(() => {
    syncTextareaHeight();
  }, [input, syncTextareaHeight]);

  const canSend = Boolean(input.trim() || selectedAttachment);

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

        @keyframes chat-mic-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.45);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(236, 72, 153, 0);
          }
        }

        @keyframes chat-welcome-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-mic-pulse {
          animation: chat-mic-pulse 1.2s ease-in-out infinite;
        }

        .chat-welcome-title {
          animation: chat-welcome-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .chat-welcome-subtitle {
          animation: chat-welcome-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }

        .chat-prompt-chip {
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.625rem 1.125rem;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: rgba(255, 255, 255, 0.6);
          transition:
            border-color 0.3s ease,
            background 0.3s ease,
            color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
          animation: chat-welcome-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--chip-delay, 0s);
        }

        .chat-prompt-chip:hover:not(:disabled) {
          border-color: rgba(236, 72, 153, 0.4);
          background: rgba(236, 72, 153, 0.08);
          color: white;
          box-shadow: 0 0 24px -8px rgba(236, 72, 153, 0.5);
          transform: translateY(-1px);
        }
      `}</style>
      {/* Messages or welcome */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoadingSession ? (
          <div className="chat-session-loading flex h-full items-center justify-center px-6 py-12">
            <p className="text-sm text-white/40">Loading chat...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12">
            <div
              className="chat-welcome-title"
              style={{ animationDelay: "0.05s" }}
            >
              <BubbleIcon size={64} />
            </div>
            <h2 className="font-heading chat-welcome-title mt-8 text-center text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.75rem]">
              What are we creating today?
            </h2>
            <p className="chat-welcome-subtitle mt-4 max-w-md text-center text-[1.0625rem] leading-relaxed tracking-[-0.018em] text-white/45">
              Your creative co-pilot — built to make you go viral.
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
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 pb-4 md:gap-6 md:px-6 md:py-10 md:pb-4">
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
                    <div className="flex max-w-[85%] flex-col items-end md:max-w-[85%]">
                      <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 px-3 py-2 text-white shadow-[0_8px_32px_-12px_rgba(236,72,153,0.45)] md:px-4 md:py-3">
                        {message.attachment?.type === "image" && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={message.attachment.dataUrl}
                            alt={message.attachment.name}
                            className="mb-2 max-h-32 max-w-full rounded-lg object-cover ring-1 ring-white/20"
                          />
                        )}
                        {message.attachment?.type === "pdf" && (
                          <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
                            <PdfIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{message.attachment.name}</span>
                          </div>
                        )}
                        {message.content ? (
                          <MessageText content={message.content} />
                        ) : null}
                      </div>
                      <UserMessageActions
                        messageIndex={index}
                        content={message.content}
                        createdAt={message.createdAt}
                        copiedIndex={copiedIndex}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full gap-2 md:gap-3">
                    <ChatAiAvatar thinking={isStreamingMessage} />
                    <div className="min-w-0 max-w-[85%] flex-1 md:max-w-none">
                      <div
                        className={`rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-white/95 backdrop-blur-md md:px-4 md:py-3 ${
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
                          </div>
                        ) : (
                          <span className="inline-block h-4 w-4" aria-hidden />
                        )}
                      </div>
                      {!isStreamingMessage && (
                        <AssistantMessageActions
                          messageIndex={index}
                          content={message.content}
                          createdAt={message.createdAt}
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
      <div
        className="sticky bottom-0 z-20 shrink-0 border-t border-[#EC4899]/10 bg-[#05050f]/90 px-4 py-3 backdrop-blur-xl md:px-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent"
        />
        <div className="mx-auto w-full max-w-3xl">
          {error && (
            <p className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm leading-relaxed text-red-300">
              {error}
            </p>
          )}

          {selectedAttachment && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-[#13131f]/90 px-3 py-2">
              {selectedAttachment.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedAttachment.dataUrl}
                  alt={selectedAttachment.name}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60 ring-1 ring-white/10">
                  <PdfIcon className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/85">
                  {selectedAttachment.name}
                </p>
                <p className="text-xs text-white/35">
                  {selectedAttachment.type === "image" ? "Image" : "PDF"} attached
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                disabled={isLoading}
                className="inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-xs font-medium text-white/45 transition-colors duration-150 hover:bg-white/5 hover:text-white/75 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          )}

          <div className="chat-input-bar flex min-h-[56px] items-center gap-2 rounded-2xl border border-white/10 bg-[#13131f]/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,application/pdf"
              capture="environment"
              onChange={(event) => void handleFileSelect(event)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`${inputUtilityButtonClass} ${
                selectedAttachment
                  ? "border-pink-500/30 bg-pink-500/10 text-pink-400"
                  : ""
              }`}
              aria-label="Attach image or PDF"
            >
              <PaperclipIcon className="h-4 w-4" />
            </button>
            <textarea
              ref={textareaRef}
              autoFocus
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message Clotter AI..."
              rows={1}
              disabled={isLoading}
              style={{ resize: "none", overflow: "hidden" }}
              className="max-h-20 min-h-[20px] flex-1 resize-none bg-transparent py-0 text-[15px] leading-5 tracking-[-0.018em] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`${inputUtilityButtonClass} ${
                isRecording
                  ? "chat-mic-pulse border-pink-500/40 bg-gradient-to-br from-pink-500/20 to-orange-500/10 text-pink-400"
                  : ""
              }`}
              aria-label={isRecording ? "Stop voice input" : "Start voice input"}
            >
              <MicIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!canSend || isLoading}
              className={sendButtonClass}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
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
          <p className="mt-2 text-center text-xs tracking-[-0.01em] text-white/30 md:mt-3 md:text-[13px]">
            Clotter AI can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
