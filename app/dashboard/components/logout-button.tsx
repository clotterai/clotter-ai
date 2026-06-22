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
      className="mt-3 w-full rounded-lg border border-[#D97706]/20 bg-[#D97706]/10 px-3 py-2 text-xs font-semibold text-[#FCD34D] transition-all hover:border-[#EAB308]/35 hover:bg-[#D97706]/20 disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
