/**
 * Date pickers send ISO dates (2027-03-14). Emails and fallbacks show them
 * the NZ way: "Sunday 14 March 2027". Anything else passes through as typed.
 * Relative imports only: the Worker bundles this file.
 */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return value;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCMonth() !== mo - 1) return value;
  return `${DAYS[date.getUTCDay()]} ${d} ${MONTHS[mo - 1]} ${y}`;
}

/** Today in the visitor's time zone as YYYY-MM-DD, for a picker's earliest date. */
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
