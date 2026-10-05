"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { imageSrc } from "@/lib/images";
import {
  GST,
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

const EXAMPLE = exampleSelection();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const noop = () => () => {};

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
  });

export default function FloralCalculator() {
  // A shared or emailed estimate opens from ?e=<code>; otherwise the example.
  const urlCode = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("e"),
    () => null,
  );
  const fromUrl = useMemo(() => decodeSelection(urlCode), [urlCode]);
  const [edited, setEdited] = useState<Selection | null>(null);
  const sel = edited ?? fromUrl ?? EXAMPLE;
  const isExample = !edited && !fromUrl;

  const edit = (fn: (s: Selection) => void) =>
    setEdited((prev) => {
      const next: Selection = structuredClone(prev ?? fromUrl ?? EXAMPLE);
      fn(next);
      return next;
    });

  const r = useMemo(() => compute(sel), [sel]);
  const compare = useMemo(() => (anyTiered(sel) ? compareTotals(sel) : null), [sel]);
  const from = r.hasFrom ? "from " : "";
  const extras = quotedExtras(r);
  const hasAnything = r.lines.length > 0 || r.svcLines.length > 0;

  /* ---------- Email me my estimate ---------- */
  const [saveState, setSaveState] = useState<"idle" | "form" | "sending" | "sent" | "error">("idle");
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
      `Floral tier: ${TIERS[sel.tier].name}`,
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

  /* ---------- Phone bottom bar: hidden while the estimate, enquiry or footer is on screen ---------- */
  const [barHidden, setBarHidden] = useState(false);
  useEffect(() => {
    const targets = [
      document.getElementById("estimate"),
      document.getElementById("enquire"),
      document.querySelector("footer"),
    ].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) visible.add(en.target);
        else visible.delete(en.target);
      }
      setBarHidden(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const lineRow = (l: { id: string; name: string; detail: string; value: string }) => (
    <div key={l.id} className="flex justify-between gap-4">
      <div className="min-w-0">
        <p className="text-ink">{l.name}</p>
        <p className="text-[12px] text-muted">{l.detail}</p>
      </div>
      <p className="shrink-0 text-ink">{l.value}</p>
    </div>
  );

  return (
    <div>
      {/* Intro */}
      <section className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-6 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)] md:items-end md:gap-16">
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
          <ol className="divide-y divide-hairline border-y border-hairline text-[13.5px] text-ink-soft">
            {["Choose a floral tier", "Add the pieces you’d love", "Send your selections to Ivy"].map(
              (s, i) => (
                <li key={s} className="flex items-baseline gap-4 py-3">
                  <span className="font-serif text-[15px] text-muted tabular-nums">0{i + 1}</span>
                  {s}
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      {/* Overall style */}
      <section className="mx-auto mt-12 max-w-[1280px] px-5 sm:px-6 md:mt-16">
        <div className="border-t border-hairline pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="eyebrow text-muted">Floral tier</p>
            <p className="text-[12.5px] text-muted">
              Applies to every piece. You can change any piece individually below.
            </p>
          </div>
          <div role="group" aria-label="Floral tier" className="mt-4 grid gap-3 sm:grid-cols-3">
            {TIERS.map((t, i) => {
              const on = sel.tier === i;
              const bp = bridalFrom(i);
              return (
                <button
                  key={t.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    edit((s) => {
                      s.tier = i;
                      for (const id in s.items) s.items[id].tier = null;
                    })
                  }
                  className={`flex items-center gap-4 border p-3 text-left transition-colors ${
                    on ? "border-ink bg-paper" : "border-hairline bg-white hover:border-ink"
                  }`}
                >
                  <img
                    src={imageSrc(`calculator-bridal-${t.name.toLowerCase()}-1`, 480)}
                    alt=""
                    width={56}
                    height={70}
                    loading="lazy"
                    className="h-[70px] w-[56px] shrink-0 object-cover"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-serif text-[22px] leading-tight font-light text-ink">
                      {t.name}
                      {on && (
                        <span className="text-[9.5px] font-normal tracking-[0.14em] text-muted uppercase">
                          Selected
                        </span>
                      )}
                    </span>
                    <span className="block text-[13px] text-ink-soft">{t.note}</span>
                    {bp != null && (
                      <span className="mt-0.5 block text-[11.5px] text-muted">Bridal bouquet from {money(bp)}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section links */}
      <nav aria-label="Calculator sections" className="mx-auto mt-8 max-w-[1280px] px-5 sm:px-6">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {[...VISIBLE_SECTIONS.map((s) => [s.id, s.title]), ["services", "Delivery & services"]].map(([id, title]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 border border-hairline px-3.5 py-2 text-[12px] tracking-[0.06em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {title}
            </a>
          ))}
        </div>
      </nav>

      {/* Catalogue + estimate */}
      <div className="mx-auto mt-10 grid max-w-[1280px] gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
        <div className="min-w-0 space-y-16 md:space-y-20">
          {VISIBLE_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`} className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 id={`h-${s.id}`} className="display-3 text-ink">
                  {s.title}
                </h2>
                <p className="text-[13px] text-muted">{s.sub}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {s.items.map((it) => (
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
            </section>
          ))}

          <section id="services" aria-labelledby="h-services" className="scroll-mt-24">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 id="h-services" className="display-3 text-ink">
                Delivery &amp; services
              </h2>
              <p className="text-[13px] text-muted">Getting everything to your venue, and away again</p>
            </div>
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
                  <span className={`text-[13px] whitespace-nowrap tabular-nums ${sel.services[sv.id] ? "font-medium text-ink" : "text-ink-soft"}`}>
                    {sv.quote ? "Quoted" : `From ${money(sv.price ?? sv.from ?? 0)}`}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Estimate panel */}
        <aside id="estimate" aria-labelledby="h-estimate" className="scroll-mt-24 lg:sticky lg:top-24">
          <div className="border border-hairline bg-paper p-6 xl:p-7">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="h-estimate" className="font-serif text-[26px] leading-tight font-light text-ink">
                Your estimate
              </h2>
              {hasAnything && !isExample && (
                <button
                  type="button"
                  onClick={() => edit((s) => Object.assign(s, emptySelection(s.tier)))}
                  className="text-[12px] text-muted underline underline-offset-2 hover:text-ink"
                >
                  Clear all
                </button>
              )}
            </div>
            {isExample && (
              <p className="mt-2 text-[12.5px] text-muted">
                Example selection shown.{" "}
                <button
                  type="button"
                  onClick={() => edit((s) => Object.assign(s, emptySelection(s.tier)))}
                  className="text-ink underline underline-offset-2"
                >
                  Clear all
                </button>
              </p>
            )}

            <div className="mt-5 space-y-3 text-[13px] tabular-nums lg:max-h-[max(8rem,calc(100vh-36rem))] lg:overflow-y-auto lg:pr-1">
              {r.lines.length ? (
                r.lines.map(lineRow)
              ) : (
                <p className="text-muted">Add pieces from the list to start your estimate.</p>
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
              {compare && (
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted tabular-nums">
                  Same pieces, all {TIERS.map((t, i) => `${t.name} from ${money(compare[i])}`).join(" · ")}
                </p>
              )}
            </div>


            <div className="mt-6">
              {saveState === "idle" && (
                <button
                  type="button"
                  className="btn-solid w-full text-center"
                  onClick={() => {
                    setSaveState("form");
                    requestAnimationFrame(() => saveInput.current?.focus());
                  }}
                >
                  Email me my estimate
                </button>
              )}
              {(saveState === "form" || saveState === "sending" || saveState === "error") && (
                <form onSubmit={sendEstimate} noValidate className="space-y-3">
                  <Field label="Your email">
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
                  {saveErr && <p className="text-[12.5px] text-ink">{saveErr}</p>}
                  {saveState === "error" && (
                    <p className="text-[12.5px] text-ink">
                      We couldn&rsquo;t send that just now. Please try again, or email{" "}
                      <a href={`mailto:${site.email}`} className="underline">
                        {site.email}
                      </a>
                      .
                    </p>
                  )}
                  <button type="submit" disabled={saveState === "sending"} className="btn-solid w-full text-center disabled:opacity-60">
                    {saveState === "sending" ? "Sending…" : "Send my estimate"}
                  </button>
                  <p className="text-[12.5px] text-muted">
                    We&rsquo;ll email you a copy of your selections to keep or share with your partner.
                  </p>
                </form>
              )}
              {saveState === "sent" && (
                <div className="border border-hairline bg-white p-4 text-[13px] text-ink-soft">
                  <p className="text-ink">Sent to {saveEmail.trim()}.</p>
                  <p className="mt-1">It should arrive in a minute or two. It has a link to reopen and adjust your estimate.</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => scrollToId("enquire")}
                className="mt-4 block text-[12.5px] text-ink underline underline-offset-2"
              >
                Ready to talk it through? Send it to Ivy
              </button>
            </div>
            <ul className="mt-6 list-disc border-t border-hairline pt-5 space-y-1.5 pl-4 text-[12px] leading-relaxed text-muted">
              <li>All prices are in NZD and exclude GST. Your final quote is confirmed after a consultation.</li>
              <li>
                Full-service wedding design starts from {money(FULL_SERVICE_FROM)}. Vase and plinth
                hire is included.
              </li>
              <li>All prices are starting prices. Travel beyond Auckland is quoted by venue.</li>
              <li>Photos show past work as a guide. Every design is made to order around the season&rsquo;s best blooms.</li>
            </ul>
          </div>
        </aside>
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
          onClick={() => scrollToId("estimate")}
          className="shrink-0 border border-ink bg-ink px-4 py-3 text-[11px] tracking-[0.16em] whitespace-nowrap text-white uppercase"
        >
          View estimate
        </button>
      </div>

      {/* Enquiry: paper band, joins the footer */}
      <section id="enquire" aria-labelledby="h-enquire" className="mt-24 scroll-mt-20 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20 md:py-24">
          <div>
            <p className="eyebrow text-muted">Send it to Ivy</p>
            <h2 id="h-enquire" className="display-2 mt-3 text-ink">
              Ready to talk it <em>through?</em>
            </h2>
            <p className="mt-5 max-w-[440px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Send us your estimate with a few details. Your selections are attached automatically,
              so there&rsquo;s no need to list them again.
            </p>
            <p className="mt-4 max-w-[440px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Every enquiring couple is offered a complimentary 30-minute video chat, with no
              obligation.{" "}
              <a href={site.consultationUrl} target="_blank" rel="noopener" className="text-ink underline underline-offset-2">
                Book your consultation
              </a>
            </p>
            <div className="mt-8 max-w-[440px] border border-hairline bg-white p-5">
              <p className="eyebrow text-muted">Your estimate</p>
              <p className="mt-2 font-serif text-[28px] leading-none font-light text-ink tabular-nums">
                {hasAnything ? `${from}${money(r.total)}` : "No pieces yet"}
                {hasAnything && <span className="ml-2 font-sans text-[12.5px] text-muted">excl. GST</span>}
              </p>
              <p className="mt-2 text-[12.5px] text-muted">
                {r.pieces} piece{r.pieces === 1 ? "" : "s"} · {TIERS[sel.tier].name} tier
                {extras ? ` · ${extras}` : ""}
              </p>
              <button
                type="button"
                onClick={() => scrollToId("estimate")}
                className="mt-3 text-[12.5px] text-ink underline underline-offset-2"
              >
                Review or adjust
              </button>
            </div>
          </div>

          {enqState === "sent" ? (
            <div className="self-start border border-hairline bg-white p-8">
              <p className="font-serif text-[26px] leading-tight font-light text-ink">Thank you.</p>
              <p className="mt-3 text-[15px] leading-[1.7] font-light text-ink-soft">
                Your estimate is with Ivy, who will be in touch personally within 1–2 business days.
              </p>
              <a href={site.consultationUrl} target="_blank" rel="noopener" className="btn-outline mt-6">
                Book your free consultation
              </a>
            </div>
          ) : (
            <form onSubmit={sendEnquiry} noValidate className="grid gap-5 sm:grid-cols-2">
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
                  {enqState === "sending" ? "Sending…" : "Send enquiry"}
                </button>
                <p className="mt-3 text-[12.5px] text-muted">
                  * Required. We reply personally within 1–2 business days.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
