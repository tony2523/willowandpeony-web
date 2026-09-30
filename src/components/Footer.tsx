import Link from "next/link";
import { site } from "../../content/site";
import { withBase } from "@/lib/images";
import NewsletterForm from "./NewsletterForm";

const cols = [
  {
    heading: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact/" },
      { label: "Delivery", href: "/flower-delivery-auckland/" },
      { label: "Return", href: "/refund-policy/" },
    ],
  },
  {
    heading: "About Us",
    links: [
      { label: "Our Story", href: "/about/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Weddings", href: "/wedding-flowers-auckland/" },
      { label: "Events", href: "/event-flowers-auckland/" },
      { label: "Journal", href: "/journal/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms and Conditions", href: "/terms-of-service/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24">
      {/* Centred logo divider, as on the original site */}
      <div className="border-t border-hairline py-12 text-center">
        <img
          src={withBase("/brand/willow-and-peony-logo.png")}
          alt="Willow & Peony"
          width={250}
          height={30}
          loading="lazy"
          className="mx-auto h-[24px] w-auto"
        />
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Willow &amp; Peony – Crafting premium, bespoke floral designs for every special
              moment.
            </p>
            <p className="mt-4 text-sm text-ink-soft">
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
              <p className="text-[0.78rem] font-normal text-ink">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-[0.82rem] text-ink-soft hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-[0.78rem] font-normal text-ink">Subscribe to our Newsletter</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}.
          </p>
          <p>
            <Link href="/wedding-flower-calendar/" className="hover:underline">
              Free wedding flower calendar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
