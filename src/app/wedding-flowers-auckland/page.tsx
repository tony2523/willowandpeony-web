import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Slideshow from "@/components/Slideshow";
import PostCard from "@/components/PostCard";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import { weddingPackages } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Florist Auckland | Bespoke Wedding Flowers",
  description:
    "Boutique wedding florist on Auckland's North Shore. Romantic, timeless bridal bouquets, ceremony and reception flowers — curated packages from $500 or fully bespoke design.",
  path: "/wedding-flowers-auckland/",
  ogImage: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271",
});

const gallery = [
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271", alt: "Bridal bouquet with soft peach and cream roses, Auckland wedding" },
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-443", alt: "Bride holding a joyful pastel bouquet in Auckland city" },
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-419", alt: "Romantic bridal bouquet detail with garden roses" },
  { name: "wedding-flowers-auckland-img-3926", alt: "Romantic ceremony arrangement with garden roses and orchids" },
  { name: "wedding-flowers-auckland-img-3923", alt: "Soft blush and ivory ceremony flowers" },
  { name: "wedding-flowers-auckland-img-3939", alt: "Delicate wedding table florals" },
  { name: "wedding-flowers-auckland-dsc03988", alt: "Sculptural white and blush wedding flowers on a plinth" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot20", alt: "Rich crimson wedding styling at The Narrows Landing" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot4", alt: "Bold crimson and blush bridal bouquet" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot3", alt: "Deep red rose bouquet with trailing ribbon" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot10", alt: "Moody romantic wedding tablescape" },
  { name: "wedding-flowers-auckland-80bdd7b3b17e99d8a7325420cb8fb9c7", alt: "Garden-inspired ceremony flowers in blush and white" },
  { name: "wedding-flowers-auckland-54086f85c7ad3b855a69348db7e5a79e", alt: "Bridal party with pastel bouquets" },
  { name: "wedding-flowers-auckland-willowandpeony-1-13", alt: "Bud vases and candles styled for a wedding reception" },
  { name: "wedding-flowers-auckland-willowandpeony-1-12-2", alt: "Romantic reception table styling" },
  { name: "wedding-flowers-auckland-dsc02433-4", alt: "Textural bridal bouquet with premium seasonal blooms" },
];

export default function WeddingsPage() {
  const posts = getPostsByCategory("weddings").slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Wedding Floral Design",
            description:
              "Bespoke wedding flowers and floral styling across Auckland: bridal bouquets, ceremony flowers, reception styling and curated wedding packages.",
            path: "/wedding-flowers-auckland/",
            serviceType: "Wedding florist",
            offers: weddingPackages.map((p) => ({
              name: `${p.name} Package`,
              price: p.priceNumber,
              description: p.ideal,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding Flowers Auckland", path: "/wedding-flowers-auckland/" },
          ]),
        ]}
      />

      <PageHero
        image="wedding-flowers-auckland-2c760fef1a83095d5abd94ee51e4041a"
        alt="Bridal party with blush and ivory wedding bouquets by Willow & Peony"
        title="Wedding Florals"
      />

      {/* Split section, as on the original: auto-cycling slideshow left
          (720×922), left-aligned 520px text column right, vertically centred */}
      <section className="mt-[88px] flex flex-col md:flex-row">
        <div className="w-full px-5 md:w-1/2 md:px-0">
          <Slideshow images={gallery} />
        </div>
        <div className="flex w-full items-center justify-center px-5 py-14 sm:px-6 md:w-1/2 md:py-8">
          <div className="w-full max-w-[520px]">
        <h2 className="h-page text-ink">Premium Wedding Floral Styling</h2>
        <p className="h-card mt-2 text-ink-soft">Thoughtful. Romantic. Timeless.</p>
        <div className="mt-6 space-y-4 text-[15px] leading-[1.4] text-ink">
          <p>
            Weddings are deeply personal — your flowers should be too. At Willow &amp; Peony, we
            believe flowers should feel as magical as the moment you say &ldquo;I do.&rdquo;
          </p>
          <p>
            Based on Auckland&rsquo;s North Shore, we are a boutique wedding florist specialising
            in romantic, modern arrangements for weddings and intimate celebrations across
            Auckland.
          </p>
          <p>
            Our work is soft, feminine, and artfully composed — blending premium seasonal blooms
            with unexpected textural details to create wedding flowers that feel uniquely yours.
          </p>
        </div>

        <h3 className="mt-10 font-serif text-[16.8px] font-bold tracking-[-0.02em] text-ink">
          What We Offer
        </h3>
        <div className="mt-4 space-y-4 text-[15px] leading-[1.4] text-ink">
          <p>
            <strong className="font-normal text-ink">Wedding Flower Packages</strong>
            <br />
            Our thoughtfully designed{" "}
            <Link href="/wedding-flower-packages/" className="underline underline-offset-2">
              packages
            </Link>{" "}
            make planning your wedding florals simple and stress-free. With three tiers to choose
            from, each package includes the floral essentials — from bridal bouquets to ceremony
            and reception florals — styled in our signature romantic and refined aesthetic.
            Perfect for couples who want beautiful blooms without the overwhelm.
          </p>
          <p>
            <strong className="font-normal text-ink">Bespoke Floral Design</strong>
            <br />
            For couples dreaming of something entirely unique, our bespoke service offers a fully
            customised floral experience. We work closely with you (and your planner or stylist)
            to design intentional, artful arrangements tailored to your vision, venue, and
            priorities — from dramatic installations to delicate floral details.
          </p>
        </div>

        <h3 className="mt-10 font-serif text-[16.8px] font-bold tracking-[-0.02em] text-ink">
          Why Choose Us
        </h3>
        <p className="mt-4 text-[15px] leading-[1.4] text-ink">
          Every couple is different — and so is every wedding we design. We take a boutique,
          collaborative approach, starting with a deep understanding of your style, vision, and
          priorities. Our floral designs are created with heart, artistry, and a touch of the
          unexpected, ensuring your flowers feel as special as the day itself.
        </p>
          </div>
        </div>
      </section>

      {/* Latest weddings */}
      <section className="mt-[88px] px-5 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="h-page text-ink">Our Latest Work</h2>
          <Link href="/journal/weddings/" className="link-text text-ink">
            View All
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="mx-auto mt-[88px] max-w-[720px] scroll-mt-24 px-5 sm:px-6">
        <div className="text-center">
          <h2 className="h-page text-ink">Ready to bring your vision to life—bloom by bloom?</h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[15px] leading-[1.4] text-ink-soft">
            We&rsquo;d love to hear more about your day — your style, your venue, your dream
            florals. Simply fill out the form below to get started!
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="wedding" />
        </div>
      </section>
    </>
  );
}
