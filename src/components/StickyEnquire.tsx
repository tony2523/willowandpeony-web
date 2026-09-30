"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Mobile-only persistent enquiry CTA (hidden on the contact page itself). */
export default function StickyEnquire() {
  const pathname = usePathname();
  if (pathname?.startsWith("/contact")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ivory/95 p-3 backdrop-blur-sm md:hidden">
      <Link
        href="/contact/"
        className="block bg-ink px-6 py-3 text-center text-[0.8rem] tracking-[0.18em] uppercase text-ivory"
      >
        Enquire about your date
      </Link>
    </div>
  );
}
