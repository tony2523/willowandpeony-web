"use client";

import { useEffect, useRef } from "react";
import { todayIso } from "@/lib/dates";

/**
 * Native date picker: a calendar on every phone and browser. The earliest
 * date (today) is set after mount, so the static HTML never carries the
 * build date.
 */
export default function DateInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.setAttribute("min", todayIso());
  }, []);
  return <input ref={ref} type="date" {...props} />;
}
