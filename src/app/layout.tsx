import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#064E3B",
};

export const metadata: Metadata = {
  title: "IRIS — Optik I See You Retail & Information System",
  description: "Sistem Manajemen Internal Optik I See You (Purwokerto, Cilacap, Wonosobo, Purbalingga)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen bg-[#FDFBF7] text-slate-800">
        {children}
      </body>
    </html>
  );
}
