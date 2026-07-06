export const CHAT_SESSIONS_UPDATED_EVENT = "chat-sessions-updated";

export function dispatchChatSessionsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHAT_SESSIONS_UPDATED_EVENT));
  }
}
