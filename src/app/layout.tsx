import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bimbel Al Ruumi — Bimbingan Belajar Islami Terpercaya",
  description:
    "Bimbel Al Ruumi menyediakan bimbingan belajar privat berkualitas dengan pendekatan Islami untuk siswa SD, SMP, dan SMA. Mentor berpengalaman, kurikulum terkini, dan pemantauan perkembangan siswa yang transparan.",
  keywords: [
    "bimbel",
    "bimbingan belajar",
    "les privat",
    "bimbel islami",
    "al ruumi",
    "tutor privat",
    "SD",
    "SMP",
    "SMA",
  ],
  openGraph: {
    title: "Bimbel Al Ruumi — Bimbingan Belajar Islami Terpercaya",
    description:
      "Bimbingan belajar privat berkualitas dengan pendekatan Islami untuk SD, SMP, dan SMA.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
