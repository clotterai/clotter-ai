import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { OnboardingPayload } from "@/lib/memory/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: OnboardingPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    niche,
    subNiche,
    platforms,
    audienceAge,
    audienceLocation,
    audienceGender,
    contentStyle,
    biggestGoal,
    postingFrequency,
    uniqueAngle,
    name,
  } = body;

  if (!niche || !platforms?.length || !contentStyle || !biggestGoal || !postingFrequency || !uniqueAngle?.trim()) {
    return NextResponse.json(
      { error: "Please complete all required onboarding fields." },
      { status: 400 },
    );
  }

  const displayName =
    name?.trim() ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0]) ||
    "Creator";

  const { error: profileError } = await supabase.from("creator_profiles").upsert(
    {
      user_id: user.id,
      name: displayName,
      niche,
      sub_niche: subNiche?.trim() || null,
      audience_age: audienceAge,
      audience_location: audienceLocation,
      audience_gender: audienceGender,
      platforms,
      content_style: contentStyle,
      posting_frequency: postingFrequency,
      biggest_goal: biggestGoal,
      unique_angle: uniqueAngle.trim(),
    },
    { onConflict: "user_id" },
  );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { error: prefsError } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      likes: [],
      dislikes: [],
    },
    { onConflict: "user_id" },
  );

  if (prefsError) {
    return NextResponse.json({ error: prefsError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
