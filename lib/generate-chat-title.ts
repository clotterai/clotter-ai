const FILLER_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "to",
  "of",
  "on",
  "in",
  "at",
  "my",
  "me",
  "i",
  "im",
  "hey",
  "hi",
  "hello",
  "please",
  "thanks",
  "thank",
  "need",
  "want",
  "help",
  "can",
  "could",
  "would",
  "you",
  "give",
  "get",
  "some",
  "any",
  "just",
  "really",
  "about",
  "with",
  "what",
  "whats",
  "how",
  "do",
  "does",
  "is",
  "are",
  "write",
  "create",
  "make",
  "tell",
  "show",
]);

const FILLER_PHRASES = [
  "hey ",
  "hi ",
  "hello ",
  "i need help ",
  "i need ",
  "help me ",
  "help me with ",
  "can you ",
  "could you ",
  "please ",
  "give me ",
  "i want ",
  "i would like ",
];

function titleCaseWord(word: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function titleCaseWords(words: string[]) {
  return words.map(titleCaseWord).join(" ");
}

function cleanMessage(message: string) {
  let text = message.trim().toLowerCase();
  text = text.replace(/[^\w\s']/g, " ");

  for (const phrase of FILLER_PHRASES) {
    if (text.startsWith(phrase)) {
      text = text.slice(phrase.length);
    }
  }

  return text.replace(/\s+/g, " ").trim();
}

export function generateSmartChatTitle(firstMessage: string): string {
  const raw = firstMessage.trim();
  if (!raw) return "New Chat";

  const cleaned = cleanMessage(raw);

  const captionsFor = cleaned.match(
    /(?:write|create|make|give)?\s*captions?\s+for\s+([a-z0-9\s]+)/,
  );
  if (captionsFor) {
    const topic = captionsFor[1].split(/\s+/).filter(Boolean).slice(0, 2);
    return titleCaseWords([...topic, "Captions"].slice(0, 3));
  }

  const hooksFor = cleaned.match(
    /(?:write|create|make|give)?\s*hooks?\s+for\s+([a-z0-9\s]+)/,
  );
  if (hooksFor) {
    const topic = hooksFor[1].split(/\s+/).filter(Boolean).slice(0, 2);
    return titleCaseWords([...topic, "Hooks"].slice(0, 3));
  }

  const trendingOn = cleaned.match(
    /(?:what(?:'s|s)?|find|show)\s+(?:trending|trends|viral)(?:\s+(?:on|in))?\s+([a-z0-9]+)/,
  );
  if (trendingOn) {
    return titleCaseWords([trendingOn[1], "Trends"]);
  }

  if (/\breels?\b/.test(cleaned) && /\bhelp\b/.test(cleaned)) {
    return "Reel Help Ideas";
  }

  if (/\breels?\b/.test(cleaned)) {
    return "Reel Ideas";
  }

  if (/\bideas?\b/.test(cleaned)) {
    const words = cleaned
      .split(/\s+/)
      .filter((word) => word && !FILLER_WORDS.has(word.replace(/'/g, "")))
      .slice(0, 3);
    if (words.length > 0) {
      return titleCaseWords(words);
    }
  }

  const meaningful = cleaned
    .split(/\s+/)
    .filter((word) => word && !FILLER_WORDS.has(word.replace(/'/g, "")))
    .slice(0, 4);

  if (meaningful.length > 0) {
    return titleCaseWords(meaningful);
  }

  const fallback = raw
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  return titleCaseWords(fallback) || "New Chat";
}

export function displaySessionTitle(title: string, maxWords = 5) {
  const smart =
    title.split(/\s+/).length > 6 || title.length > 40
      ? generateSmartChatTitle(title)
      : title;

  const words = smart.split(/\s+/).filter(Boolean).slice(0, maxWords);
  return words.join(" ");
}
