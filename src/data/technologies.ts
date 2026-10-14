export const technologies = [
  {
    slug: 'vue',
    order: 1,
    kinds: ['cards', 'conspect', 'roadmap'],
  },
  {
    slug: 'javascript',
    order: 2,
    kinds: ['cards'],
  },
  {
    slug: 'next',
    order: 3,
    kinds: ['roadmap'],
  },
] as const;

export type TechnologySlug = (typeof technologies)[number]['slug'];
export type MaterialKind = (typeof technologies)[number]['kinds'][number];

export function getTechnology(slug: string) {
  return technologies.find((item) => item.slug === slug);
}

export function technologyHasKind(slug: string, kind: MaterialKind) {
  const technology = getTechnology(slug);
  return technology ? (technology.kinds as readonly string[]).includes(kind) : false;
}
