export type LevelReference = {
  id: string;
  label: string;
};

export type LevelLesson = {
  level: number;
  title: string;
  objective: string;
  exercise: string;
  tips: string;
  references: LevelReference[];
};

export const levelLessons: LevelLesson[] = [
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
    objective: "What the apprentice needs to learn",
    exercise: "Detailed description of the task",
    tips: "Advice from the teacher",
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

export function getLevelLesson(level: number): LevelLesson | undefined {
  return levelLessons.find((lesson) => lesson.level === level);
}
