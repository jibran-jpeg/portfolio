import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jibran Sarwar | Full-Stack Developer & AI Solutions",
  description: "Portfolio of Jibran Sarwar, an AI Architect & Full-Stack Web Developer building autonomous agents, intelligent chatbots, and premium digital web experiences.",
  keywords: ["Jibran Sarwar", "Full-Stack Developer", "AI Architect", "Web Developer", "React", "Next.js", "AI Automation", "Fiverr Freelancer", "n8n", "Ollama"],
  authors: [{ name: "Jibran Sarwar", url: "https://jibran-jpeg.github.io/portfolio/" }],
  creator: "Jibran Sarwar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jibran-jpeg.github.io/portfolio/",
    title: "Jibran Sarwar | Full-Stack Developer & AI Solutions",
    description: "Portfolio of Jibran Sarwar, an AI Architect & Full-Stack Web Developer.",
    siteName: "Jibran Sarwar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jibran Sarwar | Full-Stack Developer & AI Solutions",
    description: "Portfolio of Jibran Sarwar, an AI Architect & Full-Stack Web Developer.",
  },
  metadataBase: new URL("https://jibran-jpeg.github.io/portfolio/"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: "resizes-content",
};

import SmoothScrolling from "@/components/SmoothScrolling";
import Cursor from "@/components/Cursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased text-white bg-[#121212]">
        <Cursor />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
