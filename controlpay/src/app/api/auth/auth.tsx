import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("token");
  return !!token;
}

export function redirectToLogin() {
  return NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    ),
  );
}
