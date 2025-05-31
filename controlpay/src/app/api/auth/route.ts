import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginRequest;

  if (email === "admin@admin.com" && password === "admin") {
    const token = "jwt_simulado_" + Date.now();

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json(
      { message: "Login realizado com sucesso" },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { error: "Email ou senha incorretos" },
      { status: 401 },
    );
  }
}
