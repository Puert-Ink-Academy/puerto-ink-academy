import { platformUsers } from "@/lib/mock/admin-users";
import { slugify } from "@/lib/slug";

type Person = {
  id: string;
  name: string;
  artistName?: string;
};

function preferredSlug(person: Person): string {
  const fromArtist = person.artistName ? slugify(person.artistName) : "";
  if (fromArtist) return fromArtist;
  return slugify(person.name);
}

function assignSlugs(people: Person[]): Map<string, string> {
  const taken = new Set<string>();
  const slugs = new Map<string, string>();

  for (const person of people) {
    let slug = preferredSlug(person);
    if (!slug || taken.has(slug)) slug = person.id;
    if (!slug || taken.has(slug)) {
      let suffix = 2;
      while (taken.has(`${person.id}-${suffix}`)) suffix += 1;
      slug = `${person.id}-${suffix}`;
    }
    taken.add(slug);
    slugs.set(person.id, slug);
  }

  return slugs;
}

const slugById = assignSlugs(
  platformUsers
    .filter((user) => user.role === "APPRENTICE")
    .map((user) => ({ id: user.id, name: user.name, artistName: user.artistName })),
);

const idBySlug = new Map([...slugById].map(([id, slug]) => [slug, id]));

export function profileSlug(id: string): string {
  return slugById.get(id) ?? id;
}

export function profileIdFromSlug(slug: string): string | undefined {
  return idBySlug.get(slug);
}

export function profilePath(id: string): string {
  return `/profile/${profileSlug(id)}`;
}
