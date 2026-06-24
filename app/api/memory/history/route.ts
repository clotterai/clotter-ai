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
  const search = searchParams.get("search")?.trim().toLowerCase();

  const { data: history, error } = await supabase
    .from("content_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered = search
    ? history?.filter(
        (item) =>
          item.topic?.toLowerCase().includes(search) ||
          item.content_text?.toLowerCase().includes(search),
      )
    : history;

  const stats = {
    script: history?.filter((i) => i.content_type === "script").length ?? 0,
    caption: history?.filter((i) => i.content_type === "caption").length ?? 0,
    hook: history?.filter((i) => i.content_type === "hook").length ?? 0,
    idea: history?.filter((i) => i.content_type === "idea").length ?? 0,
    trend: history?.filter((i) => i.content_type === "trend").length ?? 0,
    chat: history?.filter((i) => i.content_type === "chat").length ?? 0,
  };

  const topicCounts: Record<string, number> = {};
  history?.forEach((item) => {
    if (item.topic) {
      topicCounts[item.topic] = (topicCounts[item.topic] ?? 0) + 1;
    }
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  return NextResponse.json({
    history: filtered ?? [],
    stats,
    topTopics,
  });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "History item id is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("content_history")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
