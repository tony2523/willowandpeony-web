import Pic from "./Pic";

/**
 * Full-bleed page banner, measured from the original: 585px tall at a 900px
 * viewport (65vh), centred white serif title (28.6px) over the image, with
 * the transparent header floating above.
 */
export default function PageHero({
  image,
  alt,
  title,
  intro,
}: {
  image: string;
  alt: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative h-[65vh] min-h-[25rem] w-full overflow-hidden">
      <Pic
        name={image}
        alt={alt}
        sizes="100vw"
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="h-page max-w-[40rem] text-white">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-[38rem] text-[0.9375rem] leading-[1.4] text-white">{intro}</p>
        )}
      </div>
    </section>
  );
}
