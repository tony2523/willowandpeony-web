/**
 * Venue guides — the Auckland venues Willow & Peony has styled, with
 * florist's notes from those days and venue facts researched from the
 * venues' own sites and directories (checked 2026-10-01):
 * allelyestate.co.nz, thehotelbritomart.com, rydges.com,
 * theofficersmess.co.nz, bridgewaterestate.co.nz, thebrigham.co.nz.
 * All photography is Willow & Peony's own work at each venue.
 */

export type Venue = {
  slug: string;
  name: string;
  area: string; // short locality chip, e.g. "Kumeū · garden estate"
  location: string;
  setting: string;
  style: string;
  website: string;
  /** Short intro for the index card + guide opening. */
  intro: string;
  /** What works beautifully here — florist's perspective. */
  whatWorks: string;
  floristNotes: string[];
  about: string[];
  goodToKnow: string[];
  /** Hero image (manifest name). */
  hero: string;
  /** Gallery of W&P florals photographed at this venue. */
  gallery: string[];
  /** Related journal story. */
  post: {
    slug: string;
    title: string;
    couple: string;
    blurb: string;
    cover: string;
  };
};

export const venues: Venue[] = [
  {
    slug: "allely-estate",
    name: "Allely Estate",
    area: "Kumeū · garden estate",
    location: "Kumeū, West Auckland",
    setting: "Garden ceremonies under mature trees",
    style: "Organic, sculptural, garden-led",
    website: "https://allelyestate.co.nz",
    intro:
      "A heritage villa and marquee set in manicured gardens in the heart of Kumeū, about 25 minutes from central Auckland — with the whole estate exclusively yours for the day.",
    whatWorks:
      "Allely Estate's lush gardens ask for florals that feel grown, not placed. Organic ceremony arrangements beneath the trees, sculptural anthuriums against the greenery, and designs that repurpose from ceremony to sweetheart table — two moments from one thoughtful design.",
    floristNotes: [
      "Ceremony arrangements repurpose beautifully to the reception",
      "Dappled light under the magnolia suits airy, textural designs",
      "Generous lawn access for grounded meadow arrangements",
      "Exclusive use means relaxed styling and pack-down timing",
    ],
    about: [
      "Allely Estate pairs an elegant heritage villa with a large garden marquee, framed by carefully trimmed hedges and mature trees. Ceremonies happen under the magnolia tree, in the courtyard or inside the marquee, so the day flows from garden vows to lawn canapés to a marquee dinner without leaving the estate.",
      "For flowers, that flow is a gift: one considered design can travel with you — aisle arrangements moving to the marquee entrance, ceremony florals reappearing around the head table.",
    ],
    goodToKnow: [
      "Seats around 80 in the villa and up to 200 in the marquee (320 with extensions; 400+ cocktail-style)",
      "Ceremony options: under the magnolia, the courtyard, or the marquee",
      "Exclusive use of the estate for your celebration",
      "About 25 minutes from central Auckland",
    ],
    hero: "an-organic-and-sculptural-garden-wedding-at-allely-estate-auckland",
    gallery: [
      "organic-ground-ceremony-flowers-beneath-a-tree-at-allely-estate-auckla",
      "claire-holding-her-cascading-orchid-and-anthurium-bridal-bouquet",
      "candlelit-sweetheart-table-with-sculptural-flowers-at-allely-estate",
      "claire-and-dan-walking-from-their-allely-estate-garden-ceremony",
      "soft-pink-pastini-gerberas-and-nursia-anthuriums-in-the-ceremony-arran",
      "film-photograph-of-the-garden-wedding-ceremony-at-allely-estate",
    ],
    post: {
      slug: "allely-estate-wedding-flowers-auckland",
      title: "An organic, sculptural garden wedding at Allely Estate",
      couple: "Claire & Dan",
      blurb:
        "Nursia anthuriums, cascading orchids, bear grass and soft pink Pastini gerberas — a memorable result without flowers in every corner of the venue.",
      cover: "organic-and-sculptural-allely-estate-wedding-flowers-cover",
    },
  },
  {
    slug: "the-hotel-britomart",
    name: "The Hotel Britomart",
    area: "CBD · modern hotel",
    location: "Britomart, Auckland CBD",
    setting: "Intimate city weddings in The Libraries",
    style: "Refined, cloud-like, architectural",
    website: "https://thehotelbritomart.com",
    intro:
      "New Zealand's first 5 Green Star hotel, in the heart of the Britomart precinct — timber-lined rooms and five intimate event spaces made for city weddings of ten to fifty guests.",
    whatWorks:
      "The Libraries' warm timber and brick ask for soft, cloud-like florals — white roses, hydrangea and airy layers of baby's breath that bring romance without competing with the architecture. Designs that repurpose from ceremony to dinner suit the intimate scale perfectly.",
    floristNotes: [
      "White and ivory palettes glow against the timber interiors",
      "Compact spaces reward a few generous statement pieces",
      "Ceremony arrangements move easily to the dinner tables",
      "City portraits around Britomart pair beautifully with a hand-tied bouquet",
    ],
    about: [
      "The Hotel Britomart anchors Auckland's Britomart precinct with 99 timber-lined rooms and a set of five intimate event spaces, The Libraries and the rooftop Landing Suites among them. Micro-ceremonies happen in the Pāpuke Room, with cocktails and dinner flowing through The Libraries.",
      "It suits couples who want a relaxed, personal city wedding — a light-filled ceremony, joyful portraits through the laneways, and a warm dinner with their closest people.",
    ],
    goodToKnow: [
      "Designed for intimate weddings — roughly 10 to 50 guests",
      "Five event spaces including The Libraries and Landing Suites",
      "99 hotel rooms on site for you and your guests",
      "Steps from Britomart station, laneways and the waterfront",
    ],
    hero: "an-intimate-all-white-wedding-at-the-hotel-britomart-auckland",
    gallery: [
      "all-white-ceremony-flowers-at-the-hotel-britomart",
      "amandas-white-rose-hydrangea-and-babys-breath-bridal-bouquet",
      "intimate-hotel-britomart-wedding-aisle-with-ivory-ribbon-bows",
      "repurposed-all-white-flowers-surrounding-the-wedding-head-table",
      "amanda-and-bryan-walking-through-britomart-after-their-wedding",
      "cloud-like-white-rose-hydrangea-and-babys-breath-plinth-arrangement",
    ],
    post: {
      slug: "hotel-britomart-wedding-flowers-auckland",
      title: "An intimate all-white wedding at The Hotel Britomart",
      couple: "Amanda & Bryan",
      blurb:
        "Cloud-like arrangements of white roses, hydrangeas and baby's breath for a light-filled city celebration.",
      cover: "an-intimate-all-white-wedding-at-the-hotel-britomart-auckland-cover",
    },
  },
  {
    slug: "rydges-formosa",
    name: "Rydges Formosa",
    area: "Beachlands · golf resort",
    location: "Beachlands, South-East Auckland",
    setting: "Golf-course greens with Hauraki Gulf views",
    style: "Soft, romantic, candlelit",
    website: "https://www.rydges.com/accommodation/new-zealand/formosa-golf-resort/",
    intro:
      "A golf resort above the Hauraki Gulf at Beachlands, with indoor and outdoor spaces for up to 300 seated guests — and sea views that do half the styling for you.",
    whatWorks:
      "Formosa's generous rooms welcome soft pastel palettes and candlelight — blush and white plinth arrangements for the ceremony, bud vases and taper candles down the tables, and repurposed designs that carry the ceremony indoors when winter weather calls for it.",
    floristNotes: [
      "Indoor ceremonies glow with candlelight and blush plinth pairs",
      "Bud-vase rows suit the long reception tables",
      "Plinth arrangements repurpose to flank the head table",
      "Allow for wind if styling the outdoor lookouts",
    ],
    about: [
      "Rydges Formosa Auckland Golf Resort sits over rolling greens at Beachlands with views across the Hauraki Gulf. Six function spaces range from the Pōhutukawa room up to 200 guests through to more intimate rooms, with garden and course settings for outdoor ceremonies.",
      "It's a venue that handles every season — sunny vows on the greens in summer, and warm, candlelit indoor ceremonies in winter that feel every bit as romantic.",
    ],
    goodToKnow: [
      "Up to 300 seated or 350 cocktail-style across six spaces",
      "Motukaraka is the most popular wedding room (about 110 guests)",
      "On-site accommodation for the wedding party and guests",
      "About 45 minutes from central Auckland, or a ferry to Pine Harbour",
    ],
    hero: "a-soft-pastel-winter-wedding-at-rydges-formosa-auckland",
    gallery: [
      "romantic-indoor-wedding-ceremony-flowers-with-candlelight-at-rydges-fo",
      "sarah-holding-her-soft-blush-and-white-bridal-bouquet-at-rydges-formos",
      "blush-and-white-ceremony-plinth-arrangements-at-rydges-formosa-aucklan",
      "head-table-wedding-flowers-at-rydges-formosa-auckland-with-blush-and-w",
      "wedding-cake-decorated-with-blush-and-white-fresh-flowers-at-rydges-fo",
      "blush-and-white-bud-vases-with-candles-along-the-wedding-aisle-at-rydg",
    ],
    post: {
      slug: "rydges-formosa-winter-wedding-flowers",
      title: "A soft pastel winter wedding at Rydges Formosa",
      couple: "Sarah & Samuel",
      blurb:
        "Blush and white florals with candlelight — a winter ceremony moved indoors without losing an ounce of romance.",
      cover: "a-soft-pastel-winter-wedding-at-rydges-formosa-auckland-cover",
    },
  },
  {
    slug: "the-officers-mess",
    name: "The Officers Mess",
    area: "Takapuna · coastal heritage",
    location: "Fort Takapuna, between Takapuna and Devonport",
    setting: "Category 1 heritage building above Narrow Neck Beach",
    style: "Joyful, coastal, colour-confident",
    website: "https://www.theofficersmess.co.nz",
    intro:
      "A Category 1 historic building at Fort Takapuna, perched above Narrow Neck Beach with views across the sea to Rangitoto — heritage character with the beach minutes from the door.",
    whatWorks:
      "The sea light here loves colour — coral, blush and white with ocean air, orange blossoms against the heritage weatherboards, and beach portraits straight after the petal toss. Flowers that feel joyful rather than formal suit the Mess perfectly.",
    floristNotes: [
      "Coral and peach tones sing against the white heritage building",
      "Petal tosses photograph beautifully on the parade ground",
      "Plan bouquets that hold up for beach portraits after the ceremony",
      "Chair flowers repurpose to the reception tables",
    ],
    about: [
      "Fort Takapuna has guarded the harbour since the 1880s, and the Officers Mess is its most loved surviving building — a Category 1 Historic Place restored as a venue that layers heritage rooms with modern facilities.",
      "Between Takapuna and Devonport on the North Shore, it gives couples a ceremony above the beach, portraits on the sand at Narrow Neck, and a reception with Rangitoto on the horizon.",
    ],
    goodToKnow: [
      "Seats up to 160 guests across connecting heritage rooms",
      "Above Narrow Neck Beach — sea views to Rangitoto",
      "Category 1 Historic Place with modern facilities",
      "Ten minutes from Takapuna, fifteen from Devonport ferry",
    ],
    hero: "a-joyful-coastal-wedding-at-the-officers-mess-auckland",
    gallery: [
      "kate-holding-a-romantic-bridal-bouquet-with-white-roses-blush-garden-r",
      "kate-and-ben-walking-through-a-petal-toss-after-their-ceremony-at-the",
      "bridesmaids-in-soft-sage-green-dresses-holding-peach-coral-and-white-b",
      "kate-and-bens-wedding-ceremony-at-the-officers-mess-in-takapuna-with-o",
      "bride-holding-a-coral-orange-blush-and-white-wedding-bouquet-beside-th",
      "bridal-party-beach-photos-after-kate-and-bens-wedding-at-the-officers",
    ],
    post: {
      slug: "officers-mess-takapuna-wedding-flowers",
      title: "A joyful coastal wedding at The Officers Mess",
      couple: "Kate & Ben",
      blurb:
        "Coral, blush and white with ocean air — flowers made for a petal toss and beach portraits at Narrow Neck.",
      cover: "a-joyful-coastal-wedding-at-the-officers-mess-auckland-cover",
    },
  },
  {
    slug: "bridgewater-estate",
    name: "Bridgewater Estate",
    area: "Kaukapakapa · country",
    location: "Kaukapakapa, North-West Auckland",
    setting: "16 acres of lawns, gardens and native bush",
    style: "Soft, sculptural, romantic",
    website: "https://www.bridgewaterestate.co.nz",
    intro:
      "A country estate on 16 acres of rolling lawns, mature trees and native bush at Kaukapakapa — the only Auckland venue with a ceremony space set inside natural native forest.",
    whatWorks:
      "Bridgewater's landscaped gardens and forest edge suit soft, sculptural florals — blush and ivory bud vases with taper candles down the tables, a romantic welcome arrangement at the estate gates, and bouquets with movement for garden portraits by the lily pond.",
    floristNotes: [
      "The native-forest ceremony needs little more than a focal arrangement",
      "Bud vases and taper candles suit the reception room's scale",
      "The welcome table sets the palette as guests arrive",
      "Garden portraits by the lily pond love trailing, sculptural bouquets",
    ],
    about: [
      "Bridgewater Country Estate spreads across 16 acres of rolling lawns, landscaped gardens, a lily pond and stands of native bush, with a reception room opening to the gardens and on-site accommodation including a private bridal suite.",
      "Three outdoor ceremony spaces mean the day can start under open sky or inside the native forest — a setting no other Auckland venue offers — before flowing back to the estate for dinner.",
    ],
    goodToKnow: [
      "Seats up to 140 guests for a full reception",
      "Three outdoor ceremony spaces, including the native-forest clearing",
      "On-site accommodation and a private bridal suite",
      "About 45 minutes north-west of central Auckland",
    ],
    hero: "a-soft-and-sculptural-wedding-at-bridgewater-estate-auckland",
    gallery: [
      "bride-holding-a-romantic-blush-and-ivory-bridal-bouquet-at-bridgewater",
      "blush-and-ivory-welcome-table-floral-arrangement-at-bridgewater-estate",
      "bridgewater-estate-auckland-wedding-reception-with-blush-and-ivory-flo",
      "yue-holding-a-soft-blush-and-ivory-sculptural-bridal-bouquet-at-bridge",
      "reception-tables-with-blush-and-ivory-bud-vases-and-taper-candles-at-b",
      "modern-blush-and-ivory-bridal-bouquet-with-roses-anthuriums-and-phalae",
    ],
    post: {
      slug: "bridgewater-estate-wedding-flowers-auckland",
      title: "A soft and sculptural wedding at Bridgewater Estate",
      couple: "Yue & partner",
      blurb:
        "Blush and ivory florals with anthuriums and phalaenopsis — country romance with a modern, sculptural line.",
      cover: "a-soft-and-sculptural-wedding-at-bridgewater-estate-auckland-cover",
    },
  },
  {
    slug: "the-brigham",
    name: "The Brigham",
    area: "Whenuapai · garden restaurant",
    location: "Whenuapai, North-West Auckland",
    setting: "Three acres of established gardens",
    style: "Romantic, garden-fresh, relaxed",
    website: "https://thebrigham.co.nz",
    intro:
      "A much-loved café, restaurant and function venue at Whenuapai, set in three acres of established gardens — garden ceremony and indoor reception in one easy place.",
    whatWorks:
      "The Brigham's established gardens call for garden-fresh romance — delphiniums and white blooms for the outdoor ceremony, blush and white table flowers inside, and a bouquet that bridges both worlds for portraits among the trees.",
    floristNotes: [
      "Garden ceremony arrangements read beautifully against the greenery",
      "Blush, white and pastel table flowers suit the light interiors",
      "Ceremony florals repurpose easily for the reception room",
      "The garden paths make lovely, easy portrait settings",
    ],
    about: [
      "Established in 2006, The Brigham has grown from a neighbourhood café into one of north-west Auckland's favourite wedding and function venues, with three acres of established gardens and flexible indoor spaces.",
      "It suits couples who want a full day in one place — a garden ceremony among the trees, drinks on the lawn, and dinner inside with the doors open to the gardens.",
    ],
    goodToKnow: [
      "Garden ceremony spaces plus flexible indoor reception rooms",
      "Three acres of established gardens for portraits",
      "In-house catering with sit-down and buffet packages",
      "About 25 minutes north-west of central Auckland",
    ],
    hero: "a-romantic-garden-wedding-at-the-brigham-auckland",
    gallery: [
      "romantic-outdoor-wedding-ceremony-at-the-brigham-auckland-with-blush-w",
      "garden-ceremony-flowers-at-the-brigham-auckland-with-delphiniums-white",
      "xenia-holding-a-soft-white-and-blush-bridal-bouquet-with-roses-lisiant",
      "reception-table-flowers-at-the-brigham-auckland-with-blush-white-and-p",
      "xenia-and-daniels-romantic-garden-wedding-at-the-brigham-auckland-with",
      "blush-and-white-wedding-table-flowers-with-bud-vases-for-a-romantic-ga",
    ],
    post: {
      slug: "the-brigham-garden-wedding-flowers-auckland",
      title: "A romantic garden wedding at The Brigham",
      couple: "Xenia & Daniel",
      blurb:
        "Delphiniums, roses and lisianthus for a garden ceremony and a light-filled reception among the trees.",
      cover: "a-romantic-garden-wedding-at-the-brigham-auckland-cover",
    },
  },
];

export function getVenue(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}
