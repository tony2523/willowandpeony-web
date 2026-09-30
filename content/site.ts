import redirectsJson from "./redirects.json";

/**
 * Willow & Peony — single source of truth for business facts.
 * Edit this file to update contact details, packages, FAQs, delivery info.
 * Every page reads from here, so changes propagate site-wide.
 */

export const site = {
  name: "Willow & Peony",
  legalName: "Willow and Peony",
  domain: "https://willowandpeony.co.nz",
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
  // Klaviyo account (newsletter / calendar list) — company id from the
  // original store, kept so signups continue flowing to the same account.
  klaviyoCompanyId: "UDXJCc",
  instagram: "https://www.instagram.com/willowandpeony.nz",
  instagramHandle: "willowandpeony.nz",
  // Site-wide announcement bar. Empty string hides it. Update each season.
  announcement: "",
} as const;

/** The consultation-to-wedding-day journey, shown on service + contact pages. */
export const processSteps = [
  {
    title: "Enquire",
    body: "Tell us your date, venue and the feeling you want to create. We reply within 1–2 business days.",
  },
  {
    title: "Consultation",
    body: "A relaxed chat about your vision, palette and priorities — with your planner or stylist welcome too.",
  },
  {
    title: "Design proposal",
    body: "A tailored proposal with design direction, palette and clear pricing, refined together until it feels right.",
  },
  {
    title: "Your day",
    body: "We source, craft, deliver and style everything — then quietly pack it all away the next day.",
  },
] as const;

export const nav = [
  { label: "Weddings", href: "/wedding-flowers-auckland/" },
  { label: "Events", href: "/event-flowers-auckland/" },
  { label: "Our Story", href: "/about/" },
  { label: "Gallery", href: "/gallery/" },
] as const;

/** Extended set for the mobile drawer. */
export const drawerNav = [
  { label: "Weddings", href: "/wedding-flowers-auckland/" },
  { label: "Wedding Packages", href: "/wedding-flower-packages/" },
  { label: "Events", href: "/event-flowers-auckland/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Our Work", href: "/work/" },
  { label: "Venue Guides", href: "/venues/" },
  { label: "Our Story", href: "/about/" },
  { label: "Journal", href: "/journal/" },
  { label: "FAQ", href: "/faq/" },
] as const;

export type WeddingPackage = {
  name: string;
  price: string;
  priceNumber: number;
  ideal: string;
  includes: string[];
  note?: string;
  options?: { label: string; items: string[] }[];
  image: string;
};

export const weddingPackages: WeddingPackage[] = [
  {
    name: "Petite",
    price: "$500",
    priceNumber: 500,
    ideal: "Perfect for registry-style weddings, elopements and micro-ceremonies.",
    includes: [
      "1 × Bridal bouquet",
      "1 × Groom's buttonhole",
      "Choice of 1 × bridesmaid bouquet or 1 × signing table arrangement",
      "Pickup or local delivery (fees apply)",
    ],
    note: "Additional bouquets and buttonholes can be added for an extra fee.",
    image: "wedding-flowers-auckland-scarlet-style-shoot3",
  },
  {
    name: "Classic",
    price: "$2,500",
    priceNumber: 2500,
    ideal: "A refined package for smaller weddings with personalised design and setup.",
    includes: [
      "1 × Bridal bouquet",
      "2 × Bridesmaids bouquets",
      "4 × Buttonholes",
      "1 × Ceremony or reception styling option (choose below)",
      "Consultation + full design proposal",
      "Delivery, setup & next-day pack-out (within Auckland)",
      "All hire included (vases & plinths)",
    ],
    options: [
      { label: "Ceremony + reception", items: ["2 × Medium plinth arrangements", "15 × Bud vases"] },
      { label: "Ceremony only", items: ["2 × Large plinth arrangements"] },
      { label: "Reception only", items: ["6 × Table arrangements", "1 × Bar arrangement"] },
    ],
    image: "wedding-flower-package-auckland-scarlet-style-shoot22",
  },
  {
    name: "Luxe",
    price: "$5,000",
    priceNumber: 5000,
    ideal: "An elevated floral experience with high-impact styling and premium floral design.",
    includes: [
      "1 × Bridal bouquet",
      "3 × Bridesmaids bouquets",
      "5 × Buttonholes",
      "Choice of 1 × large grounded floral meadow or 4 × large plinth arrangements",
      "1 × Welcome sign florals",
      "10 × Table centrepieces for reception",
      "1 × Bar arrangement",
      "1 × Cake floral",
      "Rose petals for aisle",
      "Consultation + full design proposal",
      "Delivery, setup & next-day pack-out (within Auckland)",
      "All hire included (vases & plinths)",
    ],
    image: "wedding-flowers-auckland-scarlet-style-shoot20",
  },
];

export type Faq = { q: string; a: string };

/** FAQs — rendered on /faq/ and emitted as FAQPage structured data. */
export const faqs: Faq[] = [
  {
    q: "Do you offer wedding florals in Auckland?",
    a: "Yes — weddings are the heart of what we do. Willow & Peony specialises in bespoke wedding floral design across Auckland, from intimate elopements to full ceremony and reception styling. We offer three curated wedding packages (Petite $500, Classic $2,500 and Luxe $5,000) as well as fully bespoke design.",
  },
  {
    q: "Do you do corporate and private event flowers?",
    a: "Yes. We create floral styling for corporate events, product launches, gala dinners, conferences and private celebrations across Auckland — from reception styling and stage installations to table arrangements and client gifting.",
  },
  {
    q: "How much do wedding flowers cost in Auckland?",
    a: "Our curated packages give you a clear starting point: Petite from $500 for elopements and micro-ceremonies, Classic at $2,500 for smaller weddings with full design and setup, and Luxe at $5,000 for high-impact styling across ceremony and reception. Fully bespoke designs are quoted to your vision and venue — tell us your budget and we'll design to it honestly.",
  },
  {
    q: "How far in advance should I book my wedding flowers?",
    a: "As a boutique studio we take a limited number of weddings each season, so we recommend enquiring 6–12 months before your date, and earlier for peak summer weekends. That said, we love a short-notice elopement — always ask.",
  },
  {
    q: "Is delivery, setup and pack-down included?",
    a: "Yes — our Classic and Luxe packages include delivery, on-the-day setup and next-day pack-out anywhere in Auckland, plus all vase and plinth hire. Petite packages are pickup or local delivery. For bespoke weddings and events, install and pack-down are always quoted as part of the proposal, so there are no surprises.",
  },
  {
    q: "Do you do custom flower orders?",
    a: "Yes. We create custom floral arrangements tailored to your brief for any occasion. Email hello@willowandpeony.co.nz with what you have in mind and we will come back to you with options.",
  },
  {
    q: "Where do you deliver, and on which days?",
    a: "We deliver Monday to Saturday across Auckland — north to Hatfields Beach, south to Tuakau, west to Muriwai and east to Clevedon & Maraetai. We do not deliver on Sundays, with the exception of Mother's Day.",
  },
  {
    q: "Can I choose the colours of my flowers?",
    a: "We work with the freshest seasonal blooms, so we cannot guarantee specific flowers or exact colours as availability varies through the year. If you have a particular palette or flower in mind, tell us in advance and we will do our best to accommodate it.",
  },
  {
    q: "How do I care for my bouquet?",
    a: "Start with a clean vase, trim the stems at a 45-degree angle (under running water if possible), keep flowers away from ripening fruit, and place them in a cool spot out of direct sunlight, drafts and air conditioning. Change the water every two days. With care, your flowers should stay fresh for 4–7 days.",
  },
  {
    q: "How do I care for flowers in a box or a floral cake?",
    a: "Boxed arrangements and floral cakes are set in floral foam. Check the foam daily and slowly add water to keep it moist, keep the arrangement cool and out of direct sun, remove any wilted stems promptly, and avoid moving it around. Expect 3–7 days of freshness with proper care.",
  },
  {
    q: "What if no one is home to accept a delivery?",
    a: "Our courier will leave the arrangement in a safe location if no one is available. If a safe drop is not possible, or the address is incorrect, a re-delivery fee equal to the original delivery charge applies. We cannot take responsibility for flowers left in extreme weather.",
  },
  {
    q: "Can I request a specific delivery time?",
    a: "We cannot guarantee exact delivery times because our routes change daily, but deliveries are generally completed before 6pm. If timing is critical — for a venue or a surprise — get in touch and we will do our best.",
  },
];

export const delivery = {
  summary:
    "Same-day flower delivery across Auckland, Monday to Saturday, for orders placed before 12pm.",
  points: [
    "Flat-rate delivery: $15 across our Auckland delivery area",
    "Free delivery on orders over $150 (excluding rural areas)",
    "Next-day delivery available for all orders",
    "For Saturday delivery, place your order by 9am that day",
    "No Sunday delivery, with the exception of Mother's Day",
  ],
  boundaries: [
    { compass: "North", to: "Hatfields Beach" },
    { compass: "South", to: "Tuakau" },
    { compass: "West", to: "Muriwai" },
    { compass: "East", to: "Clevedon & Maraetai" },
  ],
} as const;

/** Map of legacy Shopify URLs → new URLs. Edit content/redirects.json. */
export const redirects: Record<string, string> = redirectsJson;