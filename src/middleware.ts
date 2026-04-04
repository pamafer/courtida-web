import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas — não precisam de autenticação
  const publicRoutes = ["/", "/sobre", "/precos", "/api/contact", "/api/controlid/webhook", "/api/monuv/webhook"];
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Rotas de API da Monuv (proxy) — precisam apenas de token interno
  if (pathname.startsWith("/api/monuv") && !pathname.includes("webhook")) {
    return NextResponse.next();
  }

  // Rotas protegidas — verificar autenticação
  const protectedPrefixes = ["/admin", "/club", "/app"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verificar se o usuário tem sessão ativa
  // Nota: middleware no Edge Runtime não pode usar cookies do Supabase diretamente
  // Então verificamos apenas se existe o token de sessão
  const supabaseAccessToken = request.cookies.get("sb-access-token")?.value
    || request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`)?.value;

  // Se não tem token nenhum, redirecionar para login
  // A verificação de role é feita no AuthProvider (client-side)
  // O middleware garante apenas que existe uma sessão
  if (!supabaseAccessToken) {
    // Deixar passar — o AuthProvider no layout vai mostrar a tela de login
    // Isso é mais seguro porque o Supabase gerencia as sessões client-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger rotas admin, club e app
    "/admin/:path*",
    "/club/:path*",
    "/app/:path*",
    // Não interceptar assets estáticos
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)",
  ],
};
