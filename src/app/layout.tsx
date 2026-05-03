import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ToastProvider } from "@/lib/toast/context";
import { ToastContainer } from "@/components/ui";
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

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "FluentUp — İngilizceyi oyun gibi öğren",
    template: "%s · FluentUp",
  },
  description:
    "Türkçe arayüzde, oyun gibi İngilizce öğrenme platformu. Kelime, gramer, AI öğretmen, oyunlar — hepsi tek yerde.",
  keywords: [
    "İngilizce öğrenme",
    "İngilizce kelime",
    "İngilizce gramer",
    "AI öğretmen",
    "ingilizce kursu",
    "online ingilizce",
    "FluentUp",
  ],
  authors: [{ name: "FluentUp" }],
  creator: "FluentUp",
  publisher: "FluentUp",
  metadataBase: new URL("https://fluentupenglish.com"),
  alternates: {
    canonical: "/",
    languages: {
      tr: "/",
      en: "/en",
    },
  },
  manifest: "/manifest.webmanifest",
  applicationName: "FluentUp English",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FluentUp",
  },
  openGraph: {
    title: "FluentUp — İngilizceyi oyun gibi öğren",
    description:
      "Kelime, gramer, AI öğretmen ve oyunlar — Türkçe arayüzde ücretsiz İngilizce öğren.",
    url: "https://fluentupenglish.com",
    siteName: "FluentUp English",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fluentupenglish",
    title: "FluentUp",
    description:
      "Türkçe arayüzlü ücretsiz İngilizce öğrenme platformu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
