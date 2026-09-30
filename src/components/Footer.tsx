import Link from "next/link";
import { site } from "../../content/site";
import { withBase } from "@/lib/images";

const cols = [
  {
    heading: "Flowers",
    links: [
      { label: "Wedding Flowers", href: "/wedding-flowers-auckland/" },
      { label: "Wedding Packages", href: "/wedding-flower-packages/" },
      { label: "Event Flowers", href: "/event-flowers-auckland/" },
      { label: "Flower Delivery", href: "/flower-delivery-auckland/" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Our Story", href: "/about/" },
      { label: "Journal", href: "/journal/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Refund Policy", href: "/refund-policy/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms of Service", href: "/terms-of-service/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-ivory-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            loading="lazy"
            className="h-[26px] w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Boutique floral studio on Auckland&rsquo;s North Shore. Romantic, artful flowers for
            weddings, events and beautifully considered moments.
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            <a href={`mailto:${site.email}`} className="hover:text-rose-deep">
              {site.email}
            </a>
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-rose-deep">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        {cols.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="text-[0.75rem] tracking-[0.18em] uppercase text-muted">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-rose-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. Auckland, New Zealand.
          </p>
          <p>
            <Link href="/wedding-flower-calendar/" className="hover:text-rose-deep">
              Free wedding flower calendar →
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
