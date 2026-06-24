import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentType } from "./types";

export async function getCreatorContext(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const [{ data: profile }, { data: history }, { data: preferences }] =
    await Promise.all([
      supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("content_history")
        .select("topic, content_type, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("user_preferences")
        .select("likes, dislikes")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

  if (!profile && !history?.length && !preferences) {
    return "";
  }

  const historyLines =
    history
      ?.filter((item) => item.topic)
      .map((item) => `- ${item.topic} (${item.content_type})`)
      .join("\n") || "None yet";

  const likes = preferences?.likes?.length
    ? preferences.likes.join(", ")
    : "Not specified";
  const dislikes = preferences?.dislikes?.length
    ? preferences.dislikes.join(", ")
    : "Not specified";

  return `=== CREATOR MEMORY ===
Creator Profile:
Name: ${profile?.name ?? "Creator"}
Niche: ${profile?.niche ?? "General"}${profile?.sub_niche ? ` - ${profile.sub_niche}` : ""}
Platform: ${profile?.platforms?.join(", ") ?? "Multi-platform"}
Audience: ${profile?.audience_age ?? "Mixed ages"}, ${profile?.audience_location ?? "Global"}, ${profile?.audience_gender ?? "Mixed"}
Content Style: ${profile?.content_style ?? "Mixed"}
Posting: ${profile?.posting_frequency ?? "Regular"}
Followers: ${profile?.current_followers ?? "Growing"}
Goal: ${profile?.biggest_goal ?? "Grow audience"}
Unique Angle: ${profile?.unique_angle ?? "Authentic creator voice"}
Brand: ${profile?.brand_name ?? "Personal brand"}

Content History (avoid repeating these topics):
${historyLines}

User Preferences:
They LIKE: ${likes}
They DISLIKE: ${dislikes}
=== END MEMORY ===`;
}

export async function saveContentHistory(
  supabase: SupabaseClient,
  params: {
    userId: string;
    contentType: ContentType;
    topic: string;
    contentText: string;
    platform?: string | null;
  },
) {
  const { contentType, topic, contentText, platform, userId } = params;

  if (!contentText.trim()) return;

  await supabase.from("content_history").insert({
    user_id: userId,
    content_type: contentType,
    topic: topic.trim().slice(0, 500) || "Untitled",
    content_text: contentText.trim().slice(0, 50000),
    platform: platform ?? null,
  });
}

export function appendMemoryToPrompt(
  basePrompt: string,
  memoryContext: string,
): string {
  if (!memoryContext.trim()) return basePrompt;
  return `${basePrompt}\n\nUse this creator memory to personalize every response. Never repeat topics from content history unless asked.\n\n${memoryContext}`;
}

export async function hasCreatorProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}

export function calculateProfileCompletion(
  profile: Record<string, unknown> | null,
): number {
  if (!profile) return 0;

  const fields = [
    "name",
    "niche",
    "sub_niche",
    "audience_age",
    "audience_location",
    "audience_gender",
    "platforms",
    "content_style",
    "posting_frequency",
    "current_followers",
    "biggest_goal",
    "brand_name",
    "unique_angle",
  ];

  const filled = fields.filter((field) => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === "string" && value.trim().length > 0;
  });

  return Math.round((filled.length / fields.length) * 100);
}
