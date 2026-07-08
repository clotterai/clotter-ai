import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getOwnedSession(supabase: Awaited<ReturnType<typeof createClient>>, id: string, userId: string) {
  const { data: session, error } = await supabase
    .from("chat_sessions")
    .select("id, user_id, title, messages, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { error: error.message, status: 500 as const, session: null };
  }

  if (!session) {
    return { error: "Session not found.", status: 404 as const, session: null };
  }

  return { error: null, status: 200 as const, session };
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await getOwnedSession(supabase, id, user.id);

  if (!result.session) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ session: result.session });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const owned = await getOwnedSession(supabase, id, user.id);

  if (!owned.session) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }

  let body: { title?: string; messages?: unknown[] } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: { title?: string; messages?: unknown[]; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.title === "string" && body.title.trim()) {
    updates.title = body.title.trim();
  }

  if (Array.isArray(body.messages)) {
    updates.messages = body.messages;
  }

  if (!updates.title && !updates.messages) {
    return NextResponse.json(
      { error: "Nothing to update. Provide title or messages." },
      { status: 400 },
    );
  }

  const { data: session, error } = await supabase
    .from("chat_sessions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, user_id, title, messages, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session });
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const owned = await getOwnedSession(supabase, id, user.id);

  if (!owned.session) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }

  const sourceTitle =
    typeof owned.session.title === "string" && owned.session.title.trim()
      ? owned.session.title.trim()
      : "New Chat";
  const duplicateTitle = `${sourceTitle} (copy)`;
  const messages = Array.isArray(owned.session.messages)
    ? owned.session.messages
    : [];

  const { data: session, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.id,
      title: duplicateTitle,
      messages,
    })
    .select("id, user_id, title, messages, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const owned = await getOwnedSession(supabase, id, user.id);

  if (!owned.session) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
