/**
 * Wedding flower calculator logic — pure functions shared by the page
 * (src/components/calculator/) and the Worker's estimate emails
 * (worker/index.js bundles this file), so totals always match.
 * Relative imports only: wrangler bundles this outside Next.
 */
import {
  EXAMPLE,
  GST,
  PHOTOS,
  SECTIONS,
  SERVICES,
  TIERS,
  type CalcItem,
  type CalcSection,
} from "../../content/calculator";

export { GST, SERVICES, TIERS };
export type { CalcItem, CalcSection };

/** Only items with photos are shown (Ivy's rule); hidden ones keep their prices. */
export const VISIBLE_SECTIONS: CalcSection[] = SECTIONS.map((s) => ({
  ...s,
  items: s.items.filter((it) => PHOTOS[it.id]),
})).filter((s) => s.items.length > 0);

export const ITEMS: CalcItem[] = VISIBLE_SECTIONS.flatMap((s) => s.items);
const ITEM_BY_ID = new Map(ITEMS.map((it) => [it.id, it]));

export type Selection = {
  /** Overall style: 0 Essential, 1 Signature, 2 Luxe. */
  tier: number;
  /** Per item: quantity and an optional style override. */
  items: Record<string, { qty: number; tier: number | null }>;
  /** Aisle petals option index (0 = none). */
  aisle: number;
  services: Record<string, boolean>;
};

export function emptySelection(tier = 1): Selection {
  return {
    tier,
    items: Object.fromEntries(ITEMS.map((it) => [it.id, { qty: 0, tier: null }])),
    aisle: 0,
    services: Object.fromEntries(SERVICES.map((sv) => [sv.id, false])),
  };
}

export function exampleSelection(): Selection {
  const sel = emptySelection(1);
  for (const [id, qty] of Object.entries(EXAMPLE.items)) if (sel.items[id]) sel.items[id].qty = qty;
  for (const id of EXAMPLE.services) sel.services[id] = true;
  return sel;
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-NZ");

/** "each", "per bouquet", "per metre"… */
export const unitLabel = (it: CalcItem) => (it.unit === "each" ? "each" : `per ${it.unit}`);

/**
 * Effective style for a tiered item: its own choice, else the overall style.
 * If that style isn't offered, step up to the next one that is (or down if
 * none above), so Essential-overall prices a Signature-only piece at Signature.
 */
export function tierFor(it: CalcItem, sel: Selection): number {
  const tiers = it.tiers!;
  let t = sel.items[it.id]?.tier ?? sel.tier;
  if (tiers[t] == null) {
    const up = tiers.findIndex((p, i) => i > t && p != null);
    if (up >= 0) t = up;
    else for (let i = tiers.length - 1; i >= 0; i--) if (tiers[i] != null) { t = i; break; }
  }
  return t;
}

export function unitPrice(it: CalcItem, sel: Selection): number {
  if (it.tiers) return it.tiers[tierFor(it, sel)] as number;
  return (it.price ?? it.from ?? 0) as number;
}

export type EstimateLine = { id: string; name: string; detail: string; value: string; amount: number | null };

export type Estimate = {
  florals: number;
  services: number;
  total: number;
  hasFrom: boolean;
  /** Dense aisle petals chosen: quoted separately. */
  custom: boolean;
  travelQuote: boolean;
  lines: EstimateLine[];
  svcLines: EstimateLine[];
  pieces: number;
};

export function compute(sel: Selection): Estimate {
  let florals = 0;
  let hasFrom = false;
  let custom = false;
  let pieces = 0;
  const lines: EstimateLine[] = [];
  for (const it of ITEMS) {
    if (it.options) {
      const opt = it.options[sel.aisle];
      if (sel.aisle > 0 && opt) {
        if (opt.value == null) {
          custom = true;
          lines.push({ id: it.id, name: it.name, detail: opt.label, value: "Custom quote", amount: null });
        } else {
          florals += opt.value;
          hasFrom = true;
          lines.push({ id: it.id, name: it.name, detail: opt.label, value: "from " + money(opt.value), amount: opt.value });
        }
      }
      continue;
    }
    const q = sel.items[it.id]?.qty ?? 0;
    if (!q) continue;
    const p = unitPrice(it, sel);
    florals += p * q;
    pieces += q;
    hasFrom = true;
    const style = it.tiers ? TIERS[tierFor(it, sel)].name + " · " : "";
    lines.push({
      id: it.id,
      name: it.name,
      detail: `${style}${q} × from ${money(p)}${it.unit === "metre" ? " per metre" : ""}`,
      value: "from " + money(p * q),
      amount: p * q,
    });
  }
  let services = 0;
  let travelQuote = false;
  const svcLines: EstimateLine[] = [];
  for (const sv of SERVICES) {
    if (!sel.services[sv.id]) continue;
    if (sv.quote) {
      travelQuote = true;
      svcLines.push({ id: sv.id, name: sv.name, detail: "By venue location", value: "Quoted", amount: null });
      continue;
    }
    const p = (sv.price ?? sv.from ?? 0) as number;
    services += p;
    hasFrom = true;
    svcLines.push({ id: sv.id, name: sv.name, detail: "Starting price", value: "from " + money(p), amount: p });
  }
  return { florals, services, total: florals + services, hasFrom, custom, travelQuote, lines, svcLines, pieces };
}

export const anyTiered = (sel: Selection) => ITEMS.some((it) => it.tiers && (sel.items[it.id]?.qty ?? 0) > 0);

/** The tier every chosen tiered piece was set to, or null when they differ (or none are chosen). */
export function commonTier(sel: Selection): number | null {
  const chosen = new Set(
    ITEMS.filter((it) => it.tiers && (sel.items[it.id]?.qty ?? 0) > 0).map((it) => sel.items[it.id].tier ?? sel.tier),
  );
  return chosen.size === 1 ? [...chosen][0] : null;
}

/** "Signature tier" when every tiered piece shares one tier, else "" (each line names its own tier). */
export function tierSummary(sel: Selection): string {
  const t = commonTier(sel);
  return t == null ? "" : `${TIERS[t].name} tier`;
}

/** "+ aisle petals & travel quoted" suffix, or "". */
export function quotedExtras(r: Estimate): string {
  const x = [r.custom && "aisle petals", r.travelQuote && "travel"].filter(Boolean);
  return x.length ? `+ ${x.join(" & ")} quoted` : "";
}

/* ---------- Compact share code: t.1~bridal.1~bridesmaid.3.2~a.1~s.delivery.packdown ---------- */

export function encodeSelection(sel: Selection): string {
  const parts = [`t.${sel.tier}`];
  for (const it of ITEMS) {
    const s = sel.items[it.id];
    if (!s || !s.qty) continue;
    parts.push(s.tier == null ? `${it.id}.${s.qty}` : `${it.id}.${s.qty}.${s.tier}`);
  }
  if (sel.aisle) parts.push(`a.${sel.aisle}`);
  const svc = SERVICES.filter((sv) => sel.services[sv.id]).map((sv) => sv.id);
  if (svc.length) parts.push(`s.${svc.join(".")}`);
  return parts.join("~");
}

const int = (v: string | undefined, min: number, max: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};

/** Parses a share code; unknown ids are ignored and numbers clamped. null if unusable. */
export function decodeSelection(code: string | null | undefined): Selection | null {
  if (!code || typeof code !== "string" || code.length > 2000) return null;
  const sel = emptySelection(1);
  let any = false;
  for (const part of code.split("~")) {
    const [key, ...rest] = part.split(".");
    if (key === "t") {
      sel.tier = int(rest[0], 0, 2) ?? 1;
    } else if (key === "a") {
      const aisle = ITEMS.find((it) => it.options);
      if (aisle) sel.aisle = int(rest[0], 0, aisle.options!.length - 1) ?? 0;
      any = any || sel.aisle > 0;
    } else if (key === "s") {
      for (const id of rest) if (id in sel.services) { sel.services[id] = true; any = true; }
    } else if (ITEM_BY_ID.has(key)) {
      const it = ITEM_BY_ID.get(key)!;
      const qty = int(rest[0], 0, 999) ?? 0;
      let tier = rest[1] != null && it.tiers ? int(rest[1], 0, 2) : null;
      if (tier != null && it.tiers![tier] == null) tier = null;
      sel.items[key] = { qty, tier };
      any = any || qty > 0;
    }
  }
  return any ? sel : null;
}

/* ---------- Photos ---------- */

const isTieredPhotos = (ph: (string[] | null)[] | string[]) =>
  ph.length === 3 && ph.some((x) => x === null || Array.isArray(x));

/** Photos to show for an item: same style first, then nearest (+1, −1, +2, −2). */
export function photosFor(it: CalcItem, sel: Selection): { list: string[]; tier: number | null } | null {
  const ph = PHOTOS[it.id];
  if (!ph) return null;
  if (!isTieredPhotos(ph)) return { list: ph as string[], tier: null };
  const tiered = ph as (string[] | null)[];
  const t = it.tiers ? tierFor(it, sel) : 1;
  const order = [t, t + 1, t - 1, t + 2, t - 2].filter((i) => i >= 0 && i < 3);
  const i = order.find((k) => tiered[k]);
  return i == null ? null : { list: tiered[i]!, tier: i };
}

/** Lowest "from" price of a tier across all tiered items, for the style picker. */
export const bridalFrom = (tier: number) => ITEM_BY_ID.get("bridal")?.tiers?.[tier] ?? null;
