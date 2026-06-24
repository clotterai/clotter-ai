import { createClient } from "@/lib/supabase/server";
import {
  appendMemoryToPrompt,
  getCreatorContext,
} from "@/lib/memory/getCreatorContext";

export async function buildSystemPromptWithMemory(basePrompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { systemPrompt: basePrompt, supabase, user: null };
  }

  const memoryContext = await getCreatorContext(supabase, user.id);
  return {
    systemPrompt: appendMemoryToPrompt(basePrompt, memoryContext),
    supabase,
    user,
  };
}
