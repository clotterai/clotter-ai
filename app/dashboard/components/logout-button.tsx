"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isLoading}
      className="mt-3 w-full rounded-lg border border-[#EC4899]/20 bg-[#EC4899]/10 px-3 py-2 text-xs font-semibold text-[#FDA4AF] transition-all duration-200 hover:scale-[1.02] hover:border-[#F97316]/35 hover:bg-[#EC4899]/20 disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
