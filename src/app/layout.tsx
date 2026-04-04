import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const viewport: Viewport = { themeColor: "#0A1410", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL("https://courtida.com"),
  title: { default: "courtida — Vídeo, Streaming e Gestão para Esportes de Quadra", template: "%s | courtida" },
  description: "Plataforma SaaS de vídeo, streaming ao vivo e gestão inteligente para clubes e esportes de quadra.",
  keywords: ["esportes de quadra","streaming esportivo","gravação de jogos","reconhecimento facial esporte","gestão de clube esportivo","beach tennis","padel","tênis","courtida","preddita"],
  authors: [{ name: "Preddita", url: "https://courtida.com" }],
  creator: "Preddita — Automação Inteligente",
  publisher: "Preddita",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "pt_BR", url: "https://courtida.com", siteName: "courtida", title: "courtida — Vídeo, Streaming e Gestão para Esportes de Quadra", description: "Gravação inteligente, streaming ao vivo e reconhecimento facial integrados em uma única plataforma para seu clube." },
  twitter: { card: "summary_large_image", title: "courtida — Vídeo, Streaming e Gestão para Esportes de Quadra", description: "Gravação inteligente, streaming ao vivo e reconhecimento facial integrados em uma única plataforma para seu clube." },
  alternates: { canonical: "https://courtida.com" },
  category: "technology",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} dark`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-geist)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
