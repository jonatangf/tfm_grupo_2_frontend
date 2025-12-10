

export function buildInterestMap<T extends { id: number }>(items: T[]): Map<number, T> {
  const map = new Map<number, T>();
  for (const i of items ?? []) map.set(i.id, i);
  return map;
}

export function pickInterestsByIds<T extends { id: number }>(
  ids: number[],
  map: Map<number, T>
): T[] {
  return ids.map((id) => map.get(id)).filter((x): x is T => !!x);
}
