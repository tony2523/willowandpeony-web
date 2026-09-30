import Link from "next/link";

export default function CtaBand({
  title = "Ready to bring your vision to life — bloom by bloom?",
  body = "Tell us about your day: your style, your venue, your dream florals. We'd love to hear from you.",
  buttonLabel = "Start an enquiry",
  buttonHref = "/contact/",
  secondaryLabel,
  secondaryHref,
}: {
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={buttonHref}
            className="bg-ink px-7 py-3 text-[0.75rem] tracking-[0.1em] uppercase text-white transition-opacity hover:opacity-80"
          >
            {buttonLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border border-ink px-7 py-3 text-[0.75rem] tracking-[0.1em] uppercase text-ink transition-colors hover:bg-ink hover:text-white"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
