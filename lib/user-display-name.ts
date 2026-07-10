export function getFirstNameFromUser(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}): string {
  const email = user.email ?? "";
  const meta = user.user_metadata ?? {};

  const fullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : "";

  if (fullName) {
    return fullName.split(/\s+/)[0];
  }

  const name =
    (typeof meta.name === "string" && meta.name.trim()) ||
    (typeof meta.given_name === "string" && meta.given_name.trim()) ||
    "";

  if (name) {
    return name.split(/\s+/)[0];
  }

  const emailPrefix = email.split("@")[0]?.trim();
  return emailPrefix || "Creator";
}

export function getDisplayName(
  user: {
    email?: string;
    user_metadata?: Record<string, unknown>;
  },
  preferredName?: string | null,
): string {
  const trimmed = preferredName?.trim();
  if (trimmed) return trimmed;
  return getFirstNameFromUser(user);
}
