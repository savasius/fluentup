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
    default: "FluentUp — Learn English free forever",
    template: "%s · FluentUp English",
  },
  description:
    "Gamified English learning platform. Practice vocabulary, grammar, listening and speaking. Earn XP, level up, keep your streak alive — free forever.",
  keywords: [
    "learn english",
    "english vocabulary",
    "english grammar",
    "free english",
    "english games",
    "cefr english",
    "English learning",
    "language app",
    "AI tutor",
    "gamified learning",
  ],
  authors: [{ name: "FluentUp" }],
  creator: "FluentUp",
  publisher: "FluentUp",
  metadataBase: new URL("https://fluentupenglish.com"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "FluentUp English",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FluentUp",
  },
  openGraph: {
    title: "FluentUp English — Learn English the fun way",
    description:
      "Gamified English learning platform. Earn XP, level up, keep your streak alive.",
    url: "https://fluentupenglish.com",
    siteName: "FluentUp English",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fluentupenglish",
    title: "FluentUp English",
    description:
      "Gamified English learning platform. Earn XP, level up, keep your streak alive.",
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
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
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
