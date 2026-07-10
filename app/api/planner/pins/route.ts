import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabase
    .from("planner_pins")
    .select("*")
    .eq("user_id", user.id)
    .order("pin_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (from) {
    query = query.gte("pin_date", from);
  }
  if (to) {
    query = query.lte("pin_date", to);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pins: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    pin_date?: string;
    pin_time?: string | null;
    content_type?: string;
    content_text?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const pinDate = body.pin_date?.trim();
  const contentType = body.content_type?.trim();
  const contentText = body.content_text?.trim();

  if (!pinDate || !contentType || !contentText) {
    return NextResponse.json(
      { error: "Date, content type, and content text are required." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("planner_pins")
    .insert({
      user_id: user.id,
      pin_date: pinDate,
      pin_time: body.pin_time?.trim() || null,
      content_type: contentType,
      content_text: contentText.slice(0, 50000),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pin: data });
}
