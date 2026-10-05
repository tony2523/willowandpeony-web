"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { imageSrc } from "@/lib/images";
import {
  GST,
  ITEMS,
  SERVICES,
  TIERS,
  VISIBLE_SECTIONS,
  anyTiered,
  bridalFrom,
  compareTotals,
  compute,
  decodeSelection,
  emptySelection,
  encodeSelection,
  exampleSelection,
  money,
  quotedExtras,
  type Selection,
} from "@/lib/estimate";
import { site } from "../../../content/site";
import { FULL_SERVICE_FROM } from "../../../content/calculator";
import ItemCard from "./ItemCard";

/** Guided journey: one category at a time, then Review & send. Every piece starts at Signature. */
const STEPS = [
  ...VISIBLE_SECTIONS.map((s) => ({ id: s.id, title: s.title, sub: s.sub })),
  { id: "services", title: "Delivery & services", sub: "Getting everything to your venue, and away again" },
  { id: "review", title: "Review & send", sub: "Compare floral tiers, then email it to yourself or send it to Ivy" },
];
const EMPTY = emptySelection(1);
/** For scale on the first step: Ivy's typical Signature wedding (from $4,680). */
const TYPICAL_TOTAL = compute(exampleSelection()).total;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const noop = () => () => {};
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function Field({
  label,
  children,
  className = "",
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] tracking-[0.06em] text-muted uppercase">
        {label}
        {required && <span aria-hidden className="text-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}

const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });

export default function FloralCalculator() {
  // A shared or emailed estimate opens from ?e=<code> at Review & send; otherwise empty at step 1.
  const urlCode = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("e"),
    () => null,
  );
  const fromUrl = useMemo(() => decodeSelection(urlCode), [urlCode]);
  const [edited, setEdited] = useState<Selection | null>(null);
  const sel = edited ?? fromUrl ?? EMPTY;

  const edit = (fn: (s: Selection) => void) =>
    setEdited((prev) => {
      const next: Selection = structuredClone(prev ?? fromUrl ?? EMPTY);
      fn(next);
      return next;
    });

  const r = useMemo(() => compute(sel), [sel]);
  const compare = useMemo(() => (anyTiered(sel) ? compareTotals(sel) : null), [sel]);
  const from = r.hasFrom ? "from " : "";
  const extras = quotedExtras(r);
  const hasAnything = r.lines.length > 0 || r.svcLines.length > 0;
  const mixed = ITEMS.some((it) => (sel.items[it.id]?.qty ?? 0) > 0 && sel.items[it.id]?.tier != null);

  /* ---------- Steps ---------- */
  // "" = every step closed; null = the default (step 1, or Review for a shared estimate).
  const [openStep, setOpenStep] = useState<string | null>(null);
  const current = openStep ?? (fromUrl ? "review" : STEPS[0].id);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const reviewOpen = current === "review";

  function goTo(id: string) {
    setVisited((v) => new Set(v).add(current));
    setOpenStep(id);
    requestAnimationFrame(() => scrollToId(`step-${id}`));
  }

  /** "3 pieces · from $1,010", "Skipped", or null before the step has been seen. */
  function summary(id: string): string | null {
    if (id === "review") return null;
    if (id === "services") {
      const lines = r.svcLines;
      if (!lines.length) return visited.has(id) ? "None selected" : null;
      const priced = lines.filter((l) => l.amount != null).reduce((a, l) => a + (l.amount ?? 0), 0);
      const quoted = lines.some((l) => l.amount == null);
      return `${plural(lines.length, "service")}${priced ? ` · from ${money(priced)}` : ""}${quoted ? " · travel quoted" : ""}`;
    }
    const section = VISIBLE_SECTIONS.find((s) => s.id === id)!;
    const ids = new Set(section.items.map((it) => it.id));
    const lines = r.lines.filter((l) => ids.has(l.id));
    const pieces = section.items.reduce((a, it) => a + (it.options ? 0 : sel.items[it.id]?.qty ?? 0), 0);
    if (!lines.length) return visited.has(id) ? "Skipped" : null;
    const sum = lines.reduce((a, l) => a + (l.amount ?? 0), 0);
    return `${plural(pieces, "piece")} · from ${money(sum)}`;
  }

  /* ---------- Email me my estimate ---------- */
  const [saveState, setSaveState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [saveEmail, setSaveEmail] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const saveInput = useRef<HTMLInputElement>(null);
  const saveHoney = useRef<HTMLInputElement>(null);

  async function sendEstimate(e: React.FormEvent) {
    e.preventDefault();
    const email = saveEmail.trim();
    if (!isEmail(email)) {
      setSaveErr("Enter an email address like name@example.com.");
      saveInput.current?.focus();
      return;
    }
    if (!hasAnything) {
      setSaveErr("Add a few pieces to your estimate first.");
      return;
    }
    setSaveErr("");
    setSaveState("sending");
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "email",
          email,
          estimate: encodeSelection(sel),
          _gotcha: saveHoney.current?.value ?? "",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSaveState("sent");
    } catch {
      setSaveState("error");
    }
  }

  /* ---------- Enquiry ---------- */
  const [enqState, setEnqState] = useState<"idle" | "sending" | "sent">("idle");
  const [enqErr, setEnqErr] = useState("");

  function estimateText() {
    return [
      `Floral tier: ${mixed ? "Mixed" : TIERS[sel.tier].name}`,
      ...r.lines.map((l) => `- ${l.name} (${l.detail}): ${l.value}`),
      ...(r.svcLines.length ? ["Delivery & services:", ...r.svcLines.map((l) => `- ${l.name}: ${l.value}`)] : []),
      `Estimated total (excl. GST): ${from}${money(r.total)} ${extras}`.trim(),
    ].join("\n");
  }

  async function sendEnquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!fields.names?.trim() || !isEmail(fields.email?.trim() ?? "")) {
      setEnqErr("Please add your names and a valid email address.");
      return;
    }
    setEnqErr("");
    setEnqState("sending");
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, action: "enquire", estimate: encodeSelection(sel) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setEnqState("sent");
    } catch {
      // Never lose a lead: fall back to a pre-filled email draft.
      const subject = encodeURIComponent(`Calculator enquiry: ${fields.names}`);
      const body = encodeURIComponent(
        [
          `Names: ${fields.names}`,
          `Email: ${fields.email}`,
          fields.phone && `Phone: ${fields.phone}`,
          fields.date && `Wedding date: ${fields.date}`,
          fields.venue && `Venue: ${fields.venue}`,
          fields.inspo && `Inspiration: ${fields.inspo}`,
          "",
          estimateText(),
          "",
          fields.notes,
        ]
          .filter((x) => x !== undefined && x !== "")
          .join("\n"),
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setEnqState("idle");
    }
  }

  /* ---------- Phone bottom bar: hidden at Review & send and over the footer ---------- */
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([en]) => setFooterVisible(en.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  const barHidden = reviewOpen || footerVisible;

  const clearAll = () => edit((s) => Object.assign(s, emptySelection(1)));

  const lineRow = (l: { id: string; name: string; detail: string; value: string }) => (
    <div key={l.id} className="flex justify-between gap-4">
      <div className="min-w-0">
        <p className="text-ink">{l.name}</p>
        <p className="text-[12px] text-muted">{l.detail}</p>
      </div>
      <p className="shrink-0 text-ink">{l.value}</p>
    </div>
  );

  const breakdown = (compact: boolean) => (
    <>
      <div
        className={`space-y-3 text-[13px] tabular-nums ${compact ? "lg:max-h-[max(8rem,calc(100vh-30rem))] lg:overflow-y-auto lg:pr-1" : ""}`}
      >
        {r.lines.length ? (
          r.lines.map(lineRow)
        ) : (
          <p className="text-muted">Your estimate builds here as you add pieces.</p>
        )}
        {r.svcLines.length > 0 && (
          <>
            <p className="border-t border-hairline pt-3 text-[11px] tracking-[0.16em] text-muted uppercase">
              Delivery &amp; services
            </p>
            {r.svcLines.map(lineRow)}
          </>
        )}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-hairline pt-4 text-[13px] tabular-nums">
        <div className="flex justify-between">
          <span className="text-ink-soft">Florals</span>
          <span className="text-ink">{r.florals ? "from " + money(r.florals) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft">Delivery &amp; services</span>
          <span className="text-ink">{r.services ? from + money(r.services) : "—"}</span>
        </div>
      </div>
      <div className="mt-4 border-t border-hairline pt-5" aria-live="polite">
        <p className="eyebrow text-muted">Estimated total · excl. GST</p>
        <p className="mt-2 font-serif text-[44px] leading-none font-light tracking-[-0.02em] text-ink tabular-nums">
          {r.hasFrom && <span className="mr-1 font-sans text-[13px] tracking-normal text-muted">from</span>}
          {r.hasFrom && " "}
          {money(r.total)}
        </p>
        {extras && <p className="mt-1.5 text-[12.5px] text-muted">{extras}</p>}
        <p className="mt-2 text-[12.5px] text-muted tabular-nums">
          {from}
          {money(r.total * (1 + GST))} including 15% GST
        </p>
      </div>
    </>
  );

  /* ---------- Step contents ---------- */
  function stepContent(id: string) {
    if (id === "services") {
      return (
        <div className="border-t border-hairline">
          {SERVICES.map((sv) => (
            <label
              key={sv.id}
              className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-hairline px-1 py-4"
            >
              <input
                type="checkbox"
                className="check-wp"
                checked={!!sel.services[sv.id]}
                onChange={(e) =>
                  edit((n) => {
                    n.services[sv.id] = e.target.checked;
                  })
                }
              />
              <span>
                <span className="block font-serif text-[18px] leading-snug text-ink">{sv.name}</span>
                {sv.note && <span className="block text-[12.5px] text-muted">{sv.note}</span>}
              </span>
              <span
                className={`text-[13px] whitespace-nowrap tabular-nums ${sel.services[sv.id] ? "font-medium text-ink" : "text-ink-soft"}`}
              >
                {sv.quote ? "Quoted" : `From ${money(sv.price ?? sv.from ?? 0)}`}
              </span>
            </label>
          ))}
        </div>
      );
    }
    if (id === "review") return reviewContent();
    const section = VISIBLE_SECTIONS.find((s) => s.id === id)!;
    return (
      <>
        {id === STEPS[0].id && (
          <div className="mb-8 max-w-[680px] border-l-2 border-hairline pl-4 text-[13.5px] leading-relaxed text-ink-soft">
            <p>
              Every piece starts at Signature. Change a piece&rsquo;s tier as you go, or switch
              everything at the end.
            </p>
            <p className="mt-1.5 text-muted">
              For scale: a typical Signature wedding, with a bride and three bridesmaids, two
              ceremony plinths, eight tables with bud vases, a bar arrangement, delivery and
              pack-down, is from {money(TYPICAL_TOTAL)} excl. GST.
            </p>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {section.items.map((it) => (
            <ItemCard
              key={it.id}
              it={it}
              sel={sel}
              onQty={(q) =>
                edit((n) => {
                  n.items[it.id].qty = Math.max(0, Math.min(999, Math.floor(q)));
                })
              }
              onStep={(d) =>
                edit((n) => {
                  n.items[it.id].qty = Math.max(0, Math.min(999, n.items[it.id].qty + d));
                })
              }
              onTier={(t) =>
                edit((n) => {
                  n.items[it.id].tier = t;
                  if (!n.items[it.id].qty) n.items[it.id].qty = 1;
                })
              }
            />
          ))}
        </div>
      </>
    );
  }

  function reviewContent() {
    if (!hasAnything) {
      return (
        <div className="max-w-[560px] border border-hairline bg-paper p-6">
          <p className="font-serif text-[22px] font-light text-ink">Your estimate is empty</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Add the pieces you&rsquo;d love in the steps above, and your estimate will appear here.
          </p>
          <button type="button" onClick={() => goTo(STEPS[0].id)} className="btn-solid mt-6">
            Start with {STEPS[0].title.toLowerCase()}
          </button>
        </div>
      );
    }
    return (
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* Estimate + floral tiers */}
        <div className="min-w-0">
          <div className="border border-hairline bg-paper p-6 xl:p-7">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-[26px] leading-tight font-light text-ink">Your estimate</h3>
              <button type="button" onClick={clearAll} className="text-[12px] text-muted underline underline-offset-2 hover:text-ink">
                Clear all
              </button>
            </div>
            {breakdown(false)}
          </div>

          {compare && (
            <div className="mt-8">
              <h3 className="eyebrow text-muted">Try another floral tier</h3>
              <p className="mt-2 text-[13px] text-ink-soft">
                {mixed
                  ? "You've mixed tiers across your pieces. Switching sets every piece to one tier."
                  : "The same pieces in each tier. Switch to see your estimate change."}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3" role="group" aria-label="Floral tier">
                {TIERS.map((t, i) => {
                  const on = !mixed && sel.tier === i;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        edit((s) => {
                          s.tier = i;
                          for (const k in s.items) s.items[k].tier = null;
                        })
                      }
                      className={`border p-4 text-left transition-colors ${on ? "border-ink bg-paper" : "border-hairline bg-white hover:border-ink"}`}
                    >
                      <span className="block font-serif text-[20px] leading-tight font-light text-ink">{t.name}</span>
                      <span className="mt-0.5 block text-[11.5px] text-muted">{t.note}</span>
                      <span className="mt-3 block text-[14px] text-ink tabular-nums">from {money(compare[i])}</span>
                      <span className="mt-1 block text-[10.5px] tracking-[0.14em] text-muted uppercase">
                        {on ? "Your selection" : `Switch to ${t.name}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <ul className="mt-8 list-disc space-y-1.5 pl-4 text-[12px] leading-relaxed text-muted">
            <li>All prices are in NZD and exclude GST. Your final quote is confirmed after a consultation.</li>
            <li>
              Full-service wedding design starts from {money(FULL_SERVICE_FROM)}. Vase and plinth hire is
              included.
            </li>
            <li>All prices are starting prices. Travel beyond Auckland is quoted by venue.</li>
            <li>Photos show past work as a guide. Every design is made to order around the season&rsquo;s best blooms.</li>
          </ul>
        </div>

        {/* Send it on */}
        <div className="min-w-0">
          <div className="border border-hairline p-6">
            <h3 className="font-serif text-[22px] font-light text-ink">Email me my estimate</h3>
            {saveState === "sent" ? (
              <p className="mt-3 text-[13.5px] text-ink-soft">
                <span className="text-ink">Sent to {saveEmail.trim()}.</span> It should arrive in a minute or
                two, with a link to reopen and adjust your estimate.
              </p>
            ) : (
              <form onSubmit={sendEstimate} noValidate className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <Field label="Your email" className="flex-1">
                  <input
                    ref={saveInput}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={saveEmail}
                    onChange={(e) => setSaveEmail(e.target.value)}
                    className="input-wp"
                  />
                </Field>
                <input ref={saveHoney} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <button type="submit" disabled={saveState === "sending"} className="btn-solid shrink-0 disabled:opacity-60">
                  {saveState === "sending" ? "Sending…" : "Send my estimate"}
                </button>
              </form>
            )}
            {saveErr && <p className="mt-3 text-[12.5px] text-ink">{saveErr}</p>}
            {saveState === "error" && (
              <p className="mt-3 text-[12.5px] text-ink">
                We couldn&rsquo;t send that just now. Please try again, or email{" "}
                <a href={`mailto:${site.email}`} className="underline">
                  {site.email}
                </a>
                .
              </p>
            )}
            {saveState !== "sent" && (
              <p className="mt-3 text-[12.5px] text-muted">
                A copy of your selections to keep or share with your partner.
              </p>
            )}
          </div>

          <div id="enquire" className="mt-6 scroll-mt-24 border border-hairline bg-paper p-6">
            <h3 className="font-serif text-[22px] font-light text-ink">
              Ready to talk it <em>through?</em>
            </h3>
            {enqState === "sent" ? (
              <>
                <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
                  Thank you. Your estimate is with Ivy, who will be in touch personally within 1–2
                  business days.
                </p>
                <a href={site.consultationUrl} target="_blank" rel="noopener" className="btn-outline mt-6">
                  Book your free consultation
                </a>
              </>
            ) : (
              <>
                <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
                  Send your estimate to Ivy with a few details; your selections are attached. Every
                  enquiring couple is offered a complimentary 30-minute video chat, with no
                  obligation.{" "}
                  <a href={site.consultationUrl} target="_blank" rel="noopener" className="text-ink underline underline-offset-2">
                    Book your consultation
                  </a>
                </p>
                <form onSubmit={sendEnquiry} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                  <Field label="Your names" required>
                    <input name="names" required autoComplete="name" placeholder="Ava & James" className="input-wp" />
                  </Field>
                  <Field label="Email" required>
                    <input name="email" type="email" required autoComplete="email" className="input-wp" />
                  </Field>
                  <Field label="Phone">
                    <input name="phone" type="tel" autoComplete="tel" className="input-wp" />
                  </Field>
                  <Field label="Wedding date">
                    <input name="date" placeholder="DD/MM/YYYY" className="input-wp" />
                  </Field>
                  <Field label="Venue" className="sm:col-span-2">
                    <input name="venue" placeholder="Venue name, Auckland" className="input-wp" />
                  </Field>
                  <Field label="Pinterest board or inspiration link" className="sm:col-span-2">
                    <input name="inspo" type="url" inputMode="url" placeholder="https://" className="input-wp" />
                  </Field>
                  <Field label="Colours, flowers or anything else" className="sm:col-span-2">
                    <textarea name="notes" rows={4} className="input-wp" />
                  </Field>
                  <div className="sm:col-span-2">
                    {enqErr && <p className="mb-3 text-[13px] text-ink">{enqErr}</p>}
                    <button type="submit" disabled={enqState === "sending"} className="btn-solid disabled:opacity-60">
                      {enqState === "sending" ? "Sending…" : "Send to Ivy"}
                    </button>
                    <p className="mt-3 text-[12.5px] text-muted">
                      * Required. We reply personally within 1–2 business days.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Intro */}
      <section className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-6 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:items-end md:gap-16">
          <div>
            <p className="eyebrow text-muted">Wedding flower calculator</p>
            <h1 className="display-1 mt-3 text-ink">
              Build your <em>floral estimate</em>
            </h1>
            <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Choose a floral tier, add the pieces you&rsquo;d love, and see your estimate as you go.
              Send me your selections when you&rsquo;re ready, and we&rsquo;ll work through the
              details together.
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">Floral tiers</p>
            <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
              {TIERS.map((t, i) => (
                <li key={t.name} className="flex items-center gap-4 py-3">
                  <img
                    src={imageSrc(`calculator-bridal-${t.name.toLowerCase()}-1`, 480)}
                    alt=""
                    width={40}
                    height={50}
                    loading="lazy"
                    className="h-[50px] w-[40px] shrink-0 object-cover"
                  />
                  <span className="min-w-0">
                    <span className="font-serif text-[18px] leading-tight font-light text-ink">{t.name}</span>
                    <span className="block text-[12.5px] text-ink-soft">{t.note}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-right text-[11.5px] text-muted">
                    Bouquet
                    <br />
                    from {money(bridalFrom(i) ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps + running estimate */}
      <div
        className={`mx-auto mt-12 grid max-w-[1280px] gap-14 px-5 sm:px-6 md:mt-16 lg:items-start ${
          reviewOpen ? "" : "lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:gap-14"
        }`}
      >
        <ol className="min-w-0 border-b border-hairline">
          {STEPS.map((st, i) => {
            const open = current === st.id;
            const sum = summary(st.id);
            const next = STEPS[i + 1];
            const done = visited.has(st.id) || !!sum;
            return (
              <li key={st.id} id={`step-${st.id}`} className="scroll-mt-24 border-t border-hairline">
                <h2>
                  <button
                    type="button"
                    id={`step-btn-${st.id}`}
                    aria-expanded={open}
                    aria-controls={`step-panel-${st.id}`}
                    onClick={() => (open ? setOpenStep("") : goTo(st.id))}
                    className="group flex w-full items-center gap-5 py-5 text-left md:py-6"
                  >
                    <span className="w-7 shrink-0 font-serif text-[15px] text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[24px] leading-tight font-light text-ink md:text-[28px]">
                        {st.title}
                      </span>
                      <span className="mt-1 block font-sans text-[12.5px] font-normal text-muted">
                        {open ? `Step ${i + 1} of ${STEPS.length} · ${st.sub}` : (sum ?? st.sub)}
                      </span>
                    </span>
                    {!open && (
                      <span className="shrink-0 font-sans text-[11px] font-normal tracking-[0.14em] text-ink uppercase group-hover:underline">
                        {done ? "Edit" : "Open"}
                      </span>
                    )}
                  </button>
                </h2>
                <div id={`step-panel-${st.id}`} role="region" aria-labelledby={`step-btn-${st.id}`} hidden={!open} className="pb-10">
                  {stepContent(st.id)}
                  {next && (
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6">
                      <button type="button" onClick={() => goTo(next.id)} className="btn-solid">
                        Next: {next.title}
                      </button>
                      {sum && sum !== "Skipped" && sum !== "None selected" ? (
                        <span className="text-[13px] text-muted tabular-nums sm:ml-auto">{sum}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => goTo(next.id)}
                          className="text-[13px] text-ink-soft underline underline-offset-2 hover:text-ink"
                        >
                          Skip this step
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Running estimate (desktop) */}
        {!reviewOpen && (
          <aside id="estimate" aria-labelledby="h-estimate" className="hidden lg:sticky lg:top-24 lg:block">
            <div className="border border-hairline bg-paper p-6 xl:p-7">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h2 id="h-estimate" className="font-serif text-[26px] leading-tight font-light text-ink">
                  Your estimate
                </h2>
                {hasAnything && (
                  <button type="button" onClick={clearAll} className="text-[12px] text-muted underline underline-offset-2 hover:text-ink">
                    Clear all
                  </button>
                )}
              </div>
              {breakdown(true)}
              <button type="button" onClick={() => goTo("review")} className="btn-solid mt-6 w-full text-center">
                Review &amp; send
              </button>
              <p className="mt-3 text-[12px] text-muted">Compare floral tiers and send it on at the last step.</p>
            </div>
          </aside>
        )}
      </div>

      {/* Phone bottom bar */}
      <div
        aria-hidden={barHidden}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-hairline bg-white px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 lg:hidden ${
          barHidden ? "translate-y-full" : ""
        }`}
      >
        <div>
          <span className="block text-[10px] tracking-[0.14em] whitespace-nowrap text-muted uppercase">Estimate · excl. GST</span>
          <span className="font-serif text-[24px] leading-tight font-light text-ink tabular-nums">
            {from}
            {money(r.total)}
          </span>
        </div>
        <button
          type="button"
          tabIndex={barHidden ? -1 : 0}
          onClick={() => goTo("review")}
          className="shrink-0 border border-ink bg-ink px-4 py-3 text-[11px] tracking-[0.16em] whitespace-nowrap text-white uppercase"
        >
          Review &amp; send
        </button>
      </div>
    </div>
  );
}
