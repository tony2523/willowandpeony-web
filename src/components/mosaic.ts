/**
 * The editorial nine-photo mosaic shared by the gallery teasers
 * (GalleryFeature) and the full gallery page: 12 columns by 6 rows from md
 * up, half as tall as wide. Slot shapes, in order: portrait, landscape,
 * landscape, portrait, portrait, portrait, landscape, portrait, portrait.
 * MIRROR is the same layout flipped left to right, for alternate blocks.
 */
export const MOSAIC_SHAPES = ["P", "L", "L", "P", "P", "P", "L", "P", "P"] as const;

export const MOSAIC = [
  "md:col-[1/4] md:row-[1/5]",
  "md:col-[1/4] md:row-[5/7]",
  "md:col-[4/8] md:row-[1/4]",
  "md:col-[4/6] md:row-[4/7]",
  "md:col-[6/8] md:row-[4/7]",
  "md:col-[8/11] md:row-[1/5]",
  "md:col-[8/11] md:row-[5/7]",
  "md:col-[11/13] md:row-[1/4]",
  "md:col-[11/13] md:row-[4/7]",
];

export const MOSAIC_MIRROR = [
  "md:col-[10/13] md:row-[1/5]",
  "md:col-[10/13] md:row-[5/7]",
  "md:col-[6/10] md:row-[1/4]",
  "md:col-[8/10] md:row-[4/7]",
  "md:col-[6/8] md:row-[4/7]",
  "md:col-[3/6] md:row-[1/5]",
  "md:col-[3/6] md:row-[5/7]",
  "md:col-[1/3] md:row-[1/4]",
  "md:col-[1/3] md:row-[4/7]",
];

/** Rough rendered width of each slot on md and up, for `sizes`. */
export const MOSAIC_VW = ["25vw", "25vw", "34vw", "17vw", "17vw", "25vw", "25vw", "17vw", "17vw"];
