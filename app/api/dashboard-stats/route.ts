import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("content_history")
    .select("content_type, created_at")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to load stats." },
      { status: 500 },
    );
  }

  const contentCreated = rows?.length ?? 0;
  const toolsUsed = new Set(
    rows?.map((row) => row.content_type).filter(Boolean) ?? [],
  ).size;

  const activeDays = new Set(
    rows?.map((row) => {
      if (!row.created_at) return "";
      return row.created_at.slice(0, 10);
    }) ?? [],
  );
  activeDays.delete("");

  return NextResponse.json({
    contentCreated,
    toolsUsed,
    daysActive: activeDays.size,
  });
}
