"use client";

import { useSyncExternalStore } from "react";

/** Shown on the download page when the signup email went out (?sent=1). */
export default function CalendarSentNote() {
  const sent = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("sent") === "1",
    () => false,
  );
  if (!sent) return null;
  return (
    <p className="mt-5 max-w-[28.75rem] border-l border-hairline pl-4 text-[0.84375rem] leading-relaxed text-ink-soft">
      We&rsquo;ve also emailed you the download link. If it isn&rsquo;t in your inbox within
      a few minutes, check your promotions or spam folder.
    </p>
  );
}
