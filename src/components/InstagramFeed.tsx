import Pic from "./Pic";
import { site } from "../../content/site";

/**
 * Instagram section, as on the original home page: centred 15px "Follow Us"
 * line, then a flush grid of square tiles (6×2 desktop, measured 232px),
 * every tile linking to the profile. Curated at build time — no third-party
 * feed script.
 */
const tiles = [
  { name: "willow-and-peony-bouquet-romantic-grace-09", alt: "Romantic pastel bouquet" },
  { name: "willow-and-peony-bouquet-citrus-delight-06", alt: "Citrus-toned bouquet" },
  { name: "willow-and-peony-bouquet-peach-serenade-05", alt: "Peach hand-tied bouquet" },
  { name: "willow-and-peony-bouquet-pure-grace-05", alt: "White rose and orchid bouquet" },
  { name: "willow-and-peony-bouquet-florist-schoice01", alt: "Florist's choice arrangement" },
  { name: "willow-and-peony-bouquet-oneofakind01", alt: "Sculptural floral arrangement" },
  { name: "willow-and-peony-bouquet-pink-blossom-large-05", alt: "Pink blossom bouquet" },
  { name: "willow-and-peony-bouquet-deluxe-floral-cake-10", alt: "Fresh floral cake" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot3", alt: "Deep red rose bouquet" },
  { name: "event-flowers-auckland-dsc03608-2", alt: "Sculptural event centrepiece" },
  { name: "wedding-flowers-auckland-img-3926", alt: "Romantic ceremony flowers" },
  { name: "willow-and-peony-bouquet-deluxe-floral-cake-09", alt: "Floral cake with garden roses" },
];

export default function InstagramFeed() {
  return (
    <section className="mt-[88px] px-5 sm:px-6" aria-label="Instagram">
      <p className="text-center text-[15px] text-ink">
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener"
          className="hover:underline"
        >
          Follow Us @{site.instagramHandle}
        </a>
      </p>
      <div className="mt-6 grid grid-cols-4 sm:grid-cols-6">
        {tiles.map((t) => (
          <a
            key={t.name}
            href={site.instagram}
            target="_blank"
            rel="noopener"
            aria-label={`${t.alt} — Willow & Peony on Instagram`}
            className="group block overflow-hidden"
          >
            <Pic
              name={t.name}
              alt={t.alt}
              sizes="(max-width: 640px) 25vw, 17vw"
              aspect="1/1"
              className="h-auto w-full transition-opacity duration-300 group-hover:opacity-80"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
