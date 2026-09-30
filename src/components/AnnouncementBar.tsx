import Link from "next/link";
import { site } from "../../content/site";

export default function AnnouncementBar() {
  if (!site.announcement) return null;
  return (
    <div className="bg-ink text-center">
      <Link
        href="/contact/"
        className="block px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase text-ivory/85 transition-colors hover:text-ivory"
      >
        {site.announcement}
      </Link>
    </div>
  );
}
