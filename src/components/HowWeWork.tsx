import Eyebrow from "./Eyebrow";
import { processSteps } from "../../content/site";

export default function HowWeWork() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="process-heading">
      <div className="text-center">
        <Eyebrow>How we work</Eyebrow>
        <h2 id="process-heading" className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
          From first hello to your day
        </h2>
      </div>
      <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <li key={step.title} className="relative border-t border-hairline pt-6">
            <span className="absolute -top-[0.85rem] left-0 bg-ivory pr-3 font-serif text-xl text-rose-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-xl text-ink">{step.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
