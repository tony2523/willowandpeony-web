import Link from "next/link";
import { processSteps } from "../../content/site";

/** The consultation-to-wedding-day journey — numbered editorial row. */
export default function ProcessSteps() {
  return (
    <div>
      <div className="flex items-end gap-6">
        <p className="eyebrow text-muted">The process</p>
        <div className="mb-1 h-px flex-grow bg-hairline" aria-hidden />
      </div>
      <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <li key={step.title}>
            <div aria-hidden data-n={String(i + 1).padStart(2, "0")} className="font-serif text-[52px] leading-none font-light text-hairline before:content-[attr(data-n)]" />
            <h3 className="mt-3 font-serif text-[20px] font-normal text-ink">{step.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{step.body}</p>
            {step.link && (
              <Link href={step.link.href} className="t-link mt-4 inline-block text-ink">
                {step.link.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
