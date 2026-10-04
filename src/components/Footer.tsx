import Link from "next/link";
import { site } from "../../content/site";
import { withBase } from "@/lib/images";

/** Editorial four-column footer, per the design system boards. */
const cols = [
  {
    heading: "Flowers",
    links: [
      { label: "Wedding Flowers", href: "/wedding-flowers-auckland/" },
      { label: "Wedding Packages", href: "/wedding-flower-packages/" },
      { label: "Flower Calculator", href: "/wedding-flower-calculator/" },
      { label: "Event Flowers", href: "/event-flowers-auckland/" },
      { label: "Gallery", href: "/gallery/" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Our Story", href: "/about/" },
      { label: "Our Work", href: "/work/" },
      { label: "Journal", href: "/journal/" },
      { label: "Venue Guides", href: "/venues/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact", href: "/contact/" },
      { label: "Instagram", href: site.instagram, external: true },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms & Conditions", href: "/terms-of-service/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-white">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 pt-16 pb-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-14">
        <div>
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            loading="lazy"
            className="h-[28px] w-auto"
          />
          <p className="mt-5 max-w-[300px] font-serif text-[17px] leading-[1.55] font-light text-ink-soft italic">
            Crafting premium, bespoke floral designs for every special moment.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">
            <a href={`mailto:${site.email}`} className="hover:underline">
              {site.email}
            </a>
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:underline">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        {cols.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="eyebrow text-muted">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) =>
                "external" in l && l.external ? (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                      className="text-[13px] leading-[2.1] text-ink-soft hover:text-ink hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] leading-[2.1] text-ink-soft hover:text-ink hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="mt-12 flex flex-col gap-2 border-t border-hairline py-5 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · Auckland, New Zealand
          </p>
          <p className="tracking-[0.14em] uppercase">Now booking 2026 and 2027 weddings</p>
        </div>
      </div>
    </footer>
  );
}
