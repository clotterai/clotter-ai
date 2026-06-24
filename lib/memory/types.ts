export type ContentType =
  | "idea"
  | "script"
  | "caption"
  | "hook"
  | "trend"
  | "chat";

export type CreatorProfile = {
  id: string;
  user_id: string;
  name: string | null;
  niche: string | null;
  sub_niche: string | null;
  audience_age: string | null;
  audience_location: string | null;
  audience_gender: string | null;
  platforms: string[] | null;
  content_style: string | null;
  posting_frequency: string | null;
  current_followers: string | null;
  biggest_goal: string | null;
  brand_name: string | null;
  unique_angle: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentHistoryItem = {
  id: string;
  user_id: string;
  content_type: ContentType;
  topic: string | null;
  content_text: string;
  platform: string | null;
  created_at: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  likes: string[] | null;
  dislikes: string[] | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingPayload = {
  niche: string;
  subNiche?: string;
  platforms: string[];
  audienceAge: string;
  audienceLocation: string;
  audienceGender: string;
  contentStyle: string;
  biggestGoal: string;
  postingFrequency: string;
  uniqueAngle: string;
  name?: string;
};
