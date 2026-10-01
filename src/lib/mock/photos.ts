export type SubmissionPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

function photo(file: string, alt: string): SubmissionPhoto {
  return { src: `/mock/${file}`, alt, width: 1152, height: 864 };
}

export const mockPhotos = {
  roseOutline: photo(
    "tattoo-submission.jpg",
    "Practice skin with straight line, curve, circle, and rose outline drills",
  ),
  liningDrills: photo(
    "lining-drills.jpg",
    "Practice skin with straight, wavy, zigzag, and circle lining drills",
  ),
  whipShading: photo(
    "whip-shading.jpg",
    "Practice skin with whip shading rectangles and a shaded crescent",
  ),
  gradientShading: photo(
    "gradient-shading.jpg",
    "Practice skin with a shaded rose, a sphere, and three gradient bars",
  ),
  colorPacking: photo(
    "color-packing.jpg",
    "Practice skin with a heart, star, diamond, and swallow packed with color",
  ),
  evolutionRough: photo(
    "evolution-rough.jpg",
    "Practice skin with shaky, uneven lining drills and blurred, blown-out lines",
  ),
  evolutionClean: photo(
    "evolution-clean.jpg",
    "Practice skin with crisp, even straight lines and clean circles",
  ),
} satisfies Record<string, SubmissionPhoto>;
