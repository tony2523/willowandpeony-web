/**
 * Wedding flower calculator — prices, styles and photos.
 *
 * Source: Ivy's calculator build (HANDOFF.md, 4 Oct 2026). Prices are NZD,
 * EXCLUDE GST and are shown everywhere as "from" prices. This file is the
 * single source of truth: the /wedding-flower-calculator/ page and the
 * Worker's estimate emails both read it, so they can never disagree.
 *
 * To change a price: edit the number here, build, push.
 * To add an item: add it to SECTIONS, then add photos to assets/img-src as
 * `calculator-<id>-<tier>-<n>.jpg` (or `calculator-<id>-<n>.jpg` for untiered
 * items), run `npm run images`, and list them in PHOTOS. An item only shows
 * once it has photos (same rule as Ivy's build).
 */

export const TIERS = [
  { name: "Essential", note: "Petite · Balanced · Seasonal" },
  { name: "Signature", note: "Fuller · Layered · Premium" },
  { name: "Luxe", note: "Abundant · Luxurious · Statement" },
] as const;

/** [Essential, Signature, Luxe]; null = not offered in that style. */
export type TierPrices = [number | null, number | null, number | null];

export type CalcItem = {
  id: string;
  name: string;
  note?: string;
  /** Tiered price per unit. */
  tiers?: TierPrices;
  /** Flat price per unit. */
  price?: number;
  /** Starting price per unit (counted as the minimum). */
  from?: number;
  /** "each" | "bouquet" | "chair" | "metre" … — drives "per X" wording. */
  unit: string;
  /** Radio options instead of a quantity (aisle petals). value null = custom quote. */
  options?: { label: string; value: number | null }[];
};

export type CalcSection = { id: string; title: string; sub: string; items: CalcItem[] };

export const SECTIONS: CalcSection[] = [
  {
    id: "party",
    title: "Bridal party",
    sub: "Bouquets, buttonholes and wearables",
    items: [
      { id: "bridal", name: "Bridal bouquet", tiers: [250, 350, 450], unit: "bouquet" },
      { id: "bridesmaid", name: "Bridesmaids’ bouquets", tiers: [120, 160, 200], unit: "bouquet" },
      { id: "buttonhole", name: "Buttonholes & pin-on corsages", note: "Same price for either", price: 30, unit: "each" },
      { id: "wrist", name: "Wrist corsages", price: 55, unit: "each" },
      { id: "fg-bouquet", name: "Flower girl bouquets", price: 60, unit: "each" },
      { id: "fg-basket", name: "Flower girl petal basket", note: "A small basket of fresh petals", price: 75, unit: "each" },
      { id: "fg-crown", name: "Flower girl crown", price: 120, unit: "each" },
      { id: "hair", name: "Hair flowers", from: 45, unit: "each" },
    ],
  },
  {
    id: "ceremony",
    title: "Ceremony",
    sub: "Framing the moment you say yes",
    items: [
      { id: "plinth", name: "Plinth arrangements", tiers: [350, 450, 600], unit: "each" },
      { id: "ground", name: "Ground arrangements", tiers: [null, 250, 350], unit: "each", note: "Offered in Signature and Luxe" },
      { id: "meadow", name: "Floral meadows", tiers: [null, 500, 850], unit: "each", note: "Offered in Signature and Luxe" },
      { id: "arch-1", name: "Partial arch, one arrangement", tiers: [400, 600, 900], unit: "arch" },
      { id: "arch-2", name: "Partial arch, two-piece asymmetrical", tiers: [600, 950, 1350], unit: "arch" },
      { id: "arch-full", name: "Full arch", tiers: [null, 2000, 3500], unit: "arch", note: "Offered in Signature and Luxe" },
      { id: "hanging", name: "Hanging installation", tiers: [null, 1300, 2000], unit: "each", note: "Offered in Signature and Luxe" },
      { id: "chair", name: "Chair back flowers", from: 45, unit: "chair" },
    ],
  },
  {
    id: "reception",
    title: "Reception",
    sub: "Tables, bar and gathering spaces",
    items: [
      { id: "bud", name: "Bud vases", tiers: [15, 35, 50], unit: "vase" },
      { id: "compote", name: "Ikebana-styled compotes", tiers: [60, 95, 150], unit: "each" },
      { id: "centre", name: "Table centrepieces", tiers: [120, 180, 280], unit: "table" },
      { id: "runner", name: "Meadow table runner", from: 350, unit: "metre", note: "Priced per metre" },
      { id: "bar", name: "Bar arrangement", tiers: [200, 350, 500], unit: "each" },
    ],
  },
  {
    id: "details",
    title: "Details & petals",
    sub: "The finishing touches",
    items: [
      { id: "welcome", name: "Welcome sign arrangement", from: 90, unit: "each" },
      { id: "cake", name: "Cake flowers", from: 90, unit: "cake" },
      { id: "cones", name: "Rose petal confetti cones", price: 10, unit: "cone" },
      {
        id: "aisle",
        name: "Aisle rose petals",
        unit: "each",
        options: [
          { label: "None", value: 0 },
          { label: "Delicate sprinkling along the aisle", value: 100 },
          { label: "Petals lining both sides", value: 200 },
          { label: "Dense coverage across the aisle", value: null },
        ],
      },
    ],
  },
];

export type CalcService = { id: string; name: string; note?: string; price?: number; from?: number; quote?: boolean };

export const SERVICES: CalcService[] = [
  { id: "delivery", name: "Wedding-day delivery & setup", from: 500 },
  { id: "packdown", name: "Next-day pack-down & collection", from: 90 },
  { id: "ferry", name: "Waiheke return ferry", price: 300, note: "Additional, for Waiheke Island venues" },
  { id: "travel", name: "Travel beyond Auckland", quote: true, note: "Quoted according to venue location" },
];

export const GST = 0.15;

/** Full-service wedding design starts from this (NZD excl. GST). Stated, not enforced (Ivy, 5 Oct 2026). */
export const FULL_SERVICE_FROM = 2500;

/**
 * Photos per item (manifest names, without the `calculator-` prefix).
 * Tiered items: [Essential[], Signature[], Luxe[]] (null = none; the card
 * borrows the nearest style's photos). Untiered items: a plain list.
 * Items missing here are hidden until photos arrive: flower girl bouquet,
 * flower girl crown, hair flowers, aisle rose petals.
 */
export const PHOTOS: Record<string, (string[] | null)[] | string[]> = {
  bridal: [["bridal-essential-1"], ["bridal-signature-1", "bridal-signature-2", "bridal-signature-3", "bridal-signature-4"], ["bridal-luxe-1", "bridal-luxe-2", "bridal-luxe-3", "bridal-luxe-4"]],
  bridesmaid: [["bridesmaid-essential-1"], ["bridesmaid-signature-1"], ["bridesmaid-luxe-1"]],
  buttonhole: ["buttonhole-1", "buttonhole-2", "buttonhole-3"],
  wrist: ["wrist-1"],
  "fg-basket": ["fg-basket-1"],
  plinth: [["plinth-essential-1"], ["plinth-signature-1", "plinth-signature-2", "plinth-signature-3"], ["plinth-luxe-1", "plinth-luxe-2", "plinth-luxe-3", "plinth-luxe-4", "plinth-luxe-5"]],
  ground: [null, ["ground-signature-1"], ["ground-luxe-1"]],
  meadow: [null, ["meadow-signature-1", "meadow-signature-2"], null],
  chair: ["chair-1"],
  hanging: [null, ["hanging-signature-1"], ["hanging-luxe-1"]],
  "arch-1": [null, ["arch-1-signature-1", "arch-1-signature-2"], null],
  "arch-2": [null, ["arch-2-signature-1", "arch-2-signature-2", "arch-2-signature-3"], null],
  "arch-full": [null, ["arch-full-signature-1"], ["arch-full-luxe-1"]],
  centre: [["centre-essential-1", "centre-essential-2"], ["centre-signature-1", "centre-signature-2"], ["centre-luxe-1", "centre-luxe-2"]],
  compote: [["compote-essential-1", "compote-essential-2", "compote-essential-3", "compote-essential-4"], ["compote-signature-1", "compote-signature-2", "compote-signature-3"], ["compote-luxe-1", "compote-luxe-2"]],
  bud: [["bud-essential-1", "bud-essential-2"], ["bud-signature-1", "bud-signature-2", "bud-signature-3"], ["bud-luxe-1", "bud-luxe-2", "bud-luxe-3"]],
  runner: ["runner-1", "runner-2", "runner-3"],
  bar: [["bar-essential-1", "bar-essential-2"], ["bar-signature-1", "bar-signature-2"], ["bar-luxe-1"]],
  welcome: ["welcome-1"],
  cake: ["cake-1"],
  cones: ["cones-1"],
};

/** First-visit example, so the estimate isn't empty. Total: from $4,680 excl. GST. */
export const EXAMPLE = {
  items: { bridal: 1, bridesmaid: 3, buttonhole: 5, plinth: 2, centre: 8, bud: 12, bar: 1 } as Record<string, number>,
  services: ["delivery", "packdown"],
};
