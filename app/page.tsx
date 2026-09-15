import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Clotter AI
          </span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Your AI operating system<br />for creators
        </h1>
        <p className="text-zinc-400 text-lg mb-10">
          Plan, create, grow — all in one place. Built for creators who move fast.
        </p>
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
        >
          Get Started Free
        </Link>
      </div>
    </main>
  );
}
