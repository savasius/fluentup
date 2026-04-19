import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FluentUp English — Learn English the fun way",
  description:
    "Gamified English learning platform. Practice vocabulary, grammar, listening and speaking with your AI tutor.",
  metadataBase: new URL("https://fluentupenglish.com"),
  openGraph: {
    title: "FluentUp English",
    description:
      "Learn English the fun way. Earn XP, level up, keep your streak alive.",
    url: "https://fluentupenglish.com",
    siteName: "FluentUp English",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body>{children}</body>
    </html>
  );
}
