import type { Metadata } from "next";
import Link from "next/link";
import Pic from "@/components/Pic";
import JsonLd from "@/components/JsonLd";
import LatestWork from "@/components/LatestWork";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPosts } from "@/lib/journal";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Story: Ivy, Boutique Auckland Florist",
  description:
    "Meet Ivy, founder of Willow & Peony, a boutique Auckland floral studio creating romantic, modern floral design for weddings, events and occasions.",
  path: "/about/",
  ogImage: "willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5",
});

const values = [
  {
    title: "Romantic",
    body: "Soft, feminine and artfully composed — premium seasonal blooms with layered, refined palettes.",
  },
  {
    title: "Considered",
    body: "Every design starts with your venue, your light, your day — flowers that belong to the room they're in.",
  },
  {
    title: "Personal",
    body: "A boutique studio, one florist's eye — from first hello to the last bloom packed away.",
  },
];

export default function AboutPage() {
  const latest = getPosts().slice(0, 3);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Story", path: "/about/" },
        ])}
      />

      {/* Hero split: the founding story beside Ivy's portrait (per design) */}
      <section className="mx-auto grid max-w-[1440px] md:grid-cols-[minmax(0,1fr)_minmax(0,620px)] md:pt-20">
        <div className="flex flex-col justify-center px-5 pt-14 pb-12 sm:px-10 md:px-16 md:py-24 lg:px-[90px]">
          <p className="eyebrow text-muted">Our story</p>
          <h1 className="display-1 mt-5 max-w-[560px] text-ink">
            It began with a single rose called <em>Blue Moon</em>
          </h1>
          <div className="mt-7 max-w-[480px] space-y-4 text-[15.5px] leading-[1.75] font-light text-ink-soft">
            <p>
              Ivy&rsquo;s passion for flowers blossomed back in 2012 with her first rose, the
              beautiful <em>Blue Moon</em>, planted in a small garden that quickly became a
              sanctuary. From that moment on, flowers were more than just decoration — they were
              a way to celebrate life&rsquo;s most meaningful moments.
            </p>
            <p>
              From classic blooms to artistic arrangements, Willow &amp; Peony offers more than
              just flowers — an experience tailored to you, making every moment truly special.
            </p>
          </div>
        </div>
        {/* Portrait: face sits just above centre, so anchor the crop there */}
        <Pic
          name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
          alt="Ivy Diao, founder of Willow & Peony, boutique florist in Auckland"
          sizes="(max-width: 768px) 100vw, 620px"
          priority
          className="aspect-[4/5] h-auto w-full object-cover object-[60%_25%] md:aspect-auto md:h-[780px]"
        />
      </section>

      {/* Founder quote — paper band */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[860px] px-5 py-16 text-center sm:px-6 md:py-24">
          <blockquote>
            <p className="font-serif text-[clamp(20px,2.2vw,28px)] leading-[1.55] font-light text-ink italic">
              &ldquo;I&rsquo;m dedicated to crafting premium, bespoke floral designs that are as
              unique and refined as the people they&rsquo;re made for — not only visually
              stunning, but deeply personal and meaningful.&rdquo;
            </p>
            <footer className="eyebrow mt-6 text-muted">— Ivy, founder &amp; lead florist</footer>
          </blockquote>
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <p className="eyebrow text-muted">How we work</p>
        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title}>
              <h2 className="font-serif text-[24px] font-light text-ink">{v.title}</h2>
              <p className="mt-3 max-w-[340px] text-[14px] leading-[1.7] text-ink-soft">
                {v.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 max-w-[720px] text-[15px] leading-[1.75] font-light text-ink-soft">
          With a focus on luxury and personalised service, Ivy&rsquo;s mission is to create floral
          designs that bring joy and beauty to every occasion — whether that&rsquo;s a wedding, a
          corporate event, or a custom arrangement made for someone special. Email{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>{" "}
          or start an enquiry any time.
        </p>
      </section>

      {/* Latest work */}
      <div className="mt-24 md:mt-[140px]">
        <LatestWork posts={latest} />
      </div>

      {/* CTA */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Auckland · New Zealand</p>
          <h2 className="display-3 mt-4 text-ink">
            Let&rsquo;s make something <em>beautiful</em> together
          </h2>
          <div className="mt-8">
            <Link href="/contact/" className="btn-solid">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
