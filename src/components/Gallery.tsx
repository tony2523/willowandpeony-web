import Pic from "./Pic";

/**
 * Horizontal snap carousel, as on the original weddings/events pages:
 * full-bleed, two slides per view on desktop (720×922 measured), most of one
 * slide per view on mobile. CSS scroll-snap only — no JS.
 */
export default function Gallery({
  images,
  perView = 2,
}: {
  images: { name: string; alt: string }[];
  perView?: 2 | 4;
}) {
  const basis = perView === 2 ? "basis-[85%] sm:basis-1/2" : "basis-[45%] sm:basis-[23%]";
  const aspect = perView === 2 ? "720/922" : "331/425";
  return (
    <div className="carousel" role="region" aria-label="Photo gallery" tabIndex={0}>
      {images.map((img) => (
        <div key={img.name} className={basis}>
          <Pic
            name={img.name}
            alt={img.alt}
            sizes={perView === 2 ? "(max-width: 640px) 85vw, 50vw" : "(max-width: 640px) 45vw, 23vw"}
            aspect={aspect}
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}
