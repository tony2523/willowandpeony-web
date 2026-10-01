import type { Metadata } from "next";
import { site } from "../../content/site";
import { imageOgUrl } from "./images";

const IS_PREVIEW = !!process.env.NEXT_PUBLIC_IS_PREVIEW;

type PageSeo = {
  title: string;
  description: string;
  path: string; // e.g. "/wedding-flowers-auckland/"
  ogImage?: string; // manifest image name
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  ogImage = "auckland-bridal-party-blush-bouquets-hero",
  noindex = false,
  type = "website",
  publishedTime,
}: PageSeo): Metadata {
  const url = `${site.domain}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex || IS_PREVIEW ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_NZ",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: imageOgUrl(ogImage, site.domain), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageOgUrl(ogImage, site.domain)],
    },
  };
}

/* ---------- JSON-LD builders ---------- */

export function floristJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": `${site.domain}/#florist`,
    name: site.name,
    legalName: site.legalName,
    url: `${site.domain}/`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    founder: { "@type": "Person", name: site.founder },
    sameAs: [site.instagram],
    image: imageOgUrl("auckland-bridal-party-blush-bouquets-hero", site.domain),
    priceRange: "$$-$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Auckland",
      addressRegion: "Auckland",
      addressCountry: "NZ",
    },
    areaServed: [
      { "@type": "City", name: "Auckland" },
      { "@type": "AdministrativeArea", name: "North Shore" },
    ],
    knowsAbout: [
      "Wedding flowers",
      "Bridal bouquets",
      "Event floral styling",
      "Corporate event flowers",
      "Wedding venue styling",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    url: `${site.domain}/`,
    name: site.name,
    publisher: { "@id": `${site.domain}/#florist` },
    inLanguage: "en-NZ",
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.domain}${c.path}`,
    })),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  offers?: { name: string; price: number; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${site.domain}${opts.path}`,
    serviceType: opts.serviceType,
    provider: { "@id": `${site.domain}/#florist` },
    areaServed: { "@type": "City", name: "Auckland" },
    ...(opts.offers
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${opts.name} packages`,
            itemListElement: opts.offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              description: o.description,
              price: o.price,
              priceCurrency: "NZD",
            })),
          },
        }
      : {}),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  date: string;
  cover: string;
  venue?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: `${site.domain}${opts.path}`,
    datePublished: opts.date,
    dateModified: opts.date,
    inLanguage: "en-NZ",
    image: imageOgUrl(opts.cover, site.domain),
    author: { "@type": "Person", name: site.founder, url: `${site.domain}/about/` },
    publisher: { "@id": `${site.domain}/#florist` },
    mainEntityOfPage: `${site.domain}${opts.path}`,
    ...(opts.venue ? { contentLocation: { "@type": "Place", name: opts.venue } } : {}),
  };
}
