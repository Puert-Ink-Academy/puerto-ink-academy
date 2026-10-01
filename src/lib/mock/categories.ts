export const categoryIds = [
  "fine-line",
  "realism",
  "japanese",
  "traditional",
  "watercolor",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  sequenceOrder: number;
};

const categoryList: Category[] = [
  {
    id: "fine-line",
    name: "Fine Line",
    tagline: "Precision linework and delicate detail",
    sequenceOrder: 1,
  },
  {
    id: "realism",
    name: "Realism",
    tagline: "Light, depth and lifelike texture",
    sequenceOrder: 2,
  },
  {
    id: "japanese",
    name: "Japanese",
    tagline: "Bold waves, koi and flowing backgrounds",
    sequenceOrder: 3,
  },
  {
    id: "traditional",
    name: "Traditional",
    tagline: "Bold lines and saturated color",
    sequenceOrder: 4,
  },
  {
    id: "watercolor",
    name: "Watercolor",
    tagline: "Soft washes and painterly blends",
    sequenceOrder: 5,
  },
];

export const categories: Category[] = [...categoryList].sort(
  (a, b) => a.sequenceOrder - b.sequenceOrder,
);

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && (categoryIds as readonly string[]).includes(value);
}

export function getCategory(id: CategoryId): Category {
  const category = categories.find((entry) => entry.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function getPreviousCategory(id: CategoryId): Category | undefined {
  const { sequenceOrder } = getCategory(id);
  return categories.filter((entry) => entry.sequenceOrder < sequenceOrder).at(-1);
}
