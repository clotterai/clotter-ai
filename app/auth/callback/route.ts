import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const tokenResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=pkce`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ auth_code: code }),
    }
  );

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const tokens = await tokenResponse.json();
  
  const response = NextResponse.redirect(new URL("/dashboard", "https://clotter.ai"));
  
  response.cookies.set("sb-access-token", tokens.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: tokens.expires_in,
  });
  
  response.cookies.set("sb-refresh-token", tokens.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
