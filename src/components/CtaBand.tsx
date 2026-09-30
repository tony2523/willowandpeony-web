import Link from "next/link";

/**
 * Warm-paper call-to-action band (never black, per the design system).
 * Sits flush against the next section; parents add the white gap above.
 */
export default function CtaBand({
  eyebrow,
  title,
  cta = "Start an enquiry",
  href = "/contact/",
  secondary,
}: {
  eyebrow: string;
  title: React.ReactNode;
  cta?: string;
  href?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center sm:py-20">
        <p className="eyebrow text-muted">{eyebrow}</p>
        <h2 className="display-3 mt-4 text-ink">{title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={href} className="btn-solid">
            {cta}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="t-link text-ink">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
