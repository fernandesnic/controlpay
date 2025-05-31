import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated, redirectToLogin } from "./app/api/auth/auth";

export function middleware(request: NextRequest) {
  // Lista de rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/api/auth"];

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Se for uma rota pública, permite o acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verifica se o usuário está autenticado
  if (!isAuthenticated(request)) {
    return redirectToLogin();
  }

  return NextResponse.next();
}

// Configuração de quais rotas o middleware deve atuar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
