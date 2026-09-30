import type { Metadata } from "next";
import { Newsreader, Chivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import StickyEnquire from "@/components/StickyEnquire";
import JsonLd from "@/components/JsonLd";
import { floristJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "../../content/site";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `Wedding & Event Florist Auckland | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.name,
  formatDetection: { telephone: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${newsreader.variable} ${chivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-[68px] md:pb-0">
        <JsonLd data={[floristJsonLd(), websiteJsonLd()]} />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyEnquire />
      </body>
    </html>
  );
}
