/**
 * The site's one arrow control: a square button with a thin line arrow.
 * Used by the testimonials, the calculator's photo slides and the gallery
 * lightbox so every arrow looks the same. Only the colours change with the
 * background: `light` on the page, `photo` over an image, `dark` in the
 * lightbox. The arrow is drawn, not a font glyph, so it's identical in
 * every browser.
 */

type Tone = "light" | "photo" | "dark";

const TONES: Record<Tone, string> = {
  light: "border-hairline text-ink-soft hover:border-ink hover:text-ink",
  photo: "border-ink/10 bg-white/90 text-ink hover:bg-white",
  dark: "border-white/30 bg-black/20 text-white/85 hover:border-white hover:text-white",
};

export const iconButton = (tone: Tone) =>
  `flex h-10 w-10 shrink-0 items-center justify-center border transition-colors ${TONES[tone]}`;

export function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={dir === "prev" ? "rotate-180" : undefined}
    >
      <path d="M3.5 10h13M11.5 5l5 5-5 5" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

export default function ArrowButton({
  dir,
  label,
  onClick,
  tone = "light",
  className = "",
}: {
  dir: "prev" | "next";
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: Tone;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={`${iconButton(tone)} ${className}`}>
      <ArrowIcon dir={dir} />
    </button>
  );
}
