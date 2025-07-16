import Header from "@/components/layout/Header";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Noesis - A Jornada do Conhecimento",
  description: "Forje seu intelecto em batalhas épicas de lógica!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={pressStart2P.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
