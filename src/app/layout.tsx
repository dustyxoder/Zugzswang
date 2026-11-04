import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import { BookingProvider } from "@/components/BookingProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const { brand } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: brand.seoTitle, template: `%s | ${brand.name}` },
  description: brand.seoDescription,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: brand.seoTitle,
    description: brand.seoDescription,
    url: "/",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: brand.seoTitle, description: brand.seoDescription },
};

export const viewport: Viewport = {
  themeColor: "#101A24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:font-semibold focus:text-midnight"
        >
          Skip to content
        </a>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
