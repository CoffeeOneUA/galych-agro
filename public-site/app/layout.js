import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { getContent } from "../lib/db";
import { defaultContent } from "../lib/defaultContent";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap"
});
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap"
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap"
});

export async function generateMetadata() {
  let content;
  try {
    content = await getContent();
  } catch (err) {
    console.error("generateMetadata: falling back to default content:", err);
    content = defaultContent();
  }
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: content.images.hero ? [content.images.hero] : []
    },
    icons: content.images.favicon ? { icon: content.images.favicon } : undefined
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
