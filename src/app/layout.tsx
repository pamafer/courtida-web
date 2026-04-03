import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Courtida by Preddita",
  description: "Vídeo, Streaming e Gestão para Esportes de Quadra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="font-[family-name:var(--font-geist)] antialiased">
        {children}
      </body>
    </html>
  );
}
