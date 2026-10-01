export type LevelReference = {
  id: string;
  label: string;
};

import type { CategoryId } from "@/lib/mock/categories";

export type LevelLesson = {
  categoryId: CategoryId;
  level: number;
  title: string;
  objective: string;
  exercise: string;
  tips: string;
  references: LevelReference[];
};

type LessonContent = Omit<LevelLesson, "categoryId">;

const fineLineLessons: LessonContent[] = [
  {
    level: 1,
    title: "Studio Hygiene",
    objective: "Set up and break down a clean, cross-contamination-free station",
    exercise: "Photograph your fully wrapped and prepared station before a session",
    tips: "Wrap everything you will touch with gloves on, then don't touch anything else",
    references: [
      { id: "station-wrap", label: "Station wrap" },
      { id: "glove-changes", label: "Glove changes" },
    ],
  },
  {
    level: 2,
    title: "Machine Setup",
    objective: "Tune the machine, grip, and power supply for line work",
    exercise: "Photograph your assembled machine with the needle hang set correctly",
    tips: "Check the hang against your fingernail before every session",
    references: [
      { id: "needle-hang", label: "Needle hang" },
      { id: "voltage", label: "Voltage ranges" },
    ],
  },
  {
    level: 3,
    title: "Needle Depth",
    objective: "Find consistent depth on practice skin without blowouts",
    exercise: "Fill a practice sheet with short lines at a steady depth",
    tips: "Let the needle do the work and keep your hand speed even",
    references: [
      { id: "depth-chart", label: "Depth chart" },
      { id: "blowouts", label: "Spotting blowouts" },
    ],
  },
  {
    level: 4,
    title: "Stencil Transfer",
    objective: "Apply a crisp, correctly placed stencil that lasts the session",
    exercise: "Transfer a simple stencil and photograph it straight on",
    tips: "Less stencil solution gives a sharper line",
    references: [
      { id: "placement", label: "Placement" },
      { id: "transfer-solution", label: "Transfer solution" },
    ],
  },
  {
    level: 5,
    title: "Line Control",
    objective: "Pull clean, consistent lines that hold their shape through curves",
    exercise: "Tattoo a sheet of straight lines, smooth curves and closed circles in one pass each",
    tips: "Move from your shoulder, not your wrist, and keep a steady hand speed",
    references: [
      { id: "straight-lines", label: "Straight lines" },
      { id: "curves", label: "Curves" },
      { id: "circles", label: "Circles" },
      { id: "line-weight", label: "Line weight" },
    ],
  },
  {
    level: 6,
    title: "Line Weight",
    objective: "Vary line weight deliberately to add depth to outlines",
    exercise: "Outline the same flash three times with different needle groupings",
    tips: "Heavier lines on the outside, lighter lines for detail",
    references: [{ id: "groupings", label: "Needle groupings" }],
  },
  {
    level: 7,
    title: "Whip Shading",
    objective: "Build soft pepper and whip textures",
    exercise: "Fill a gradient bar using only whip strokes",
    tips: "Flick out at the end of every stroke",
    references: [{ id: "whip-motion", label: "Whip motion" }],
  },
  {
    level: 8,
    title: "Shading Gradients",
    objective: "Blend smooth black-to-skin gradients",
    exercise: "Shade a sphere with a seamless gradient",
    tips: "Layer slowly instead of going in heavy",
    references: [{ id: "gradient-steps", label: "Gradient steps" }],
  },
  {
    level: 9,
    title: "Color Packing",
    objective: "Pack solid, even color with no holidays",
    exercise: "Pack three color swatches edge to edge",
    tips: "Small overlapping circles keep the saturation even",
    references: [{ id: "packing-motion", label: "Packing motion" }],
  },
  {
    level: 10,
    title: "Final Piece",
    objective: "Combine every skill into one finished design",
    exercise: "Tattoo a full flash piece on practice skin",
    tips: "Plan your order: lines, shading, then color",
    references: [{ id: "flash-sheet", label: "Flash sheet" }],
  },
];

const realismLessons: LessonContent[] = [
  {
    level: 1,
    title: "Value Scales",
    objective: "Read and reproduce a full range of values from black to skin",
    exercise: "Shade a ten-step value scale with clean, even transitions",
    tips: "Squint at your reference to see values instead of details",
    references: [
      { id: "value-scale", label: "Value scale" },
      { id: "grey-wash", label: "Grey wash dilutions" },
    ],
  },
  {
    level: 2,
    title: "Soft Shading",
    objective: "Build smooth, layered shading with no visible passes",
    exercise: "Shade a sphere and a cube under a single light source",
    tips: "Work light to dark and keep the needle moving in small circles",
    references: [{ id: "light-source", label: "Light and shadow" }],
  },
  {
    level: 3,
    title: "Skin Textures",
    objective: "Render pores, wrinkles and fine texture convincingly",
    exercise: "Tattoo a close-up study of an aged hand",
    tips: "Texture lives in the mid-tones, so leave the highlights clean",
    references: [{ id: "texture-studies", label: "Texture studies" }],
  },
  {
    level: 4,
    title: "Portrait Features",
    objective: "Capture eyes, noses and lips with accurate proportion",
    exercise: "Complete a single realistic eye with reflections",
    tips: "The highlight in the eye sells the whole portrait",
    references: [
      { id: "eye-anatomy", label: "Eye anatomy" },
      { id: "reflections", label: "Reflections" },
    ],
  },
  {
    level: 5,
    title: "Photo-Reference Piece",
    objective: "Translate a photograph into a finished realistic tattoo",
    exercise: "Tattoo a palm-sized portrait from a photo reference",
    tips: "Map your darkest darks first so the contrast holds up",
    references: [{ id: "reference-prep", label: "Preparing references" }],
  },
];

const traditionalLessons: LessonContent[] = [
  {
    level: 1,
    title: "Bold Outlines",
    objective: "Pull thick, confident outlines in a single pass",
    exercise: "Outline a classic swallow with a 9 round liner",
    tips: "Slow down. Bold lines need a steady, unhurried hand speed",
    references: [
      { id: "liner-groupings", label: "Liner groupings" },
      { id: "single-pass", label: "Single-pass lines" },
    ],
  },
  {
    level: 2,
    title: "Solid Black Fill",
    objective: "Pack black that heals solid with no patchiness",
    exercise: "Fill a panther head silhouette with solid black",
    tips: "Overlap your passes and keep the skin stretched tight",
    references: [{ id: "black-packing", label: "Black packing" }],
  },
  {
    level: 3,
    title: "Color Saturation",
    objective: "Lay down bright, fully saturated traditional color",
    exercise: "Pack red, yellow and green into a rose and leaves",
    tips: "Go light colors first, and never pack yellow after black",
    references: [{ id: "color-order", label: "Color order" }],
  },
  {
    level: 4,
    title: "Classic Flash",
    objective: "Combine outline, black and color into one flash design",
    exercise: "Tattoo a dagger and banner flash piece",
    tips: "Leave skin breaks between colors so the design reads from afar",
    references: [{ id: "flash-history", label: "Flash history" }],
  },
  {
    level: 5,
    title: "Flash Sheet",
    objective: "Design and execute your own traditional flash",
    exercise: "Draw a three-piece flash sheet and tattoo one design",
    tips: "Keep it simple: bold will hold",
    references: [{ id: "sheet-layout", label: "Sheet layout" }],
  },
];

const watercolorLessons: LessonContent[] = [
  {
    level: 1,
    title: "Color Theory",
    objective: "Choose harmonious palettes that heal well together",
    exercise: "Pack a color wheel with smooth transitions between hues",
    tips: "Complementary colors make each other pop, but mix into mud",
    references: [{ id: "color-wheel", label: "Color wheel" }],
  },
  {
    level: 2,
    title: "Wet Blends",
    objective: "Blend two colors into a seamless watercolor wash",
    exercise: "Fade a blue wash into purple across a practice sheet",
    tips: "Dilute your inks and blend while the first color is still wet",
    references: [{ id: "dilution", label: "Ink dilution" }],
  },
  {
    level: 3,
    title: "Splatter and Bleeds",
    objective: "Create controlled splatter and paint-bleed effects",
    exercise: "Add splatter and drip effects around a simple shape",
    tips: "Vary the dot sizes so the splatter looks natural",
    references: [{ id: "splatter", label: "Splatter effects" }],
  },
  {
    level: 4,
    title: "Outline-Free Forms",
    objective: "Define a shape using only color and value",
    exercise: "Tattoo a hummingbird with no black outline",
    tips: "Use a darker edge of the same hue to hold the shape",
    references: [{ id: "edge-control", label: "Edge control" }],
  },
  {
    level: 5,
    title: "Final Wash Piece",
    objective: "Finish a full watercolor composition",
    exercise: "Tattoo a floral watercolor piece with a supporting sketch line",
    tips: "A light sketch line helps the piece age gracefully",
    references: [{ id: "aging", label: "How watercolor ages" }],
  },
];

const japaneseLessons: LessonContent[] = [
  {
    level: 1,
    title: "Wind Bars",
    objective: "Lay down the bold black wind bars that frame Japanese work",
    exercise: "Fill a practice sheet with sweeping wind bars in solid black",
    tips: "Follow the body's flow: wind bars should curve with the muscle",
    references: [{ id: "wind-bars", label: "Wind bar flow" }],
  },
  {
    level: 2,
    title: "Wave Patterns",
    objective: "Draw and tattoo classic Japanese waves with crisp curls",
    exercise: "Tattoo a wave panel with three cresting curls",
    tips: "Keep the curl lines consistent in weight so the waves read clearly",
    references: [{ id: "hokusai", label: "Hokusai wave studies" }],
  },
  {
    level: 3,
    title: "Koi Scales",
    objective: "Render overlapping koi scales with depth and color",
    exercise: "Tattoo a koi body section with shaded, overlapping scales",
    tips: "Shade the base of each scale so it tucks under the one above",
    references: [{ id: "koi-anatomy", label: "Koi anatomy" }],
  },
  {
    level: 4,
    title: "Peonies and Blossoms",
    objective: "Build layered peony and cherry blossom petals",
    exercise: "Tattoo a peony with a scatter of cherry blossoms",
    tips: "Work petals from the back of the flower to the front",
    references: [{ id: "flower-meaning", label: "Flower symbolism" }],
  },
  {
    level: 5,
    title: "Backpiece Composition",
    objective: "Plan a full composition that flows across a large area",
    exercise: "Design a backpiece layout and tattoo one finished section",
    tips: "Place the main subject first, then let waves and wind bars fill the gaps",
    references: [{ id: "backpiece", label: "Backpiece layouts" }],
  },
];

function withCategory(categoryId: CategoryId, lessons: LessonContent[]): LevelLesson[] {
  return lessons.map((lesson) => ({ categoryId, ...lesson }));
}

export const levelLessons: LevelLesson[] = [
  ...withCategory("fine-line", fineLineLessons),
  ...withCategory("realism", realismLessons),
  ...withCategory("japanese", japaneseLessons),
  ...withCategory("traditional", traditionalLessons),
  ...withCategory("watercolor", watercolorLessons),
];

export function getCategoryLessons(categoryId: CategoryId): LevelLesson[] {
  return levelLessons.filter((lesson) => lesson.categoryId === categoryId);
}

export function getLevelLesson(
  categoryId: CategoryId,
  level: number,
): LevelLesson | undefined {
  return levelLessons.find(
    (lesson) => lesson.categoryId === categoryId && lesson.level === level,
  );
}
