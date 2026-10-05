import redirectsJson from "./redirects.json";
import { FULL_SERVICE_FROM, SECTIONS as CALC_SECTIONS, SERVICES as CALC_SERVICES } from "./calculator";

const nzd = (n: number) => "$" + n.toLocaleString("en-NZ");
/** Lowest "from" price of a calculator piece, e.g. calcFrom("bridal") → "$250". */
const calcFrom = (id: string) => {
  const it = CALC_SECTIONS.flatMap((x) => x.items).find((i) => i.id === id);
  const p = it?.tiers ? Math.min(...it.tiers.filter((x): x is number => x != null)) : (it?.price ?? it?.from ?? 0);
  return nzd(p);
};
const svcFrom = (id: string) => {
  const sv = CALC_SERVICES.find((x) => x.id === id);
  return nzd(sv?.price ?? sv?.from ?? 0);
};

/**
 * Willow & Peony — single source of truth for business facts.
 * Edit this file to update contact details and FAQs (calculator prices live in calculator.ts).
 * Every page reads from here, so changes propagate site-wide.
 */

export const site = {
  name: "Willow & Peony",
  legalName: "Willow and Peony",
  domain: "https://willowandpeony.co.nz",
  /** Ivy's Calendly for the complimentary 30-minute consultation. */
  consultationUrl: "https://calendly.com/ivy-willowandpeony/initial-wedding-consultation",
  tagline: "Artful florals for beautifully considered events",
  description:
    "Willow & Peony is a boutique florist on Auckland's North Shore, creating romantic, artful floral styling for weddings, corporate events and celebrations across Auckland.",
  email: "hello@willowandpeony.co.nz",
  phone: "+64 21 033 8545",
  phoneDisplay: "+64 21 033 8545",
  phoneHours: "9:00am–5:00pm, Monday to Saturday",
  founder: "Ivy Diao",
  region: "Auckland",
  base: "North Shore, Auckland, New Zealand",
  instagram: "https://www.instagram.com/willowandpeony.nz",
  instagramHandle: "willowandpeony.nz",
  // Site-wide announcement bar. Empty string hides it. Update each season.
  announcement: "",
} as const;

/** The consultation-to-wedding-day journey, shown on service + contact pages. */
export const processSteps: { title: string; body: string; link?: { label: string; href: string } }[] = [
  {
    title: "Estimate & enquire",
    body: "Build an itemised estimate with our flower calculator, or simply tell us your date, venue and the feeling you want to create. We reply within 1–2 business days.",
    link: { label: "Estimate your flowers", href: "/wedding-flower-calculator/" },
  },
  {
    title: "Consultation",
    body: "Every enquiring couple is offered a complimentary 30-minute video chat about their vision, palette and priorities, with no obligation attached. Your planner or stylist is welcome too.",
    link: { label: "Book your consultation", href: "https://calendly.com/ivy-willowandpeony/initial-wedding-consultation" },
  },
  {
    title: "Design proposal",
    body: "An itemised, tailored proposal with design direction, palette and clear pricing, refined together until it feels right.",
  },
  {
    title: "Your day",
    body: "We source, craft, deliver and style everything — then quietly pack it all away the next day.",
  },
];

export const nav = [
  { label: "Weddings", href: "/wedding-flowers-auckland/" },
  { label: "Events", href: "/event-flowers-auckland/" },
  { label: "Our Story", href: "/about/" },
  { label: "Gallery", href: "/gallery/" },
] as const;

/** Extended set for the mobile drawer. */
export const drawerNav = [
  { label: "Weddings", href: "/wedding-flowers-auckland/" },
  { label: "Flower Calculator", href: "/wedding-flower-calculator/" },
  { label: "Events", href: "/event-flowers-auckland/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Our Work", href: "/work/" },
  { label: "Venue Guides", href: "/venues/" },
  { label: "Our Story", href: "/about/" },
  { label: "Journal", href: "/journal/" },
  { label: "FAQ", href: "/faq/" },
] as const;

export type Faq = { q: string; a: string };

/** FAQs — rendered on /faq/ and emitted as FAQPage structured data. */
export const faqs: Faq[] = [
  {
    q: "Do you offer wedding florals in Auckland?",
    a: `Yes — weddings are the heart of what we do. Willow & Peony specialises in bespoke wedding floral design across Auckland, from intimate elopements to full ceremony and reception styling. Full-service wedding design starts from ${nzd(FULL_SERVICE_FROM)}, and our flower calculator gives you an itemised estimate in minutes.`,
  },
  {
    q: "Do you do corporate and private event flowers?",
    a: "Yes. We create floral styling for corporate events, product launches, gala dinners, conferences and private celebrations across Auckland — from reception styling and stage installations to table arrangements, shop windows and in-store flowers for retail and brand spaces.",
  },
  {
    q: "How much do wedding flowers cost in Auckland?",
    a: `Full-service wedding floral design starts from ${nzd(FULL_SERVICE_FROM)}. Bridal bouquets start from ${calcFrom("bridal")}, bridesmaids' bouquets from ${calcFrom("bridesmaid")} and table centrepieces from ${calcFrom("centre")} (excluding GST), and our flower calculator adds it all up as you go. Every wedding is confirmed in a proposal after your consultation, so tell us your budget and we'll design to it honestly.`,
  },
  {
    q: "How far in advance should I book my wedding flowers?",
    a: "As a boutique studio we take a limited number of weddings each season, so we recommend enquiring 6–12 months before your date, and earlier for peak summer weekends. That said, we love a short-notice elopement — always ask.",
  },
  {
    q: "Is delivery, setup and pack-down included?",
    a: `Wedding-day delivery and setup start from ${svcFrom("delivery")} and next-day pack-down from ${svcFrom("packdown")} within Auckland, and every vase and plinth is included. Waiheke Island weddings add a return ferry from ${svcFrom("ferry")}, and venues beyond Auckland are quoted individually. Everything is itemised in your proposal, so there are no surprises.`,
  },
  {
    q: "Do you do custom flower orders?",
    a: "Yes. We create custom floral arrangements tailored to your brief for any occasion. Email hello@willowandpeony.co.nz with what you have in mind and we will come back to you with options.",
  },
  {
    q: "Can I choose the colours of my flowers?",
    a: "We work with the freshest seasonal blooms, so we cannot guarantee specific flowers or exact colours as availability varies through the year. If you have a particular palette or flower in mind, tell us in advance and we will do our best to accommodate it.",
  },
];


/** Map of legacy Shopify URLs → new URLs. Edit content/redirects.json. */
export const redirects: Record<string, string> = redirectsJson;