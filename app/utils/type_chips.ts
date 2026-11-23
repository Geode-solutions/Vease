// One chip per type; with several types, a type shared by several imported items shows their count
export function typeChips(types: Record<string, string[]>): string[] {
  const counts = new Map<string, number>();
  for (const type of Object.values(types).flat()) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  if (counts.size <= 1) {
    return [...counts.keys()];
  }
  return [...counts].map(([type, count]) => (count > 1 ? `${type} ×${count}` : type));
}
