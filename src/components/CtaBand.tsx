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
    <section className="mt-24 bg-ink text-ivory">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/70">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={buttonHref}
            className="bg-ivory px-7 py-3 text-[0.8rem] tracking-[0.16em] uppercase text-ink transition-opacity hover:opacity-85"
          >
            {buttonLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border border-ivory/40 px-7 py-3 text-[0.8rem] tracking-[0.16em] uppercase text-ivory transition-colors hover:border-ivory"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
