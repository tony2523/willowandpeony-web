/**
 * The wedding gallery: Ivy's selected photos, grouped by wedding (Tony,
 * 6 Oct 2026). Photos live in assets/img-src as `gallery-<slug>-NN.jpg`;
 * to add one, drop it in with the next number, run `npm run images`, and it
 * appears automatically. The event gallery still comes from the event
 * stories in content/journal.
 *
 * The gallery shows the weddings in this order, each wedding's photos side
 * by side in file-number order. `lead` (a photo number) moves that photo to
 * the front of its wedding; the first wedding's lead opens the whole gallery
 * (Tony, 6 Oct 2026: the bride among the bouquets, Claire & Dan 09).
 */
export const WEDDING_GALLERY: { slug: string; alt: string; lead?: string }[] = [
  { slug: "claire-dan-allely-estate", lead: "09", alt: "Wedding flowers for Claire and Dan at Allely Estate" },
  { slug: "amanda-bryan-hotel-britomart", alt: "Wedding flowers for Amanda and Bryan at The Hotel Britomart, Auckland" },
  { slug: "kaelan-tongtong-st-matthew-in-the-city", alt: "Wedding flowers for Kaelan and Tongtong at St Matthew-in-the-City, Auckland" },
  { slug: "kate-ben-the-officers-mess", alt: "Wedding flowers for Kate and Ben at The Officers Mess, Auckland" },
  { slug: "leah-riley-private-venue", alt: "Wedding flowers for Leah and Riley at a private venue in Auckland" },
  { slug: "yue-vern-bridgewater-estate", alt: "Wedding flowers for Yue and Vern at Bridgewater Estate" },
  { slug: "auckland-city-wedding", alt: "Auckland city wedding flowers by Willow & Peony" },
];
