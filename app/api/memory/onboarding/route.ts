import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { OnboardingPayload } from "@/lib/memory/types";

function joinSelections(values: string[] | undefined, fallback?: string): string {
  if (values?.length) {
    return values.join(", ");
  }
  return fallback?.trim() ?? "";
}

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

  const niche = joinSelections(
    body.niches,
    body.niche,
  );
  const subNiche = body.subNiche;
  const platforms = body.platforms ?? [];
  const audienceAge = joinSelections(body.audienceAges, body.audienceAge);
  const audienceLocation = joinSelections(
    body.audienceLocations,
    body.audienceLocation,
  );
  const audienceGender = joinSelections(body.audienceGenders, body.audienceGender);
  const contentStyle = joinSelections(body.contentStyles, body.contentStyle);
  const biggestGoal = joinSelections(body.biggestGoals, body.biggestGoal);
  const postingFrequency = joinSelections(
    body.postingFrequencies,
    body.postingFrequency,
  );
  const uniqueAngle = body.uniqueAngle?.trim() ?? "";
  const name = body.name;

  if (
    !niche ||
    !platforms.length ||
    !contentStyle ||
    !biggestGoal ||
    !postingFrequency ||
    !uniqueAngle
  ) {
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
      audience_age: audienceAge || null,
      audience_location: audienceLocation || null,
      audience_gender: audienceGender || null,
      platforms,
      content_style: contentStyle,
      posting_frequency: postingFrequency,
      biggest_goal: biggestGoal,
      unique_angle: uniqueAngle,
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
