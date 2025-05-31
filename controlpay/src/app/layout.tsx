import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TransactionProvider } from "../contexts/TransactionContext";

export const metadata: Metadata = {
  title: "ControlPay",
  description: "Sistema de Controle Financeiro",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body>
        <TransactionProvider>{children}</TransactionProvider>
      </body>
    </html>
  );
}
