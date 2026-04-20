import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ToastProvider } from "@/lib/toast/context";
import { ThemeProvider } from "@/lib/theme/context";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "FluentUp English — Learn English the fun way",
    template: "%s · FluentUp English",
  },
  description:
    "Gamified English learning platform. Practice vocabulary, grammar, listening and speaking with your AI tutor. Earn XP, level up, keep your streak alive.",
  keywords: [
    "English learning",
    "language app",
    "vocabulary",
    "grammar",
    "AI tutor",
    "gamified learning",
    "English practice",
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
