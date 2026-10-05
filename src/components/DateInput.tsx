"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { formatDate, todayIso } from "@/lib/dates";
import { ArrowIcon } from "./ArrowButton";

/**
 * The site's date field (Tony, 6 Oct 2026): clicking anywhere in the box
 * opens a calendar directly underneath, the same width as the box. Used for
 * every date on the site (wedding, event and calculator enquiries).
 *
 * The visible field holds the chosen date as text ("Saturday 14 March 2027")
 * under `name`, so FormData, the emails and the browser's `required` check
 * all keep working. Typing is blocked; the calendar is the only way in.
 * Past dates are disabled; today is worked out in the browser, so the
 * static HTML never carries the build date. Weeks start on Monday (NZ).
 */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const YEARS_AHEAD = 4;

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m: m - 1, d };
};
const addDays = (s: string, n: number) => {
  const { y, m, d } = parse(s);
  const t = new Date(Date.UTC(y, m, d + n));
  return iso(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
};
const addMonths = (s: string, n: number) => {
  const { y, m, d } = parse(s);
  const first = new Date(Date.UTC(y, m + n, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return iso(first.getUTCFullYear(), first.getUTCMonth(), Math.min(d, last));
};

const navBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-ink-soft transition-colors enabled:hover:border-ink enabled:hover:text-ink disabled:opacity-30";

export default function DateInput({
  name,
  required,
  className = "",
  placeholder = "Select a date",
}: {
  name: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const [focus, setFocus] = useState(""); // the day keyboard focus sits on (and the month shown)
  const [narrow, setNarrow] = useState(false); // short month names when the box is narrow
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const id = useId();

  const show = useCallback(() => {
    const t = todayIso();
    setToday(t);
    setFocus(value || t);
    setNarrow((wrap.current?.offsetWidth ?? 999) < 260);
    setOpen(true);
  }, [value]);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) input.current?.focus();
  }, []);

  // Never move before today.
  const go = (d: string) => setFocus(today && d < today ? today : d);

  // Click outside closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  // Keyboard focus follows the focused day while it is inside the calendar.
  useEffect(() => {
    if (!open || !grid.current?.contains(document.activeElement)) return;
    grid.current.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();
  }, [open, focus]);

  function onFieldKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") return;
    if (e.key === "Escape") {
      if (open) close();
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      setValue("");
      return;
    }
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      if (!open) show();
      requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus());
      return;
    }
    if (e.key.length === 1) e.preventDefault(); // no typing
  }

  function onDayKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      go(moves[e.key]());
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const view = focus ? parse(focus) : null;
  const now = today ? parse(today) : null;
  let cells: (string | null)[] = [];
  if (view) {
    const lead = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7; // Monday first
    const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => iso(view.y, view.m, i + 1))];
    while (cells.length % 7) cells.push(null);
  }
  const atFirstMonth = !!view && !!now && view.y === now.y && view.m === now.m;

  return (
    <div ref={wrap} className="relative">
      <input
        ref={input}
        type="text"
        name={name}
        required={required}
        value={value ? formatDate(value) : ""}
        onChange={() => {}}
        onClick={() => (open ? close() : show())}
        onKeyDown={onFieldKey}
        onPaste={(e) => e.preventDefault()}
        inputMode="none"
        autoComplete="off"
        placeholder={placeholder}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className={`${className} cursor-pointer pr-10 caret-transparent`}
      />
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
      >
        <rect x="3" y="4.5" width="14" height="12" rx="1" />
        <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
      </svg>

      {open && view && now && (
        <div
          id={id}
          role="dialog"
          aria-label="Choose a date"
          className={`absolute inset-x-0 top-full z-30 mt-1 animate-[fadein_0.15s_ease] border border-hairline bg-white shadow-[0_0.875rem_2.125rem_rgba(26,24,21,0.12)] ${narrow ? "p-2" : "p-3 sm:p-4"}`}
        >
          <div className="flex items-center justify-between gap-2">
            <button type="button" aria-label="Previous month" disabled={atFirstMonth} onClick={() => go(addMonths(focus, -1))} className={navBtn}>
              <ArrowIcon dir="prev" />
            </button>
            <div className="flex min-w-0 items-center gap-1.5 font-serif text-[1.0625rem] text-ink">
              <select
                aria-label="Month"
                value={view.m}
                onChange={(e) => go(iso(view.y, Number(e.target.value), 1))}
                className="min-w-0 cursor-pointer appearance-none bg-transparent text-right hover:underline focus:outline-1 focus:outline-ink"
              >
                {MONTHS.map((mo, i) => (
                  <option key={mo} value={i} disabled={view.y === now.y && i < now.m}>
                    {narrow ? mo.slice(0, 3) : mo}
                  </option>
                ))}
              </select>
              <select
                aria-label="Year"
                value={view.y}
                onChange={(e) => go(iso(Number(e.target.value), view.m, 1))}
                className="cursor-pointer appearance-none bg-transparent hover:underline focus:outline-1 focus:outline-ink"
              >
                {Array.from({ length: YEARS_AHEAD + 1 }, (_, i) => now.y + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" aria-label="Next month" onClick={() => go(addMonths(focus, 1))} className={navBtn}>
              <ArrowIcon dir="next" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[0.65625rem] tracking-[0.12em] text-muted uppercase" aria-hidden>
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">
                {w}
              </span>
            ))}
          </div>
          <div ref={grid} role="group" aria-label={`${MONTHS[view.m]} ${view.y}`} className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} aria-hidden />;
              const past = d < today;
              const selected = d === value;
              return (
                <button
                  key={d}
                  type="button"
                  data-day={d}
                  tabIndex={d === focus ? 0 : -1}
                  disabled={past}
                  aria-pressed={selected}
                  aria-label={formatDate(d)}
                  onClick={() => {
                    setValue(d);
                    close();
                  }}
                  onKeyDown={onDayKey}
                  className={`flex h-9 items-center justify-center text-[0.84375rem] tabular-nums transition-colors disabled:cursor-not-allowed disabled:text-hairline sm:h-10 ${
                    selected
                      ? "bg-ink text-white"
                      : `text-ink enabled:hover:bg-paper ${d === today ? "underline decoration-1 underline-offset-4" : ""}`
                  }`}
                >
                  {parse(d).d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
